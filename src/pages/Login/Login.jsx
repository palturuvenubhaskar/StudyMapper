import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import './Login.css';

export default function Login() {
  // Common states
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'mobile'
  const [isLoading, setIsLoading] = useState(false);
  
  // Email states
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mobile states
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    sendPhoneOtp, 
    verifyPhoneOtp 
  } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
        toast('Account created successfully!', 'success');
      } else {
        await loginWithEmail(email, password);
        toast('Logged in successfully!', 'success');
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      toast(error.message || 'Authentication failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile) {
      toast('Please enter a mobile number', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      // Clean mobile number and prepend country code
      const cleanMobile = mobile.replace(/\D/g, '');
      const formattedNumber = `${countryCode}${cleanMobile}`; 
      const result = await sendPhoneOtp(formattedNumber, 'recaptcha-container');
      setConfirmationResult(result);
      setShowOtp(true);
      toast('OTP sent successfully!', 'success');
    } catch (error) {
      console.error(error);
      toast(error.message || 'Failed to send OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast('Please enter the OTP', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await verifyPhoneOtp(confirmationResult, otp);
      toast('Logged in successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast(error.message || 'Invalid OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast('Logged in with Google!', 'success');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast(error.message || 'Failed to log in with Google.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <div className="illustration-bg-shape"></div>
        <div className="illustration-content">
          <h1>StudyMapper</h1>
          <p>Your intelligent companion for organized learning, skill mapping, and career placement preparation.</p>
        </div>
      </div>
      
      <div className="login-form-section">
        <div className="login-card">
          <div className="login-header">
            <h2>{isRegistering && activeTab === 'email' ? 'Create Account' : 'Welcome Back'}</h2>
            <p>{isRegistering && activeTab === 'email' ? 'Sign up to start your learning journey.' : 'Sign in to continue your learning journey.'}</p>
          </div>

          <div className="social-login">
            <button 
              className="social-btn google-btn" 
              onClick={handleGoogleLogin} 
              type="button"
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="login-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button 
              className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: activeTab === 'email' ? 'var(--bg-card)' : 'transparent', color: activeTab === 'email' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: activeTab === 'email' ? '600' : '400' }}
            >
              Email
            </button>
            <button 
              className={`tab-btn ${activeTab === 'mobile' ? 'active' : ''}`}
              onClick={() => setActiveTab('mobile')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: activeTab === 'mobile' ? 'var(--bg-card)' : 'transparent', color: activeTab === 'mobile' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: activeTab === 'mobile' ? '600' : '400' }}
            >
              Mobile Number
            </button>
          </div>

          {activeTab === 'email' && (
            <form className="login-form" onSubmit={handleEmailAuth}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ paddingRight: '42px' }}
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Sign In')} <ArrowRight size={18} />
              </button>
              
              <button 
                type="button" 
                className="toggle-mode-btn" 
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ marginTop: '16px', display: 'block', width: '100%', textAlign: 'center', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                disabled={isLoading}
              >
                {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Create one'}
              </button>
            </form>
          )}

          {activeTab === 'mobile' && !showOtp && (
            <form className="login-form" onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="input-with-icon phone-input-group">
                  <Phone size={18} />
                  <select 
                    value={countryCode} 
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="country-code-select"
                  >
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+91">+91 (IN)</option>
                    {/* Add more common codes as needed */}
                  </select>
                  <input 
                    type="tel" 
                    placeholder="0000000000" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div id="recaptcha-container" style={{ margin: '16px 0' }}></div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'} <ArrowRight size={18} />
              </button>
            </form>
          )}

          {activeTab === 'mobile' && showOtp && (
            <form className="login-form" onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>Enter 6-digit OTP</label>
                <div className="input-with-icon">
                  <ShieldCheck size={18} />
                  <input 
                    type="text" 
                    placeholder="123456" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Login'} <ArrowRight size={18} />
              </button>
              
              <button 
                type="button" 
                className="toggle-mode-btn" 
                onClick={() => setShowOtp(false)}
                style={{ marginTop: '16px', display: 'block', width: '100%', textAlign: 'center', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                disabled={isLoading}
              >
                Change Phone Number
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
