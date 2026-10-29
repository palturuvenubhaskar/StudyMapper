import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Terminal, ChevronDown, Sparkles } from 'lucide-react';

const formatValue = (value) => {
  if (value === undefined) return '—';
  if (typeof value === 'string') return value === '' ? '""' : JSON.stringify(value);
  return JSON.stringify(value);
};

export default function TestCasePanel({
  results,
  status,
  runTime = 0,
  totalTests = 0,
  onExplain,
  collapsible = true,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const passedCount = results ? results.filter(r => r.passed).length : 0;
  const totalCount = results ? results.length : 0;

  // Surface the first failure as soon as a run finishes.
  useEffect(() => {
    if (status !== 'passed' && status !== 'failed') return;
    const firstFailure = results.findIndex(r => !r.passed);
    setActiveTab(firstFailure > -1 ? firstFailure : 0);
  }, [status, results]);

  const summary = status === 'running'
    ? `Running test ${Math.min(results.length + 1, totalTests || results.length + 1)}${totalTests ? ` of ${totalTests}` : ''}…`
    : status === 'passed' || status === 'failed'
      ? `${passedCount} of ${totalCount} passed${runTime ? ` · ${runTime} ms` : ''}`
      : totalTests
        ? `${totalTests} visible test${totalTests === 1 ? '' : 's'} ready`
        : 'Run your code to check it';

  const activeResult = results && results[activeTab];
  const hasFailures = status === 'failed' && results.some(r => !r.passed);

  return (
    <section className={`practice-tests${collapsed ? ' is-collapsed' : ''}`} aria-label="Test results">
      <div className="practice-tests-head">
        <span className="practice-tests-icon" aria-hidden="true">
          <Terminal size={14} />
        </span>
        <div className="practice-tests-copy">
          <span className="practice-tests-title">Test results</span>
          <span className="practice-tests-sub">{summary}</span>
        </div>

        <div className="practice-tests-actions">
          {status === 'passed' && (
            <span className="practice-verdict is-pass">
              <CheckCircle2 size={12} /> All passed
            </span>
          )}
          {hasFailures && onExplain && (
            <button type="button" className="practice-text-btn" onClick={onExplain}>
              <Sparkles size={13} /> Explain failure
            </button>
          )}
          {collapsible && (
            <button
              type="button"
              className="practice-icon-btn"
              aria-expanded={!collapsed}
              aria-label={collapsed ? 'Expand test results' : 'Collapse test results'}
              title={collapsed ? 'Expand test results' : 'Collapse test results'}
              onClick={() => setCollapsed(value => !value)}
            >
              <ChevronDown size={16} className={collapsed ? 'is-flipped' : ''} />
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="practice-tests-body">
          {status === 'idle' && (
            <div className="practice-tests-empty">
              <Terminal size={22} />
              <p>
                <strong>No results yet.</strong>{' '}
                {totalTests
                  ? `Run your code to check it against ${totalTests} visible test${totalTests === 1 ? '' : 's'}.`
                  : 'Run your code to check it against the visible tests.'}
              </p>
              <span className="practice-tests-kbd">
                Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> in the editor
              </span>
            </div>
          )}

          {status === 'running' && (
            <div className="practice-tests-empty">
              <Loader2 size={22} className="spin-icon" />
              <p><strong>Running tests…</strong></p>
              <div
                className="practice-run-track"
                role="progressbar"
                aria-label="Test progress"
                aria-valuemin={0}
                aria-valuemax={totalTests || 0}
                aria-valuenow={totalCount}
              >
                <div
                  className="practice-run-fill"
                  style={{ width: `${totalTests ? Math.round((totalCount / totalTests) * 100) : 0}%` }}
                />
              </div>
            </div>
          )}

          {status !== 'idle' && status !== 'running' && results && results.length > 0 && (
            <>
              <div className="practice-case-tabs" role="tablist" aria-label="Test cases">
                {results.map((result, i) => (
                  <button
                    key={result.id || i}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === i}
                    className={`practice-case-tab is-${result.passed ? 'pass' : 'fail'}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {result.passed
                      ? <CheckCircle2 size={12} />
                      : <XCircle size={12} />}
                    Case {i + 1}
                  </button>
                ))}
              </div>

              {activeResult && (
                <div className="practice-case-detail" role="tabpanel">
                  <div className="practice-io-grid">
                    <div className="practice-io-block">
                      <span className="practice-io-label">Input</span>
                      <pre>{formatValue(activeResult.input)}</pre>
                    </div>
                    <div className="practice-io-block">
                      <span className="practice-io-label">Expected</span>
                      <pre>{formatValue(activeResult.expected)}</pre>
                    </div>
                    <div className={`practice-io-block is-${activeResult.passed ? 'pass' : 'fail'}`}>
                      <span className="practice-io-label">Your output</span>
                      <pre>{activeResult.actual || <span className="practice-io-empty">No output</span>}</pre>
                    </div>
                  </div>

                  {activeResult.stderr && (
                    <div className="practice-io-block is-error">
                      <span className="practice-io-label">Error output</span>
                      <pre>{activeResult.stderr}</pre>
                    </div>
                  )}

                  <div className="practice-case-foot">
                    <span className={`practice-verdict is-${activeResult.passed ? 'pass' : 'fail'}`}>
                      {activeResult.passed
                        ? <><CheckCircle2 size={12} /> Accepted</>
                        : <><XCircle size={12} /> Wrong answer</>}
                    </span>
                    {activeResult.executionTime !== undefined && (
                      <span className="practice-case-time">{activeResult.executionTime} ms</span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
