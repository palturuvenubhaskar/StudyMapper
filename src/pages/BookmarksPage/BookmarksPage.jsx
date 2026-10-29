import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllBookmarks, addBookmark, deleteBookmark } from '../../data/repository';
import { getRoadmapSummary } from '../SkillRoadmap/data/roadmapCatalog';
import {
  ArrowUpRight,
  Bookmark,
  Compass,
  LayoutDashboard,
  Map as MapIcon,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import './BookmarksPage.css';

const SUGGESTED_ROADMAPS = ['full-stack', 'datastructures-and-algorithms', 'frontend']
  .map(getRoadmapSummary)
  .filter(Boolean);

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'roadmaps', label: 'Roadmaps' },
  { id: 'topics', label: 'Study topics' },
];

const formatRelative = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const minutesAgo = Math.round((date.getTime() - Date.now()) / 60000);

  if (Math.abs(minutesAgo) < 60) return rtf.format(minutesAgo, 'minute');

  const hoursAgo = Math.round(minutesAgo / 60);
  if (Math.abs(hoursAgo) < 24) return rtf.format(hoursAgo, 'hour');

  const daysAgo = Math.round(hoursAgo / 24);
  if (Math.abs(daysAgo) < 7) return rtf.format(daysAgo, 'day');

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatSaved = (iso) => {
  const relative = formatRelative(iso);
  return relative ? `Saved ${relative}` : null;
};

function BookmarkCard({ to, title, meta, icon: Icon, tone, onRemove }) {
  return (
    <article className="bm-card">
      <Link className="bm-card-link" to={to}>
        <span className={`bm-card-icon bm-card-icon--${tone}`} aria-hidden="true">
          <Icon size={18} />
        </span>
        <span className="bm-card-text">
          <span className="bm-card-title">{title}</span>
          {meta && <span className="bm-card-meta" title={meta}>{meta}</span>}
        </span>
        <ArrowUpRight size={16} className="bm-card-arrow" aria-hidden="true" />
      </Link>
      <button
        type="button"
        className="bm-card-remove"
        onClick={onRemove}
        title="Remove bookmark"
        aria-label={`Remove ${title} from bookmarks`}
      >
        <Trash2 size={16} />
      </button>
    </article>
  );
}

