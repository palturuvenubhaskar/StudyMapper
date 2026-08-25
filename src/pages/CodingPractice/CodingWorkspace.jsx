import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCodingProblem, updateCodingProblem } from '../../data/repository';
import { analyzeCodingSolutionPrompt, generateVisualDebugPrompt, generateCodeReviewPrompt, callOpenRouterStream } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Play, Loader, Eye, EyeOff, Code2, CheckCircle2, Bug, Search } from 'lucide-react';
import { awardXP } from '../../core/gamification/xpEngine';
import { updateQuestProgress } from '../../core/gamification/dailyQuests';
import { checkAchievements } from '../../core/gamification/achievementChecker';
import { logEvent } from '../../core/analytics/tracker';
import './CodingPractice.css';

export default function CodingWorkspace() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modes: 'analysis' | 'debug' | 'review'
  const [activeMode, setActiveMode] = useState('analysis');
  const [analyzing, setAnalyzing] = useState(false);
  
  const [analysisContent, setAnalysisContent] = useState('');
  const [debugContent, setDebugContent] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  
  const [streamingContent, setStreamingContent] = useState('');
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getCodingProblem(problemId);
      if (!p) { navigate('/coding'); return; }
      setProblem(p);
      setCode(p.user_code || '');
      setAnalysisContent(p.ai_analysis || '');
      setLoading(false);
    })();
  }, [problemId]);

  const handleAction = async (mode) => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    
    setActiveMode(mode);
    setAnalyzing(true);
    setStreamingContent('');
    
    // Clear previous content for the mode
    if (mode === 'analysis') setAnalysisContent('');
    else if (mode === 'debug') setDebugContent('');
    else if (mode === 'review') setReviewContent('');

    try {
      await updateCodingProblem(problemId, { user_code: code });

      let messages;
      if (mode === 'analysis') {
        messages = analyzeCodingSolutionPrompt(problem, code, problem.language);
      } else if (mode === 'debug') {
        messages = generateVisualDebugPrompt(problem, code, problem.language);
      } else if (mode === 'review') {
        messages = generateCodeReviewPrompt(problem, code, problem.language);
      }

      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        setStreamingContent(textSoFar);
      });

      if (mode === 'analysis') {
        setAnalysisContent(fullText);
        // Correctness check logic
        const isSolved = fullText.toLowerCase().includes('✅') || fullText.toLowerCase().includes('correct');
        await updateCodingProblem(problemId, { ai_analysis: fullText, status: isSolved ? 'solved' : 'attempted' });
        setProblem(prev => ({ ...prev, status: isSolved ? 'solved' : 'attempted', ai_analysis: fullText, user_code: code }));
        
        if (isSolved && problem.status !== 'solved') {
          await awardXP('guest', 100, 'coding_problem', problemId);
          await updateQuestProgress('guest', 'solve_code', 1);
          await checkAchievements('guest');
        }
        await logEvent('guest', problemId, 'coding_problem_attempt', 0, isSolved ? 100 : 0);
        toast(isSolved ? '✅ Solution looks correct!' : '⚠️ Analysis complete', isSolved ? 'success' : 'info');
      } else if (mode === 'debug') {
        setDebugContent(fullText);
        toast('🐞 Debug trace complete', 'info');
      } else if (mode === 'review') {
        setReviewContent(fullText);
        toast('👀 Code review complete', 'success');
      }

      setStreamingContent('');
    } catch (err) {
      console.error(err);
      toast('Failed to process: ' + err.message, 'error');
    }
    setAnalyzing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 4; }, 0);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;

  const renderActiveContent = () => {
    if (analyzing) return streamingContent;
    if (activeMode === 'analysis') return analysisContent;
    if (activeMode === 'debug') return debugContent;
    if (activeMode === 'review') return reviewContent;
    return '';
  };

  return (
    <div className="coding-workspace">
      <div className="workspace-header">
        <h1 style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', margin: 0, flex: '1 1 100%' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/coding')} style={{ flexShrink: 0, margin: 0 }}>
            <ArrowLeft size={18} />
          </button>
          <span style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
            <Code2 size={20} style={{ flexShrink: 0, marginTop: '4px' }} />
            <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{problem.title}</span>
          </span>
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: problem.difficulty === 'Easy' ? 'var(--success-soft)' : problem.difficulty === 'Medium' ? 'var(--warning-soft)' : 'var(--danger-soft)', color: problem.difficulty === 'Easy' ? 'var(--success)' : problem.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)' }}>{problem.difficulty}</span>
          <span className="badge badge-accent">{problem.language}</span>
          <span className="badge badge-accent">{problem.topic}</span>
          {problem.status === 'solved' && <span className="badge badge-success"><CheckCircle2 size={10} /> Solved</span>}
        </div>
      </div>

      <div className="workspace-split">
        {/* Left: Problem */}
        <div className="workspace-left glass-card">
          <div className="problem-panel">
            <h2>Problem Statement</h2>
            <p>{problem.statement}</p>

            <h2>Constraints</h2>
            <pre>{problem.constraints}</pre>

            <h2>Sample Input</h2>
            <pre>{problem.sample_input}</pre>

            <h2>Sample Output</h2>
            <pre>{problem.sample_output}</pre>

            <h2>Explanation</h2>
            <p>{problem.explanation}</p>

            <div className="hints-toggle">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowHints(!showHints)}>
                {showHints ? <><EyeOff size={14} /> Hide Hints</> : <><Eye size={14} /> Show Hints</>}
              </button>
              {showHints && <div className="hints-content">{problem.hints}</div>}
            </div>
          </div>
        </div>

        {/* Right: Code editor */}
        <div className="workspace-right">
          <div className="glass-card code-panel">
            <div className="code-editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{problem.language}</span>
              <div className="tool-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`btn btn-sm ${activeMode === 'debug' ? 'btn-primary' : 'btn-ghost'}`} 
                  onClick={() => handleAction('debug')}
                  disabled={analyzing}
                  title="Visual Debugger (Simulated Trace)"
                >
                  <Bug size={14} /> Debug
                </button>
                <button 
                  className={`btn btn-sm ${activeMode === 'review' ? 'btn-primary' : 'btn-ghost'}`} 
                  onClick={() => handleAction('review')}
                  disabled={analyzing}
                  title="Senior Developer Code Review"
                >
                  <Search size={14} /> Review
                </button>
              </div>
            </div>
            <textarea
              className="code-textarea"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`// Write your ${problem.language} solution here...`}
              spellCheck="false"
            />
            <div className="code-actions">
              <button className={`btn ${activeMode === 'analysis' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleAction('analysis')} disabled={analyzing || !code.trim()}>
                {analyzing && activeMode === 'analysis' ? <><Loader size={16} className="spin-icon" /> Analyzing...</> : <><Play size={16} /> Submit for Analysis</>}
              </button>
            </div>
          </div>

          {/* Analysis / Output Panel */}
          {(analyzing || analysisContent || debugContent || reviewContent) && (
            <div className="glass-card analysis-panel">
              <div className="analysis-tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontWeight: activeMode === 'analysis' ? 'bold' : 'normal', color: activeMode === 'analysis' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setActiveMode('analysis')}>
                  Analysis Verdict
                </span>
                <span style={{ fontWeight: activeMode === 'debug' ? 'bold' : 'normal', color: activeMode === 'debug' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setActiveMode('debug')}>
                  Debug Trace
                </span>
                <span style={{ fontWeight: activeMode === 'review' ? 'bold' : 'normal', color: activeMode === 'review' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setActiveMode('review')}>
                  Code Review
                </span>
              </div>
              <div className={`markdown-body ${activeMode === 'debug' ? 'debug-trace' : ''}`}>
                <MarkdownRenderer remarkPlugins={[remarkGfm]}>{renderActiveContent() || 'No data yet for this mode. Run the tool above.'}</MarkdownRenderer>
                {analyzing && <span className="cursor-blink">|</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
