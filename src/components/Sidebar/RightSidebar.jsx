import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Grid, BookOpen, Calculator, Beaker, FileText } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { useAuth } from '../../context/AuthContext';
import './RightSidebar.css';

export default function RightSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];
  const qbanks = useLiveQuery(() => db.question_banks.toArray()) || [];
  
  // Pick a random icon for subjects based on name length for visual variety
  const getSubjectIcon = (title) => {
    const icons = [Grid, BookOpen, Calculator, Beaker, FileText];
    const index = title.length % icons.length;
    const Icon = icons[index];
    return <Icon size={20} />;
  };

  return (
    <aside className="right-sidebar">

      <div className="rs-section-header">
        <h3 className="rs-section-title">Your Subjects</h3>
        <button className="rs-section-link btn-ghost btn-sm" onClick={() => navigate('/create')}>
          More <ChevronRight size={14} />
        </button>
      </div>

      <div className="rs-courses-list">
        {subjects.slice(0, 4).map(sub => (
          <div key={sub.id} className="rs-course-item" onClick={() => navigate(`/subject/${sub.id}`)}>
            <div className="rs-course-icon">
              {getSubjectIcon(sub.title)}
            </div>
            <div className="rs-course-info">
              <span className="rs-course-title">{sub.title}</span>
            </div>
            <ChevronRight size={16} className="rs-course-arrow" />
          </div>
        ))}
        {subjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No subjects yet.
          </div>
        )}
      </div>

      <div className="rs-section-header" style={{ marginTop: '32px' }}>
        <h3 className="rs-section-title">Question Banks</h3>
        <button className="rs-section-link btn-ghost btn-sm" onClick={() => navigate('/qb/create')}>
          More <ChevronRight size={14} />
        </button>
      </div>

      <div className="rs-courses-list">
        {qbanks.slice(0, 4).map(qb => (
          <div key={qb.id} className="rs-course-item" onClick={() => navigate(`/qb/${qb.id}`)}>
            <div className="rs-course-icon" style={{ background: 'var(--bg-surface-active)' }}>
              <FileText size={20} color="var(--accent-primary)" />
            </div>
            <div className="rs-course-info">
              <span className="rs-course-title">{qb.title}</span>
            </div>
            <ChevronRight size={16} className="rs-course-arrow" />
          </div>
        ))}
        {qbanks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No question banks yet.
          </div>
        )}
      </div>

    </aside>
  );
}
