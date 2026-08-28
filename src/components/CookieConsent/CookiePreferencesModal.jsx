import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Lock, Settings, BarChart3, Megaphone, Check } from 'lucide-react';

export function CookiePreferencesModal({ isOpen, onClose, currentConsent, onSave }) {
  const [preferences, setPreferences] = useState(currentConsent || {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const categories = [
    {
      id: 'necessary',
      title: 'Necessary',
      description: 'Essential for the app to function. Cannot be disabled.',
      icon: Lock,
      required: true,
    },
    {
      id: 'functional',
      title: 'Functional',
      description: 'Remember your preferences, themes, and study settings.',
      icon: Settings,
      required: false,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Help us understand how you use StudyMapper to improve features.',
      icon: BarChart3,
      required: false,
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Occasional updates about new features and study tips.',
      icon: Megaphone,
      required: false,
    },
  ];

  const handleToggle = (id) => {
    if (id === 'necessary') return;
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cookie Preferences" size="md">
      <div className="cookie-preferences">
        <p className="cookie-pref-intro">
          Manage your cookie preferences below. Necessary cookies are always active 
          as they are required for the app to work.
        </p>

        <div className="cookie-categories">
          {categories.map(({ id, title, description, icon: Icon, required }) => (
            <div key={id} className="cookie-category">
              <div className="cookie-category-info">
                <Icon size={20} className="cookie-category-icon" />
                <div>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences[id]}
                  onChange={() => handleToggle(id)}
                  disabled={required}
                />
                <span className={`cookie-toggle-slider ${required ? 'disabled' : ''}`} />
              </label>
            </div>
          ))}
        </div>

        <div className="cookie-pref-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            Save Preferences
          </button>
        </div>
      </div>
    </Modal>
  );
}
