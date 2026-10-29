import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById, getUnitsForSubject, getTopicsForUnits, updateSubject, getQuestionBanksForSubject, deleteSubject, deleteQuestionBank } from '../../data/repository';
import { BookOpen, ChevronRight, Check, FileText, Plus, Trash2, Loader } from 'lucide-react';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import './SubjectView.css';
import './SubjectViewNew.css';

export default function SubjectView() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [unitsWithTopics, setUnitsWithTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const [questionBanks, setQuestionBanks] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null); // 'subject' | bankId | null

  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    const sub = await getSubjectById(subjectId);
    if (!sub) {
      navigate('/');
      return;
    }
    setSubject(sub);
    setTitleInput(sub.title);

    const units = await getUnitsForSubject(subjectId);
    const topics = await getTopicsForUnits(units.map(u => u.id));
    const topicsByUnit = new Map(units.map(u => [u.id, []]));
    for (const t of topics) topicsByUnit.get(t.unit_id)?.push(t);
    const result = units.map(u => ({
      ...u,
      topics: topicsByUnit.get(u.id).sort((a, b) => a.order_index - b.order_index),
    }));
    setUnitsWithTopics(result);
    // Expand all by default
    setExpandedUnits(new Set(units.map(u => u.id)));

    const banks = await getQuestionBanksForSubject(subjectId);
    setQuestionBanks(banks);

    setLoading(false);
  }, [subjectId, navigate]);

  useEffect(() => { loadData(); }, [loadData, subjectId]);

  const handleSaveTitle = async () => {
    if (titleInput.trim() && titleInput.trim() !== subject.title) {
      await updateSubject(subject.id, { title: titleInput.trim() });
      setSubject({ ...subject, title: titleInput.trim() });
    }
    setEditingTitle(false);
  };

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  };

  const handleDeleteSubject = async () => {
    try {
      await deleteSubject(subjectId);
      toast('Subject deleted successfully', 'success');
      navigate('/');
    } catch {
      toast('Failed to delete subject', 'error');
    }
    setConfirmDelete(null);
  };

  const handleDeleteQB = async (bankId) => {
    try {
      await deleteQuestionBank(bankId);
      setQuestionBanks(prev => prev.filter(b => b.id !== bankId));
      toast('Question bank deleted', 'success');
    } catch {
      toast('Failed to delete question bank', 'error');
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader size={28} className="spin-icon" />
        <p>Loading subject…</p>
      </div>
    );
  }

  const totalTopics = unitsWithTopics.reduce((s, u) => s + u.topics.length, 0);
  const studiedTopics = unitsWithTopics.reduce((s, u) => s + u.topics.filter(t => t.has_content === 1).length, 0);

  return (
    <div className="sv-page">

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="sv-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="sv-modal" onClick={e => e.stopPropagation()}>
            <Trash2 size={28} className="sv-modal-icon" />
            <h3>{confirmDelete === 'subject' ? 'Delete Subject?' : 'Delete Question Bank?'}</h3>
            <p>
              {confirmDelete === 'subject'
                ? 'This will permanently delete this subject, all its units, topics, notes, and generated content. This action cannot be undone.'
                : 'This will permanently delete this question bank and all its questions. This action cannot be undone.'}
            </p>
            <div className="sv-modal-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => confirmDelete === 'subject' ? handleDeleteSubject() : handleDeleteQB(confirmDelete)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sv-head">
        <div className="sv-head-copy">
          {editingTitle ? (
            <div className="title-edit">
              <input
                className="input subject-name-input"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
              />
              <button className="btn btn-primary btn-sm" onClick={handleSaveTitle}><Check size={14} /> Save</button>
            </div>
          ) : (
            <>
              <span className="sv-eyebrow">Subject</span>
              <h1 className="sv-title" onClick={() => setEditingTitle(true)}>
                {subject.title}
                <span className="sv-title-accent"> </span>
              </h1>
            </>
          )}
          <p className="sv-subtitle">
            {unitsWithTopics.length} unit{unitsWithTopics.length !== 1 ? 's' : ''} · {totalTopics} topic{totalTopics !== 1 ? 's' : ''} · {studiedTopics} studied
          </p>
        </div>

        <div className="sv-metrics" aria-label="Subject metrics">
          <div className="sv-metric">
            <span className="sv-metric-label"><BookOpen size={11} /> Units</span>
            <span className="sv-metric-value">{unitsWithTopics.length}</span>
          </div>
          <div className="sv-metric">
            <span className="sv-metric-label"><Check size={11} /> Topics</span>
            <span className="sv-metric-value">{totalTopics}</span>
          </div>
          <div className="sv-metric">
            <span className="sv-metric-label"><BookOpen size={11} /> Studied</span>
            <span className="sv-metric-value">{studiedTopics}</span>
          </div>
        </div>

        <div className="sv-head-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete('subject')} title="Delete Subject">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </header>

      <section className="sv-card">
        <div className="sv-card-head">
          <span className="sv-icon"><BookOpen size={15} /></span>
          <div className="sv-card-copy">
            <h2>Units & Topics</h2>
            <p>Click a unit to expand. Studied topics show a green dot and badge.</p>
          </div>
        </div>

        <div className="sv-units">
          {unitsWithTopics.map((unit) => (
            <div key={unit.id} className={`sv-unit ${expandedUnits.has(unit.id) ? 'is-open' : ''}`}>
              <div className="sv-unit-head" onClick={() => toggleUnit(unit.id)}>
                <ChevronRight size={16} className="sv-unit-chev" />
                <span className="sv-unit-title">{unit.title}</span>
                <span className="sv-unit-count">{unit.topics.length} topic{unit.topics.length !== 1 ? 's' : ''}</span>
              </div>

              {expandedUnits.has(unit.id) && (
                <div className="sv-unit-body">
                  {unit.topics.length > 0 ? (
                    <div className="sv-topics">
                      {unit.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`sv-topic ${topic.has_content === 1 ? 'is-studied' : ''}`}
                          onClick={() => navigate(`/topic/${topic.id}`)}
                        >
                          <span className="sv-topic-dot" aria-hidden="true" />
                          <span className="sv-topic-name">{topic.title}</span>
                          {topic.has_content === 1 && <span className="sv-topic-badge">Studied</span>}
                          <ChevronRight size={13} className="sv-topic-chev" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sv-unit-empty">No topics in this unit</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="sv-card">
        <div className="sv-card-head">
          <span className="sv-icon is-emerald"><FileText size={15} /></span>
          <div className="sv-card-copy">
            <h2>Question Banks</h2>
            <p>Upload past papers to generate AI answers and practice questions.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/subject/${subjectId}/qb/create`)}>
            <Plus size={13} /> Add Question Bank
          </button>
        </div>

        {questionBanks.length === 0 ? (
          <div className="sv-empty">
            <FileText size={28} />
            <p><strong>No question banks yet.</strong> Upload past papers to generate AI answers and practice questions.</p>
          </div>
        ) : (
          <div className="sv-qb-grid">
            {questionBanks.map(bank => (
              <div key={bank.id} className="sv-qb-card" onClick={() => navigate(`/qb/${bank.id}`)}>
                <span className="sv-qb-icon"><FileText size={16} /></span>
                <h4>{bank.title}</h4>
                <p>Uploaded {new Date(bank.created_at).toLocaleDateString()}</p>
                <button
                  className="sv-qb-delete"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(bank.id); }}
                  title="Delete Question Bank"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}