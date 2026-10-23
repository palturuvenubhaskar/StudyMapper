import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, TrendingUp, Sparkles, X, ArrowRight } from 'lucide-react';
import './Welcome.css';

export default function Welcome({ onClose }) {
  const navigate = useNavigate();
  const primaryActionRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    primaryActionRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleGetStarted = () => {
    if (onClose) onClose();
    navigate('/create');
  };

  const handleSignIn = () => {
    if (onClose) onClose();
    navigate('/login');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="welcome-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="welcome-card">
        {onClose && (
          <button
            type="button"
            className="welcome-close-btn"
            onClick={onClose}
            aria-label="Close welcome modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}

        <div className="welcome-header">
          <div className="welcome-badge" aria-hidden="true">
            <Sparkles size={28} />
          </div>
          <h1 id="welcome-title" className="welcome-title">
            Welcome to StudyMapper!
          </h1>
          <p className="welcome-subtitle">
            Your intelligent study companion. Track progress, generate adaptive plans, and master any subject — all in one place.
          </p>
        </div>

        <div className="welcome-grid">
          <div className="welcome-feature">
            <div className="welcome-feature-icon blue">
              <Search size={20} />
            </div>
            <span className="welcome-feature-text">Organize subjects & topics</span>
          </div>

          <div className="welcome-feature">
            <div className="welcome-feature-icon purple">
              <Calendar size={20} />
            </div>
            <span className="welcome-feature-text">Plan your study schedule</span>
          </div>

          <div className="welcome-feature">
            <div className="welcome-feature-icon green">
              <TrendingUp size={20} />
            </div>
            <span className="welcome-feature-text">Track your progress</span>
          </div>

          <div className="welcome-feature">
            <div className="welcome-feature-icon orange">
              <Sparkles size={20} />
            </div>
            <span className="welcome-feature-text">AI-powered help</span>
          </div>
        </div>

        <div className="welcome-actions">
          <button
            ref={primaryActionRef}
            type="button"
            className="welcome-btn-primary"
            onClick={handleGetStarted}
          >
            Start studying
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="welcome-btn-secondary"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        </div>

        <p className="welcome-footer-text">
          No account needed to begin. Your subjects stay on this device until you sign in.
        </p>
      </div>
    </div>
  );
}