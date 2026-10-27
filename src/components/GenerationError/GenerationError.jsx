import { AlertTriangle, Loader, RefreshCw } from 'lucide-react';
import './GenerationError.css';

/**
 * Inline failure state for AI generation. Shows what went wrong and gives the
 * user a single, obvious way to try the same request again.
 */
export default function GenerationError({
  title = "Couldn't generate this",
  message = 'The AI service did not respond. This is usually temporary.',
  onRetry,
  retrying = false,
  compact = false,
  className = '',
  style,
}) {
  return (
    <div
      className={`generation-error${compact ? ' generation-error--compact' : ''}${className ? ` ${className}` : ''}`}
      role="alert"
      style={style}
    >
      <span className="generation-error-icon" aria-hidden="true">
        <AlertTriangle size={compact ? 16 : 18} />
      </span>

      <div className="generation-error-copy">
        <span className="generation-error-title">{title}</span>
        {message && <span className="generation-error-message">{message}</span>}
      </div>

      {onRetry && (
        <button
          type="button"
          className="btn btn-secondary btn-sm generation-error-retry"
          onClick={onRetry}
          disabled={retrying}
        >
          {retrying ? <Loader size={14} className="spin-icon" /> : <RefreshCw size={14} />}
          {retrying ? 'Trying…' : 'Try Again'}
        </button>
      )}
    </div>
  );
}
