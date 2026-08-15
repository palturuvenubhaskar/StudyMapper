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
        <img src="/STUDYMAPPER%20LOGO.png" alt="StudyMapper" className="mobile-brand-logo" />
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
          />
        </div>
      </div>
    </header>
  );
}
