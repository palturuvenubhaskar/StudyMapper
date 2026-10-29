import { useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Code,
  Compass,
  Database,
  GraduationCap,
  Layers,
  Lightbulb,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Wrench,
  X,
} from 'lucide-react';
import { ALL_ROADMAPS, ROADMAP_CATEGORIES, getCategoryCounts } from './data/roadmapCatalog';

const BOOKMARK_KEY = 'studymapper_roadmap_bookmarks';
const PREVIEW_LIMIT = 8;

const CATEGORY_META = {
  role: { icon: Compass, hue: 217 },
  language: { icon: Code, hue: 38 },
  framework: { icon: Layers, hue: 262 },
  tool: { icon: Wrench, hue: 172 },
  database: { icon: Database, hue: 340 },
  mobile: { icon: Smartphone, hue: 22 },
  concept: { icon: Lightbulb, hue: 190 },
  skill: { icon: GraduationCap, hue: 235 },
  beginner: { icon: Sprout, hue: 142 },
  'best-practices': { icon: ShieldCheck, hue: 215 },
};

const getBookmarks = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistBookmarks = (ids) => {
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable; the in-memory state still works for this visit.
  }
};

function RoadmapCard({ roadmap, saved, onOpen, onToggleSave }) {
  const meta = CATEGORY_META[roadmap.category] || CATEGORY_META.skill;
  const Icon = meta.icon;

  return (
    <article className="rm-card" style={{ '--rm-hue': meta.hue }}>
      <button
        type="button"
        className="rm-card-main"
        onClick={() => onOpen(roadmap.id)}
      >
        <span className="rm-card-icon" aria-hidden="true">
          <Icon size={17} />
        </span>
        <span className="rm-card-text">
          <span className="rm-card-title">{roadmap.title}</span>
          <span className="rm-card-desc">{roadmap.description}</span>
        </span>
      </button>
      <button
        type="button"
        className={`rm-card-save ${saved ? 'is-saved' : ''}`}
        onClick={() => onToggleSave(roadmap.id)}
        aria-pressed={saved}
        title={saved ? 'Remove from saved' : 'Save roadmap'}
        aria-label={saved ? `Remove ${roadmap.title} from saved roadmaps` : `Save ${roadmap.title}`}
      >
        {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      </button>
    </article>
  );
}

export default function RoadmapBrowser({ onSelectRoadmap, onGenerateCustom }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const [expandedGroups, setExpandedGroups] = useState({});

  const counts = useMemo(() => getCategoryCounts(), []);
  const categories = useMemo(
    () => ROADMAP_CATEGORIES
      .filter(category => category.id !== 'all' && counts[category.id] > 0)
      .map(category => ({ ...category, count: counts[category.id] })),
    [counts],
  );

  const query = search.trim().toLowerCase();

  const filteredRoadmaps = useMemo(() => ALL_ROADMAPS.filter(roadmap => {
    if (activeCategory !== 'all' && roadmap.category !== activeCategory) return false;
    if (savedOnly && !bookmarks.includes(roadmap.id)) return false;
    if (query && !`${roadmap.title} ${roadmap.description}`.toLowerCase().includes(query)) return false;
    return true;
  }), [activeCategory, savedOnly, bookmarks, query]);

  const groups = useMemo(
    () => categories
      .map(category => ({
        ...category,
        items: filteredRoadmaps.filter(roadmap => roadmap.category === category.id),
      }))
      .filter(group => group.items.length > 0),
    [categories, filteredRoadmaps],
  );

  const isFlatView = Boolean(query) || savedOnly || activeCategory !== 'all';
  const activeCategoryLabel = categories.find(category => category.id === activeCategory)?.label;

  const handleToggleSave = (id) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter(bookmarkId => bookmarkId !== id)
      : [id, ...bookmarks];
    persistBookmarks(next);
    setBookmarks(next);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('all');
    setSavedOnly(false);
  };

  const flatHeading = query
    ? `Results for “${search.trim()}”`
    : savedOnly
      ? 'Saved roadmaps'
      : activeCategoryLabel;

  const emptyCopy = query
    ? {
        title: `No roadmaps match “${search.trim()}”`,
        body: 'Try a shorter or broader term, or create a path for exactly the skill you want to learn.',
      }
    : savedOnly
      ? {
          title: 'No saved roadmaps yet',
          body: 'Tap the bookmark icon on any roadmap and it will wait for you here.',
        }
      : {
          title: 'Nothing in this category yet',
          body: 'Pick another category, or create a custom roadmap for your goal.',
        };

  return (
    <div className="roadmap-browser">
      <header className="rm-head">
        <div className="rm-head-copy">
          <span className="rm-eyebrow">
            {ALL_ROADMAPS.length} guided paths · {categories.length} categories
          </span>
          <h1 className="rm-title">Skill <span>Roadmaps</span></h1>
          <p className="rm-subtitle">
            Community driven, up-to-date paths to learn any tool or technology.
          </p>
        </div>
        <button type="button" className="btn rm-create" onClick={onGenerateCustom}>
          <Sparkles size={16} aria-hidden="true" />
          Create custom roadmap
        </button>
      </header>

      <div className="rm-toolbar">
        <div className="rm-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            className="rm-search-input"
            placeholder="Search roadmaps"
            aria-label="Search roadmaps"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="rm-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="rm-chips" role="group" aria-label="Filter roadmaps by category">
          <button
            type="button"
            className={`rm-chip ${activeCategory === 'all' && !savedOnly ? 'is-active' : ''}`}
            aria-pressed={activeCategory === 'all' && !savedOnly}
            onClick={() => {
              setActiveCategory('all');
              setSavedOnly(false);
            }}
          >
            All
            <span className="rm-chip-count">{counts.all}</span>
          </button>

          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              className={`rm-chip ${activeCategory === category.id && !savedOnly ? 'is-active' : ''}`}
              aria-pressed={activeCategory === category.id && !savedOnly}
              onClick={() => {
                setActiveCategory(category.id);
                setSavedOnly(false);
              }}
            >
              {category.label}
              <span className="rm-chip-count">{category.count}</span>
            </button>
          ))}

          <span className="rm-chip-divider" aria-hidden="true" />

          <button
            type="button"
            className={`rm-chip rm-chip-saved ${savedOnly ? 'is-active' : ''}`}
            aria-pressed={savedOnly}
            onClick={() => {
              setSavedOnly(true);
              setActiveCategory('all');
            }}
          >
            <Bookmark size={13} aria-hidden="true" />
            Saved
            <span className="rm-chip-count">{bookmarks.length}</span>
          </button>
        </div>
      </div>

      {filteredRoadmaps.length === 0 ? (
        <div className="rm-empty">
          <span className="rm-empty-icon" aria-hidden="true">
            <Compass size={22} />
          </span>
          <h2>{emptyCopy.title}</h2>
          <p>{emptyCopy.body}</p>
          <div className="rm-empty-actions">
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              {savedOnly ? 'Browse all roadmaps' : 'Clear filters'}
            </button>
            <button type="button" className="btn btn-primary" onClick={onGenerateCustom}>
              <Sparkles size={16} aria-hidden="true" />
              Create custom roadmap
            </button>
          </div>
        </div>
      ) : isFlatView ? (
        <section className="rm-section" aria-labelledby="rm-flat-title">
          <div className="rm-section-head">
            <h2 id="rm-flat-title">{flatHeading}</h2>
            <span className="rm-section-count">{filteredRoadmaps.length}</span>
            <span className="rm-section-line" aria-hidden="true" />
          </div>
          <div className="rm-grid">
            {filteredRoadmaps.map(roadmap => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                saved={bookmarks.includes(roadmap.id)}
                onOpen={onSelectRoadmap}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        </section>
      ) : (
        groups.map(group => {
          const expanded = Boolean(expandedGroups[group.id]);
          const visibleItems = expanded ? group.items : group.items.slice(0, PREVIEW_LIMIT);

          return (
            <section key={group.id} className="rm-section" aria-labelledby={`rm-group-${group.id}`}>
              <div className="rm-section-head">
                <h2 id={`rm-group-${group.id}`}>{group.label}</h2>
                <span className="rm-section-count">{group.items.length}</span>
                <span className="rm-section-line" aria-hidden="true" />
              </div>
              <div className="rm-grid">
                {visibleItems.map(roadmap => (
                  <RoadmapCard
                    key={roadmap.id}
                    roadmap={roadmap}
                    saved={bookmarks.includes(roadmap.id)}
                    onOpen={onSelectRoadmap}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
              {group.items.length > PREVIEW_LIMIT && (
                <button
                  type="button"
                  className="rm-show-all"
                  aria-expanded={expanded}
                  onClick={() => setExpandedGroups(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
                >
                  {expanded
                    ? <><ChevronUp size={14} aria-hidden="true" /> Show fewer</>
                    : <><ChevronDown size={14} aria-hidden="true" /> Show all {group.items.length}</>}
                </button>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
