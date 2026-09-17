import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ProblemPanel({ problem }) {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="problem-panel" style={{ padding: '24px', height: '100%', overflowY: 'auto', background: 'var(--bg-surface)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>{problem.title}</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: problem.difficulty === 'Easy' ? 'var(--success-soft)' : problem.difficulty === 'Medium' ? 'var(--warning-soft)' : 'var(--danger-soft)', color: problem.difficulty === 'Easy' ? 'var(--success)' : problem.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)' }}>
            {problem.difficulty}
          </span>
          <span className="badge" style={{ background: 'var(--bg-surface-active)', color: 'var(--text-secondary)' }}>
            {problem.topic}
          </span>
        </div>
      </div>

      <div className="markdown-body" style={{ marginBottom: '32px' }}>
        <MarkdownRenderer remarkPlugins={[remarkGfm]}>{problem.statement}</MarkdownRenderer>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Constraints</h3>
        <div className="markdown-body">
          <MarkdownRenderer remarkPlugins={[remarkGfm]}>{problem.constraints}</MarkdownRenderer>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Examples</h3>
        <div style={{ background: 'var(--bg-panel)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Input:</span>
            <pre style={{ margin: '4px 0 0 0', background: 'transparent', padding: 0, border: 'none' }}>{problem.sample_input}</pre>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Output:</span>
            <pre style={{ margin: '4px 0 0 0', background: 'transparent', padding: 0, border: 'none' }}>{problem.sample_output}</pre>
          </div>
          {problem.explanation && (
            <div>
              <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Explanation:</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>{problem.explanation}</p>
            </div>
          )}
        </div>
      </div>

      <div className="hints-accordion" style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div 
          style={{ padding: '12px 16px', background: 'var(--bg-surface-active)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => setShowHints(!showHints)}
        >
          <span>Hints</span>
          {showHints ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {showHints && (
          <div className="markdown-body" style={{ padding: '16px', background: 'var(--bg-panel)' }}>
            <MarkdownRenderer remarkPlugins={[remarkGfm]}>{problem.hints}</MarkdownRenderer>
          </div>
        )}
      </div>
    </div>
  );
}
