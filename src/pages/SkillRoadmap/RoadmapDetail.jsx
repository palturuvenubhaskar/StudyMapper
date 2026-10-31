import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Download,
  HelpCircle,
  ListChecks,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { NODE_TYPES, ROADMAP_CATEGORIES } from './data/roadmapMeta';
import RoadmapFlowchart from './RoadmapFlowchart';
import LinearRoadmap from './LinearRoadmap';

const PROGRESS_KEY = 'studymapper_roadmap_progress';

const CATEGORY_LABELS = Object.fromEntries(
  ROADMAP_CATEGORIES.map(category => [category.id, category.label]),
);

const loadProgress = (roadmapId) => {
  try {
    const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    return all[roadmapId] || {};
  } catch { return {}; }
};

const saveProgress = (roadmapId, progress) => {
  try {
    const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    all[roadmapId] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {}
};

const BOOKMARK_KEY = 'studymapper_roadmap_bookmarks';
const isBookmarked = (id) => {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]').includes(id); }
  catch { return false; }
};
const toggleBookmarkStorage = (id) => {
  try {
    const bm = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
    const next = bm.includes(id) ? bm.filter(b => b !== id) : [...bm, id];
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
    return next.includes(id);
  } catch { return false; }
};

// Linear roadmaps store nested items; only leaves (things you actually study)
// count towards progress so section/topic totals always add up.
const collectLeaves = (items, out = []) => {
  (items || []).forEach(item => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      collectLeaves(item.children, out);
    } else if (item.type !== NODE_TYPES.SECTION && item.type !== 'subgroup') {
      out.push(item);
    }
  });
  return out;
};

const isTrackableNode = (node) => (
  node.type === NODE_TYPES.TOPIC
  || node.type === NODE_TYPES.SUBTOPIC
  || node.type === NODE_TYPES.CHECKPOINT
);

// Path of container ids (sections/topics) that hold the target node.
const findAncestors = (items, targetId, trail = []) => {
  for (const item of items || []) {
    if (item.id === targetId) return trail;
    if (Array.isArray(item.children) && item.children.length > 0) {
      const found = findAncestors(item.children, targetId, [...trail, item.id]);
      if (found) return found;
    }
  }
  return null;
};

const categoryLabel = (roadmap) => {
  if (!roadmap.category) return null;
  return CATEGORY_LABELS[roadmap.category] || roadmap.category;
};

