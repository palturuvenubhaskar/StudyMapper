import { useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Search, BookOpen, Cpu, GraduationCap, Wrench, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import helpArticles from './helpArticles.json';

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
  { id: 'ai-features', name: 'AI Features', icon: Cpu },
  { id: 'study-tools', name: 'Study Tools', icon: GraduationCap },
  { id: 'coding', name: 'Coding Practice', icon: Wrench },
  { id: 'account', name: 'Account & Data', icon: User },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: AlertCircle },
];

export function HelpCenter() {
  useDocumentTitle('Help Center');
  const [search, setSearch] = useState('');

  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Help Center</h1>
        <div className="help-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {search ? (
        <div className="help-results">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link key={article.id} to={`/help/${article.id}`} className="help-result-card">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </Link>
            ))
          ) : (
            <div className="help-no-results">
              <p>No articles found for &quot;{search}&quot;</p>
              <button onClick={() => setSearch('')} className="btn btn-secondary">Clear Search</button>
            </div>
          )}
        </div>
      ) : (
        <div className="help-categories">
          {categories.map(({ id, name, icon: Icon }) => {
            const count = helpArticles.filter((a) => a.category === id).length;
            return (
              <Link key={id} to={`/help?category=${id}`} className="help-category-card">
                <Icon size={28} />
                <h3>{name}</h3>
                <span>{count} articles</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
