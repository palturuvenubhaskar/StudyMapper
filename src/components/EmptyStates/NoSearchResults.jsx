import { SearchX, ArrowLeft } from 'lucide-react';

export function NoSearchResults({ query, context = 'general', onClearSearch }) {
  const suggestions = {
    general: ['Try different keywords', 'Check your spelling', 'Use broader terms'],
    help: ['Try "planner", "flashcards", or "export"', 'Browse categories instead'],
    subjects: ['Create a new subject', 'Browse all subjects'],
    questions: ['Add your first question', 'Upload a question paper'],
  };

  return (
    <div className="empty-state no-search-results">
      <SearchX className="empty-state-icon" size={48} strokeWidth={1.5} />
      <h3>No results found</h3>
      <p>
        We could not find anything matching <strong>"{query}"</strong>
      </p>

      <div className="search-suggestions">
        <span>Try:</span>
        <ul>
          {(suggestions[context] || suggestions.general).map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      {onClearSearch && (
        <button onClick={onClearSearch} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Clear Search
        </button>
      )}
    </div>
  );
}