export default function RoadmapDetail({ roadmapId, onBack, onSelectRoadmap }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(roadmapId));
  const [faqOpen, setFaqOpen] = useState(false);
  const [nodeProgress, setNodeProgress] = useState(() => loadProgress(roadmapId));
  const [selectedNode, setSelectedNode] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    import('./data/roadmapData')
      .then(({ getRoadmapById }) => {
        if (cancelled) return;
        setRoadmap(getRoadmapById(roadmapId) || null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setRoadmap(null);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [roadmapId]);

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;
  }

  if (!roadmap) {
    return (
      <div className="rd-not-found">
        <h2>Roadmap Coming Soon</h2>
        <p>This roadmap is being developed. Check back later!</p>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to All Roadmaps
        </button>
      </div>
    );
  }

  const updateStatus = (nodeId, status) => {
    setNodeProgress(prev => {
      const updated = { ...prev, [nodeId]: status };
      saveProgress(roadmapId, updated);
      return updated;
    });
  };

  const cycleNodeStatus = (node) => {
    const current = nodeProgress[node.id] || 'pending';
    const next = current === 'pending' ? 'in-progress' : current === 'in-progress' ? 'done' : 'pending';
    updateStatus(node.id, next);
  };

  const isLinear = roadmap.layout === 'linear';

  const trackableNodes = isLinear
    ? collectLeaves(roadmap.items)
    : (roadmap.nodes || []).filter(isTrackableNode);

  const doneCount = trackableNodes.filter(node => nodeProgress[node.id] === 'done').length;
  const activeCount = trackableNodes.filter(node => nodeProgress[node.id] === 'in-progress').length;
  const totalCount = trackableNodes.length;
  const remainingCount = Math.max(totalCount - doneCount, 0);
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const nextUp = isLinear
    ? trackableNodes.find(node => nodeProgress[node.id] !== 'done')
    : null;

  const resumeLabel = doneCount === 0
    ? 'Start roadmap'
    : progressPct === 100
      ? 'Review roadmap'
      : 'Continue learning';

  const handleResume = () => {
    if (!nextUp) return;
    const path = findAncestors(roadmap.items || [], nextUp.id);
    const expanded = { ...collapsed };
    (path || []).forEach(id => { expanded[id] = true; });
    setCollapsed(expanded);
    setTimeout(() => {
      const target = document.getElementById(`lr-node-${nextUp.id}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const selectedHasChildren = Boolean(selectedNode?.children?.length)
    && selectedNode.type !== 'subgroup';
  const selectedLeaves = selectedHasChildren ? collectLeaves(selectedNode.children) : [];
  const selectedDone = selectedLeaves.filter(node => nodeProgress[node.id] === 'done').length;

  return (
    <div className="roadmap-detail">
      <div className="rd-main-content">
        <div className="rd-topbar">
          <button className="rd-back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> All roadmaps
          </button>
          <div className="rd-header-actions">
            <button
              className={`rd-action-btn ${bookmarked ? 'active' : ''}`}
              onClick={() => setBookmarked(toggleBookmarkStorage(roadmapId))}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
              aria-pressed={bookmarked}
            >
              {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            <button className="rd-action-btn" title="Download">
              <Download size={18} />
            </button>
            <button className="rd-action-btn" title="Share">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <header className="rd-hero">
          <div className="rd-hero-copy">
            <div className="rd-hero-meta">
              {categoryLabel(roadmap) && (
                <span className="rd-pill">{categoryLabel(roadmap)}</span>
              )}
              {totalCount > 0 && (
                <span className="rd-meta-item">
                  <ListChecks size={13} aria-hidden="true" />
                  {totalCount} steps
                </span>
              )}
              {roadmap.subscriberCount && (
                <span className="rd-meta-item">
                  <Users size={13} aria-hidden="true" />
                  {roadmap.subscriberCount} learners
                </span>
              )}
            </div>

            <h1 className="rd-title">{roadmap.title}</h1>
            <p className="rd-description">{roadmap.description}</p>
          </div>

          {isLinear && totalCount > 0 && (
            <div className="rd-progress-card">
              <div className="rd-progress-head">
                <span className="rd-progress-label">Your progress</span>
                <span className="rd-progress-pct">
                  {progressPct}<small>%</small>
                </span>
              </div>

              <div className="rd-progress-track" aria-hidden="true">
                <div className="rd-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>

              <div className="rd-progress-stats">
                <span className="rd-stat is-done">
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                  {doneCount} done
                </span>
                <span className="rd-stat is-active">
                  <span className="rd-dot" aria-hidden="true" />
                  {activeCount} active
                </span>
                <span className="rd-stat is-left">{remainingCount} left</span>
              </div>

              <button type="button" className="rd-resume" onClick={handleResume}>
                {resumeLabel}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          )}
        </header>

        {roadmap.faq && (
          <div className={`rd-faq ${faqOpen ? 'is-open' : ''}`}>
            <button
              className="rd-faq-toggle"
              onClick={() => setFaqOpen(!faqOpen)}
              aria-expanded={faqOpen}
            >
              <span className="rd-faq-icon" aria-hidden="true"><HelpCircle size={16} /></span>
              <span className="rd-faq-question">{roadmap.faq.question}</span>
              <ChevronDown className="rd-faq-caret" size={16} aria-hidden="true" />
            </button>
            {faqOpen && (
              <div className="rd-faq-content">
                <p>{roadmap.faq.answer}</p>
              </div>
            )}
          </div>
        )}

        {/* Node colours are a flowchart concept and mean nothing in a list. */}
        {!isLinear && roadmap.legend && (
          <div className="rd-legend">
            {roadmap.legend.map((item, i) => (
              <div key={i} className="rd-legend-item">
                <span
                  className="rd-legend-color"
                  style={{ background: item.color, color: item.textColor || '#1a1a1a' }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {isLinear ? (
          <LinearRoadmap
            roadmap={roadmap}
            nodeProgress={nodeProgress}
            onNodeClick={setSelectedNode}
            onLinkClick={onSelectRoadmap}
            onToggleStatus={cycleNodeStatus}
            nextUpId={nextUp?.id}
            collapsed={collapsed}
            onToggleCollapse={(id) => setCollapsed(prev => ({ ...prev, [id]: !(prev[id] === undefined ? true : prev[id]) }))}
          />
        ) : (
          <RoadmapFlowchart
            roadmap={roadmap}
            nodeProgress={nodeProgress}
            onNodeClick={setSelectedNode}
            onLinkClick={onSelectRoadmap}
          />
        )}
      </div>

      {/* Node Detail Panel (Right Side) */}
      {selectedNode && (() => {
        const nodeTitle = selectedNode.title || selectedNode.label || 'this topic';
        return (
          <div className="rd-node-panel">
            <div className="rd-panel-header">
              <h3>{nodeTitle}</h3>
              <button className="rd-panel-close" onClick={() => setSelectedNode(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="rd-panel-body">
              {selectedHasChildren ? (
                <div className="rd-panel-progress">
                  <span className="rd-panel-label">Section progress</span>
                  <div className="rd-panel-progress-row">
                    <strong>{selectedDone}</strong>
                    <span>of {selectedLeaves.length} steps complete</span>
                  </div>
                  <div className="rd-progress-track" aria-hidden="true">
                    <div
                      className="rd-progress-fill"
                      style={{
                        width: `${selectedLeaves.length ? Math.round((selectedDone / selectedLeaves.length) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <p className="rd-panel-hint">
                    Mark each step in the list to update this section.
                  </p>
                </div>
              ) : (
                <div className="rd-panel-status">
                  <span className="rd-panel-label">Status</span>
                  <div className="rd-status-buttons">
                    <button
                      className={`rd-status-btn ${(nodeProgress[selectedNode.id] || 'pending') === 'pending' ? 'active pending' : ''}`}
                      onClick={() => updateStatus(selectedNode.id, 'pending')}
                    >
                      <Circle size={14} /> Not Started
                    </button>
                    <button
                      className={`rd-status-btn ${nodeProgress[selectedNode.id] === 'in-progress' ? 'active in-progress' : ''}`}
                      onClick={() => updateStatus(selectedNode.id, 'in-progress')}
                    >
                      <Clock size={14} /> In Progress
                    </button>
                    <button
                      className={`rd-status-btn ${nodeProgress[selectedNode.id] === 'done' ? 'active done' : ''}`}
                      onClick={() => updateStatus(selectedNode.id, 'done')}
                    >
                      <CheckCircle2 size={14} /> Done
                    </button>
                  </div>
                </div>
              )}

              <div className="rd-panel-info">
                <h4>About {nodeTitle}</h4>
                <p>
                  {selectedNode.type === NODE_TYPES.TOPIC || selectedNode.type === NODE_TYPES.SUBTOPIC
                    ? `Learn ${nodeTitle} as part of your ${roadmap.title} journey. This is a key skill that will build your foundation.`
                    : `Complete this checkpoint by building a project that demonstrates your understanding of the concepts covered so far.`
                  }
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
