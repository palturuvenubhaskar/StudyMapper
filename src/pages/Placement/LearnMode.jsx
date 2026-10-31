import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  ArrowLeft, ArrowRight, CheckCircle2, CircleDot, Clock, Lock, Target,
} from 'lucide-react';
import { db } from '../../data/db';
import { TopicDetail } from './TopicDetail';
import { usePlacementState } from '../../context/PlacementStateContext';
import { TRACKS_BY_ID } from './placementCatalog';
import './LearnMode.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
  { id: 'completed', label: 'Learned' },
  { id: 'pending', label: 'Remaining' },
];

const STATUS_LABEL = {
  completed: 'Learned',
  in_progress: 'In progress',
};

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export default function LearnMode() {
  const { categoryId, topicId } = useParams();
  const navigate = useNavigate();
  const config = TRACKS_BY_ID[categoryId];
  const { saveState, loadState } = usePlacementState(`learn-${categoryId}`);

  useDocumentTitle(config ? config.name : 'Placement Prep');

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
    if (!config) return;
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

  const topics = config.topics;
  const learnedCount = topics.filter(t => getTopicStatus(t.id) === 'completed').length;
  const percent = topics.length ? Math.round((learnedCount / topics.length) * 100) : 0;
  const remainingMinutes = topics
    .filter(t => getTopicStatus(t.id) !== 'completed')
    .reduce((sum, t) => sum + t.estimated, 0);
  const nextTopic = topics.find(t => getTopicStatus(t.id) !== 'completed') || null;

  const counts = {
    all: topics.length,
    easy: topics.filter(t => t.difficulty === 'easy').length,
    medium: topics.filter(t => t.difficulty === 'medium').length,
    hard: topics.filter(t => t.difficulty === 'hard').length,
    completed: learnedCount,
    pending: topics.length - learnedCount,
  };

  const filteredTopics = topics.filter(t => {
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
    <div className="learn-page" style={{ '--track': config.color }}>
      <button onClick={() => navigate('/placement')} className="back-btn">
        <ArrowLeft size={16} aria-hidden="true" />
        Placement Prep
      </button>

      <header className="learn-head">
        <div className="learn-head-copy">
          <p className="learn-eyebrow">Placement prep · Learn</p>
          <h1>{config.name}</h1>
          <p className="learn-subtitle">
            {config.description}
          </p>
        </div>

        <Link className="learn-test-link" to={config.testPath}>
          <Target size={15} aria-hidden="true" />
          Practice test
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>

      <section className="learn-summary" aria-label="Track progress">
        <div className="learn-summary-count">
          <span className="learn-summary-value">
            {learnedCount}
            <span className="learn-summary-total">/{topics.length}</span>
          </span>
          <span className="learn-summary-label">topics learned</span>
        </div>

        <div className="learn-summary-body">
          <div
            className="learn-summary-bar"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${config.name} progress`}
          >
            <span className="learn-summary-fill" style={{ width: `${percent}%` }} />
          </div>
          <p className="learn-summary-note">
            {nextTopic
              ? `${getTopicStatus(nextTopic.id) === 'in_progress' ? 'Continue' : 'Next up'}: ${nextTopic.title} · ${formatDuration(remainingMinutes)} of study left`
              : `Track complete · all ${topics.length} topics learned`}
          </p>
        </div>
      </section>

      <div className="learn-toolbar">
        <div className="learn-filters" role="group" aria-label="Filter topics">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`learn-filter ${filter === id ? 'is-active' : ''}`}
              aria-pressed={filter === id}
            >
              {label}
              <span className="learn-filter-count">{counts[id]}</span>
            </button>
          ))}
        </div>
        <p className="learn-toolbar-note">
          {filteredTopics.length} of {topics.length} shown
        </p>
      </div>

      <div className="learn-section-head">
        <h2>Topics</h2>
        <p>In order — each topic unlocks when the one before it is learned.</p>
      </div>

      {filteredTopics.length === 0 ? (
        <div className="learn-empty">
          <p>No topics match this filter yet.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFilter('all')}>
            Show all {topics.length} topics
          </button>
        </div>
      ) : (
        <div className="topic-grid">
          {filteredTopics.map((topic) => {
            const position = topics.indexOf(topic);
            const status = getTopicStatus(topic.id);
            const prerequisite = position > 0 ? topics[position - 1] : null;
            const isLocked = Boolean(prerequisite) && getTopicStatus(prerequisite.id) !== 'completed';
            const isNext = nextTopic?.id === topic.id;

            return (
              <TopicTile
                key={topic.id}
                topic={topic}
                position={position}
                status={status}
                isLocked={isLocked}
                isNext={isNext}
                prerequisite={prerequisite}
                onOpen={() => setSelectedTopic(topic)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopicTile({ topic, position, status, isLocked, isNext, prerequisite, onOpen }) {
  const stateLabel = STATUS_LABEL[status];
  const action = status === 'completed' ? 'Review guide'
    : status === 'in_progress' ? 'Continue guide'
      : 'Open guide';

  const ariaLabel = isLocked
    ? `${topic.title}. Locked until you learn ${prerequisite.title}.`
    : `${topic.title}. ${stateLabel || 'Not started'}. ${topic.estimated} minutes.`;

  return (
    <button
      type="button"
      className={[
        'topic-tile',
        status === 'completed' ? 'is-learned' : '',
        isLocked ? 'is-locked' : '',
        isNext ? 'is-next' : '',
      ].filter(Boolean).join(' ')}
      onClick={onOpen}
      disabled={isLocked}
      aria-label={ariaLabel}
    >
      <span className="topic-tile-head">
        <span className="topic-position">{String(position + 1).padStart(2, '0')}</span>
        <span className={`topic-difficulty is-${topic.difficulty}`}>{topic.difficulty}</span>
        {status === 'completed' && (
          <span className="topic-state is-learned">
            <CheckCircle2 size={13} aria-hidden="true" />
            Learned
          </span>
        )}
        {status === 'in_progress' && (
          <span className="topic-state is-progress">
            <CircleDot size={13} aria-hidden="true" />
            In progress
          </span>
        )}
        {isNext && status !== 'in_progress' && (
          <span className="topic-state is-next">Next up</span>
        )}
        {isLocked && (
          <span className="topic-state is-locked">
            <Lock size={13} aria-hidden="true" />
          </span>
        )}
      </span>

      <span className="topic-tile-title">{topic.title}</span>

      <span className="topic-tile-meta">
        <Clock size={13} aria-hidden="true" />
        {topic.estimated} min
      </span>

      <span className="topic-tile-foot">
        {isLocked ? (
          <>
            <Lock size={12} aria-hidden="true" />
            After {prerequisite.title}
          </>
        ) : (
          <>
            {action}
            <ArrowRight size={14} className="topic-tile-arrow" aria-hidden="true" />
          </>
        )}
      </span>
    </button>
  );
}
