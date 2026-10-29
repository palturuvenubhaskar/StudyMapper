import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { BookOpen, Target, Play, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  PLACEMENT_TRACKS,
  TRACKS_BY_ID,
  TOPICS_BY_FULL_ID,
  TOTAL_TOPIC_COUNT,
  topicFullId,
} from './placementCatalog';
import './Placement.css';

const EMPTY_DATA = {
  tracks: {},
  learned: 0,
  tests: 0,
  avgScore: null,
  bookmarks: 0,
  recentTests: [],
  nextStep: { to: '/placement/aptitude/learn', label: 'Start with aptitude' },
};

function percentOf(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function scoreOf(result) {
  if (!result?.total_questions) return 0;
  return Math.round((result.score / result.total_questions) * 100);
}

function timestampOf(value) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function plural(count, singular, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

function buildNextStep(progress) {
  if (!progress?.length) {
    return { to: '/placement/aptitude/learn', label: 'Start with aptitude' };
  }

  const latest = [...progress].sort(
    (a, b) => timestampOf(b.last_studied_at) - timestampOf(a.last_studied_at)
  )[0];
  const match = TOPICS_BY_FULL_ID[latest.topic_id];
  if (!match) {
    return { to: '/placement/aptitude/learn', label: 'Start with aptitude' };
  }

  // A finished topic should hand off to the next unfinished one in its track
  // instead of reopening the page the learner just completed.
  if (latest.status !== 'completed') {
    return {
      to: `/placement/${match.trackId}/learn/${match.topic.id}`,
      label: `Continue: ${match.topic.title}`,
    };
  }

  const completed = new Set(
    progress.filter((p) => p.status === 'completed').map((p) => p.topic_id)
  );
  const track = TRACKS_BY_ID[match.trackId];
  const next = track?.topics.find(
    (topic) => !completed.has(topicFullId(track.id, topic.id))
  );

  if (next) {
    return {
      to: `/placement/${match.trackId}/learn/${next.id}`,
      label: `Next: ${next.title}`,
    };
  }

  return {
    to: `/placement/${match.trackId}/learn/${match.topic.id}`,
    label: `Review: ${match.topic.title}`,
  };
}

export default function Placement() {
  useDocumentTitle('Placement Prep');

  // One query for every number on the page. Track progress is measured against
  // the catalog, not the (never populated) placement_topics table.
  const data = useLiveQuery(async () => {
    const [progress, results, bookmarks] = await Promise.all([
      db.placement_learning_progress.toArray(),
      db.placement_test_results.toArray(),
      db.placement_bookmarks.toArray(),
    ]);

    const completedIds = new Set(
      progress.filter((p) => p.status === 'completed').map((p) => p.topic_id)
    );

    const tracks = {};
    PLACEMENT_TRACKS.forEach((track) => {
      const learned = track.topics.filter((topic) =>
        completedIds.has(topicFullId(track.id, topic.id))
      ).length;
      const trackResults = results.filter((r) => r.category === track.id);
      const scores = trackResults.map(scoreOf);

      tracks[track.id] = {
        learned,
        total: track.topics.length,
        percent: percentOf(learned, track.topics.length),
        tests: trackResults.length,
        avgScore: scores.length
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
          : null,
      };
    });

    const allScores = results.map(scoreOf);

    return {
      tracks,
      learned: Object.values(tracks).reduce((sum, track) => sum + track.learned, 0),
      tests: results.length,
      avgScore: allScores.length
        ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
        : null,
      bookmarks: bookmarks.length,
      recentTests: [...results]
        .sort((a, b) => timestampOf(b.created_at) - timestampOf(a.created_at))
        .slice(0, 3),
      nextStep: buildNextStep(progress),
    };
  }, []);

  const view = data || EMPTY_DATA;
  const nextStep = view.nextStep;

  return (
    <div className="placement-hub">
      <header className="placement-head">
        <div className="placement-head-copy">
          <p className="placement-eyebrow">Interview preparation</p>
          <h1>Placement Prep</h1>
          <p className="placement-subtitle">
            Learn a concept, then prove it in a test. Three tracks cover the rounds most
            companies run.
          </p>
        </div>

        <Link className="placement-cta" to={nextStep.to} title={nextStep.label}>
          <Play size={14} fill="currentColor" aria-hidden="true" />
          <span className="placement-cta-label">{nextStep.label}</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <div className="placement-status" aria-label="Overall preparation">
        <div className="placement-status-item">
          <span className="placement-status-value">
            {view.learned}
            <span className="placement-status-total">/{TOTAL_TOPIC_COUNT}</span>
          </span>
          <span className="placement-status-label">Topics learned</span>
        </div>
        <span className="placement-status-divider" aria-hidden="true" />
        <div className="placement-status-item">
          <span className="placement-status-value">{view.tests}</span>
          <span className="placement-status-label">Tests taken</span>
        </div>
        <span className="placement-status-divider" aria-hidden="true" />
        <div className="placement-status-item">
          <span className="placement-status-value">
            {view.avgScore === null ? '—' : `${view.avgScore}%`}
          </span>
          <span className="placement-status-label">Average score</span>
        </div>
        {view.bookmarks > 0 && (
          <>
            <span className="placement-status-divider" aria-hidden="true" />
            <div className="placement-status-item">
              <span className="placement-status-value">{view.bookmarks}</span>
              <span className="placement-status-label">Saved topics</span>
            </div>
          </>
        )}
      </div>

      <section className="placement-tracks" aria-labelledby="placement-tracks-title">
        <div className="placement-section-head">
          <h2 id="placement-tracks-title">Learning tracks</h2>
          <p>Pick a track to start, or continue where you left off.</p>
        </div>

        <div className="placement-categories">
          {PLACEMENT_TRACKS.map((track) => (
            <TrackCard key={track.id} track={track} stats={view.tracks[track.id]} />
          ))}
        </div>
      </section>

      {view.recentTests.length > 0 && (
        <section className="placement-recent" aria-labelledby="placement-recent-title">
          <div className="placement-section-head">
            <h2 id="placement-recent-title">Recent tests</h2>
            <p>Your last three attempts across all tracks.</p>
          </div>

          <ul className="placement-recent-list">
            {view.recentTests.map((result) => {
              const track = PLACEMENT_TRACKS.find((t) => t.id === result.category);
              return (
                <li
                  key={result.id}
                  className="placement-recent-row"
                  style={{ '--track': track?.color || 'var(--accent-brand)' }}
                >
                  <span className="placement-recent-dot" aria-hidden="true" />
                  <span className="placement-recent-name">
                    {track?.shortName || result.category}
                  </span>
                  <span className="placement-recent-meta">
                    {plural(result.total_questions, 'question')}
                    {result.created_at ? ` · ${formatDate(result.created_at)}` : ''}
                  </span>
                  <span className="placement-recent-score">{scoreOf(result)}%</span>
                  <Link className="placement-recent-link" to={track?.testPath || '/placement'}>
                    Retake
                    <ChevronRight size={14} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function TrackCard({ track, stats }) {
  const Icon = track.icon;
  const learned = stats?.learned ?? 0;
  const total = stats?.total ?? track.topics.length;
  const percent = stats?.percent ?? 0;
  const tests = stats?.tests ?? 0;
  const avgScore = stats?.avgScore ?? null;
  const minutes = track.topics.reduce((sum, topic) => sum + topic.estimated, 0);
  const hours = Math.floor(minutes / 60);

  return (
    <article className="track-card" style={{ '--track': track.color }}>
      <div className="track-card-head">
        <span className="track-icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.9} />
        </span>
        <div className="track-title-wrap">
          <h3>{track.name}</h3>
          <span className="track-meta">
            {plural(total, 'topic')} · {hours}h {minutes % 60}m
          </span>
        </div>
        <span className="track-percent" aria-label={`${percent}% learned`}>
          {percent}
          <span className="track-percent-sign">%</span>
        </span>
      </div>

      <p className="track-desc">{track.description}</p>

      <div
        className="track-bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${track.name} learning progress`}
      >
        <span className="track-bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="track-stats">
        <div className="track-stat">
          <span className="track-stat-value">
            {learned}
            <span className="track-stat-total">/{total}</span>
          </span>
          <span className="track-stat-label">Learned</span>
        </div>
        <div className="track-stat">
          <span className="track-stat-value">{tests}</span>
          <span className="track-stat-label">Tests</span>
        </div>
        <div className="track-stat">
          <span className="track-stat-value">
            {avgScore === null ? '—' : `${avgScore}%`}
          </span>
          <span className="track-stat-label">Avg score</span>
        </div>
      </div>

      <div className="track-tags">
        {track.subcategories.slice(0, 2).map((sub) => (
          <span key={sub} className="track-tag">
            {sub}
          </span>
        ))}
        {track.subcategories.length > 2 && (
          <span className="track-tag track-tag-more">
            +{track.subcategories.length - 2}
          </span>
        )}
      </div>

      <div className="track-actions">
        <Link to={track.learnPath} className="track-btn track-btn-learn">
          <BookOpen size={16} aria-hidden="true" />
          Learn
        </Link>
        <Link to={track.testPath} className="track-btn track-btn-test">
          <Target size={16} aria-hidden="true" />
          Test
        </Link>
      </div>
    </article>
  );
}
