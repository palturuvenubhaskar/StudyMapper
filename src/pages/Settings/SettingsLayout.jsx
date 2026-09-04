import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, Shield, Bell, Database, Palette, ChevronDown } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' },
  { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Database, path: '/settings/data-privacy' },
  { id: 'appearance', label: 'Appearance', icon: Palette, path: '/settings/appearance' },
];

export function SettingsLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTab = tabs.find(t => location.pathname.includes(t.path)) || tabs[0];
  const CurrentIcon = currentTab.icon;

  return (
    <div className="settings-page">
      <aside className="settings-sidebar">
        <h2>Settings</h2>
        <nav className="settings-nav">
          {tabs.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) => `settings-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="settings-mobile-nav" ref={dropdownRef}>
        <button 
          className="settings-mobile-dropdown-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="dropdown-btn-content">
            <CurrentIcon size={18} />
            <span>{currentTab.label}</span>
          </div>
          <ChevronDown size={18} className={`dropdown-arrow ${isMobileMenuOpen ? 'open' : ''}`} />
        </button>

        {isMobileMenuOpen && (
          <div className="settings-mobile-dropdown-menu">
            {tabs.map(({ id, label, icon: Icon, path }) => (
              <NavLink
                key={id}
                to={path}
                className={({ isActive }) => `mobile-dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <main className="settings-content">
        <Outlet />
      </main>
    </div>
  );
}
