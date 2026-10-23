import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, TrendingUp, Code2, Calendar, Bookmark, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Skill Roadmap', path: '/roadmap', icon: MapPin },
    { name: 'Placement Prep', path: '/placement', icon: TrendingUp },
    { name: 'Coding Practice', path: '/coding', icon: Code2 },
    { name: 'Study Planner', path: '/planner', icon: Calendar },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <button type="button" className="brand-wordmark" onClick={() => navigate('/')}>
          <span className="brand-name">StudyMapper</span>
        </button>
      </div>

      <div className="sidebar-nav-scrollable">
        <nav className="sidebar-nav">
          {(() => {
            const isActive = (itemPath, currentPath) => {
              if (itemPath === '/') {
                return currentPath === '/' || currentPath.startsWith('/subject') || currentPath.startsWith('/qb') || currentPath.startsWith('/topic') || currentPath === '/create';
              }
              return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
            };

            const activeIndex = navItems.findIndex(item => isActive(item.path, location.pathname));
            const showIndicator = activeIndex !== -1;
            // 42px height + 8px gap = 50px offset per item
            const offset = activeIndex * 50; 

            return (
              <>
                {showIndicator && (
                  <div 
                    className="active-indicator" 
                    style={{ transform: `translateY(${offset}px)` }} 
                  />
                )}
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    className={`nav-item ${!item.isAction && isActive(item.path, location.pathname) ? 'active' : ''}`}
                    aria-current={isActive(item.path, location.pathname) ? 'page' : undefined}
                    onClick={() => {
                      if (item.isAction) {
                        window.dispatchEvent(new CustomEvent('toggle-ai-coach'));
                      } else {
                        navigate(item.path);
                      }
                    }}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </>
            );
          })()}
        </nav>

      </div>

      <div className="sidebar-footer-profile">
        <button type="button" className="profile-card" onClick={() => navigate('/settings')} aria-label="Open account settings">
          <div className="profile-avatar">
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' fill='%23e0e7ff'/><path fill='%236366f1' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
              }}
            />
          </div>
          <div className="profile-info">
            <span className="profile-name">{user?.name || 'User'}</span>
          </div>
        </button>
      </div>

    </aside>
  );
}
