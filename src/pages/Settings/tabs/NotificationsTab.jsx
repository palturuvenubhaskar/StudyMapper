import { useEffect, useState } from 'react';
import { Bell, Mail, Smartphone, Trophy, Check } from 'lucide-react';
import { db } from '../../../data/db';

const items = [
  {
    key: 'email_notifications',
    label: 'Email notifications',
    description: 'Account updates and a weekly summary of your study progress.',
    icon: Mail,
  },
  {
    key: 'push_notifications',
    label: 'Browser alerts',
    description: 'Daily quests and reminders while StudyMapper is open.',
    icon: Smartphone,
  },
  {
    key: 'study_reminders',
    label: 'Study reminders',
    description: 'A nudge on days you have planned but not started.',
    icon: Bell,
  },
  {
    key: 'social_notifications',
    label: 'Leaderboard updates',
    description: 'Friend activity, streak milestones and rank changes.',
    icon: Trophy,
  },
];

export function NotificationsTab() {
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: false,
    study_reminders: true,
    social_notifications: true,
  });
  const [status, setStatus] = useState('saved');

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
    setStatus('saving');
    try {
      const stored = await db.user_settings.toCollection().last();
      const timestamp = new Date().toISOString();
      if (stored) {
        await db.user_settings.put({ ...stored, ...updated, updated_at: timestamp });
      } else {
        await db.user_settings.put({ id: 1, ...updated, created_at: timestamp, updated_at: timestamp });
      }
      setStatus('saved');
    } catch {
      setSettings(settings);
      setStatus('error');
    }
  };

  const activeCount = items.filter((item) => settings[item.key]).length;

  return (
    <div className="settings-tab">
      <header className="set-head">
        <div className="set-head-copy">
          <h2>Notifications</h2>
          <p>Choose what reaches you. Everything here saves as you change it.</p>
        </div>
        <span className={`set-status ${status === 'error' ? 'error' : ''}`}>
          {status === 'saving' ? 'Saving…' : status === 'error' ? 'Could not save' : <><Check size={13} /> {activeCount} of {items.length} on</>}
        </span>
      </header>

      <section className="set-panel">
        <div className="set-panel-head">
          <h3>What you receive</h3>
          <p>Turn off anything that pulls you out of a study session.</p>
        </div>

        <div className="set-rows">
          {items.map(({ key, label, description, icon: Icon }) => (
            <div className="set-row" key={key}>
              <span className="set-row-icon">
                <Icon size={17} />
              </span>
              <div className="set-row-copy">
                <label className="set-row-label" htmlFor={`notification-${key}`}>
                  {label}
                </label>
                <span className="set-row-description">{description}</span>
              </div>
              <label className="settings-toggle">
                <input
                  id={`notification-${key}`}
                  type="checkbox"
                  checked={settings[key]}
                  onChange={() => handleToggle(key)}
                />
                <span className="settings-toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      </section>

      <p className="set-footnote">
        System-level notification permissions are controlled by your browser or device settings.
      </p>
    </div>
  );
}
