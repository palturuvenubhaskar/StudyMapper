import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { 
  ArrowLeft, BookOpen, CheckCircle, Circle, Clock, Lock
} from 'lucide-react';
import { db } from '../../data/db';
import { TopicDetail } from './TopicDetail';
import { usePlacementState } from '../../context/PlacementStateContext';
import { TRACKS_BY_ID } from './placementCatalog';
import './LearnMode.css';

export default function LearnMode() {
  const { categoryId, topicId } = useParams();
  const navigate = useNavigate();
  const config = TRACKS_BY_ID[categoryId];
  const { saveState, loadState } = usePlacementState(`learn-${categoryId}`);
  
  useDocumentTitle(`Learn - ${config?.name || 'Placement Prep'}`);
  
  // Restore saved state on mount, preferring a topic from the URL
  const savedState = loadState();
  const urlTopic = topicId ? config?.topics.find(t => t.id === topicId) : null;
  const [selectedTopic, setSelectedTopic] = useState(urlTopic || savedState?.selectedTopic || null);
  const [topicsProgress, setTopicsProgress] = useState({});
  const [filter, setFilter] = useState(savedState?.filter || 'all'); // all | easy | medium | hard | completed | pending

  // Keep a ref of current state for the cleanup function
  const stateRef = useRef({ selectedTopic, filter });
  useEffect(() => {
    stateRef.current = { selectedTopic, filter };
  }, [selectedTopic, filter]);

  // Save state on unmount
  useEffect(() => {
    return () => saveState(stateRef.current);
  }, [saveState]);

  useEffect(() => {
    if (config) {
        loadProgress();
    }
  }, [categoryId, config]);

  const loadProgress = async () => {
    if(!config) return;
    const topicIds = config.topics.map(t => `${categoryId}-${t.id}`);
    const progress = await db.placement_learning_progress.where('topic_id').anyOf(topicIds).toArray();
    const map = {};
    progress.forEach(p => { map[p.topic_id] = p; });
    setTopicsProgress(map);
  };

  const getTopicStatus = (topicId) => {
    const fullId = `${categoryId}-${topicId}`;
    return topicsProgress[fullId]?.status || 'not_started';
  };

  if (!config) return <div>Category not found.</div>;

  const filteredTopics = config.topics.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'completed') return getTopicStatus(t.id) === 'completed';
    if (filter === 'pending') return getTopicStatus(t.id) !== 'completed';
    return t.difficulty === filter;
  });

  if (selectedTopic) {
    return (
      <TopicDetail 
        categoryId={categoryId}
        topic={selectedTopic}
        config={config}
        onBack={() => {
          setSelectedTopic(null);
          if (topicId) navigate(`/placement/${categoryId}/learn`, { replace: true });
        }}
        onComplete={loadProgress}
      />
    );
  }

  return (
    <div className="learn-mode">
      {/* Header */}
      <div className="learn-header">
        <button onClick={() => navigate('/placement')} className="back-btn">
          <ArrowLeft size={18} />
          Back to Placement Prep
        </button>
        <h1>{config.name}</h1>
        <p>Master these topics before taking the test. AI-generated explanations tailored for placement prep.</p>
      </div>

      {/* Filters */}
      <div className="learn-filters">
        {['all', 'easy', 'medium', 'hard', 'completed', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="topics-grid">
        {filteredTopics.map((topic, index) => {
          const status = getTopicStatus(topic.id);
          const isLocked = index > 0 && getTopicStatus(config.topics[index - 1].id) !== 'completed';
          
          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              status={status}
              isLocked={isLocked}
              categoryColor={config.color}
              onClick={() => !isLocked && setSelectedTopic(topic)}
            />
          );
        })}
      </div>
    </div>
  );
}

function TopicCard({ topic, status, isLocked, categoryColor, onClick }) {
  const difficultyColors = {
    easy: '#22c55e',
    medium: '#f59e0b',
    hard: '#ef4444',
  };

  return (
    <div 
      className={`topic-card ${status} ${isLocked ? 'locked' : ''}`}
      onClick={onClick}
      style={{ '--topic-color': categoryColor }}
    >
      {isLocked && (
        <div className="topic-lock-overlay">
          <Lock size={24} />
          <span>Complete previous topic</span>
        </div>
      )}
      
      <div className="topic-card-header">
        <span 
          className="difficulty-badge"
          style={{ background: `${difficultyColors[topic.difficulty]}20`, color: difficultyColors[topic.difficulty] }}
        >
          {topic.difficulty}
        </span>
        {status === 'completed' && <CheckCircle size={18} className="status-icon completed" />}
        {status === 'in_progress' && <Circle size={18} className="status-icon in-progress" />}
      </div>

      <h3>{topic.title}</h3>
      
      <div className="topic-meta">
        <span><Clock size={14} /> {topic.estimated} min</span>
        <span><BookOpen size={14} /> AI Guide</span>
      </div>

      <div className="topic-progress-bar">
        <div 
          className="topic-progress-fill" 
          style={{ width: status === 'completed' ? '100%' : status === 'in_progress' ? '50%' : '0%' }}
        />
      </div>
    </div>
  );
}
