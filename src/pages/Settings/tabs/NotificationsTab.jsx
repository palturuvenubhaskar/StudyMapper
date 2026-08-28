import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Trophy } from 'lucide-react';
import { db } from '../../../data/db';

export function NotificationsTab() {
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: false,
    study_reminders: true,
    social_notifications: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const stored = await db.user_settings.toCollection().last();
    if (stored) {
      setSettings({
        email_notifications: stored.email_notifications ?? true,
        push_notifications: stored.push_notifications ?? false,
        study_reminders: stored.study_reminders ?? true,
        social_notifications: stored.social_notifications ?? true,
      });
    }
  };

  const handleToggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await db.user_settings.update(1, { ...updated, updated_at: new Date().toISOString() });
  };

  const items = [
    { key: 'email_notifications', label: 'Email Notifications', description: 'Receive updates about your account and study progress', icon: Mail },
    { key: 'push_notifications', label: 'Push Notifications', description: 'Browser notifications for daily quests and reminders', icon: Smartphone },
    { key: 'study_reminders', label: 'Study Reminders', description: 'Reminders to maintain your study streak', icon: Bell },
    { key: 'social_notifications', label: 'Social Notifications', description: 'Friend activity and leaderboard updates', icon: Trophy },
  ];

  return (
    <div className="settings-tab">
      <h2><Bell size={20} /> Notifications</h2>
      <div className="settings-section">
        {items.map(({ key, label, description, icon: Icon }) => (
          <div key={key} className="settings-toggle-row">
            <div className="settings-toggle-info">
              <Icon size={18} />
              <div>
                <span className="toggle-label">{label}</span>
                <span className="toggle-description">{description}</span>
              </div>
            </div>
            <label className="settings-toggle">
              <input type="checkbox" checked={settings[key]} onChange={() => handleToggle(key)} />
              <span className="settings-toggle-slider" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
