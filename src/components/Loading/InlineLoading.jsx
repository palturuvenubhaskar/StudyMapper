import { Loader2 } from 'lucide-react';
import './Loading.css';

export function InlineLoading({ text = 'Loading...', size = 'sm' }) {
  return (
    <span className={`inline-loading inline-loading-${size}`}>
      <Loader2 className="inline-spinner" size={size === 'sm' ? 14 : 18} />
      <span>{text}</span>
    </span>
  );
}
