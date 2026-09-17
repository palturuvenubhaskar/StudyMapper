import { X, Sparkles, Loader } from 'lucide-react';
import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';

export default function AITutorDrawer({ isOpen, onClose, streamContent, isAnalyzing, mode }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', 
        background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-strong)', 
        boxShadow: '-4px 0 24px rgba(0,0,0,0.5)', zIndex: 1000, 
        display: 'flex', flexDirection: 'column' 
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
        <h2 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-brand)' }}>
          <Sparkles size={18} />
          AI Tutor 
          <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-muted)', background: 'var(--bg-panel)', padding: '2px 6px', borderRadius: '4px' }}>
            {mode === 'explain-error' ? 'Debugging' : 'Code Review'}
          </span>
        </h2>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-root)' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {isAnalyzing && !streamContent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <Loader className="spinner" size={16} /> Thinking...
            </div>
          )}
          
          <div className="markdown-body" style={{ fontSize: '14px' }}>
            <MarkdownRenderer remarkPlugins={[remarkGfm]}>
              {streamContent || (isAnalyzing ? '' : 'No analysis available.')}
            </MarkdownRenderer>
            {isAnalyzing && streamContent && <span className="cursor-blink">|</span>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-surface)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
          AI analysis uses API tokens. Use local tests first when possible.
        </p>
      </div>
    </div>
  );
}
