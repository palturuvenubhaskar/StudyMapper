import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { 
  ArrowLeft, BookOpen, CheckCircle, Circle, Clock, 
  Brain, Code, Users, Lock
} from 'lucide-react';
import { db } from '../../data/db';
import { TopicDetail } from './TopicDetail';
import { usePlacementState } from '../../context/PlacementStateContext';
import './LearnMode.css';

const CATEGORY_CONFIG = {
  aptitude: {
    name: 'Aptitude Practice',
    icon: Brain,
    color: '#6366f1',
    topics: [
      { id: 'profit-loss', title: 'Profit & Loss', difficulty: 'easy', estimated: 15 },
      { id: 'time-work', title: 'Time & Work', difficulty: 'medium', estimated: 20 },
      { id: 'percentages', title: 'Percentages', difficulty: 'easy', estimated: 10 },
      { id: 'ratio-proportion', title: 'Ratio & Proportion', difficulty: 'easy', estimated: 15 },
      { id: 'time-speed-distance', title: 'Time, Speed & Distance', difficulty: 'medium', estimated: 20 },
      { id: 'probability', title: 'Probability', difficulty: 'hard', estimated: 25 },
      { id: 'permutations', title: 'Permutations & Combinations', difficulty: 'hard', estimated: 30 },
      { id: 'data-interpretation', title: 'Data Interpretation', difficulty: 'medium', estimated: 25 },
      { id: 'logical-series', title: 'Logical Series', difficulty: 'easy', estimated: 15 },
      { id: 'blood-relations', title: 'Blood Relations', difficulty: 'easy', estimated: 10 },
      { id: 'syllogism', title: 'Syllogism', difficulty: 'medium', estimated: 20 },
      { id: 'verbal-analogy', title: 'Verbal Analogy', difficulty: 'easy', estimated: 10 },
    ]
  },
  technical: {
    name: 'Technical Interview',
    icon: Code,
    color: '#10b981',
    topics: [
      { id: 'arrays-strings', title: 'Arrays & Strings', difficulty: 'easy', estimated: 30 },
      { id: 'linked-lists', title: 'Linked Lists', difficulty: 'medium', estimated: 35 },
      { id: 'stacks-queues', title: 'Stacks & Queues', difficulty: 'medium', estimated: 30 },
      { id: 'trees-graphs', title: 'Trees & Graphs', difficulty: 'hard', estimated: 45 },
      { id: 'sorting', title: 'Sorting Algorithms', difficulty: 'medium', estimated: 35 },
      { id: 'os-processes', title: 'Process Management', difficulty: 'medium', estimated: 30 },
      { id: 'os-memory', title: 'Memory Management', difficulty: 'hard', estimated: 40 },
      { id: 'dbms-normalization', title: 'DBMS Normalization', difficulty: 'medium', estimated: 30 },
      { id: 'sql-queries', title: 'SQL Queries', difficulty: 'medium', estimated: 25 },
      { id: 'cn-protocols', title: 'Network Protocols', difficulty: 'medium', estimated: 35 },
      { id: 'system-design-basics', title: 'System Design Basics', difficulty: 'hard', estimated: 50 },
      { id: 'oop-concepts', title: 'OOP Concepts', difficulty: 'easy', estimated: 25 },
    ]
  },
  hr: {
    name: 'HR & Behavioral',
    icon: Users,
    color: '#f59e0b',
    topics: [
      { id: 'star-method', title: 'STAR Method Framework', difficulty: 'easy', estimated: 20 },
      { id: 'tell-me-about-yourself', title: 'Tell Me About Yourself', difficulty: 'easy', estimated: 15 },
      { id: 'strengths-weaknesses', title: 'Strengths & Weaknesses', difficulty: 'easy', estimated: 20 },
      { id: 'why-this-company', title: 'Why This Company?', difficulty: 'easy', estimated: 15 },
      { id: 'conflict-resolution', title: 'Conflict Resolution', difficulty: 'medium', estimated: 25 },
      { id: 'leadership-examples', title: 'Leadership Examples', difficulty: 'medium', estimated: 30 },
      { id: 'teamwork-stories', title: 'Teamwork Stories', difficulty: 'medium', estimated: 25 },
      { id: 'failure-lessons', title: 'Lessons from Failure', difficulty: 'medium', estimated: 25 },
      { id: 'salary-negotiation', title: 'Salary Negotiation', difficulty: 'hard', estimated: 20 },
      { id: 'questions-for-interviewer', title: 'Questions for Interviewer', difficulty: 'easy', estimated: 15 },
    ]
  }
};

export default function LearnMode() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[categoryId];
  const { saveState, loadState } = usePlacementState(`learn-${categoryId}`);
  
  useDocumentTitle(`Learn — ${config?.name || 'Placement Prep'}`);
  
  // Restore saved state on mount
  const savedState = loadState();
  const [selectedTopic, setSelectedTopic] = useState(savedState?.selectedTopic || null);
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
        onBack={() => setSelectedTopic(null)}
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
