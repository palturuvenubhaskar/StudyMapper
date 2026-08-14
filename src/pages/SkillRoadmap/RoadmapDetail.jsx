import { useState, useMemo } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, Download, Share2, ChevronDown, ChevronUp, Users, Sparkles, X, CheckCircle2, Circle, Clock } from 'lucide-react';
import { getRoadmapById, NODE_TYPES } from './data/roadmapData';
import RoadmapFlowchart from './RoadmapFlowchart';
import LinearRoadmap from './LinearRoadmap';

const PROGRESS_KEY = 'studymapper_roadmap_progress';

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

export default function RoadmapDetail({ roadmapId, onBack, onSelectRoadmap }) {
  const roadmap = getRoadmapById(roadmapId);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(roadmapId));
  const [faqOpen, setFaqOpen] = useState(false);
  const [nodeProgress, setNodeProgress] = useState(() => loadProgress(roadmapId));
  const [selectedNode, setSelectedNode] = useState(null);

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

  const toggleNodeStatus = (nodeId) => {
    setNodeProgress(prev => {
      const current = prev[nodeId] || 'pending';
      let next;
      if (current === 'pending') next = 'in-progress';
      else if (current === 'in-progress') next = 'done';
      else next = 'pending';
      const updated = { ...prev, [nodeId]: next };
      saveProgress(roadmapId, updated);
      return updated;
    });
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  // Progress stats
  const extractTrackableLinear = (items) => {
    let result = [];
    if (!items) return result;
    for (const item of items) {
      if (item.type === 'topic' || item.type === 'subtopic' || item.type === 'checkpoint') {
        result.push(item);
      }
      if (item.children) {
        result = result.concat(extractTrackableLinear(item.children));
      }
    }
    return result;
  };

  const trackableNodes = roadmap.layout === 'linear'
    ? extractTrackableLinear(roadmap.items)
    : (roadmap.nodes || []).filter(
        n => n.type === NODE_TYPES.TOPIC || n.type === NODE_TYPES.CHECKPOINT || n.type === NODE_TYPES.SUBTOPIC
      );
  const doneCount = trackableNodes.filter(n => nodeProgress[n.id] === 'done').length;
  const inProgressCount = trackableNodes.filter(n => nodeProgress[n.id] === 'in-progress').length;
  const progressPct = trackableNodes.length > 0 ? Math.round((doneCount / trackableNodes.length) * 100) : 0;

  return (
    <div className="roadmap-detail">
      {/* Main Content (Left Side) */}
      <div className="rd-main-content">
        {/* Header */}
        <div className="rd-header">
          <div className="rd-header-top">
            <button className="rd-back-btn" onClick={onBack}>
              <ArrowLeft size={16} /> All Roadmaps
            </button>
            <div className="rd-header-actions">
              <button
                className={`rd-action-btn ${bookmarked ? 'active' : ''}`}
                onClick={() => setBookmarked(toggleBookmarkStorage(roadmapId))}
                title="Bookmark"
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

          <h1 className="rd-title">{roadmap.title}</h1>
          <p className="rd-description">{roadmap.description}</p>


          {/* FAQ Accordion */}
          {roadmap.faq && (
            <div className="rd-faq">
              <button className="rd-faq-toggle" onClick={() => setFaqOpen(!faqOpen)}>
                <span>ℹ️ {roadmap.faq.question}</span>
                {faqOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {faqOpen && (
                <div className="rd-faq-content">
                  <p>{roadmap.faq.answer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        {roadmap.legend && (
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
            <div className="rd-legend-item">
              <span className="rd-legend-color" style={{ background: '#10b981' }} />
              <span>Completed</span>
            </div>
            <div className="rd-legend-item">
              <span className="rd-legend-color" style={{ background: '#f59e0b' }} />
              <span>In Progress</span>
            </div>
          </div>
        )}

        {/* Flowchart or Linear Roadmap */}
        {roadmap.layout === 'linear' ? (
          <LinearRoadmap
            roadmap={roadmap}
            nodeProgress={nodeProgress}
            onNodeClick={handleNodeClick}
            onLinkClick={onSelectRoadmap}
          />
        ) : (
          <RoadmapFlowchart
            roadmap={roadmap}
            nodeProgress={nodeProgress}
            onNodeClick={handleNodeClick}
            onLinkClick={onSelectRoadmap}
          />
        )}
      </div>

      {/* Node Detail Panel (Right Side) */}
      {selectedNode && (
        <div className="rd-node-panel">
          <div className="rd-panel-header">
            <h3>{selectedNode.label}</h3>
            <button className="rd-panel-close" onClick={() => setSelectedNode(null)}>
              <X size={18} />
            </button>
          </div>

          <div className="rd-panel-body">
            <div className="rd-panel-status">
              <span className="rd-panel-label">Status:</span>
              <div className="rd-status-buttons">
                <button
                  className={`rd-status-btn ${(nodeProgress[selectedNode.id] || 'pending') === 'pending' ? 'active pending' : ''}`}
                  onClick={() => {
                    const updated = { ...nodeProgress, [selectedNode.id]: 'pending' };
                    setNodeProgress(updated);
                    saveProgress(roadmapId, updated);
                  }}
                >
                  <Circle size={14} /> Not Started
                </button>
                <button
                  className={`rd-status-btn ${nodeProgress[selectedNode.id] === 'in-progress' ? 'active in-progress' : ''}`}
                  onClick={() => {
                    const updated = { ...nodeProgress, [selectedNode.id]: 'in-progress' };
                    setNodeProgress(updated);
                    saveProgress(roadmapId, updated);
                  }}
                >
                  <Clock size={14} /> In Progress
                </button>
                <button
                  className={`rd-status-btn ${nodeProgress[selectedNode.id] === 'done' ? 'active done' : ''}`}
                  onClick={() => {
                    const updated = { ...nodeProgress, [selectedNode.id]: 'done' };
                    setNodeProgress(updated);
                    saveProgress(roadmapId, updated);
                  }}
                >
                  <CheckCircle2 size={14} /> Done
                </button>
              </div>
            </div>

            <div className="rd-panel-info">
              <h4>About {selectedNode.label}</h4>
              <p>
                {selectedNode.type === NODE_TYPES.TOPIC || selectedNode.type === NODE_TYPES.SUBTOPIC
                  ? `Learn ${selectedNode.label} as part of your ${roadmap.title} journey. This is a key skill that will build your foundation.`
                  : `Complete this checkpoint by building a project that demonstrates your understanding of the concepts covered so far.`
                }
              </p>
            </div>

            <div className="rd-panel-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => toggleNodeStatus(selectedNode.id)}
              >
                Toggle Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
