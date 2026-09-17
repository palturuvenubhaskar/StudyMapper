import TestCaseRow from './TestCaseRow';
import { Loader, Sparkles, CheckCircle } from 'lucide-react';

export default function TestRunnerPanel({ results, status, runTime, onAskAI }) {
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  return (
    <div className="test-runner-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-panel)' }}>
      {/* Header */}
      <div className="test-runner-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-surface)' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Test Results</h3>
        {status !== 'idle' && status !== 'running' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Runtime: {runTime}ms</span>
            <span className="badge" style={{ background: status === 'passed' ? 'var(--success-soft)' : 'var(--danger-soft)', color: status === 'passed' ? 'var(--success)' : 'var(--danger)' }}>
              {passedCount} / {totalCount} Passed
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="test-runner-body" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {status === 'idle' && (
          <div className="empty-state" style={{ height: '100%', padding: '24px', border: 'none', background: 'transparent' }}>
            <p>Click "Run Tests" to verify your solution against public and hidden test cases.</p>
          </div>
        )}
        
        {status === 'running' && (
          <div className="loading-container" style={{ height: '100%', padding: '24px' }}>
            <Loader className="spinner" size={24} />
            <p>Running test cases...</p>
          </div>
        )}

        {(status === 'passed' || status === 'failed') && (
          <div className="test-results-list">
            {status === 'passed' && (
              <div style={{ padding: '12px', background: 'var(--success-soft)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                <CheckCircle size={18} /> All tests passed! 🎉
              </div>
            )}
            
            {status === 'failed' && (
              <div style={{ padding: '12px', background: 'var(--danger-soft)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontWeight: 600 }}>
                {totalCount - passedCount} test(s) failed.
                <button 
                  className="btn btn-sm" 
                  style={{ float: 'right', marginTop: '-4px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
                  onClick={() => onAskAI('explain-error')}
                >
                  <Sparkles size={14} style={{ color: 'var(--accent-brand)' }} /> Ask AI why it failed
                </button>
              </div>
            )}

            {results.map((result) => (
              <TestCaseRow 
                key={result.id} 
                result={result} 
                isHidden={typeof result.id === 'string' && result.id.startsWith('h')} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
