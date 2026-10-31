import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCodingProblem, updateCodingProblem } from '../../data/repository';
import { generateCodeReviewPrompt, generateCodingProblemPrompt, extractJson, callOpenRouterStream } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, ChevronRight, CheckCircle2, FileText, Code2, Terminal, Loader } from 'lucide-react';
import { awardXP } from '../../core/gamification/xpEngine';
import { updateQuestProgress } from '../../core/gamification/dailyQuests';
import { updateWeeklyChallengeProgress } from '../../core/gamification/weeklyChallenges';
import { checkAchievements } from '../../core/gamification/achievementChecker';
import { logEvent } from '../../core/analytics/tracker';

// New Architecture Imports
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { usePyodide } from './hooks/usePyodide';
import { useTestRunner } from './hooks/useTestRunner';
import { problems as localProblems } from './data/problemTestCases';

import ProblemPanel from './components/ProblemPanel';
import CodeEditorPanel from './components/CodeEditorPanel';
import TestCasePanel from './components/TestCasePanel';
import SubmissionModal from './components/SubmissionModal';
import AITutorDrawer from './components/AITutorDrawer';

import './CodingPractice.css';
import './PracticeWorkspace.css';

// Below this width the workspace becomes a single-pane tab flow.
const MOBILE_MAX_WIDTH = 900;

// Starter snippets are stored with lowercase language keys, while the selected
// language is a display name ("Python"). Accept both.
const getStarterCode = (starterCode, language) => {
  if (!starterCode || !language) return '';
  return starterCode[language] ?? starterCode[String(language).toLowerCase()] ?? '';
};

