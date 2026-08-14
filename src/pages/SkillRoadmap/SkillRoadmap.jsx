import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentProfile, saveStudentProfile, getRoadmapForProfile, createRoadmap, getSkillsForRoadmap, updateRoadmapSkill, deleteRoadmapSkill, addRoadmapSkill, deleteRoadmap } from '../../data/repository';
import { callOpenRouter, generateRoadmapPrompt, extractJson } from '../../core/api/aiService';
import { ALL_ROADMAPS } from './data/roadmapData';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import ProfileSetup from './ProfileSetup';
import RoadmapBrowser from './RoadmapBrowser';
import RoadmapDetail from './RoadmapDetail';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, MapPin, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Trash2, Plus, RefreshCw, Sparkles, Loader, GripVertical, ArrowRight } from 'lucide-react';
import './SkillRoadmap.css';

export default function SkillRoadmap() {
  const navigate = useNavigate();
  const { roadmapId } = useParams();
  const toast = useToast();

  // Views: 'browse' | 'detail' | 'custom'
  const [view, setView] = useState(roadmapId ? 'detail' : 'browse');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(roadmapId || null);

  // Custom AI Roadmap state (existing functionality)
  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [addingSkill, setAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  // Sync URL params with view state
  useEffect(() => {
    if (roadmapId) {
      setView('detail');
      setSelectedRoadmapId(roadmapId);
    }
  }, [roadmapId]);

  // Load custom roadmap data when switching to custom view
  const loadCustomData = async () => {
    setLoading(true);
    const p = await getStudentProfile();
    setProfile(p);
    if (p) {
      const rm = await getRoadmapForProfile(p.id);
      setRoadmap(rm);
      if (rm) {
        const sk = await getSkillsForRoadmap(rm.id);
        setSkills(sk);
      }
    }
    setLoading(false);
  };

  const handleSelectRoadmap = (id) => {
    setSelectedRoadmapId(id);
    setView('detail');
    navigate(`/roadmap/${id}`, { replace: true });
  };

  const handleBackToBrowse = () => {
    setView('browse');
    setSelectedRoadmapId(null);
    navigate('/roadmap', { replace: true });
  };

  const handleGenerateCustom = async () => {
    setView('custom');
    await loadCustomData();
  };

  // === Custom AI Roadmap handlers (preserved from original) ===
  const handleProfileSubmit = async (formData) => {
    setGenerating(true);
    try {
      const profileId = await saveStudentProfile(formData);
      const profileObj = { ...formData, id: profileId };
      setProfile(profileObj);

      const availableRoadmaps = ALL_ROADMAPS.map(r => `${r.id}: ${r.title}`).join('\n');
      const messages = generateRoadmapPrompt(formData, availableRoadmaps);
      const responseText = await callOpenRouter(messages);
      const skillsData = extractJson(responseText);

      if (skillsData && Array.isArray(skillsData) && skillsData.length > 0) {
        const existingRm = await getRoadmapForProfile(profileId);
        if (existingRm) await deleteRoadmap(existingRm.id);

        const rmId = await createRoadmap(profileId, `${formData.career_goal} Roadmap`, formData.career_goal, skillsData);
        const rm = { id: rmId, profile_id: profileId, title: `${formData.career_goal} Roadmap`, career_goal: formData.career_goal };
        setRoadmap(rm);
        const sk = await getSkillsForRoadmap(rmId);
        setSkills(sk);
        toast('Roadmap generated!', 'success');
      } else {
        toast('AI failed to generate roadmap. Try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    }
    setGenerating(false);
  };

  const handleRegenerate = async () => {
    if (!profile || !window.confirm('Regenerate the entire roadmap? This will replace the current one.')) return;
    if (roadmap) await deleteRoadmap(roadmap.id);
    setRoadmap(null);
    setSkills([]);
  };

  const handleViewRoadmap = (roadmapId) => {
    handleSelectRoadmap(roadmapId);
  };

  const toggleComplete = async (skill) => {
    const newStatus = skill.status === 'completed' ? 'pending' : 'completed';
    await updateRoadmapSkill(skill.id, { status: newStatus });
    setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, status: newStatus } : s));
  };

  const handleDeleteSkill = async (e, skillId) => {
    e.stopPropagation();
    await deleteRoadmapSkill(skillId);
    setSkills(prev => prev.filter(s => s.id !== skillId));
    toast('Skill removed', 'success');
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim() || !roadmap) return;
    const skill = await addRoadmapSkill(roadmap.id, newSkillName.trim(), skills.length);
    setSkills(prev => [...prev, skill]);
    setNewSkillName('');
    setAddingSkill(false);
    toast('Skill added', 'success');
  };

  const moveSkill = async (idx, direction) => {
    const newSkills = [...skills];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newSkills.length) return;
    [newSkills[idx], newSkills[targetIdx]] = [newSkills[targetIdx], newSkills[idx]];
    await updateRoadmapSkill(newSkills[idx].id, { order_index: idx });
    await updateRoadmapSkill(newSkills[targetIdx].id, { order_index: targetIdx });
    setSkills(newSkills);
  };

  const completedCount = skills.filter(s => s.status === 'completed').length;
  const progressPct = skills.length > 0 ? Math.round((completedCount / skills.length) * 100) : 0;

  // === RENDER ===

  // Browse view
  if (view === 'browse') {
    return (
      <div className="skill-roadmap-page">
        <RoadmapBrowser
          onSelectRoadmap={handleSelectRoadmap}
          onGenerateCustom={handleGenerateCustom}
        />
      </div>
    );
  }

  // Detail view (pre-built roadmaps)
  if (view === 'detail' && selectedRoadmapId) {
    return (
      <div className="skill-roadmap-page">
        <RoadmapDetail
          roadmapId={selectedRoadmapId}
          onBack={handleBackToBrowse}
          onSelectRoadmap={handleSelectRoadmap}
        />
      </div>
    );
  }

  // Custom AI Roadmap view (legacy)
  if (loading) return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;

  return (
    <div className="skill-roadmap-page">
      <button className="btn btn-ghost back-btn" onClick={handleBackToBrowse}>
        <ArrowLeft size={18} /> Back to All Roadmaps
      </button>

      <h1 className="roadmap-title"><Sparkles size={28} /> Custom AI Roadmap</h1>

      {!profile || !roadmap ? (
        <ProfileSetup onSubmit={handleProfileSubmit} loading={generating} existingProfile={profile} />
      ) : (
        <>
          {/* Progress bar */}
          <div className="roadmap-progress-section surface-card">
            <div className="progress-info">
              <span>{completedCount} / {skills.length} Skills Completed</span>
              <span className="badge badge-primary">{progressPct}%</span>
            </div>
            <div className="custom-progress-bar">
              <div className="custom-progress-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <div className="roadmap-actions">
              <button className="btn btn-secondary btn-sm" onClick={handleRegenerate}>
                <RefreshCw size={14} /> Regenerate Roadmap
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setAddingSkill(!addingSkill)}>
                <Plus size={14} /> Add Skill
              </button>
            </div>
          </div>

          {addingSkill && (
            <div className="add-skill-row surface-card">
              <input className="input" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} placeholder="Enter skill name..." onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
              <button className="btn btn-primary btn-sm" onClick={handleAddSkill}>Add</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setAddingSkill(false)}>Cancel</button>
            </div>
          )}

          {/* Timeline */}
          <div className="roadmap-timeline">
            {skills.map((skill, idx) => {
              const isCompleted = skill.status === 'completed';
              return (
                <div key={skill.id} className={`timeline-item ${isCompleted ? 'completed' : ''}`}>
                  <div className="timeline-connector">
                    <div className={`timeline-dot ${isCompleted ? 'dot-completed' : ''}`} onClick={() => toggleComplete(skill)}>
                      {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    {idx < skills.length - 1 && <div className="timeline-line"></div>}
                  </div>

                  <div className="timeline-card surface-card">
                    <div className="timeline-card-header">
                      <div className="skill-info">
                        <span className="skill-number">#{idx + 1}</span>
                        <h3>{skill.name}</h3>
                        {skill.estimated_time && <span className="badge badge-warning"><Clock size={10} /> {skill.estimated_time}</span>}
                        {isCompleted && <span className="badge badge-success">✓ Done</span>}
                      </div>
                      <div className="skill-actions">
                        <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); moveSkill(idx, -1); }} disabled={idx === 0}><ChevronUp size={14} /></button>
                        <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); moveSkill(idx, 1); }} disabled={idx === skills.length - 1}><ChevronDown size={14} /></button>
                        <button className="btn btn-ghost btn-icon" onClick={(e) => handleDeleteSkill(e, skill.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {skill.why_important && <p className="skill-why">{skill.why_important}</p>}

                    {skill.roadmap_id && (
                      <div className="skill-content" style={{ padding: '0 24px 24px', borderTop: 'none' }}>
                        <button className="btn btn-primary" onClick={() => handleViewRoadmap(skill.roadmap_id)}>
                          View Full Roadmap <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
