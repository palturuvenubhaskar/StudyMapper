import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCodingProblem, updateCodingProblem } from '../../data/repository';
import { analyzeCodingSolutionPrompt, generateVisualDebugPrompt, generateCodeReviewPrompt, generateCodingProblemPrompt, extractJson, callOpenRouter, callOpenRouterStream } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, Loader } from 'lucide-react';
import { awardXP } from '../../core/gamification/xpEngine';
import { updateQuestProgress } from '../../core/gamification/dailyQuests';
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
import { db } from '../../data/db';

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
  const generationStartedRef = useRef(false);
  
  // AI Tutor State
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMode, setAiMode] = useState('review'); // 'review' or 'explain-error'
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiStreamContent, setAiStreamContent] = useState('');

  // Submission State
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResults, setSubmitResults] = useState([]);
  
  // Local Execution Hooks
  const pyodideConfig = usePyodide();
  const { results, status, runTime, runTests, reset: resetTests } = useTestRunner(pyodideConfig);

  // Stream-generate the problem when it has status 'generating'
  const streamGenerateProblem = useCallback(async (pRecord) => {
    if (generationStartedRef.current) return;
    generationStartedRef.current = true;
    setIsGenerating(true);
    setGeneratingStream('');

    try {
      const messages = generateCodingProblemPrompt(
        pRecord.language, pRecord.topic, pRecord.difficulty
      );

      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        setGeneratingStream(textSoFar);
        // Try to parse partial JSON to update problem progressively
        try {
          const partial = extractJson(textSoFar);
          if (partial) {
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
        toast('Failed to parse problem. Try regenerating.', 'error');
        await updateCodingProblem(pRecord.id, { status: 'unsolved' });
        setProblem(prev => ({ ...prev, status: 'unsolved' }));
      }
    } catch (err) {
      console.error('Generation failed:', err);
      toast('Generation failed: ' + err.message, 'error');
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
      const starterCode = localProblem?.starterCode?.[language] || '';
      setCode(savedCode || starterCode);
      
      setLoading(false);

      // If the problem is in 'generating' state, start streaming AI generation
      if (pRecord && pRecord.status === 'generating') {
        streamGenerateProblem(pRecord);
      }
    })();
  }, [problemId, language, navigate, toast, streamGenerateProblem]);

  const handleRunTests = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    
    // Save code attempt to DB
    try {
      await updateCodingProblem(problemId, { user_code: code });
    } catch(err) { /* ignore if record doesn't exist yet */ }
    
    // Run ONLY public test cases for "Run"
    let publicTests = problem.publicTestCases || [];
    if (!publicTests.length && problem.test_cases_json) {
       try {
         const tcJson = typeof problem.test_cases_json === 'string' ? JSON.parse(problem.test_cases_json) : problem.test_cases_json;
         publicTests = tcJson.filter(t => !t.isHidden && !t.is_hidden);
       } catch (e) {}
    }

    if (publicTests.length === 0) {
      toast('No visible test cases found for this problem', 'warning');
      return;
    }
    
    await runTests(code, publicTests);
  };

  const handleSubmit = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }

    setIsSubmitting(true);
    setShowSubmissionModal(true);
    setSubmitResults([]);

    // Save code attempt to DB
    try {
      await updateCodingProblem(problemId, { user_code: code });
    } catch(err) { /* ignore if record doesn't exist yet */ }
    
    // Run ALL test cases (public + hidden)
    let allTests = [...(problem.publicTestCases || []), ...(problem.hiddenTestCases || [])];
    if (allTests.length === 0 && problem.test_cases_json) {
       try {
         allTests = typeof problem.test_cases_json === 'string' ? JSON.parse(problem.test_cases_json) : problem.test_cases_json;
       } catch (e) {}
    }

    if (allTests.length === 0) {
      toast('No test cases found for this problem', 'warning');
      setIsSubmitting(false);
      setShowSubmissionModal(false);
      return;
    }

    // We use the runTests hook to actually execute, but we'll capture results 
    // Wait, runTests updates `results` state which is passed to TestCasePanel.
    // For Submission Modal, we also want to intercept it or just use `results` state.
    // Let's run it using the hook, and copy the results state to `submitResults`.
    await runTests(code, allTests, (currentResults) => {
      setSubmitResults([...currentResults]);
    });

    setIsSubmitting(false);

    // After runTests finishes, check if all passed
    // Note: since runTests is async, we can check submitResults after it resolves
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
          await checkAchievements('guest');
          await logEvent('guest', problemId, 'coding_problem_solved', 0, 100);
          
          toast('✅ Solution Accepted! You earned XP.', 'success');
        } catch(err) {
          console.error("Failed to update status", err);
        }
      })();
    }
  }, [isSubmitting, submitResults, problem, problemId, code, toast]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your code to the starter template?')) {
      setCode(problem?.starterCode?.[language] || '');
      resetTests();
      setSubmitResults([]);
    }
  };

  const handleAskAI = async (mode = 'review') => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    
    setAiMode(mode);
    setAiDrawerOpen(true);
    setAiAnalyzing(true);
    setAiStreamContent('');

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
      toast('Failed to contact AI: ' + err.message, 'error');
    }
    setAiAnalyzing(false);
  };

  if (loading) return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;

  // Show generating state in the header
  const isCurrentlyGenerating = isGenerating || problem?.status === 'generating';

  let totalSubmissionTests = 0;
  if (problem) {
     const p1 = problem.publicTestCases || [];
     const p2 = problem.hiddenTestCases || [];
     totalSubmissionTests = p1.length + p2.length;
     if (totalSubmissionTests === 0 && problem.test_cases_json) {
       try {
         const parsed = typeof problem.test_cases_json === 'string' ? JSON.parse(problem.test_cases_json) : problem.test_cases_json;
         totalSubmissionTests = parsed.length;
       } catch (e) {}
     }
  }

  return (
    <div className="coding-practice-page">
      {/* Top Navbar */}
      <div className="breadcrumb">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/coding')} style={{ padding: 0, marginRight: '8px' }}>
          <ArrowLeft size={16} />
        </button>
        <span style={{ fontWeight: 500 }}>Coding Practice</span>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{problem.title}</span>
        
        {isCurrentlyGenerating && (
          <div className="badge badge-accent" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <Loader size={12} className="spin-icon" /> Generating Problem...
          </div>
        )}
        {pyodideConfig.loading && !isCurrentlyGenerating && (
          <div className="badge badge-accent" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <Loader size={12} className="spin-icon" /> Loading Python Environment...
          </div>
        )}
      </div>

      {/* Main Workspace Area */}
      <div className="split-pane">
        <PanelGroup orientation="horizontal">
          
          {/* Left Pane: Problem Description */}
          <Panel defaultSize={45} minSize={30}>
            <div className="pane-left-content">
              <ProblemPanel problem={problem} isGenerating={isCurrentlyGenerating} />
            </div>
          </Panel>

          <PanelResizeHandle style={{ width: '16px', background: 'transparent', cursor: 'col-resize' }} />

          {/* Right Pane: Editor & Tests */}
          <Panel defaultSize={55} minSize={40}>
            <div className="pane-right-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: '16px', paddingRight: '4px' }}>
              
              <div className="pane-right-top" style={{ height: 'calc(100vh - 120px)', flexShrink: 0 }}>
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

              <div className="pane-right-bottom" style={{ minHeight: '400px', flexShrink: 0, marginBottom: '24px' }}>
                <TestCasePanel 
                  results={results}
                  status={status}
                  runTime={runTime}
                />
              </div>
              
            </div>
          </Panel>
          
        </PanelGroup>

        {/* Floating AI Tutor Drawer */}
        <AITutorDrawer 
          isOpen={aiDrawerOpen} 
          onClose={() => setAiDrawerOpen(false)} 
          streamContent={aiStreamContent}
          isAnalyzing={aiAnalyzing}
          mode={aiMode}
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
    </div>
  );
}
