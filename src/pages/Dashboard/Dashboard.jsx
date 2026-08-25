import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects, deleteSubject, getSubjectProgress, getUnitsForSubject, getAllQuestionBanks } from '../../data/repository';
import { db } from '../../data/db';
import { Search, Calendar, ChevronRight, MoreHorizontal, Play, BookOpen, FileText, BarChart2, Plus, Award, Activity } from 'lucide-react';
import StudyPlanner from '../StudyPlanner/StudyPlanner';
import BookmarksPage from '../BookmarksPage/BookmarksPage';
import GamificationDashboard from '../../components/GamificationDashboard/GamificationDashboard';
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
              <button className="btn btn-primary" onClick={() => navigate('/create')} style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Plus size={18} /> New Subject
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
             {/* Jump Back In */}
             <div className="surface-card" style={{ padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate(subjects.length > 0 ? `/subject/${subjects[0].id}` : '/create')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                   <div style={{ background: 'var(--bg-surface-active)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                      <Play size={28} color="var(--accent-primary)" style={{ marginLeft: '4px' }} />
                   </div>
                   <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Jump Back In</div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0' }}>{subjects.length > 0 ? subjects[0].title : 'Create a Subject'}</h2>
                   </div>
                </div>
                <ChevronRight size={24} color="var(--text-secondary)" />
             </div>
             
             {/* Stats Card */}
             <div className="surface-card" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                   <BookOpen size={24} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                   <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>{stats.totalUnits}</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>Subjects</div>
                </div>
                <div style={{ width: '1px', height: '60px', background: 'var(--border-strong)', display: 'none' }}></div>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                   <Award size={24} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                   <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>{stats.avgProgress}%</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>Avg Progress</div>
                </div>
             </div>
             
             {/* Gamification Dashboard */}
             <div style={{ gridColumn: '1 / -1' }}>
               <GamificationDashboard userId="guest" />
             </div>

             {/* Analytics Dashboard */}
             <div className="surface-card analytics-panel" style={{ gridColumn: '1 / -1', padding: '24px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                 <Activity size={24} color="var(--accent-primary)" />
                 <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Study Analytics</h2>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                 {/* 7-Day Study Time Chart */}
                 <div>
                   <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Study Time (Last 7 Days)</h3>
                   <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '8px', paddingBottom: '24px', borderBottom: '1px solid var(--border-glass)', position: 'relative' }}>
                     {analytics.weekData.map((day, idx) => {
                       const maxMins = Math.max(...analytics.weekData.map(d => d.minutes), 60);
                       const heightPct = Math.min((day.minutes / maxMins) * 100, 100);
                       return (
                         <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                           <div style={{ 
                             width: '100%', 
                             background: 'linear-gradient(to top, var(--accent-brand), var(--accent-primary))',
                             height: `${heightPct}%`,
                             minHeight: day.minutes > 0 ? '4px' : '0',
                             borderRadius: '4px 4px 0 0',
                             transition: 'height 0.3s ease'
                           }}></div>
                           <span style={{ position: 'absolute', bottom: '0', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '4px' }}>{day.dayName}</span>
                         </div>
                       );
                     })}
                   </div>
                 </div>

                 {/* Mock Exam Average */}
                 <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Mock Exam Performance</h3>
                    <div style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', 
                        background: `conic-gradient(var(--accent-primary) ${analytics.mockAvg * 3.6}deg, var(--bg-hover) 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{analytics.mockAvg}%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Average Score</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Across all subjects</div>
                      </div>
                    </div>
                 </div>
               </div>
             </div>

           </div>


         </div>
       )}

       {isMobile && !loading && (
         <div className="mobile-dashboard-extensions">
           <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-glass)' }}>
             <StudyPlanner />
           </div>
           <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-glass)' }}>
             <BookmarksPage />
           </div>
         </div>
       )}
    </div>
  );
}
