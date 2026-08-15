import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects, deleteSubject, getSubjectProgress, getUnitsForSubject, getAllQuestionBanks } from '../../data/repository';
import { Search, Calendar, ChevronRight, MoreHorizontal, Play, Book, FileText, BarChart2, Plus, Award } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [qbanks, setQbanks] = useState([]);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({ totalUnits: 0, avgProgress: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <div className="loading-container" style={{ height: '50vh' }}>
          <div className="spinner spinner-lg"></div>
        </div>
      ) : (
        <div className="dashboard-grid">
          
          {/* Hero Banner */}
          <div className="surface-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center', padding: '32px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Good <span style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>afternoon</span>
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
                   <Book size={24} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
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
          </div>


        </div>
      )}
    </div>
  );
}
