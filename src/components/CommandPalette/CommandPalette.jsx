import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Layers } from 'lucide-react';
import { db } from '../../data/db';
import './CommandPalette.css';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ subjects: [], topics: [] });
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ subjects: [], topics: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults({ subjects: [], topics: [] });
        return;
      }
      const q = query.toLowerCase();
      const subjects = await db.subjects.filter(s => s.title.toLowerCase().includes(q)).toArray();
      const topics = await db.topics.filter(t => t.title.toLowerCase().includes(q)).toArray();
      setResults({ subjects, topics });
    };
    search();
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Since we don't have direct access to the setter here in the same way, we rely on the parent closing it
        // Or if it's already open, we close it.
        onClose(false);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (path) => {
    navigate(path);
    onClose(false);
  };

  return (
    <div className="command-palette-overlay" onClick={() => onClose(false)}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-input-row">
          <Search size={20} className="command-icon" />
          <input
            ref={inputRef}
            className="command-input"
            placeholder="Search subjects, topics, or jump to..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="btn btn-ghost btn-icon command-close" onClick={() => onClose(false)}>
            <X size={18} />
          </button>
        </div>

        {(query.trim().length >= 2 || results.subjects.length > 0 || results.topics.length > 0) && (
          <div className="command-results">
            {results.subjects.length > 0 && (
              <div className="command-section">
                <div className="command-section-title">Subjects</div>
                {results.subjects.map(s => (
                  <div key={s.id} className="command-item" onClick={() => navigateTo(`/subject/${s.id}`)}>
                    <BookOpen size={16} />
                    <span>{s.title}</span>
                  </div>
                ))}
              </div>
            )}
            
            {results.topics.length > 0 && (
              <div className="command-section">
                <div className="command-section-title">Topics</div>
                {results.topics.map(t => (
                  <div key={t.id} className="command-item" onClick={() => navigateTo(`/topic/${t.id}`)}>
                    <Layers size={16} />
                    <span>{t.title}</span>
                  </div>
                ))}
              </div>
            )}

            {results.subjects.length === 0 && results.topics.length === 0 && (
              <div className="command-empty">No results found for "{query}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
