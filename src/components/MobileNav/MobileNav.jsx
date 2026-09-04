import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Code2, TrendingUp, Settings } from 'lucide-react';
import './MobileNav.css';

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/roadmap', icon: MapPin },
    { name: 'Placement', path: '/placement', icon: TrendingUp },
    { name: 'Practice', path: '/coding', icon: Code2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (itemPath, currentPath) => {
    if (itemPath === '/') {
      return currentPath === '/' || currentPath.startsWith('/subject') || currentPath.startsWith('/qb') || currentPath.startsWith('/topic');
    }
    return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
  };

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const active = isActive(item.path, location.pathname);
        return (
          <button
            key={item.path}
            className={`mobile-nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={20} className="mobile-nav-icon" />
            <span className="mobile-nav-label">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
