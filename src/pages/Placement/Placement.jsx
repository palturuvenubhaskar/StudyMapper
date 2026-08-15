import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, getPlacementStats, saveStudentProfile } from '../../data/repository';
import { ArrowLeft, Brain, Code2, Users, TrendingUp, ChevronRight, Target, Briefcase, Award, Edit2, Check, X } from 'lucide-react';
import './Placement.css';

export default function Placement() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [tempRole, setTempRole] = useState('');

  useEffect(() => {
    (async () => {
      const p = await getStudentProfile();
      setProfile(p);
      if (p) {
        setTempRole(p.career_goal || '');
        const s = await getPlacementStats(p.id);
        setStats(s);
      }
      setLoading(false);
    })();
  }, []);

  const saveRole = async () => {
    if (tempRole.trim() && profile) {
      const updated = { ...profile, career_goal: tempRole.trim() };
      await saveStudentProfile(updated);
      setProfile(updated);
    }
    setIsEditingRole(false);
  };

  if (loading) return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;

  const sections = [
    {
      title: 'Aptitude Practice',
      description: 'Master Quantitative, Logical Reasoning, and Verbal Ability. Sharpen your problem-solving skills under pressure.',
      icon: <Brain size={28} />,
      color: '#818cf8', // Indigo
      bgGlow: 'rgba(129, 140, 248, 0.15)',
      path: '/placement/aptitude',
      statText: stats ? `${stats.aptitude.correct}/${stats.aptitude.total} Correct` : '0 attempted',
      progress: stats ? (stats.aptitude.total === 0 ? 0 : (stats.aptitude.correct / stats.aptitude.total) * 100) : 0
    },
    {
      title: 'Technical Interview',
      description: 'Tackle real-world DSA, OS, and System Design problems. Compare your logic with ideal answers.',
      icon: <Code2 size={28} />,
      color: '#34d399', // Emerald
      bgGlow: 'rgba(52, 211, 153, 0.15)',
      path: '/placement/technical',
      statText: stats ? `${stats.technical.practiced}/${stats.technical.total} Practiced` : '0 attempted',
      progress: stats ? (stats.technical.total === 0 ? 0 : (stats.technical.practiced / stats.technical.total) * 100) : 0
    },
    {
      title: 'HR & Behavioral',
      description: 'Nail the cultural fit. Get AI-powered feedback on your communication and leadership stories.',
      icon: <Users size={28} />,
      color: '#fbbf24', // Amber
      bgGlow: 'rgba(251, 191, 36, 0.15)',
      path: '/placement/hr',
      statText: stats ? `${stats.hr.answered}/${stats.hr.total} Answered` : '0 attempted',
      progress: stats ? (stats.hr.total === 0 ? 0 : (stats.hr.answered / stats.hr.total) * 100) : 0
    }
  ];

  return (
    <div className="placement-hub">


      <div className="placement-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge"><Briefcase size={16}/> Career Prep Mode</div>
          <h1 className="hero-title">Placement <span>Prep</span></h1>
          {profile ? (
            <div className="hero-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              Targeting: 
              {isEditingRole ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input 
                    type="text" 
                    className="input" 
                    style={{ padding: '4px 8px', width: '200px', fontSize: '0.95rem', margin: 0 }} 
                    value={tempRole} 
                    onChange={e => setTempRole(e.target.value)} 
                    autoFocus 
                    onKeyDown={e => e.key === 'Enter' && saveRole()}
                  />
                  <button className="btn btn-icon btn-primary" onClick={saveRole}><Check size={16} /></button>
                  <button className="btn btn-icon btn-ghost" onClick={() => { setIsEditingRole(false); setTempRole(profile.career_goal); }}><X size={16} /></button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong className="highlight-goal">{profile.career_goal}</strong>
                  <button className="btn btn-icon btn-ghost" onClick={() => setIsEditingRole(true)} title="Change Role">
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="hero-subtitle warning">
              ⚠️ Set up your profile in the Skill Roadmap first.
            </p>
          )}
        </div>
        
        {stats && profile && (
          <div className="hero-stats-overview">
            <div className="stat-pill">
              <Award size={18} color="#818cf8"/>
              <span>{stats.aptitude.total + stats.technical.total + stats.hr.total}</span> Total Interactions
            </div>
            <div className="stat-pill">
              <Target size={18} color="#34d399"/>
              <span>{profile.career_goal}</span>
            </div>
          </div>
        )}
      </div>

      <div className="placement-cards-container">
        {sections.map((sec, idx) => (
          <div 
            key={idx} 
            className="premium-placement-card" 
            onClick={() => navigate(sec.path)} 
            style={{ '--card-color': sec.color, '--card-glow': sec.bgGlow }}
          >
            <div className="card-bg-gradient"></div>
            <div className="card-content">
              <div className="card-header">
                <div className="card-icon-wrapper">
                  {sec.icon}
                </div>
                <div className="card-action">
                  <ChevronRight size={20} />
                </div>
              </div>
              
              <div className="card-body">
                <h2>{sec.title}</h2>
                <p>{sec.description}</p>
              </div>

              <div className="card-footer">
                <div className="progress-info">
                  <span className="stat-label">Progress</span>
                  <span className="stat-value" style={{ color: 'var(--text-primary)' }}>{sec.statText}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${sec.progress}%`, backgroundColor: sec.color }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
