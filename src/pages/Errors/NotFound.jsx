import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { BookX, Home, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
  useDocumentTitle('Page Not Found');

  return (
    <div className="error-page">
      <div className="error-container">
        <BookX className="error-icon" size={64} strokeWidth={1.5} />
        <h1>404</h1>
        <h2>This page seems to have gone offline for revision</h2>
        <p>
          The page you are looking for does not exist or may have been moved. 
          Do not worry — your study data is completely safe.
        </p>

        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/subjects" className="btn btn-secondary">
            <Search size={18} />
            Browse Subjects
          </Link>
          <Link to="/help" className="btn btn-ghost">
            <HelpCircle size={18} />
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
