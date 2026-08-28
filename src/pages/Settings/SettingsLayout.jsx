import { NavLink, Outlet } from 'react-router-dom';
import { User, Shield, Bell, Database, Palette } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' },
  { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Database, path: '/settings/data-privacy' },
  { id: 'appearance', label: 'Appearance', icon: Palette, path: '/settings/appearance' },
];

export function SettingsLayout() {
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
      <main className="settings-content">
        <Outlet />
      </main>
    </div>
  );
}
