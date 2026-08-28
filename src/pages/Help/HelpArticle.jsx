import { useParams, Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import helpArticles from './helpArticles.json';
import { ArrowLeft } from 'lucide-react';
import { NotFound } from '../Errors/NotFound';

export function HelpArticle() {
  const { articleId } = useParams();
  const article = helpArticles.find(a => a.id === articleId);

  useDocumentTitle(article ? article.title : 'Help Article');

  if (!article) {
    return <NotFound />;
  }

  return (
    <div className="help-page">
      <div className="help-header">
        <Link to="/help" className="btn btn-ghost" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Help Center
        </Link>
        <h1>{article.title}</h1>
      </div>
      <div className="help-article-content" style={{ padding: '24px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>{article.excerpt}</p>
        <div style={{ lineHeight: 1.6, color: 'var(--text-primary)' }}>
          {article.content}
        </div>
      </div>
    </div>
  );
}
