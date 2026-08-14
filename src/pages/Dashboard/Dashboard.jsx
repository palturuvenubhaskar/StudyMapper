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
          
          {/* Old Hero Layout updated with Glassmorphism */}
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 40px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Good <span style={{ color: 'var(--accent-primary)' }}>afternoon</span></h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Here's what's happening with your studies today.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-ghost" onClick={() => navigate('/qb/create')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> Upload Bank
              </button>
              <button className="btn-primary" onClick={() => navigate('/create')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> New Subject
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
             <div className="glass-panel" style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate(subjects.length > 0 ? `/subject/${subjects[0].id}` : '/create')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                   <div style={{ background: 'var(--bg-surface-active)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                      <Play size={28} color="var(--accent-primary)" style={{ marginLeft: '4px' }} />
                   </div>
                   <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Jump Back In</div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{subjects.length > 0 ? subjects[0].title : 'Create a Subject'}</h2>
                   </div>
                </div>
                <ChevronRight size={24} color="var(--text-secondary)" />
             </div>
             
             <div className="glass-panel" style={{ padding: '32px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                   <Book size={24} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                   <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.totalUnits}</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subjects</div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--border-light)' }}></div>
                <div style={{ textAlign: 'center' }}>
                   <BarChart2 size={24} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                   <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{subjects.reduce((sum, s) => sum + 6, 0)}</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Units</div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--border-light)' }}></div>
                <div style={{ textAlign: 'center' }}>
                   <Award size={24} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                   <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.avgProgress}%</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Avg Progress</div>
                </div>
             </div>
          </div>


        </div>
      )}
    </div>
  );
}
