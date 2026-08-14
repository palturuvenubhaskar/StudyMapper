import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById, getUnitsForSubject, getTopicsForUnit, updateSubject, getQuestionBanksForSubject, getLatestTopicContent } from '../../data/repository';
import { ArrowLeft, BookOpen, ChevronRight, Edit3, Check, FileText, Plus, Download, Loader, X } from 'lucide-react';

import { useToast } from '../../components/ToastProvider/ToastProvider';
import './SubjectView.css';

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
  
  const toast = useToast();


  const loadData = async () => {
    setLoading(true);
    const sub = await getSubjectById(subjectId);
    if (!sub) {
      navigate('/');
      return;
    }
    setSubject(sub);
    setTitleInput(sub.title);

    const units = await getUnitsForSubject(subjectId);
    const result = [];
    for (const unit of units) {
      const topics = await getTopicsForUnit(unit.id);
      result.push({ ...unit, topics });
    }
    setUnitsWithTopics(result);
    // Expand all by default
    setExpandedUnits(new Set(units.map(u => u.id)));

    const banks = await getQuestionBanksForSubject(subjectId);
    setQuestionBanks(banks);

    setLoading(false);
  };

  useEffect(() => { loadData(); }, [subjectId]);

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



  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg"></div>
        <p>Loading subject...</p>
      </div>
    );
  }

  const totalTopics = unitsWithTopics.reduce((s, u) => s + u.topics.length, 0);
  const studiedTopics = unitsWithTopics.reduce((s, u) => s + u.topics.filter(t => t.has_content === 1).length, 0);

  return (
    <div className="subject-view">


      <div className="subject-view-header">
        {editingTitle ? (
          <div className="title-edit">
            <input className="input subject-name-input" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()} />
            <button className="btn btn-primary btn-sm" onClick={handleSaveTitle}><Check size={14} /> Save</button>
          </div>
        ) : (
          <h1 onClick={() => setEditingTitle(true)}>
            <BookOpen size={24} /> {subject.title}
            <button className="btn btn-ghost btn-icon" onClick={() => setEditingTitle(true)}><Edit3 size={14} /></button>
          </h1>
        )}
        <div className="subject-stats">
          <span className="badge badge-accent">{unitsWithTopics.length} Units</span>
          <span className="badge badge-success">{studiedTopics}/{totalTopics} Topics Studied</span>

        </div>
      </div>

      <div className="units-list">
        {unitsWithTopics.map((unit) => (
          <div key={unit.id} className="glass-card unit-block">
            <div className="unit-block-header" onClick={() => toggleUnit(unit.id)}>
              <ChevronRight size={18} className={`chevron ${expandedUnits.has(unit.id) ? 'rotated' : ''}`} />
              <h3>{unit.title}</h3>
              <span className="badge badge-accent">{unit.topics.length} topics</span>
            </div>
            {expandedUnits.has(unit.id) && (
              <div className="unit-topics-list">
                {unit.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`topic-item ${topic.has_content === 1 ? 'studied' : ''}`}
                    onClick={() => navigate(`/topic/${topic.id}`)}
                  >
                    <div className="topic-dot" />
                    <span>{topic.title}</span>
                    {topic.has_content === 1 && <span className="badge badge-success">Studied</span>}
                    <ChevronRight size={14} className="topic-arrow" />
                  </div>
                ))}
                {unit.topics.length === 0 && (
                  <p className="no-topics">No topics in this unit</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="section-divider">
        <h2>Question Banks</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/subject/${subjectId}/qb/create`)}>
          <Plus size={14} /> Add Question Bank
        </button>
      </div>

      {questionBanks.length === 0 ? (
        <div className="glass-card empty-state-small">
          <FileText size={32} />
          <p>No question banks yet. Upload past papers to generate AI answers.</p>
        </div>
      ) : (
        <div className="qb-grid">
          {questionBanks.map(bank => (
            <div key={bank.id} className="glass-card qb-card" onClick={() => navigate(`/qb/${bank.id}`)}>
              <FileText size={24} color="var(--accent)" />
              <h4>{bank.title}</h4>
              <p>Uploaded {new Date(bank.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}


    </div>
  );
}
