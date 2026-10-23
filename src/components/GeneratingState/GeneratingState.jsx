import './GeneratingState.css';

export function GeneratingDots({ size = 'md' }) {
  return (
    <span className={`generating-state-dots generating-state-dots--${size}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function GeneratingState({ label = 'Generating', hint, size = 'md', inline = false, className = '' }) {
  return (
    <div
      className={`generating-state generating-state--${size}${inline ? ' generating-state--inline' : ''}${className ? ` ${className}` : ''}`}
      role="status"
      aria-live="polite"
    >
      <GeneratingDots size={size} />
      <span className="generating-state-copy">
        <span className="generating-state-label">{label}</span>
        {hint && <span className="generating-state-hint">{hint}</span>}
      </span>
    </div>
  );
}

