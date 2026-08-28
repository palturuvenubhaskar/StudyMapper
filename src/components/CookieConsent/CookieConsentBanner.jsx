import { Cookie, X, Settings, Check } from 'lucide-react';
import './CookieConsent.css';

export function CookieConsentBanner({ 
  isVisible, 
  onAcceptAll, 
  onRejectNonEssential, 
  onOpenPreferences,
  onDismiss 
}) {
  if (!isVisible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner-content">
        <Cookie className="cookie-icon" size={24} />
        <div className="cookie-text">
          <p>
            We use cookies to enhance your study experience and analyze traffic. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies.{''}
            <a href="/cookie-policy">Learn more</a>
          </p>
        </div>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-btn-ghost" onClick={onOpenPreferences}>
            <Settings size={14} />
            Customize
          </button>
          <button className="cookie-btn cookie-btn-secondary" onClick={onRejectNonEssential}>
            <X size={14} />
            Reject
          </button>
          <button className="cookie-btn cookie-btn-primary" onClick={onAcceptAll}>
            <Check size={14} />
            Accept All
          </button>
        </div>
        <button className="cookie-close" onClick={onDismiss} aria-label="Dismiss cookie banner">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
