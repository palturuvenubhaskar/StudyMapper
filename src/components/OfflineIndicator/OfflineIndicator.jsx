import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { WifiOff, X } from 'lucide-react';
import { useState } from 'react';
import './OfflineIndicator.css';

export function OfflineIndicator() {
  const { isOnline } = useNetworkStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <div className="offline-indicator" role="status">
      <WifiOff size={16} />
      <span>You are offline. Your data is safe locally.</span>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss offline notice">
        <X size={14} />
      </button>
    </div>
  );
}
