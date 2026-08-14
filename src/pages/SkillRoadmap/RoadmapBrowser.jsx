import { useState, useMemo } from 'react';
import { Search, Bookmark, BookmarkCheck, Sparkles, ArrowRight } from 'lucide-react';
import { ALL_ROADMAPS, ROADMAP_CATEGORIES, getCategoryCounts, NEW_ROADMAPS } from './data/roadmapData';
import PremiumSelect from '../../components/PremiumSelect/PremiumSelect';

const BOOKMARK_KEY = 'studymapper_roadmap_bookmarks';

const getBookmarks = () => {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]'); }
  catch { return []; }
};

const toggleBookmark = (id) => {
  const bm = getBookmarks();
  const next = bm.includes(id) ? bm.filter(b => b !== id) : [...bm, id];
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  return next;
};

export default function RoadmapBrowser({ onSelectRoadmap, onGenerateCustom }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  const counts = useMemo(() => getCategoryCounts(), []);

  const categories = ROADMAP_CATEGORIES.map(c => ({
    ...c,
    count: counts[c.id] || 0,
    displayLabel: `${c.label} (${counts[c.id] || 0})`
  }));

  const filteredRoadmaps = useMemo(() => {
    let items = activeCategory === 'all'
      ? ALL_ROADMAPS
      : ALL_ROADMAPS.filter(r => r.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(r => r.title.toLowerCase().includes(q));
    }
    return items;
  }, [activeCategory, search]);

  // Group roadmaps by category for "all" view
  const groupedRoadmaps = useMemo(() => {
    if (activeCategory !== 'all') {
      return [{ label: activeCategory.replace(/-/g, ' ').toUpperCase() + ' ROADMAPS', items: filteredRoadmaps }];
    }

    const roleItems = filteredRoadmaps.filter(r => r.category === 'role');
    const skillItems = filteredRoadmaps.filter(r => r.category === 'skill');
    const toolItems = filteredRoadmaps.filter(r => r.category === 'tool');
    const langItems = filteredRoadmaps.filter(r => r.category === 'language');
    const frameworkItems = filteredRoadmaps.filter(r => r.category === 'framework');
    const beginnerItems = filteredRoadmaps.filter(r => r.category === 'beginner');
    const bpItems = filteredRoadmaps.filter(r => r.category === 'best-practices');

    const groups = [];
    if (roleItems.length) groups.push({ label: 'ROLE BASED ROADMAPS', items: roleItems });
    if (skillItems.length) groups.push({ label: 'SKILL BASED ROADMAPS', items: skillItems });
    if (toolItems.length) groups.push({ label: 'TOOLS', items: toolItems });
    if (langItems.length) groups.push({ label: 'LANGUAGES', items: langItems });
    if (frameworkItems.length) groups.push({ label: 'FRAMEWORKS', items: frameworkItems });
    if (beginnerItems.length) groups.push({ label: 'ABSOLUTE BEGINNERS', items: beginnerItems });
    if (bpItems.length) groups.push({ label: 'BEST PRACTICES', items: bpItems });
    return groups;
  }, [activeCategory, filteredRoadmaps]);

  const handleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarks(toggleBookmark(id));
  };

  const handleCategoryChange = (e) => {
    const selectedDisplay = e.target.value;
    const cat = categories.find(c => c.displayLabel === selectedDisplay);
    if (cat) setActiveCategory(cat.id);
  };

  const currentActiveDisplay = categories.find(c => c.id === activeCategory)?.displayLabel || 'All Roadmaps (91)';

  return (
    <div className="roadmap-browser">
      {/* Top Header & Navigation */}
      <header className="rb-top-header">
        <div className="rb-header-content">
          <div className="rb-title-section">
            <h1 className="rb-title">Skill Roadmaps</h1>
            <p className="rb-subtitle">Community driven, up-to-date paths to learn any tool or technology.</p>
          </div>
          
          <div className="rb-filters" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '220px' }}>
              <PremiumSelect 
                value={currentActiveDisplay}
                onChange={handleCategoryChange}
                options={categories.map(c => c.displayLabel)}
              />
            </div>
            
            <div className="rb-search-wrapper">
              <Search size={16} className="rb-search-icon" />
              <input
                type="text"
                className="rb-search-input"
                placeholder="Search roadmaps"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="rb-content">
        {groupedRoadmaps.map(group => (
          <div key={group.label} className="rb-group">
            <h3 className="rb-group-label">{group.label}</h3>
            <div className="rb-grid">
              {group.items.map(roadmap => (
                <div
                  key={roadmap.id}
                  className="rb-card"
                  onClick={() => onSelectRoadmap(roadmap.id)}
                >
                  <span className="rb-card-title">{roadmap.title}</span>
                  <button
                    className="rb-card-bookmark"
                    onClick={(e) => handleBookmark(e, roadmap.id)}
                    title={bookmarks.includes(roadmap.id) ? 'Remove bookmark' : 'Bookmark'}
                  >
                    {bookmarks.includes(roadmap.id)
                      ? <BookmarkCheck size={20} />
                      : <Bookmark size={20} />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredRoadmaps.length === 0 && (
          <div className="rb-empty">
            <p>No roadmaps found for "{search}"</p>
          </div>
        )}

        {/* AI Banner */}
        <div className="rb-ai-banner" onClick={onGenerateCustom}>
          <Sparkles size={20} />
          <span>Can't find what you're looking for? Generate a custom AI roadmap</span>
          <ArrowRight size={20} />
        </div>
      </main>
    </div>
  );
}
