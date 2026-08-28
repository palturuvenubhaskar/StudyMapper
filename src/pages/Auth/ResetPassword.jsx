import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

export function ResetPassword() {
  useDocumentTitle('Reset Password');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or expired reset link. Please request a new one.');
      setIsVerifying(false);
      return;
    }

    const verifyCode = async () => {
      try {
        const auth = getAuth();
        await verifyPasswordResetCode(auth, oobCode);
        setIsVerifying(false);
      } catch (err) {
        setError('This reset link has expired or is invalid. Please request a new one.');
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(calculateStrength(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (strength < 2) {
      setError('Password is too weak. Include uppercase, numbers, and special characters.');
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(
        err.code === 'auth/weak-password'
          ? 'Password is too weak. Please choose a stronger password.'
          : err.code === 'auth/expired-action-code'
          ? 'This reset link has expired. Please request a new one.'
          : 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <Loader2 size={32} className="spin" style={{ color: 'var(--accent)' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '16px' }} />
          <h1>Password Reset Successful</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Lock size={40} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
        <h1>Create New Password</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
          Enter a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="strength-bar"
                      style={{
                        background: level <= strength ? strengthColors[strength - 1] : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: strengthColors[strength - 1] || 'var(--text-muted)' }}>
                  {strengthLabels[strength - 1] || 'Enter password'}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
