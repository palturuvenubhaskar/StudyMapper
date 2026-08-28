import { Sparkles, X } from 'lucide-react';
import './Loading.css';

export function AIStreamingLoader({ message = 'AI is crafting your notes...', onCancel }) {
  return (
    <div className="ai-streaming-loader">
      <div className="ai-loader-content">
        <Sparkles className="ai-loader-icon" size={20} />
        <div className="ai-loader-text">
          <span>{message}</span>
          <span className="ai-loader-dots">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
      {onCancel && (
        <button onClick={onCancel} className="ai-loader-cancel" aria-label="Cancel generation">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
