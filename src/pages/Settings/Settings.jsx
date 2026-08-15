import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeProvider';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { 
  User, Moon, Sun, Monitor, Bell, Shield, 
  LogOut, Check, Trash2, Smartphone, Mail, Cloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');

  // Mock states for the new settings
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [syncWifiOnly, setSyncWifiOnly] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, mobile });
    addToast('Profile updated successfully', 'success');
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
  };

  const handleDeleteAccount = () => {
    // Mock delete account
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      addToast('Account deleted successfully', 'success');
    }
  };

  const handleClearCache = () => {
    addToast('Local cache cleared successfully', 'success');
  };

  if (!user) {
    return (
      <div className="settings-container not-logged-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="empty-state glass-panel" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px' }}>
          <User size={48} style={{ marginBottom: '16px', color: 'var(--text-muted)', margin: '0 auto' }} />
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Sign in to access settings</h2>
          <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>You need to be logged in to view and manage your profile and preferences.</p>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ width: '100%' }}>
            Log In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container" style={{ padding: '64px 48px', maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '100px' }}>
      <div className="settings-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account settings and preferences.</p>
      </div>

      <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        
        <div className="settings-column" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Public Profile Card */}
          <section className="surface-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Public Profile</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>This is how others will see you on the platform.</p>
            
            <div className="profile-avatar-section" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Profile Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-brand)' }} />
              <div className="avatar-actions" style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>Change</button>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>Remove</button>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Mobile Number</label>
                <input type="tel" className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                <Check size={16} /> Save Changes
              </button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="surface-card" style={{ padding: '32px', border: '1px solid var(--danger-soft)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px', color: '#F43F5E' }}>Danger Zone</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Irreversible actions for your account.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <button className="btn btn-danger" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogOut size={16} /> Sign Out
              </button>
              <button className="btn btn-secondary" onClick={handleDeleteAccount} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#F43F5E', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </section>
        </div>

        <div className="settings-column" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Appearance */}
          <section className="surface-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Appearance</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Customize the look and feel of StudyMapper.</p>
            
            <div className="theme-segmented-control">
              <button 
                type="button"
                className={`theme-segment ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <Sun size={16} /> Light
              </button>
              <button 
                type="button"
                className={`theme-segment ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={16} /> Dark
              </button>
              <button 
                type="button"
                className={`theme-segment ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
              >
                <Monitor size={16} /> System
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="surface-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Notifications</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Manage how we contact you.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}><Bell size={18} className="text-primary" style={{ color: 'var(--accent-brand)' }} /></div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500' }}>Push Notifications</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get notified in the browser</div>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}><Mail size={18} className="text-primary" style={{ color: 'var(--accent-brand)' }} /></div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500' }}>Email Alerts</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weekly summaries and alerts</div>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}><Smartphone size={18} className="text-primary" style={{ color: 'var(--accent-brand)' }} /></div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500' }}>SMS Alerts</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Important security notices only</div>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Data & Privacy */}
          <section className="surface-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Data & Privacy</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Manage your local data footprint.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}><Cloud size={18} className="text-primary" style={{ color: 'var(--accent-brand)' }} /></div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500' }}>Sync over Wi-Fi only</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Save mobile data</div>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={syncWifiOnly} onChange={(e) => setSyncWifiOnly(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '16px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Local cache speeds up loading but uses storage space (Current: ~12MB)
                </div>
                <button className="btn btn-secondary" onClick={handleClearCache} style={{ width: '100%' }}>
                  Clear Local Cache
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
