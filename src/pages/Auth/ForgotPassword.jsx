import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export function ForgotPassword() {
  useDocumentTitle('Forgot Password');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      setCooldown(60);

      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(
        err.code === 'auth/user-not-found'
          ? 'No account found with this email address'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : 'Failed to send reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '16px' }} />
          <h1>Check Your Email</h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
            We have sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
          <button 
            onClick={handleSubmit} 
            disabled={cooldown > 0 || isLoading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
          </button>
          <Link to="/login" className="auth-back-link">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Mail size={40} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
        <h1>Reset Password</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
          Enter your email address and we will send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
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
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <Link to="/login" className="auth-back-link">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
