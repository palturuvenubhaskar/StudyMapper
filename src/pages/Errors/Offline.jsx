import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { CloudOff, Wifi, BookOpen, Brain, Clock, Code } from 'lucide-react';

export function Offline() {
  useDocumentTitle('Offline');

  const offlineFeatures = [
    { icon: BookOpen, label: 'Read Notes & Topics' },
    { icon: Brain, label: 'Review Flashcards' },
    { icon: Clock, label: 'Use Pomodoro Timer' },
    { icon: Code, label: 'Practice Coding (non-evaluated)' },
  ];

  return (
    <div className="error-page offline">
      <div className="error-container">
        <CloudOff className="error-icon muted" size={64} strokeWidth={1.5} />
        <h1>You are Offline</h1>
        <h2>No internet connection detected</h2>
        <p>
          The good news? StudyMapper is built to work offline. 
          All your subjects, notes, and flashcards are available right now.
        </p>

        <div className="offline-features">
          <h3>Available Offline:</h3>
          <div className="feature-grid">
            {offlineFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="feature-item">
                <Icon size={20} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            <Wifi size={18} />
            Retry Connection
          </button>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
