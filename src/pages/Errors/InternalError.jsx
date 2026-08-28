import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ServerCrash, RotateCcw, Home, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InternalError({ error, errorInfo, onReset }) {
  useDocumentTitle('Something Went Wrong');

  return (
    <div className="error-page">
      <div className="error-container">
        <ServerCrash className="error-icon danger" size={64} strokeWidth={1.5} />
        <h1>500</h1>
        <h2>Something went wrong on our end</h2>
        <p>
          Do not worry — all your study data is safe in your browser local storage. 
          This appears to be a temporary issue.
        </p>

        <div className="error-actions">
          {onReset && (
            <button onClick={onReset} className="btn btn-primary">
              <RotateCcw size={18} />
              Reload Page
            </button>
          )}
          <Link to="/" className="btn btn-secondary">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/support" state={{ category: 'Bug Report' }} className="btn btn-ghost">
            <Bug size={18} />
            Report Issue
          </Link>
        </div>

        {(error || errorInfo) && (
          <details className="error-details">
            <summary>Technical Details (for debugging)</summary>
            <pre>
              {error?.toString()}
              {'\n'}
              {errorInfo?.componentStack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
