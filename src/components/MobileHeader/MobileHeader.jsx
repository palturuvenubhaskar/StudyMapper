import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search } from 'lucide-react';
import './MobileHeader.css';

export default function MobileHeader({ onSearchClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="mobile-header">
      <div className="mobile-brand" onClick={() => navigate('/')}>
        <span className="mobile-brand-name">StudyMapper</span>
      </div>
      <div className="mobile-header-actions">
        <button className="mobile-icon-btn" onClick={onSearchClick}>
          <Search size={20} />
        </button>
        <div className="mobile-avatar" onClick={() => navigate('/settings')}>
          <img 
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
            alt="Profile" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' fill='%23e0e7ff'/><path fill='%236366f1' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
            }}
          />
        </div>
      </div>
    </header>
  );
}
