import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCodingProblem, updateCodingProblem } from '../../data/repository';
import { analyzeCodingSolutionPrompt, generateVisualDebugPrompt, generateCodeReviewPrompt, callOpenRouterStream } from '../../core/api/aiService';
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
import EditorPanel from './components/EditorPanel';
import TestRunnerPanel from './components/TestRunnerPanel';
import AITutorDrawer from './components/AITutorDrawer';

import './CodingPractice.css';

export default function CodingWorkspace() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [dbRecord, setDbRecord] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(true);
  
  // AI Tutor State
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMode, setAiMode] = useState('review'); // 'review' or 'explain-error'
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiStreamContent, setAiStreamContent] = useState('');
  
  // Local Execution Hooks
  const pyodideConfig = usePyodide();
  const { results, status, runTime, runTests, reset: resetTests } = useTestRunner(pyodideConfig);

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
      
      // Load saved code or starter code
      const savedCode = pRecord?.user_code;
      const starterCode = localProblem?.starterCode?.[language] || '';
      setCode(savedCode || starterCode);
      
      setLoading(false);
    })();
  }, [problemId, language, navigate, toast]);

  // Gamification hook when tests pass
  useEffect(() => {
    if (status === 'passed' && problem && problem.status !== 'solved') {
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
  }, [status, problem, problemId, code, toast]);

  const handleRunTests = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    
    // Save code attempt to DB
    try {
      await updateCodingProblem(problemId, { user_code: code });
    } catch(err) { /* ignore if record doesn't exist yet */ }
    
    // Combine public and hidden tests
    const allTests = [...(problem.publicTestCases || []), ...(problem.hiddenTestCases || [])];
    
    if (allTests.length === 0) {
      toast('No test cases found for this problem', 'warning');
      return;
    }
    
    await runTests(code, allTests);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your code to the starter template?')) {
      setCode(problem?.starterCode?.[language] || '');
      resetTests();
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

  return (
    <div className="coding-workspace" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-root)' }}>
      {/* Top Navbar */}
      <div className="workspace-header" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/coding')} style={{ padding: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Coding Practice</h2>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: 500 }}>{problem.title}</span>
        </div>
        {pyodideConfig.loading && (
          <div className="badge badge-accent" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Loader size={12} className="spin-icon" /> Loading Python Environment...
          </div>
        )}
      </div>

      {/* Main Workspace Area */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <PanelGroup direction="horizontal">
          
          {/* Left Pane: Problem Description */}
          <Panel defaultSize={40} minSize={30} style={{ borderRight: '1px solid var(--border-light)' }}>
            <ProblemPanel problem={problem} />
          </Panel>

          <PanelResizeHandle className="panel-resize-handle" style={{ width: '4px', cursor: 'col-resize', background: 'transparent', position: 'relative', zIndex: 10 }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '1px', right: '1px', background: 'var(--border-strong)', transition: 'background 0.2s', ':hover': { background: 'var(--accent-brand)' } }} />
          </PanelResizeHandle>

          {/* Right Pane: Editor & Tests */}
          <Panel defaultSize={60} minSize={40}>
            <PanelGroup direction="vertical">
              
              <Panel defaultSize={65} minSize={30} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <EditorPanel 
                  code={code} 
                  setCode={setCode} 
                  language={language} 
                  setLanguage={setLanguage}
                  onRunTests={handleRunTests}
                  isRunning={status === 'running'}
                  onReset={handleReset}
                  onAskAI={handleAskAI}
                  canAskAI={status === 'failed' || status === 'passed'}
                  canSubmit={status === 'passed'}
                />
              </Panel>

              <PanelResizeHandle className="panel-resize-handle" style={{ height: '4px', cursor: 'row-resize', background: 'transparent', position: 'relative', zIndex: 10 }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: '1px', bottom: '1px', background: 'var(--border-strong)' }} />
              </PanelResizeHandle>

              <Panel defaultSize={35} minSize={20} collapsible>
                <TestRunnerPanel 
                  results={results}
                  status={status}
                  runTime={runTime}
                  onAskAI={handleAskAI}
                />
              </Panel>
              
            </PanelGroup>
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
      </div>
    </div>
  );
}