export default function BookmarksPage() {
  const [topicBookmarks, setTopicBookmarks] = useState([]);
  const [roadmapBookmarks, setRoadmapBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [removed, setRemoved] = useState(null);

  const loadBookmarks = useCallback(async () => {
    const bms = await getAllBookmarks();
    setTopicBookmarks(bms);

    let rmIds = [];
    try {
      const raw = localStorage.getItem('studymapper_roadmap_bookmarks');
      const parsed = raw ? JSON.parse(raw) : [];
      rmIds = Array.isArray(parsed) ? parsed : [];
    } catch {
      rmIds = [];
    }

    setRoadmapBookmarks(rmIds.map(getRoadmapSummary).filter(Boolean));
  }, []);

  useEffect(() => {
    loadBookmarks().finally(() => setLoading(false));
  }, [loadBookmarks]);

  useEffect(() => {
    if (!removed) return undefined;
    const timer = setTimeout(() => setRemoved(null), 7000);
    return () => clearTimeout(timer);
  }, [removed]);

  const handleDeleteTopic = async (bm) => {
    await deleteBookmark(bm.id);
    setTopicBookmarks(prev => prev.filter(item => item.id !== bm.id));
    setRemoved({ kind: 'topic', item: bm });
  };

  const handleDeleteRoadmap = async (rm) => {
    try {
      const raw = localStorage.getItem('studymapper_roadmap_bookmarks');
      const parsed = raw ? JSON.parse(raw) : [];
      const rmIds = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(
        'studymapper_roadmap_bookmarks',
        JSON.stringify(rmIds.filter(id => id !== rm.id)),
      );
    } catch {
      // Ignore storage errors and still update the visible list.
    }
    setRoadmapBookmarks(prev => prev.filter(item => item.id !== rm.id));
    setRemoved({ kind: 'roadmap', item: rm });
  };

  const handleUndo = async () => {
    if (!removed) return;
    if (removed.kind === 'topic') {
      await addBookmark(removed.item.topic_id, removed.item.section_id ?? null);
    } else {
      try {
        const raw = localStorage.getItem('studymapper_roadmap_bookmarks');
        const parsed = raw ? JSON.parse(raw) : [];
        const rmIds = Array.isArray(parsed) ? parsed : [];
        if (!rmIds.includes(removed.item.id)) {
          localStorage.setItem(
            'studymapper_roadmap_bookmarks',
            JSON.stringify([removed.item.id, ...rmIds]),
          );
        }
      } catch {
        // If storage is unavailable there is nothing to restore.
      }
    }
    setRemoved(null);
    await loadBookmarks();
  };

  const searchTerm = query.trim().toLowerCase();
  const filteredRoadmaps = useMemo(
    () => roadmapBookmarks.filter(rm => (
      !searchTerm
      || `${rm.title} ${rm.description ?? ''}`.toLowerCase().includes(searchTerm)
    )),
    [roadmapBookmarks, searchTerm],
  );
  const filteredTopics = useMemo(
    () => topicBookmarks.filter(bm => (
      !searchTerm || (bm.topic_title ?? '').toLowerCase().includes(searchTerm)
    )),
    [topicBookmarks, searchTerm],
  );

  const total = roadmapBookmarks.length + topicBookmarks.length;
  const hasBookmarks = total > 0;
  const showRoadmaps = filter !== 'topics';
  const showTopics = filter !== 'roadmaps';
  const visibleRoadmaps = showRoadmaps ? filteredRoadmaps : [];
  const visibleTopics = showTopics ? filteredTopics : [];
  const visibleCount = visibleRoadmaps.length + visibleTopics.length;
  const counts = {
    all: total,
    roadmaps: roadmapBookmarks.length,
    topics: topicBookmarks.length,
  };

  const lastSaved = topicBookmarks.reduce((latest, bm) => {
    const time = new Date(bm.created_at).getTime();
    if (Number.isNaN(time)) return latest;
    return time > latest ? time : latest;
  }, 0);

  return (
    <div className="bookmarks-page">
      <header className="bm-head">
        <div>
          <h1 className="bm-title">Bookmarks</h1>
          <p className="bm-subtitle">
            {hasBookmarks
              ? `${total} saved ${total === 1 ? 'item' : 'items'} — roadmaps and topics you kept for later.`
              : 'Your personal shelf for roadmaps and study topics you want to come back to.'}
          </p>
        </div>
        {hasBookmarks && (
          <div className="bm-head-actions">
            <Link className="btn btn-secondary" to="/roadmap">
              <Compass size={16} aria-hidden="true" />
              Browse roadmaps
            </Link>
          </div>
        )}
      </header>

      {loading ? (
        <div className="bm-loading" aria-busy="true" aria-label="Loading bookmarks">
          <div className="skeleton" style={{ height: '48px', width: '42%' }} />
          <div className="skeleton" style={{ height: '18px', width: '30%' }} />
          <div className="bm-loading-grid">
            <div className="skeleton" style={{ height: '76px' }} />
            <div className="skeleton" style={{ height: '76px' }} />
            <div className="skeleton" style={{ height: '76px' }} />
            <div className="skeleton" style={{ height: '76px' }} />
          </div>
        </div>
      ) : !hasBookmarks ? (
        <section className="bm-empty" aria-labelledby="bm-empty-title">
          <div className="bm-empty-main">
            <span className="bm-empty-icon" aria-hidden="true">
              <Bookmark size={22} />
            </span>
            <h2 id="bm-empty-title">Nothing saved yet</h2>
            <p>
              Bookmark a roadmap or a study topic while you are learning and it will wait
              for you here.
            </p>
            <div className="bm-empty-actions">
              <Link className="btn btn-primary" to="/roadmap">
                <Compass size={16} aria-hidden="true" />
                Explore roadmaps
              </Link>
              <Link className="btn btn-secondary" to="/">
                <LayoutDashboard size={16} aria-hidden="true" />
                Go to dashboard
              </Link>
            </div>
          </div>

          {SUGGESTED_ROADMAPS.length > 0 && (
            <aside className="bm-suggest" aria-labelledby="bm-suggest-title">
              <h2 id="bm-suggest-title">Popular starting points</h2>
              <ul className="bm-suggest-list">
                {SUGGESTED_ROADMAPS.map(rm => (
                  <li key={rm.id}>
                    <Link className="bm-suggest-card" to={`/roadmap/${rm.id}`}>
                      <span className="bm-suggest-text">
                        <span className="bm-suggest-title-text">{rm.title}</span>
                        <span className="bm-suggest-desc">{rm.description}</span>
                      </span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </section>
      ) : (
        <>
          <section className="bm-status" aria-label="Bookmark overview">
            <div className="bm-status-item">
              <strong>{total}</strong>
              <span>saved</span>
            </div>
            <span className="bm-status-divider" aria-hidden="true" />
            <div className="bm-status-item">
              <MapIcon size={14} aria-hidden="true" />
              <strong>{counts.roadmaps}</strong>
              <span>{counts.roadmaps === 1 ? 'roadmap' : 'roadmaps'}</span>
            </div>
            <span className="bm-status-divider" aria-hidden="true" />
            <div className="bm-status-item">
              <Bookmark size={14} aria-hidden="true" />
              <strong>{counts.topics}</strong>
              <span>{counts.topics === 1 ? 'study topic' : 'study topics'}</span>
            </div>
            {lastSaved > 0 && (
              <>
                <span className="bm-status-divider" aria-hidden="true" />
                <div className="bm-status-item">
                  <span>Last saved {formatRelative(new Date(lastSaved).toISOString())}</span>
                </div>
              </>
            )}
          </section>

          <div className="bm-toolbar">
            <div className="bm-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                className="bm-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title"
                aria-label="Search bookmarks"
              />
              {query && (
                <button
                  type="button"
                  className="bm-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="bm-filters" role="group" aria-label="Filter bookmarks by type">
              {FILTERS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`bm-filter ${filter === item.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                >
                  {item.label}
                  <span className="bm-filter-count">{counts[item.id]}</span>
                </button>
              ))}
            </div>
          </div>

          {visibleCount === 0 ? (
            <div className="bm-no-results">
              <p>
                No bookmarks match
                {searchTerm ? <> &ldquo;{query.trim()}&rdquo;</> : ' this filter'}.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setQuery('');
                  setFilter('all');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="bm-sections">
              {visibleRoadmaps.length > 0 && (
                <section className="bm-section" aria-labelledby="bm-roadmaps-title">
                  <div className="bm-section-head">
                    <h2 id="bm-roadmaps-title">Roadmaps</h2>
                    <span className="bm-section-count">{visibleRoadmaps.length}</span>
                  </div>
                  <div className="bm-grid">
                    {visibleRoadmaps.map(rm => (
                      <BookmarkCard
                        key={rm.id}
                        to={`/roadmap/${rm.id}`}
                        title={rm.title}
                        meta={rm.description}
                        icon={MapIcon}
                        tone="roadmap"
                        onRemove={() => handleDeleteRoadmap(rm)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {visibleTopics.length > 0 && (
                <section className="bm-section" aria-labelledby="bm-topics-title">
                  <div className="bm-section-head">
                    <h2 id="bm-topics-title">Study topics</h2>
                    <span className="bm-section-count">{visibleTopics.length}</span>
                  </div>
                  <div className="bm-grid">
                    {visibleTopics.map(bm => (
                      <BookmarkCard
                        key={bm.id}
                        to={`/topic/${bm.topic_id}`}
                        title={bm.topic_title}
                        meta={formatSaved(bm.created_at)}
                        icon={Bookmark}
                        tone="topic"
                        onRemove={() => handleDeleteTopic(bm)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}

      {removed && (
        <div className="bm-undo" role="status">
          <span>
            {removed.kind === 'topic' ? 'Topic bookmark removed' : 'Roadmap bookmark removed'}
          </span>
          <button type="button" className="bm-undo-btn" onClick={handleUndo}>
            Undo
          </button>
          <button
            type="button"
            className="bm-undo-close"
            onClick={() => setRemoved(null)}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
