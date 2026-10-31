import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects, getSubjectsProgress, getAllQuestionBanks } from '../../data/repository';
import { db } from '../../data/db';
import { Search, Play, BookOpen, FileText, Plus, Award, Activity, Timer } from 'lucide-react';
import GamificationDashboard from '../../components/GamificationDashboard/GamificationDashboard';
import PomodoroTimer from '../../components/PomodoroTimer/PomodoroTimer';
import './Dashboard.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function getProgressCaption(progress) {
  if (progress <= 0) return 'No topics studied yet';
  if (progress < 25) return 'Just getting started';
  if (progress < 50) return 'Building momentum';
  if (progress < 75) return 'Halfway there';
  if (progress < 100) return 'Almost there';
  return 'Every topic studied';
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [qbanks, setQbanks] = useState([]);
  const [stats, setStats] = useState({ totalUnits: 0, avgProgress: 0, resumeProgress: 0 });
  const [analytics, setAnalytics] = useState({ weekData: [], mockAvg: 0, mockCount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const greeting = getGreeting();
  const shortcutLabel = /mac/i.test(navigator.platform) ? '⌘K' : 'Ctrl K';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadAnalytics = async () => {
    try {
      const exams = await db.mock_exams.toArray();
      const avgScore = exams.length > 0
        ? Math.round(exams.reduce((sum, e) => sum + (e.score || 0), 0) / exams.length)
        : 0;

      const sessions = await db.study_sessions.toArray();
      const dayKey = (value) => {
        const d = new Date(value);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      };
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          dateStr: dayKey(d),
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          minutes: 0,
        };
      });

      sessions.forEach(s => {
        if (s.completed === 0) return;
        const day = last7Days.find(d => d.dateStr === dayKey(s.created_at));
        if (day) day.minutes += (s.duration_minutes || 0);
      });

      setAnalytics({ weekData: last7Days, mockAvg: avgScore, mockCount: exams.length });
    } catch (err) {
      console.error('Analytics load error:', err);
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    const [subs, allQbanks] = await Promise.all([getAllSubjects(), getAllQuestionBanks()]);
    setSubjects(subs);
    setQbanks(allQbanks);

    const progress = await getSubjectsProgress(subs.map(s => s.id));
    const progressValues = Object.values(progress);
    const totalProgressSum = progressValues.reduce((sum, p) => sum + p, 0);

    setStats({
      totalUnits: subs.length,
      avgProgress: subs.length > 0 ? Math.round(totalProgressSum / subs.length) : 0,
      resumeProgress: subs.length > 0 ? progress[subs[0].id] ?? 0 : 0,
    });

    await loadAnalytics();
    setLoading(false);
  };

  useEffect(() => { loadSubjects(); }, []);

  // Keep the weekly focus chart honest when a session finishes on this page.
  useEffect(() => {
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(loadAnalytics, 150);
    };
    window.addEventListener('studymapper:xp', refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('studymapper:xp', refresh);
    };
  }, []);

  const maxStudyMinutes = Math.max(...analytics.weekData.map(d => d.minutes), 30);
  const weekMinutes = analytics.weekData.reduce((sum, d) => sum + d.minutes, 0);
  const avgMinutes = Math.round(weekMinutes / 7);
  const resumeSubject = subjects[0];
  const resumeProgress = resumeSubject ? stats.resumeProgress : 0;
  const resumeTitle = resumeSubject ? resumeSubject.title : 'Create your first subject';
  const resumeMeta = !resumeSubject
    ? 'Your first study map starts here.'
    : resumeProgress > 0
      ? `${resumeProgress}% of topics studied`
      : 'No topics studied yet';
  const avgProgressCaption = stats.totalUnits === 0
    ? 'Add a subject to begin'
    : getProgressCaption(stats.avgProgress);

  return (
    <div className="dashboard-content">
      {/* Top Search Bar */}
      <div className="dashboard-top-bar">
        <button
          type="button"
          className="search-trigger"
          onClick={() => navigate('/search')}
          aria-label="Search subjects, topics and notes"
        >
          <Search size={18} className="search-icon" aria-hidden="true" />
          <span className="search-trigger-text">Search subjects, topics and notes…</span>
          <kbd className="search-trigger-kbd">{shortcutLabel}</kbd>
        </button>
      </div>

      {loading ? (
        <div className="dashboard-grid" style={{ padding: '2rem' }}>
          <div className="skeleton" style={{ height: '140px', marginBottom: '24px' }}></div>
          <div className="dashboard-snapshot">
            <div className="skeleton" style={{ height: '232px' }}></div>
            <div className="skeleton" style={{ height: '232px' }}></div>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          
          {/* Hero Banner */}
          <section className="surface-card dashboard-hero">
            <div className="dashboard-hero-copy">
              <p className="dashboard-eyebrow">Your study workspace</p>
              <h1 className="dashboard-title">
                Good <span className="dashboard-title-accent">{greeting}</span>
              </h1>
              <p className="dashboard-subtitle">
                {subjects.length > 0
                  ? 'Pick up where you left off or start something new.'
                  : 'Create your first subject to start mapping your learning.'}
              </p>
            </div>
            <div className="dashboard-hero-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/qb/create')}>
                <FileText size={18} aria-hidden="true" /> Upload Bank
              </button>
              <button type="button" className="btn btn-gradient" onClick={() => navigate('/create')}>
                <Plus size={18} aria-hidden="true" /> New Subject
              </button>
            </div>
          </section>

          {/* Mobile Subjects & Question Banks */}
          {isMobile && (
            <div className="mobile-only-section" style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <PomodoroTimer />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Your Subjects</h3>
                <button type="button" className="btn-ghost btn-sm dashboard-more-btn" onClick={() => navigate('/create')}>New</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {subjects.slice(0, 4).map(sub => (
                  <button
                    type="button"
                    key={sub.id}
                    className="surface-card premium-card dashboard-tile"
                    onClick={() => navigate(`/subject/${sub.id}`)}
                  >
                    <span className="dashboard-tile-icon">
                      <BookOpen size={24} aria-hidden="true" />
                    </span>
                    <span className="dashboard-tile-title">{sub.title}</span>
                  </button>
                ))}
                {subjects.length === 0 && <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>No subjects yet.</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Question Banks</h3>
                <button type="button" className="btn-ghost btn-sm dashboard-more-btn" onClick={() => navigate('/qb/create')}>New</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                {qbanks.slice(0, 4).map(qb => (
                  <button
                    type="button"
                    key={qb.id}
                    className="surface-card premium-card dashboard-tile"
                    onClick={() => navigate(`/qb/${qb.id}`)}
                  >
                    <span className="dashboard-tile-icon">
                      <FileText size={24} aria-hidden="true" />
                    </span>
                    <span className="dashboard-tile-title">{qb.title}</span>
                  </button>
                ))}
                {qbanks.length === 0 && <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>No question banks yet.</div>}
              </div>
            </div>
          )}

          <section className="dashboard-snapshot" aria-label="Learning snapshot">
            {/* Resume card */}
            <button
              type="button"
              className="resume-card card-button"
              onClick={() => navigate(resumeSubject ? `/subject/${resumeSubject.id}` : '/create')}
              aria-label={resumeSubject ? `Continue learning ${resumeSubject.title}, ${resumeProgress}% studied` : 'Create your first subject'}
            >
              {resumeSubject && (
                <span className="resume-initial" aria-hidden="true">
                  {resumeSubject.title.trim().charAt(0).toUpperCase()}
                </span>
              )}
              <span className="resume-kicker">
                <span className="resume-signal" aria-hidden="true" />
                {resumeSubject ? 'Continue learning' : 'Start here'}
              </span>
              <span className="resume-main">
                <span className="resume-copy">
                  <span className="resume-title" title={resumeTitle}>{resumeTitle}</span>
                  <span className="resume-meta">{resumeMeta}</span>
                </span>
                <span className="resume-action" aria-hidden="true">
                  <Play size={20} fill="currentColor" />
                </span>
              </span>
              <span className="resume-footer">
                <span className="resume-progress-track" aria-hidden="true">
                  <span className="resume-progress-fill" style={{ width: `${resumeProgress}%` }} />
                </span>
                <span className="resume-progress-value tabular-nums">{resumeProgress}%</span>
              </span>
            </button>

            {/* Average progress */}
            <div className="metric-card surface-card">
              <div className="metric-top">
                <span className="metric-label">Avg progress</span>
                <Award size={18} className="metric-icon metric-icon--amber" aria-hidden="true" />
              </div>
              <div className="metric-readout">
                <span className="metric-value tabular-nums">
                  {stats.avgProgress}<span className="metric-value-suffix">%</span>
                </span>
              </div>
              <div className="metric-progress">
                <span className="metric-progress-track" aria-hidden="true">
                  <span
                    className="metric-progress-fill"
                    style={{
                      width: `${stats.avgProgress}%`,
                      minWidth: stats.avgProgress > 0 ? '6px' : '0',
                    }}
                  />
                </span>
                <p className="metric-caption">{avgProgressCaption}</p>
              </div>
            </div>
          </section>

          {/* Gamification Dashboard */}
          <div>
            <GamificationDashboard userId="guest" />
          </div>

          {/* Analytics Dashboard */}
          <div className="surface-card premium-card analytics-panel">
            <div className="analytics-header">
              <div className="analytics-heading">
                <span className="analytics-icon-chip" aria-hidden="true">
                  <Activity size={18} />
                </span>
                <div>
                  <h2>Study analytics</h2>
                  <p className="analytics-subtitle">How your last seven days are shaping up</p>
                </div>
              </div>
              <span className="analytics-range">Last 7 days</span>
            </div>

            <div className="analytics-grid">
              {/* 7-Day Study Time Chart */}
              <section className="analytics-chart-container" aria-label="Focus time over the last 7 days">
                <div className="analytics-stat-head">
                  <div>
                    <span className="analytics-stat-label">Focus time</span>
                    <div className="analytics-stat-value">
                      {weekMinutes}<span className="analytics-stat-unit">min</span>
                    </div>
                  </div>
                  <span className="analytics-stat-meta">{avgMinutes} min/day avg</span>
                </div>

                <div className="focus-chart">
                  <div className="focus-chart-grid" aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                  <div className="focus-chart-columns">
                    {analytics.weekData.map((day, idx) => {
                      const heightPct = Math.min((day.minutes / maxStudyMinutes) * 100, 100);
                      const isToday = idx === analytics.weekData.length - 1;
                      return (
                        <div
                          key={day.dateStr}
                          className={`focus-column ${isToday ? 'is-today' : ''}`}
                        >
                          <div className="focus-bar-track">
                            <div
                              className="focus-bar-fill"
                              style={{ height: `${heightPct}%`, minHeight: day.minutes > 0 ? '4px' : '0' }}
                            >
                              <span className="focus-bar-tooltip">{day.minutes} min</span>
                            </div>
                          </div>
                          <span className="focus-day-label">{day.dayName}</span>
                        </div>
                      );
                    })}
                  </div>
                  {weekMinutes === 0 && (
                    <div className="focus-chart-empty">
                      <Timer size={16} aria-hidden="true" />
                      <span>No focus sessions yet</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Mock Exam Average */}
              <section className="analytics-performance-container" aria-label="Mock exam performance">
                <div className="analytics-stat-head">
                  <div>
                    <span className="analytics-stat-label">Mock exams</span>
                    <div className="analytics-stat-value">
                      {analytics.mockAvg}<span className="analytics-stat-unit">%</span>
                    </div>
                  </div>
                  <span className="analytics-stat-meta">
                    {analytics.mockCount} taken
                  </span>
                </div>

                <div className="performance-card">
                  <div
                    className="radial-progress-wrapper"
                    style={{
                      background: `conic-gradient(#38bdf8 ${analytics.mockAvg * 3.6}deg, var(--border-strong) ${analytics.mockAvg * 3.6}deg)`,
                    }}
                  >
                    <div className="radial-progress-inner">
                      <span>{analytics.mockAvg}%</span>
                    </div>
                  </div>
                  <div className="performance-info">
                    <div className="performance-title">Average score</div>
                    <div className="performance-subtitle">
                      {analytics.mockCount === 0
                        ? 'Take a mock exam to set a baseline.'
                        : `Across ${analytics.mockCount} mock exam${analytics.mockCount === 1 ? '' : 's'}.`}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

         </div>
       )}
    </div>
  );
}
