import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, ShieldCheck, Bell, Database, Palette, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const groups = [
  {
    label: 'Account',
    items: [
      { id: 'profile', label: 'Profile', description: 'Name, photo and email', icon: User, path: '/settings/profile' },
      { id: 'security', label: 'Security', description: 'Password and sign-in', icon: ShieldCheck, path: '/settings/security' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', description: 'What reaches you', icon: Bell, path: '/settings/notifications' },
      { id: 'appearance', label: 'Appearance', description: 'Theme, type and spacing', icon: Palette, path: '/settings/appearance' },
    ],
  },
  {
    label: 'Your data',
    items: [
      { id: 'data-privacy', label: 'Data & privacy', description: 'Export or remove data', icon: Database, path: '/settings/data-privacy' },
    ],
  },
];

const tabs = groups.flatMap((group) => group.items);

function initialsOf(name) {
  return (name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function SettingsLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const currentTab = tabs.find((t) => location.pathname.includes(t.path)) || tabs[0];
  const CurrentIcon = currentTab.icon;

  return (
    <div className="settings-page">
      <aside className="settings-rail">
        <div className="settings-rail-head">
          <h1>Settings</h1>
          <p>Account, notifications and preferences.</p>
        </div>

        <nav className="settings-nav" aria-label="Settings sections">
          {groups.map((group) => (
            <div className="settings-nav-group" key={group.label}>
              <span className="settings-nav-group-label">{group.label}</span>
              {group.items.map(({ id, label, icon: Icon, path }) => (
                <NavLink
                  key={id}
                  to={path}
                  className={({ isActive }) => `settings-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="settings-nav-icon">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  <span className="settings-nav-label">{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <NavLink to="/settings/profile" className="settings-account">
          <span className="settings-account-avatar">
            {user?.avatar && !avatarFailed ? (
              <img src={user.avatar} alt="" onError={() => setAvatarFailed(true)} />
            ) : (
              <span className="settings-account-initials">{initialsOf(user?.name)}</span>
            )}
          </span>
          <span className="settings-account-copy">
            <span className="settings-account-name">{user?.name || 'Your account'}</span>
            <span className="settings-account-email">{user?.email || 'Signed in'}</span>
          </span>
        </NavLink>
      </aside>

      <div className="settings-mobile-nav" ref={dropdownRef}>
        <button
          type="button"
          className="settings-mobile-trigger"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="settings-mobile-current">
            <CurrentIcon size={18} />
            <span>{currentTab.label}</span>
          </span>
          <ChevronDown size={18} className={`settings-mobile-arrow ${isMobileMenuOpen ? 'open' : ''}`} />
        </button>

        {isMobileMenuOpen && (
          <div className="settings-mobile-menu">
            {groups.map((group) => (
              <div className="settings-mobile-group" key={group.label}>
                <span className="settings-nav-group-label">{group.label}</span>
                {group.items.map(({ id, label, icon: Icon, path }) => (
                  <NavLink
                    key={id}
                    to={path}
                    className={({ isActive }) => `settings-mobile-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
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
