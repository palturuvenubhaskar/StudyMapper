import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll } from '../../data/repository';
import { Search as SearchIcon, BookOpen, Layers, FileText, StickyNote, HelpCircle, AlignLeft } from 'lucide-react';
import './SearchPage.css';

const typeIcons = {
  subject: <BookOpen size={16} />,
  unit: <Layers size={16} />,
  topic: <FileText size={16} />,
  'topic-content': <AlignLeft size={16} />,
  note: <StickyNote size={16} />,
  question: <HelpCircle size={16} />,
};

const typeColors = {
  subject: 'badge-accent',
  unit: 'badge-warning',
  topic: 'badge-success',
  'topic-content': 'badge-accent',
  note: 'badge-danger',
  question: 'badge-warning',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleQueryChange = (value) => {
    setQuery(value);
    // Results for the previous query would be misleading once the text changes.
    setSearched(false);
    setResults([]);
    setError(null);
  };

  const handleSearch = async () => {
    const term = query.trim();
    if (!term || loading) return;

    setLoading(true);
    setError(null);
    try {
      const r = await searchAll(term);
      setResults(r);
      setSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
      setSearched(false);
      setError('Search could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'subject') navigate(`/subject/${result.id}`);
    else if (result.type === 'unit') navigate(`/subject/${result.parentId}`);
    else if (result.type === 'topic') navigate(`/topic/${result.id}`);
    else if (result.type === 'topic-content' || result.type === 'note') navigate(`/topic/${result.parentId}`);
    else if (result.type === 'question') navigate(`/qb/${result.parentId}`);
  };

  return (
    <div className="search-page">

      <h1><SearchIcon size={24} /> Search</h1>
      <p className="search-subtitle">Search across subjects, units, topics, and notes</p>

      <div className="search-bar">
        <input
          className="input search-input"
          placeholder="Type to search..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          autoFocus
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
          <SearchIcon size={16} /> {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="empty-state" role="alert">
          <SearchIcon size={48} />
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <div className="empty-state">
          <SearchIcon size={48} />
          <h3>No results found</h3>
          <p>Try different keywords</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="search-results">
          {results.map(r => (
            <button
              key={`${r.type}-${r.id}`}
              type="button"
              className="glass-card search-result-item"
              onClick={() => handleResultClick(r)}
            >
              <span className={`badge ${typeColors[r.type]}`}>{typeIcons[r.type]} {r.type}</span>
              <h4>{r.title}</h4>
              <p>{r.snippet}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
