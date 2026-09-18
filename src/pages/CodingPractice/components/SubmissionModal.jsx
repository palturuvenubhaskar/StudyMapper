import { Loader2, CheckCircle, XCircle, X, Clock, Trophy } from 'lucide-react';

export default function SubmissionModal({ results, isRunning, totalTests, onClose }) {
  const passedCount = results ? results.filter(r => r.passed).length : 0;
  const completedCount = results ? results.length : 0;
  const allPassed = !isRunning && passedCount === totalTests && totalTests > 0;
  const score = totalTests > 0 ? Math.round((passedCount / totalTests) * 100) : 0;
  const totalExecutionTime = results ? results.reduce((sum, r) => sum + (r.executionTime || 0), 0) : 0;

  return (
    <div className="submission-modal-overlay">
      <div className="submission-modal">
        {/* Header */}
        <div className="submission-header">
          <div>
            <h2>
              {isRunning ? (
                <><Loader2 size={20} className="spin" style={{ color: '#3b82f6', display: 'inline', verticalAlign: '-3px', marginRight: '8px' }} /> Submitting...</>
              ) : allPassed ? (
                <><Trophy size={20} className="success-icon" style={{ display: 'inline', verticalAlign: '-3px', marginRight: '8px' }} /> Accepted!</>
              ) : (
                <><XCircle size={20} className="fail-icon" style={{ display: 'inline', verticalAlign: '-3px', marginRight: '8px' }} /> {passedCount}/{totalTests} Passed</>
              )}
            </h2>
            {!isRunning && (
              <p>{allPassed ? 'All test cases passed successfully.' : 'Some test cases failed. Review and try again.'}</p>
            )}
            {isRunning && (
              <p>Running testcase {Math.min(completedCount + 1, totalTests)} of {totalTests}...</p>
            )}
          </div>
          <button onClick={onClose} className="modal-close-btn" disabled={isRunning}>
            <X size={18} />
          </button>
        </div>

        {/* Test Case Results Table */}
        <div className="submission-results">
          <table>
            <thead>
              <tr>
                <th>Testcase #</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: totalTests }).map((_, i) => {
                const result = results && results[i];
                const isPending = !result;
                const rowClass = isPending ? 'pending' : (result.passed ? 'passed' : 'failed');

                return (
                  <tr key={i} className={rowClass}>
                    <td>Testcase #{i + 1}</td>
                    <td>
                      {result ? (
                        result.passed ? (
                          <span className="status-pass"><CheckCircle size={14} /> Passed</span>
                        ) : (
                          <span className="status-fail"><XCircle size={14} /> Failed</span>
                        )
                      ) : (
                        isRunning ? (
                          <span className="status-pending"><Loader2 size={14} className="spin" /> Running...</span>
                        ) : (
                          <span className="status-pending">Skipped</span>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="submission-footer">
          {!isRunning ? (
            <div className="submission-stats">
              <span className={`score ${allPassed ? 'pass' : 'fail'}`}>
                Score: {score}/100
              </span>
            </div>
          ) : (
            <div className="submission-stats">
              <span style={{ color: '#64748b' }}>Please wait while your code is evaluated...</span>
            </div>
          )}
          <button 
            onClick={onClose} 
            className="btn btn-primary"
            style={{ 
              padding: '8px 16px', background: '#3b82f6', color: 'white', 
              border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
              opacity: isRunning ? 0.6 : 1
            }}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
