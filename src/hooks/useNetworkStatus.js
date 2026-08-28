import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    wasOffline: false,
    since: Date.now(),
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        isOnline: true,
        wasOffline: !prev.isOnline,
        since: Date.now(),
      }));
    };

    const handleOffline = () => {
      setStatus(prev => ({
        isOnline: false,
        wasOffline: prev.wasOffline,
        since: Date.now(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
