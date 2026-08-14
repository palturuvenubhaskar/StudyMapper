import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCodingProblem, updateCodingProblem } from '../../data/repository';
import { analyzeCodingSolutionPrompt, callOpenRouterStream } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Play, Loader, Eye, EyeOff, Code2, CheckCircle2 } from 'lucide-react';
import './CodingHub.css';

export default function CodingWorkspace() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [streamingAnalysis, setStreamingAnalysis] = useState('');
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getCodingProblem(problemId);
      if (!p) { navigate('/coding'); return; }
      setProblem(p);
      setCode(p.user_code || '');
      setAnalysis(p.ai_analysis || '');
      setLoading(false);
    })();
  }, [problemId]);

  const handleSubmit = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    setAnalyzing(true);
    setStreamingAnalysis('');
    setAnalysis('');

    try {
      await updateCodingProblem(problemId, { user_code: code });

      const messages = analyzeCodingSolutionPrompt(problem, code, problem.language);
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        setStreamingAnalysis(textSoFar);
      });

      setAnalysis(fullText);
      setStreamingAnalysis('');

      // Check if verdict contains "Correct"
      const isSolved = fullText.toLowerCase().includes('✅') || fullText.toLowerCase().includes('correct');
      await updateCodingProblem(problemId, { ai_analysis: fullText, status: isSolved ? 'solved' : 'attempted' });
      setProblem(prev => ({ ...prev, status: isSolved ? 'solved' : 'attempted', ai_analysis: fullText, user_code: code }));
      toast(isSolved ? '✅ Solution looks correct!' : '⚠️ Analysis complete', isSolved ? 'success' : 'info');
    } catch (err) {
      console.error(err);
      toast('Failed to analyze: ' + err.message, 'error');
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

  return (
    <div className="coding-workspace">
      <div className="workspace-header">
        <h1>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/coding')}><ArrowLeft size={18} /></button>
          <Code2 size={20} /> {problem.title}
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
            <div className="code-editor-header">
              <span>{problem.language}</span>
              <span>{code.split('\n').length} lines</span>
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
              <button className="btn btn-primary" onClick={handleSubmit} disabled={analyzing || !code.trim()}>
                {analyzing ? <><Loader size={16} className="spin-icon" /> Analyzing...</> : <><Play size={16} /> Submit for AI Analysis</>}
              </button>
            </div>
          </div>

          {/* Analysis */}
          {(analyzing || analysis) && (
            <div className="glass-card analysis-panel">
              <div className="markdown-body">
                <MarkdownRenderer remarkPlugins={[remarkGfm]}>{analyzing ? streamingAnalysis : analysis}</MarkdownRenderer>
                {analyzing && <span className="cursor-blink">|</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
