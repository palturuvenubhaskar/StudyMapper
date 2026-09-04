import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects, deleteSubject, getSubjectProgress, getUnitsForSubject, getAllQuestionBanks } from '../../data/repository';
import { db } from '../../data/db';
import { Search, Calendar, ChevronRight, MoreHorizontal, Play, BookOpen, FileText, BarChart2, Plus, Award, Activity } from 'lucide-react';
import StudyPlanner from '../StudyPlanner/StudyPlanner';
import BookmarksPage from '../BookmarksPage/BookmarksPage';
import GamificationDashboard from '../../components/GamificationDashboard/GamificationDashboard';
import PomodoroTimer from '../../components/PomodoroTimer/PomodoroTimer';
import './Dashboard.css';

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [qbanks, setQbanks] = useState([]);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({ totalUnits: 0, avgProgress: 0 });
  const [analytics, setAnalytics] = useState({ weekData: [], mockAvg: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    const subs = await getAllSubjects();
    const sortedSubs = [...subs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setSubjects(sortedSubs);
    
    const allQbanks = await getAllQuestionBanks();
    const sortedQbanks = [...allQbanks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setQbanks(sortedQbanks);
    
    const prog = {};
    let totalProgressSum = 0;
    
    for (const s of subs) {
      const p = await getSubjectProgress(s.id);
      prog[s.id] = p;
      totalProgressSum += p || 0;
    }
    
    setProgress(prog);
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

  return (
    <div className="dashboard-content">
      {/* Top Search Bar */}
      <div className="dashboard-top-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search" className="search-input-fluid" onClick={() => navigate('/search')} />
        </div>
      </div>

      {loading ? (
        <div className="dashboard-grid" style={{ padding: '2rem' }}>
          <div className="skeleton" style={{ height: '140px', marginBottom: '24px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
             <div className="skeleton" style={{ height: '120px' }}></div>
             <div className="skeleton" style={{ height: '120px' }}></div>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          
          {/* Hero Banner */}
          <div className="surface-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center', padding: '32px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Good <span style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>afternoon</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Here's what's happening with your studies today.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%', maxWidth: '400px' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/qb/create')} style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FileText size={18} /> Upload Bank
              </button>
              <button className="btn btn-gradient" onClick={() => navigate('/create')} style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Plus size={18} /> New Subject
              </button>
            </div>
          </div>

          {/* Mobile Subjects & Question Banks */}
          {isMobile && (
            <div className="mobile-only-section" style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <PomodoroTimer />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Your Subjects</h3>
                <button className="btn-ghost btn-sm" onClick={() => navigate('/create')} style={{ color: 'var(--accent)', fontWeight: '600', padding: '4px 8px', borderRadius: '6px' }}>More</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {subjects.slice(0, 4).map(sub => (
                  <div key={sub.id} className="surface-card premium-card" style={{ padding: '20px 16px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate(`/subject/${sub.id}`)}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.title}</div>
                  </div>
                ))}
                {subjects.length === 0 && <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>No subjects yet.</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Question Banks</h3>
                <button className="btn-ghost btn-sm" onClick={() => navigate('/qb/create')} style={{ color: 'var(--accent)', fontWeight: '600', padding: '4px 8px', borderRadius: '6px' }}>More</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                {qbanks.slice(0, 4).map(qb => (
                  <div key={qb.id} className="surface-card premium-card" style={{ padding: '20px 16px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate(`/qb/${qb.id}`)}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <FileText size={24} style={{ color: 'var(--accent-brand)' }} />
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qb.title}</div>
                  </div>
                ))}
                {qbanks.length === 0 && <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>No question banks yet.</div>}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
             {/* Jump Back In */}
             <div className="surface-card premium-card jump-card" onClick={() => navigate(subjects.length > 0 ? `/subject/${subjects[0].id}` : '/create')}>
                <div className="hover-glow"></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
                   <div className="jump-icon-box">
                      <Play size={28} style={{ marginLeft: '4px' }} fill="currentColor" />
                   </div>
                   <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-brand)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Jump Back In</div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0', lineHeight: '1.2' }}>{subjects.length > 0 ? subjects[0].title : 'Create a Subject'}</h2>
                   </div>
                </div>
                <ChevronRight size={24} className="jump-chevron" style={{ position: 'relative', zIndex: 1 }} />
             </div>
             
             {/* Stats Cards */}
             <div className="stats-grid">
                <div className="surface-card premium-card stat-card">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                         <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Total Subjects</div>
                         <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
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
                         <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
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
                 <Activity size={24} className="analytics-icon" />
                 <h2>Study Analytics</h2>
               </div>
               
               <div className="analytics-grid">
                 {/* 7-Day Study Time Chart */}
                 <div className="analytics-chart-container">
                   <h3>Study Time (Last 7 Days)</h3>
                   <div className="bar-chart-wrapper">
                     {analytics.weekData.map((day, idx) => {
                       const maxMins = Math.max(...analytics.weekData.map(d => d.minutes), 60);
                       const heightPct = Math.min((day.minutes / maxMins) * 100, 100);
                       return (
                         <div key={idx} className="bar-column">
                           <div className="bar-fill-wrapper">
                             <div 
                               className="bar-fill" 
                               style={{ height: `${heightPct}%`, minHeight: day.minutes > 0 ? '4px' : '0' }}
                             >
                                <span className="bar-tooltip">{day.minutes}m</span>
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
