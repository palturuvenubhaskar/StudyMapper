import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Terminal, Play } from 'lucide-react';

export default function TestCasePanel({ results, status, runTime }) {
  const passedCount = results ? results.filter(r => r.passed).length : 0;
  const totalCount = results ? results.length : 0;
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="test-case-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ─── Tabs Header ─── */}
      <div className="test-case-tabs" style={{ display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
        <div className="tabs-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#252526', borderBottom: '1px solid #333', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}><CheckCircle2 size={16} /></span> Testcase
        </div>
        
        <div className="tabs-list" style={{ display: 'flex', gap: '8px', padding: '8px 16px', borderBottom: '1px solid #333' }}>
          {results && results.length > 0 ? (
            results.map((r, i) => (
              <button
                key={r.id || i}
                onClick={() => setActiveTab(i)}
                className={`test-tab ${activeTab === i ? 'active' : ''} ${status !== 'idle' && status !== 'running' ? (r.passed ? 'pass' : 'fail') : ''}`}
              >
                {status !== 'idle' && status !== 'running' && (
                  r.passed ? <CheckCircle2 size={12} className="tab-status pass" /> : <XCircle size={12} className="tab-status fail" />
                )}
                Case {i + 1}
              </button>
            ))
          ) : (
            <button className="test-tab active">Test Results</button>
          )}
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="test-case-content" style={{ flex: 1, overflowY: 'auto' }}>
        {/* Idle state */}
        {status === 'idle' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6e7681' }}>
            <Terminal size={32} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
            <p>Click <strong>"Run"</strong> to test your solution against visible test cases.</p>
          </div>
        )}

        {/* Running state for "Run Tests" (not Submit) */}
        {status === 'running' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', color: '#e6edf3' }}>
            <Loader2 size={20} className="spin" style={{ color: '#38bdf8' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Running...</div>
              <div style={{ fontSize: '12px', color: '#8b949e' }}>Executing code against test cases.</div>
            </div>
          </div>
        )}

        {/* Results state */}
        {(status === 'passed' || status === 'failed') && results && results[activeTab] && (
          <TestCaseDetail result={results[activeTab]} />
        )}
      </div>
    </div>
  );
}

function TestCaseDetail({ result }) {
  return (
    <div className="io-display">
      {/* Input */}
      <div className="io-group">
        <label>Input</label>
        <pre className="io-value">{JSON.stringify(result.input)}</pre>
      </div>

      {/* Expected Output */}
      <div className="io-group">
        <label>Expected Output</label>
        <pre className={`io-value expected`}>
          {JSON.stringify(result.expected)}
        </pre>
      </div>

      {/* Actual Output */}
      <div className="io-group">
        <label>Your Output</label>
        <pre className={`io-value ${result.passed ? 'pass' : 'fail'}`}>
          {result.actual || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>No output</span>}
        </pre>
      </div>

      {/* Error */}
      {result.stderr && (
        <div className="io-group error">
          <label style={{ color: '#f87171' }}>Error Output</label>
          <pre className="io-value">
            {result.stderr}
          </pre>
        </div>
      )}

      {/* Footer / Execution Stats */}
      <div className="test-case-footer">
        {result.passed ? (
          <span className="result-badge passed">Accepted</span>
        ) : (
          <span className="result-badge failed">Wrong Answer</span>
        )}
        
        {result.executionTime != null && (
          <span className="execution-time">
            Execution Time: {result.executionTime}ms
          </span>
        )}
      </div>
    </div>
  );
}