export default function CodingWorkspace() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [dbRecord, setDbRecord] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStream, setGeneratingStream] = useState('');
  const [generationError, setGenerationError] = useState(null);
  const generationStartedRef = useRef(false);

  // AI Tutor State
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMode, setAiMode] = useState('review'); // 'review' or 'explain-error'
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiStreamContent, setAiStreamContent] = useState('');
  const [aiError, setAiError] = useState(null);

  // Submission State
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResults, setSubmitResults] = useState([]);

  // Layout State
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_MAX_WIDTH);
  const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'code', 'tests'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Local Execution Hooks
  const pyodideConfig = usePyodide();
  const { results, status, runTime, runTests, reset: resetTests } = useTestRunner(pyodideConfig);

  // Stream-generate the problem when it has status 'generating'
  const streamGenerateProblem = useCallback(async (pRecord) => {
    if (generationStartedRef.current) return;
    generationStartedRef.current = true;
    setIsGenerating(true);
    setGeneratingStream('');
    setGenerationError(null);

    try {
      const messages = generateCodingProblemPrompt(
        pRecord.language, pRecord.topic, pRecord.difficulty
      );

      let lastStreamUpdate = 0;
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        const now = Date.now();
        if (now - lastStreamUpdate < 200) return;
        lastStreamUpdate = now;
        setGeneratingStream(textSoFar);
        // Try to parse partial JSON to update problem progressively
        try {
          let partial = extractJson(textSoFar);
          if (!partial) {
            partial = {};
            const parseField = (field) => {
              const regex = new RegExp(`"${field}"\\s*:\\s*"([^]*?)(?:"|$)`);
              const match = textSoFar.match(regex);
              return match ? match[1].replace(/\\\\n/g, '\\n').replace(/\\\\"/g, '"') : null;
            };
            const fields = ['title', 'statement', 'constraints', 'sample_input', 'sample_output', 'explanation', 'hints'];
            fields.forEach(f => {
              const val = parseField(f);
              if (val) partial[f] = val;
            });
          }
          if (partial && Object.keys(partial).length > 0) {
            setProblem(prev => ({
              ...prev,
              title: partial.title || prev.title,
              statement: partial.statement || prev.statement,
              constraints: partial.constraints || prev.constraints,
              sample_input: partial.sample_input || prev.sample_input,
              sample_output: partial.sample_output || prev.sample_output,
              explanation: partial.explanation || prev.explanation,
              hints: partial.hints || prev.hints,
            }));
          }
        } catch { /* partial JSON not ready yet */ }
      });

      // Final parse
      const parsed = extractJson(fullText);
      if (parsed && parsed.title) {
        const updates = {
          title: parsed.title,
          statement: parsed.statement || '',
          constraints: parsed.constraints || '',
          sample_input: parsed.sample_input || '',
          sample_output: parsed.sample_output || '',
          explanation: parsed.explanation || '',
          hints: parsed.hints || '',
          test_cases: parsed.test_cases || '',
          status: 'unsolved',
        };
        await updateCodingProblem(pRecord.id, updates);
        setProblem(prev => ({ ...prev, ...updates }));
        toast('Problem generated!', 'success');
      } else {
        setGenerationError('The AI response was incomplete. Try again to build this problem.');
        await updateCodingProblem(pRecord.id, { status: 'unsolved' });
        setProblem(prev => ({ ...prev, status: 'unsolved' }));
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setGenerationError('The AI service did not respond. This is usually temporary.');
      await updateCodingProblem(pRecord.id, { status: 'unsolved' });
      setProblem(prev => ({ ...prev, status: 'unsolved' }));
    }
    setIsGenerating(false);
  }, [toast]);

  useEffect(() => {
    (async () => {
      // Find problem data from our local test case file
      const localProblem = localProblems.find(p => p.id === problemId);

      // Fetch DB record for user progress
      const pRecord = await getCodingProblem(problemId);

      if (!localProblem && !pRecord) {
        toast('Problem not found', 'error');
        navigate('/coding');
        return;
      }

      // Merge local problem data (which has test cases) with db record (if any)
      const mergedProblem = {
        ...(pRecord || {}),
        ...(localProblem || {}),
        status: pRecord?.status || 'unsolved'
      };

      setProblem(mergedProblem);
      setDbRecord(pRecord);

      // Set language from the problem record
      if (pRecord?.language) {
        setLanguage(pRecord.language);
      }

      // Load saved code or starter code
      const savedCode = pRecord?.user_code;
      const starterCode = getStarterCode(localProblem?.starterCode, language);
      setCode(savedCode || starterCode);

      setLoading(false);

      // If the problem is in 'generating' state, start streaming AI generation
      if (pRecord && pRecord.status === 'generating') {
        streamGenerateProblem(pRecord);
      }
    })();
  }, [problemId, language, navigate, toast, streamGenerateProblem]);

  const getTestCases = (includeHidden) => {
    let tests = [];
    if (problem.publicTestCases) {
      tests = [...problem.publicTestCases];
      if (includeHidden && problem.hiddenTestCases) {
        tests = [...tests, ...problem.hiddenTestCases];
      }
    }

    if (tests.length === 0) {
      let tc = problem.test_cases_json || problem.test_cases;
      if (tc) {
        try {
          const tcArr = typeof tc === 'string' ? JSON.parse(tc) : tc;
          if (Array.isArray(tcArr)) {
            tests = tcArr;
          }
        } catch (e) {}
      }
    }

    if (tests.length === 0 && problem.sample_input && (problem.sample_output || problem.expected_output)) {
      tests = [{
        input: problem.sample_input,
        expected: problem.sample_output || problem.expected_output,
        expected_output: problem.sample_output || problem.expected_output,
        is_hidden: false,
        isHidden: false
      }];
    }

    return includeHidden ? tests : tests.filter(t => !t.isHidden && !t.is_hidden);
  };

  const handleRunTests = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }

    if (language === 'Python' && !pyodideConfig.pyodide) {
      toast('Python is still loading — try again in a moment.', 'warning');
      return;
    }

    // Save code attempt to DB
    try {
      await updateCodingProblem(problemId, { user_code: code });
    } catch(err) { /* ignore if record doesn't exist yet */ }

    const publicTests = getTestCases(false);

    if (publicTests.length === 0) {
      toast('No visible test cases found for this problem', 'warning');
      return;
    }

    await runTests(code, publicTests, language);

    // On phones the editor and the results live in separate tabs; show the
    // results as soon as the run finishes.
    if (isMobile) setActiveTab('tests');
  };

  const handleSubmit = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }

    if (language === 'Python' && !pyodideConfig.pyodide) {
      toast('Python is still loading — try again in a moment.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setShowSubmissionModal(true);
    setSubmitResults([]);

    // Save code attempt to DB
    try {
      await updateCodingProblem(problemId, { user_code: code });
    } catch(err) { /* ignore if record doesn't exist yet */ }

    const allTests = getTestCases(true);

    if (allTests.length === 0) {
      toast('No test cases found for this problem', 'warning');
      setIsSubmitting(false);
      setShowSubmissionModal(false);
      return;
    }

    await runTests(code, allTests, language, (currentResults) => {
      setSubmitResults([...currentResults]);
    });

    setIsSubmitting(false);
  };

  // Gamification hook when submit passes all
  useEffect(() => {
    const passedCount = submitResults.filter(r => r.passed).length;
    const totalCount = submitResults.length;

    if (!isSubmitting && submitResults.length > 0 && passedCount === totalCount && problem && problem.status !== 'solved') {
      (async () => {
        try {
          await updateCodingProblem(problemId, { status: 'solved', user_code: code });
          setProblem(prev => ({ ...prev, status: 'solved' }));

          await awardXP('guest', 100, 'coding_problem', problemId);
          await updateQuestProgress('guest', 'solve_code', 1);
          await updateWeeklyChallengeProgress('guest', 'code', 1);
          await checkAchievements('guest');
          await logEvent('guest', problemId, 'coding_problem_solved', 0, 100);

          toast('Solution Accepted! You earned XP.', 'success');
        } catch(err) {
          console.error("Failed to update status", err);
        }
      })();
    }
  }, [isSubmitting, submitResults, problem, problemId, code, toast]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your code to the starter template?')) {
      setCode(getStarterCode(problem?.starterCode, language));
      resetTests();
      setSubmitResults([]);
    }
  };

  const handleRetryGeneration = () => {
    if (!problem) return;
    generationStartedRef.current = false;
    streamGenerateProblem(problem);
  };

  const handleAskAI = async (mode = 'review') => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }

    setAiMode(mode);
    setAiDrawerOpen(true);
    setAiAnalyzing(true);
    setAiStreamContent('');
    setAiError(null);

    try {
      let messages;

      if (mode === 'explain-error') {
        const failedTest = results.find(r => !r.passed);
        const promptStr = failedTest
          ? `My code failed test case ${failedTest.name || failedTest.id}.\nInput: ${JSON.stringify(failedTest.input)}\nExpected: ${JSON.stringify(failedTest.expected)}\nActual output: ${failedTest.actual}\nError (if any): ${failedTest.stderr}\n\nHere is my code:\n` + code
          : `My code is failing tests. Please help me debug it.\n\nCode:\n` + code;

        messages = [
          { role: 'system', content: 'You are an expert coding tutor. Explain why the code fails the given test case and suggest a fix. Be concise and focus on the logical error.' },
          { role: 'user', content: promptStr }
        ];
      } else {
        messages = generateCodeReviewPrompt(problem, code, language);
      }

      await callOpenRouterStream(messages, (textSoFar) => {
        setAiStreamContent(textSoFar);
      });

    } catch (err) {
      console.error(err);
      setAiError('The AI service did not respond. This is usually temporary.');
    }
    setAiAnalyzing(false);
  };

  if (loading) {
    return (
      <div className="practice-loading">
        <Loader className="spin-icon" size={26} />
        <span>Opening problem…</span>
      </div>
    );
  }

  const goToPractice = () => navigate('/coding');

  // Show generating state in the header
  const isCurrentlyGenerating = isGenerating || problem?.status === 'generating';
  const isSolved = problem?.status === 'solved';
  const starterCode = getStarterCode(problem?.starterCode, language);
  const hasWork = code.trim().length > 0 && code !== starterCode;

  const headerStatus = isCurrentlyGenerating
    ? { label: 'Building problem', tone: 'info' }
    : isSolved
      ? { label: 'Solved', tone: 'success' }
      : hasWork
        ? { label: 'In progress', tone: 'warning' }
        : { label: 'Not started', tone: 'neutral' };

  const env = language !== 'Python'
    ? null
    : pyodideConfig.loading
      ? { label: 'Loading Python', tone: 'loading' }
      : pyodideConfig.error
        ? { label: 'Python unavailable', tone: 'error' }
        : { label: 'Python ready', tone: 'ready' };

  const publicTestCount = getTestCases(false).length;
  const totalSubmissionTests = getTestCases(true).length;

  const renderProblemPane = () => (
    <ProblemPanel
      problem={problem}
      isGenerating={isCurrentlyGenerating}
      generationError={generationError}
      onRetry={handleRetryGeneration}
    />
  );

  const renderTestsDock = (showToggle = true) => (
    <TestCasePanel
      results={results}
      status={status}
      runTime={runTime}
      totalTests={publicTestCount}
      onExplain={() => handleAskAI('explain-error')}
      collapsible={showToggle}
    />
  );

  const renderCodePane = (showTests = true) => (
    <div className="practice-code">
      <div className="practice-editor">
        <CodeEditorPanel
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          onRun={handleRunTests}
          isRunning={status === 'running'}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onReset={handleReset}
          onAskAI={handleAskAI}
        />
      </div>
      {showTests && renderTestsDock()}
    </div>
  );

  const mobileTabs = [
    { id: 'problem', label: 'Problem', icon: FileText },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'tests', label: 'Tests', icon: Terminal },
  ];

  const hasTestResults = status === 'passed' || status === 'failed';

  return (
    <div className="practice-workspace">
      <header className="practice-bar">
        <button
          type="button"
          className="practice-back"
          onClick={goToPractice}
          aria-label="Back to coding practice"
          title="Back to coding practice"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="practice-bar-main">
          <nav className="practice-crumbs" aria-label="Breadcrumb">
            <button type="button" className="practice-crumb-link" onClick={goToPractice}>
              Coding practice
            </button>
            <ChevronRight size={12} className="practice-crumb-sep" aria-hidden="true" />
            <span>{problem.topic || 'Practice'}</span>
            {problem.difficulty && (
              <>
                <span className="practice-crumb-dot" aria-hidden="true" />
                <span>{problem.difficulty}</span>
              </>
            )}
          </nav>
          <h1 className="practice-heading" title={problem.title}>{problem.title || 'New problem'}</h1>
        </div>

        <div className="practice-bar-side">
          {env && (
            <span className={`practice-env is-${env.tone}`} title={env.label}>
              <span className="practice-env-dot" aria-hidden="true" />
              {env.label}
            </span>
          )}
          <span className={`practice-status is-${headerStatus.tone}`}>
            {headerStatus.tone === 'info' && <Loader size={12} className="spin-icon" />}
            {headerStatus.tone === 'success' && <CheckCircle2 size={12} />}
            {headerStatus.label}
          </span>
        </div>
      </header>

      {isMobile ? (
        <>
          <div className="practice-mobile-tabs" role="tablist" aria-label="Workspace">
            {mobileTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                className="practice-mobile-tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={15} />
                {label}
                {id === 'tests' && hasTestResults && <span className="practice-tab-dot" aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className="practice-mobile-body">
            {activeTab === 'problem' && renderProblemPane()}
            {activeTab === 'code' && renderCodePane(false)}
            {activeTab === 'tests' && renderTestsDock(false)}
          </div>
        </>
      ) : (
        <div className="practice-shell">
          <PanelGroup orientation="horizontal">
            <Panel defaultSize={44} minSize={30}>
              {renderProblemPane()}
            </Panel>

            <PanelResizeHandle className="practice-resize">
              <span className="practice-resize-grip" aria-hidden="true" />
            </PanelResizeHandle>

            <Panel defaultSize={56} minSize={38}>
              {renderCodePane()}
            </Panel>
          </PanelGroup>
        </div>
      )}

      {/* Floating AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        streamContent={aiStreamContent}
        isAnalyzing={aiAnalyzing}
        mode={aiMode}
        error={aiError}
        onRetry={() => handleAskAI(aiMode)}
      />

      {/* Submission Modal Overlay */}
      {showSubmissionModal && (
        <SubmissionModal
          results={submitResults}
          isRunning={isSubmitting}
          totalTests={totalSubmissionTests}
          onClose={() => setShowSubmissionModal(false)}
        />
      )}
    </div>
  );
}
