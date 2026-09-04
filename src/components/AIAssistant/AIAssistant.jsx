import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAISessions, createAISession, getAIMessages, deleteAISession, updateAISession } from '../../data/repository';
import { generateMorningDigest } from '../../core/analytics/morningDigest';
import { Bot, X, Plus, Trash2, Edit2, Check, Menu, MoreVertical, MessageSquare, Maximize2, Minimize2, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';
import AIChatPanel from './AIChatPanel';
import './AIAssistant.css';

export default function AIAssistant({ userId = 'guest' }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isCoding = location.pathname.startsWith('/coding');
  
  const [historyOpen, setHistoryOpen] = useState(false); // Closed by default in panel mode
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  
  const [digest, setDigest] = useState(null);

  // Resizing state
  const [panelWidth, setPanelWidth] = useState(() => {
    return parseInt(localStorage.getItem('studymapper_ai_width')) || 450;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    (async () => {
      const morningData = await generateMorningDigest(userId);
      if (morningData) {
        setDigest(morningData);
      }
    })();
  }, [userId]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-ai-coach', handleToggle);
    return () => window.removeEventListener('toggle-ai-coach', handleToggle);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 320 && newWidth <= 800) {
        setPanelWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        localStorage.setItem('studymapper_ai_width', panelWidth);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
      document.body.style.cursor = 'default';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, panelWidth]);

  // We no longer lock body scroll because it's part of the standard layout now.
  // Instead, the panels scroll independently.

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      loadMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  const loadSessions = async () => {
    try {
      const s = await getAISessions();
      setSessions(s);
      // Removed the auto-selection logic to enforce 'New Chat' by default
    } catch (err) {
      console.error("Error loading AI sessions:", err);
    }
  };

  const loadMessages = async (id) => {
    try {
      const m = await getAIMessages(id);
      setMessages(m);
    } catch (err) {
      console.error("Error loading AI messages:", err);
    }
  };

  const createNewSession = () => {
    setActiveSessionId(null);
    if (isFullScreen && window.innerWidth < 768) {
      setHistoryOpen(false);
    }
  };

  const handleToggleOpen = () => {
    if (!isOpen) {
      setActiveSessionId(null);
    }
    setIsOpen(!isOpen);
  };

  const groupSessionsByTime = (sessList) => {
    const groups = [
      { label: 'Today', items: [] },
      { label: 'Yesterday', items: [] },
      { label: 'Previous 7 Days', items: [] },
      { label: 'Previous 30 Days', items: [] },
      { label: 'Older', items: [] }
    ];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const prev7Start = new Date(todayStart);
    prev7Start.setDate(prev7Start.getDate() - 7);
    
    const prev30Start = new Date(todayStart);
    prev30Start.setDate(prev30Start.getDate() - 30);

    sessList.forEach(s => {
      const d = new Date(s.updated_at || s.created_at);
      if (d >= todayStart) {
        groups[0].items.push(s);
      } else if (d >= yesterdayStart) {
        groups[1].items.push(s);
      } else if (d >= prev7Start) {
        groups[2].items.push(s);
      } else if (d >= prev30Start) {
        groups[3].items.push(s);
      } else {
        groups[4].items.push(s);
      }
    });

    return groups.filter(g => g.items.length > 0);
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this conversation?")) {
      await deleteAISession(id);
      if (activeSessionId === id) setActiveSessionId(null);
      await loadSessions();
    }
  };

  const handleEditTitle = (e, session) => {
    e.stopPropagation();
    setEditingTitleId(session.id);
    setNewTitle(session.title);
  };

  const saveTitle = async (e, id) => {
    e.stopPropagation();
    if (newTitle.trim()) {
      await updateAISession(id, { title: newTitle.trim() });
      await loadSessions();
    }
    setEditingTitleId(null);
  };

  return (
    <div 
      className={`ai-assistant-wrapper ${!isOpen ? 'closed' : ''} ${isFullScreen ? 'fullscreen' : ''}`}
      style={{ width: isOpen ? (isFullScreen ? '100vw' : `${panelWidth}px`) : 0 }}
    >
      {isOpen && !isFullScreen && (
        <div 
          className="ai-resize-handle" 
          onMouseDown={() => setIsResizing(true)} 
        />
      )}

      {/* Floating Action Button (Fixed position) */}
      <button 
        className="ai-fab" 
        onClick={handleToggleOpen}
        style={{ display: isOpen ? 'none' : 'flex' }}
        title="AI Assistant & Study Coach"
      >
        <Bot size={28} />
        {digest && !isOpen && <span className="coach-notification-dot" style={{ position: 'absolute', top: '4px', right: '4px', width: '12px', height: '12px', background: '#ef4444', border: '2px solid white', borderRadius: '50%' }}></span>}
      </button>

      {/* Inner Panel */}
      <div className="ai-sidebar">
        
        {/* Left Sidebar (History) */}
        <div className={`ai-history-panel ${historyOpen ? '' : 'closed'}`}>
          <div className="ai-history-header">
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>History</span>
            {/* Mobile close history button could go here */}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', padding: '0 12px', marginBottom: '12px' }}>
            <button 
              className={`history-item ${activeSessionId === null ? 'active' : ''}`} 
              style={{ flex: 1, justifyContent: 'center', background: activeSessionId === null ? 'var(--bg-surface-active)' : 'var(--bg-surface-hover)', margin: 0, border: '1px solid var(--border-light)' }} 
              onClick={() => setActiveSessionId(null)}
            >
              <GraduationCap size={16} /> Coach
            </button>
            <button 
              className="new-chat-btn" 
              style={{ flex: 1, margin: 0 }} 
              onClick={() => setActiveSessionId('new')}
            >
              <Plus size={16} /> Chat
            </button>
          </div>
          
          <div className="history-list">
            {groupSessionsByTime(sessions).map(group => (
              <div key={group.label} className="history-group">
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 12px 4px 12px' }}>
                  {group.label}
                </div>
                {group.items.map(s => (
                  <div 
                    key={s.id} 
                    className={`history-item ${activeSessionId === s.id ? 'active' : ''}`}
                    onClick={() => setActiveSessionId(s.id)}
                  >
                    {editingTitleId === s.id ? (
                      <div style={{ display: 'flex', gap: '4px', width: '100%', alignItems: 'center' }}>
                        <input 
                          autoFocus
                          style={{ 
                            flex: 1, 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'inherit', 
                            outline: 'none',
                            borderBottom: '1px solid var(--border-strong)'
                          }}
                          value={newTitle} 
                          onChange={e => setNewTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveTitle(e, s.id);
                            if (e.key === 'Escape') setEditingTitleId(null);
                          }}
                          onClick={e => e.stopPropagation()}
                        />
                        <button className="ai-btn-ghost" style={{ padding: '4px' }} onClick={(e) => saveTitle(e, s.id)}><Check size={14} /></button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflow: 'hidden' }}>
                          <MessageSquare size={16} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                            {s.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button className="ai-btn-ghost" style={{ padding: '4px' }} onClick={(e) => handleEditTitle(e, s)}><Edit2 size={12} /></button>
                          <button className="ai-btn-ghost" style={{ padding: '4px' }} onClick={(e) => handleDeleteSession(e, s.id)}><Trash2 size={12} /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="ai-main-view">
          
          {/* Top Bar */}
          <div className="ai-top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {isFullScreen && (
                <button className="ai-btn-ghost" onClick={() => setHistoryOpen(!historyOpen)}>
                  <Menu size={24} />
                </button>
              )}
              <h1 className="ai-brand-text" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                {isCoding ? 'AI Coding Mentor' : 'StudyMapper AI'}
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="ai-btn-ghost ai-fullscreen-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button className="ai-btn-ghost">
                <MoreVertical size={20} />
              </button>
              <button className="ai-btn-ghost" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
          </div>

          {activeSessionId ? (
            <AIChatPanel 
              sessionId={activeSessionId} 
              setSessionId={setActiveSessionId}
              onSessionUpdated={loadSessions}
              messages={messages} 
              setMessages={setMessages} 
            />
          ) : (
            <div className="coach-dashboard-scrollable" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <p className="coach-greeting">Good Morning! <Sparkles size={24} style={{ display: 'inline', color: '#f59e0b', verticalAlign: 'text-bottom' }} /></p>
                {digest ? (
                  <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem' }}>
                      You are on a <strong style={{ color: 'var(--text-primary)' }}>{digest.streakDays}-day streak!</strong> Let's keep it going.
                    </p>
                    
                    {digest.weakTopics && digest.weakTopics.length > 0 && (
                      <div className="coach-alert">
                        <div className="coach-alert-header">
                          <AlertCircle size={18} />
                          <span>Focus Areas</span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Based on your recent analytics, you seem to be struggling with:</p>
                        <ul>
                          {digest.weakTopics.map((t, idx) => <li key={idx}>{t}</li>)}
                        </ul>
                      </div>
                    )}

                    {digest.recommendedQuests && digest.recommendedQuests.length > 0 && (
                      <div className="coach-quests">
                        <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Recommended Quests</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {digest.recommendedQuests.map((q, idx) => (
                            <div key={idx} style={{ 
                              padding: '16px', 
                              background: 'var(--bg-glass)', 
                              border: '1px solid var(--border-light)', 
                              borderRadius: '12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.title}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{q.type}</div>
                              </div>
                              <button className="btn btn-primary btn-sm" onClick={() => window.location.href = q.path}>Start</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', opacity: 0.7 }}>
                    <GraduationCap size={48} style={{ marginBottom: '16px', color: 'var(--text-muted)' }} />
                    <p>Generating your personalized morning digest...</p>
                  </div>
                )}
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
                <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', textAlign: 'center' }}>Need help with something else?</p>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={() => setActiveSessionId('new')}
                >
                  <MessageSquare size={20} />
                  Start a New Chat
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
