import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function TestCaseRow({ result, isHidden }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`test-case-row ${result.passed ? 'border-l-4 border-success' : 'border-l-4 border-danger'} bg-surface mb-2 rounded-md overflow-hidden border border-strong`}>
      <div 
        className="test-case-header p-3 flex justify-between items-center cursor-pointer hover:bg-surface-hover transition-colors" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="test-status flex items-center gap-2">
          {result.passed ? <CheckCircle2 style={{ color: 'var(--success)' }} size={18} /> : <XCircle style={{ color: 'var(--danger)' }} size={18} />}
          <span style={{ fontWeight: 600 }}>{result.name || `Test Case ${result.id}`}</span>
          {isHidden && <span className="badge">Hidden</span>}
        </div>
        <div className="test-meta flex items-center gap-4 text-muted">
          <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {result.executionTime}ms
          </span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {expanded && (
        <div className="test-case-body p-4 border-t border-strong" style={{ background: 'var(--bg-panel)' }}>
          {isHidden && !result.passed ? (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Input and output are hidden for this test case until the problem is solved.
            </div>
          ) : (
            <div className="test-details" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="detail-section">
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Input</div>
                <div className="code-block" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {JSON.stringify(result.input)}
                </div>
              </div>
              
              <div className="detail-section">
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Output</div>
                <div className="code-block" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {JSON.stringify(result.expected)}
                </div>
              </div>
              
              <div className="detail-section">
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actual Output</div>
                <div className="code-block" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: result.passed ? 'var(--bg-surface)' : 'var(--danger-soft)', color: result.passed ? 'inherit' : 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {result.actual || <span style={{ opacity: 0.5 }}>No output</span>}
                </div>
              </div>
              
              {result.stderr && (
                <div className="detail-section">
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--danger)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Error Output</div>
                  <pre className="code-block" style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--danger-soft)', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '13px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                    {result.stderr}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
