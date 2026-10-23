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
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    const r = await searchAll(query.trim());
    setResults(r);
    setSearched(true);
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          autoFocus
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          <SearchIcon size={16} /> Search
        </button>
      </div>

      {searched && results.length === 0 && (
        <div className="empty-state">
          <SearchIcon size={48} />
          <h3>No results found</h3>
          <p>Try different keywords</p>
        </div>
      )}

      {results.length > 0 && (
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
