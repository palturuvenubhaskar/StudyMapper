import { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Monitor, Type } from 'lucide-react';
import { db } from '../../../data/db';
import { useTheme } from '../../../context/ThemeProvider';

const themes = [
  { id: 'light', name: 'Light', description: 'Clean and bright', icon: Sun },
  { id: 'dark', name: 'Dark', description: 'Easy on the eyes', icon: Moon },
  { id: 'system', name: 'System', description: 'Follows system preferences', icon: Monitor },
];

const fontSizes = [
  { id: 'small', name: 'Small', scale: '14px' },
  { id: 'medium', name: 'Medium', scale: '16px' },
  { id: 'large', name: 'Large', scale: '18px' },
];

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [density, setDensity] = useState('comfortable');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const stored = await db.user_settings.toCollection().last();
    if (stored) {
      setFontSize(stored.font_size || 'medium');
      setDensity(stored.density || 'comfortable');
    }
  };

  const applyTheme = async (themeId) => {
    setTheme(themeId);
    await db.user_settings.update(1, { theme: themeId, updated_at: new Date().toISOString() });
  };

  const applyFontSize = async (size) => {
    setFontSize(size);
    document.documentElement.style.fontSize = fontSizes.find(f => f.id === size)?.scale || '16px';
    await db.user_settings.update(1, { font_size: size, updated_at: new Date().toISOString() });
  };

  return (
    <div className="settings-tab">
      <h2><Palette size={20} /> Appearance</h2>

      <div className="settings-section">
        <h3>Theme</h3>
        <div className="theme-grid">
          {themes.map(({ id, name, description, icon: Icon }) => (
            <button
              key={id}
              onClick={() => applyTheme(id)}
              className={`theme-card ${theme === id ? 'active' : ''}`}
            >
              <Icon size={24} />
              <div>
                <span className="theme-name">{name}</span>
                <span className="theme-desc">{description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Font Size</h3>
        <div className="font-size-options">
          {fontSizes.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => applyFontSize(id)}
              className={`font-size-btn ${fontSize === id ? 'active' : ''}`}
            >
              <Type size={id === 'small' ? 14 : id === 'medium' ? 18 : 22} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>UI Density</h3>
        <div className="density-options">
          {['compact', 'comfortable'].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDensity(d);
                document.documentElement.setAttribute('data-density', d);
              }}
              className={`density-btn ${density === d ? 'active' : ''}`}
            >
              {d === 'compact' ? 'Compact' : 'Comfortable'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
