import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects, getSubjectsProgress, getAllQuestionBanks } from '../../data/repository';
import { db } from '../../data/db';
import { Search, ChevronRight, Play, BookOpen, FileText, Plus, Award, Activity } from 'lucide-react';
import GamificationDashboard from '../../components/GamificationDashboard/GamificationDashboard';
import PomodoroTimer from '../../components/PomodoroTimer/PomodoroTimer';
import './Dashboard.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [qbanks, setQbanks] = useState([]);
  const [stats, setStats] = useState({ totalUnits: 0, avgProgress: 0 });
  const [analytics, setAnalytics] = useState({ weekData: [], mockAvg: 0 });
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

  const loadSubjects = async () => {
    setLoading(true);
    const [subs, allQbanks] = await Promise.all([getAllSubjects(), getAllQuestionBanks()]);
    setSubjects(subs);
    setQbanks(allQbanks);

    const progress = await getSubjectsProgress(subs.map(s => s.id));
    const totalProgressSum = Object.values(progress).reduce((sum, p) => sum + p, 0);

    setStats({
      totalUnits: subs.length,
      avgProgress: subs.length > 0 ? Math.round(totalProgressSum / subs.length) : 0
    });

    // Load Analytics Data
    try {
      const exams = await db.mock_exams.toArray();
      const avgScore = exams.length > 0 
        ? Math.round(exams.reduce((sum, e) => sum + (e.score || 0), 0) / exams.length)
        : 0;
      
      const sessions = await db.study_sessions.toArray();
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          dateStr: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          minutes: 0
        };
      });
      
      sessions.forEach(s => {
        const dStr = new Date(s.created_at).toISOString().split('T')[0];
        const day = last7Days.find(d => d.dateStr === dStr);
        if (day) day.minutes += (s.duration_minutes || 0);
      });

      setAnalytics({ weekData: last7Days, mockAvg: avgScore });
    } catch (err) {
      console.error('Analytics load error:', err);
    }

    setLoading(false);
  };

  useEffect(() => { loadSubjects(); }, []);

  const maxStudyMinutes = Math.max(...analytics.weekData.map(d => d.minutes), 60);

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '24px', marginBottom: '40px' }}>
             <div className="skeleton" style={{ height: '120px' }}></div>
             <div className="skeleton" style={{ height: '120px' }}></div>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '24px', marginBottom: '40px' }}>
             {/* Jump Back In */}
             <button
                type="button"
                className="surface-card premium-card jump-card card-button"
                onClick={() => navigate(subjects.length > 0 ? `/subject/${subjects[0].id}` : '/create')}
             >
                <span className="hover-glow" aria-hidden="true"></span>
                <span className="jump-card-content">
                   <span className="jump-icon-box">
                      <Play size={28} style={{ marginLeft: '4px' }} fill="currentColor" aria-hidden="true" />
                   </span>
                   <span>
                      <span className="jump-eyebrow">Jump back in</span>
                      <span className="jump-title">{subjects.length > 0 ? subjects[0].title : 'Create a subject'}</span>
                   </span>
                </span>
                <ChevronRight size={24} className="jump-chevron" aria-hidden="true" />
             </button>
             
             {/* Stats Cards */}
             <div className="stats-grid">
                <div className="surface-card premium-card stat-card">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                         <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Total Subjects</div>
                         <div className="stat-value tabular-nums">
                            {stats.totalUnits}
                         </div>
                      </div>
                      <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', flexShrink: 0 }}>
                         <BookOpen size={24} />
                      </div>
                   </div>
                </div>
                
                <div className="surface-card premium-card stat-card">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                         <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Avg Progress</div>
                         <div className="stat-value tabular-nums">
                            {stats.avgProgress}%
                         </div>
                      </div>
                      <div className="stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', flexShrink: 0 }}>
                         <Award size={24} />
                      </div>
                   </div>
                   <div className="stat-progress-track" style={{ marginTop: '16px' }}>
                      <div className="stat-progress-bar" style={{ width: `${stats.avgProgress}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
                   </div>
                </div>
             </div>
             
             {/* Gamification Dashboard */}
             <div style={{ gridColumn: '1 / -1' }}>
               <GamificationDashboard userId="guest" />
             </div>

             {/* Analytics Dashboard */}
             <div className="surface-card premium-card analytics-panel">
               <div className="analytics-header">
                 <Activity size={24} className="analytics-icon" aria-hidden="true" />
                 <h2>Study Analytics</h2>
               </div>
               
               <div className="analytics-grid">
                 {/* 7-Day Study Time Chart */}
                 <div className="analytics-chart-container">
                   <h3>Study Time (Last 7 Days)</h3>
                   <div className="bar-chart-wrapper">
                      {analytics.weekData.map((day) => {
                        const heightPct = Math.min((day.minutes / maxStudyMinutes) * 100, 100);
                        return (
                          <div key={day.dateStr} className="bar-column">
                            <div className="bar-fill-wrapper">
                              <div 
                                className="bar-fill" 
                                style={{ height: `${heightPct}%`, minHeight: day.minutes > 0 ? '4px' : '0' }}
                              >
                                 <span className="bar-tooltip">{day.minutes} min</span>
                              </div>
                            </div>
                            <span className="bar-label">{day.dayName}</span>
                          </div>
                        );
                      })}
                   </div>
                 </div>

                 {/* Mock Exam Average */}
                 <div className="analytics-performance-container">
                    <h3>Mock Exam Performance</h3>
                    <div className="performance-card">
                      <div className="radial-progress-wrapper" style={{ background: `conic-gradient(var(--accent-primary) ${analytics.mockAvg * 3.6}deg, var(--bg-hover) 0deg)` }}>
                        <div className="radial-progress-inner">
                          <span>{analytics.mockAvg}%</span>
                        </div>
                      </div>
                      <div className="performance-info">
                        <div className="performance-title">Average Score</div>
                        <div className="performance-subtitle">Across all subjects</div>
                      </div>
                    </div>
                 </div>
               </div>
             </div>

           </div>
         </div>
       )}
    </div>
  );
}
