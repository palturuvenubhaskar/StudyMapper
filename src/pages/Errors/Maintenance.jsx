import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Wrench, WifiOff, ArrowRight, RotateCcw } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Link } from 'react-router-dom';

export function Maintenance() {
  useDocumentTitle('Under Maintenance');
  const { isOnline } = useNetworkStatus();

  return (
    <div className="error-page maintenance">
      <div className="error-container">
        <div className="maintenance-icon-wrapper">
          <Wrench className="error-icon" size={64} strokeWidth={1.5} />
          <span className="maintenance-pulse" />
        </div>
        <h1>Under Maintenance</h1>
        <h2>We are upgrading your learning experience</h2>
        <p>
          StudyMapper is temporarily unavailable while we perform scheduled improvements. 
          We will be back as soon as possible.
        </p>

        <div className="maintenance-status">
          <span className="status-dot" />
          <span>Estimated return: Soon</span>
        </div>

        {!isOnline && (
          <div className="offline-notice">
            <WifiOff size={16} />
            <span>You are also offline — but your local data is safe.</span>
          </div>
        )}

        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            <RotateCcw size={18} />
            Check Status
          </button>
          <Link to="/" className="btn btn-secondary">
            Continue Offline
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
