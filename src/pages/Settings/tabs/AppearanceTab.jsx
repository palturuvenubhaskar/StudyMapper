import { useEffect, useState } from 'react';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import { db } from '../../../data/db';
import { useTheme } from '../../../context/ThemeProvider';

const themes = [
  { id: 'light', name: 'Light', description: 'Bright paper, soft colour', icon: Sun },
  { id: 'dark', name: 'Dark', description: 'Low light, low glare', icon: Moon },
  { id: 'system', name: 'System', description: 'Follows this device', icon: Monitor },
];

const fontSizes = [
  { id: 'small', name: 'Small', short: 'A', scale: '14px' },
  { id: 'medium', name: 'Medium', short: 'A', scale: '16px' },
  { id: 'large', name: 'Large', short: 'A', scale: '18px' },
];

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [status, setStatus] = useState('saved');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const stored = await db.user_settings.toCollection().last();
    if (stored) {
      const size = stored.font_size || 'medium';
      setFontSize(size);
      document.documentElement.style.fontSize = fontSizes.find((f) => f.id === size)?.scale || '16px';
    }
  };

  const persist = async (changes) => {
    setStatus('saving');
    try {
      const stored = await db.user_settings.toCollection().last();
      const timestamp = new Date().toISOString();
      if (stored) {
        await db.user_settings.put({ ...stored, ...changes, updated_at: timestamp });
      } else {
        await db.user_settings.put({ id: 1, ...changes, created_at: timestamp, updated_at: timestamp });
      }
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  const applyTheme = async (themeId) => {
    setTheme(themeId);
    await persist({ theme: themeId });
  };

  const applyFontSize = async (size) => {
    setFontSize(size);
    document.documentElement.style.fontSize = fontSizes.find((f) => f.id === size)?.scale || '16px';
    await persist({ font_size: size });
  };

  return (
    <div className="settings-tab">
      <header className="set-head">
        <div className="set-head-copy">
          <h2>Appearance</h2>
          <p>Set the reading environment you can stay in for a long session.</p>
        </div>
        <span className={`set-status ${status === 'error' ? 'error' : ''}`}>
          {status === 'error' ? 'Could not save' : <><Check size={13} /> Saved</>}
        </span>
      </header>

      <section className="set-panel">
        <div className="set-panel-head">
          <h3>
            <Palette size={16} />
            Theme
          </h3>
          <p>Applies across every page, including notes and flashcards.</p>
        </div>

        <div className="set-panel-body">
          <div className="set-theme-grid" role="group" aria-label="Theme">
            {themes.map(({ id, name, description, icon: Icon }) => (
              <button
                type="button"
                key={id}
                aria-pressed={theme === id}
                onClick={() => applyTheme(id)}
                className={`set-theme-card ${theme === id ? 'active' : ''}`}
              >
                <span className={`set-theme-preview preview-${id}`} aria-hidden="true">
                  <span className="preview-rail" />
                  <span className="preview-body">
                    <span className="preview-line wide" />
                    <span className="preview-line" />
                    <span className="preview-line short" />
                  </span>
                </span>
                <span className="set-theme-meta">
                  <span className="set-theme-name">
                    <Icon size={15} />
                    {name}
                  </span>
                  <span className="set-theme-desc">{description}</span>
                </span>
                {theme === id && (
                  <span className="set-theme-check" aria-hidden="true">
                    <Check size={13} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="set-panel">
        <div className="set-panel-head">
          <h3>Text size</h3>
          <p>Scales text across the app. Interface spacing stays the same.</p>
        </div>

        <div className="set-panel-body">
          <div className="set-segmented" role="group" aria-label="Text size">
            {fontSizes.map(({ id, name, short }) => (
              <button
                type="button"
                key={id}
                aria-pressed={fontSize === id}
                onClick={() => applyFontSize(id)}
                className={`set-segment ${fontSize === id ? 'active' : ''}`}
              >
                <span className={`set-segment-glyph glyph-${id}`} aria-hidden="true">
                  {short}
                </span>
                {name}
              </button>
            ))}
          </div>

          <div className="set-reading-sample">
            <span className="set-sample-label">Preview</span>
            <p>
              Active recall beats rereading. Close your notes and write down what you remember, then check what
              you missed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
