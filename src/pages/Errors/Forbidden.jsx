import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ShieldAlert, ArrowLeft, LogIn, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Forbidden() {
  useDocumentTitle('Access Denied');
  const location = useLocation();
  const isAuthRequired = !localStorage.getItem('firebase_auth_user');

  return (
    <div className="error-page">
      <div className="error-container">
        <ShieldAlert className="error-icon warning" size={64} strokeWidth={1.5} />
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>
          You do not have permission to view this resource. 
          {isAuthRequired 
            ? ' This area may require you to be signed in.' 
            : ' Your account may not have the required privileges.'}
        </p>

        <div className="error-actions">
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={18} />
            Go Back
          </button>

          {isAuthRequired ? (
            <Link to="/login" state={{ from: location }} className="btn btn-primary">
              <LogIn size={18} />
              Sign In
            </Link>
          ) : (
            <Link to="/support" className="btn btn-primary">
              <Mail size={18} />
              Contact Support
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
