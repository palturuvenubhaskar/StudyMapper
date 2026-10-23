import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, FileText, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { deleteSubject, deleteQuestionBank } from '../../data/repository';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';
import './RightSidebar.css';

export default function RightSidebar() {
  const navigate = useNavigate();
  const toast = useToast();
  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];
  const qbanks = useLiveQuery(() => db.question_banks.toArray()) || [];
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'subject'|'qbank', id, title }

  useEffect(() => {
    if (!confirmDelete) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setConfirmDelete(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDelete]);
  
  // Always use BookOpen for subjects
  const getSubjectIcon = () => {
    return <BookOpen size={20} />;
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'subject') {
        await deleteSubject(confirmDelete.id);
        toast('Subject deleted', 'success');
      } else {
        await deleteQuestionBank(confirmDelete.id);
        toast('Question bank deleted', 'success');
      }
    } catch {
      toast('Failed to delete', 'error');
    }
    setConfirmDelete(null);
  };

  return (
    <aside className="right-sidebar">

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="rs-delete-overlay" onClick={() => setConfirmDelete(null)}>
          <div
            className="rs-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rs-delete-title"
            onClick={e => e.stopPropagation()}
          >
            <Trash2 size={28} style={{ color: '#ef4444', marginBottom: '8px' }} aria-hidden="true" />
            <h4 id="rs-delete-title">Delete “{confirmDelete.title}”?</h4>
            <p>This cannot be undone.</p>
            <div className="rs-delete-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-sm" style={{ background: '#ef4444', color: 'white', border: 'none' }} onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      
      <PomodoroTimer />

      <div className="rs-section-header">
        <h3 className="rs-section-title">Your Subjects</h3>
        <button className="rs-section-link btn-ghost btn-sm" onClick={() => navigate('/create')}>
          More <ChevronRight size={14} />
        </button>
      </div>

      <div className="rs-courses-list">
        {subjects.slice(0, 4).map(sub => (
          <div key={sub.id} className="rs-course-item">
            <button
              type="button"
              className="rs-course-link"
              onClick={() => navigate(`/subject/${sub.id}`)}
            >
              <span className="rs-course-icon">
                {getSubjectIcon(sub.title)}
              </span>
              <span className="rs-course-info">
                <span className="rs-course-title">{sub.title}</span>
              </span>
            </button>
            <button
              type="button"
              className="rs-item-delete-btn"
              onClick={() => setConfirmDelete({ type: 'subject', id: sub.id, title: sub.title })}
              aria-label={`Delete subject ${sub.title}`}
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
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
          <div key={qb.id} className="rs-course-item">
            <button
              type="button"
              className="rs-course-link"
              onClick={() => navigate(`/qb/${qb.id}`)}
            >
              <span className="rs-course-icon" style={{ background: 'var(--bg-surface-active)', color: 'var(--accent-primary)' }}>
                <FileText size={20} aria-hidden="true" />
              </span>
              <span className="rs-course-info">
                <span className="rs-course-title">{qb.title}</span>
              </span>
            </button>
            <button
              type="button"
              className="rs-item-delete-btn"
              onClick={() => setConfirmDelete({ type: 'qbank', id: qb.id, title: qb.title })}
              aria-label={`Delete question bank ${qb.title}`}
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
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
