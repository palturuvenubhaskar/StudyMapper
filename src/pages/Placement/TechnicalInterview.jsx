import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, createPlacementSession, savePlacementQuestions, updatePlacementQuestion } from '../../data/repository';
import { generateTechnicalInterviewPrompt, extractJson, callOpenRouter } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Loader, RefreshCw, Eye, EyeOff, CheckCircle2, BookOpen, Target, Sparkles } from 'lucide-react';
import './Placement.css';


const TOPICS = ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'OOP', 'C/C++', 'Java', 'Python', 'JavaScript'];

export default function TechnicalInterview() {
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [topic, setTopic] = useState('Data Structures');
  const [difficulty, setDifficulty] = useState('Medium');
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [visibleAnswers, setVisibleAnswers] = useState({});

  // New scope selector state
  const [testScope, setTestScope] = useState('all');
  const [learnedTopicsCount, setLearnedTopicsCount] = useState(0);
  const [weakTopicsCount, setWeakTopicsCount] = useState(0);

  useEffect(() => {
    (async () => { const p = await getStudentProfile(); setProfile(p); })();
  }, []);

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const messages = generateTechnicalInterviewPrompt(topic, difficulty, 5);
      const responseText = await callOpenRouter(messages);
      const parsed = extractJson(responseText);

      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        const sid = await createPlacementSession(profile?.id || 'guest', 'technical');
        const saved = await savePlacementQuestions(sid, parsed.map(q => ({
          question: q.question, correct_answer: q.ideal_answer, explanation: q.ideal_answer,
          category: 'technical', subcategory: topic, difficulty: q.difficulty || difficulty
        })));
        setQuestions(prev => [...saved, ...prev]);
        setVisibleAnswers({});
        toast('Questions generated!', 'success');
      } else {
        toast('Failed to generate questions. Try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    }
    setGenerating(false);
  };

  const toggleAnswer = (id) => {
    setVisibleAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markPracticed = async (q) => {
    await updatePlacementQuestion(q.id, { user_answer: 'practiced' });
    setQuestions(prev => prev.map(qq => qq.id === q.id ? { ...qq, user_answer: 'practiced' } : qq));
    toast('Marked as practiced', 'success');
  };

  return (
    <div className="practice-page">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/placement')}>
        <ArrowLeft size={18} /> Back to Placement Hub
      </button>

      <h1 style={{ marginBottom: '24px' }}>Technical Interview Practice</h1>

      <div className="practice-controls">
        <select className="input" value={topic} onChange={e => setTopic(e.target.value)}>
          {TOPICS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div className="test-scope-selector">
        <label className="scope-option">
          <input 
            type="radio" 
            name="scope" 
            value="learned" 
            checked={testScope === 'learned'}
            onChange={(e) => setTestScope(e.target.value)}
          />
          <div className="scope-card">
            <BookOpen size={20} />
            <div>
              <strong>Learned Topics Only</strong>
              <span>Test yourself on {learnedTopicsCount} topics you've studied</span>
            </div>
          </div>
        </label>
        
        <label className="scope-option">
          <input 
            type="radio" 
            name="scope" 
            value="weak" 
            checked={testScope === 'weak'}
            onChange={(e) => setTestScope(e.target.value)}
          />
          <div className="scope-card">
            <Target size={20} />
            <div>
              <strong>Weak Areas</strong>
              <span>Focus on {weakTopicsCount} topics you struggled with</span>
            </div>
          </div>
        </label>
        
        <label className="scope-option">
          <input 
            type="radio" 
            name="scope" 
            value="all" 
            checked={testScope === 'all'}
            onChange={(e) => setTestScope(e.target.value)}
          />
          <div className="scope-card">
            <Sparkles size={20} />
            <div>
              <strong>Full Test</strong>
              <span>All topics mixed together</span>
            </div>
          </div>
        </label>
      </div>

      <div className="practice-controls" style={{ marginTop: '16px' }}>
        <button className="btn btn-primary" onClick={generateQuestions} disabled={generating}>
          {generating ? <><Loader size={16} className="spin-icon" /> Generating...</> : <><RefreshCw size={16} /> Generate 5 Questions</>}
        </button>
      </div>

      <div className="tech-questions-list">
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card tech-question-card">
            <div className="tech-q-header">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge badge-primary">Q{idx + 1}</span>
                <span className="badge badge-warning">{q.difficulty}</span>
                <span className="badge badge-accent">{q.subcategory}</span>
                {q.user_answer === 'practiced' && <span className="badge badge-success"><CheckCircle2 size={10} /> Practiced</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => toggleAnswer(q.id)}>
                  {visibleAnswers[q.id] ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show Answer</>}
                </button>
                {q.user_answer !== 'practiced' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => markPracticed(q)}>
                    <CheckCircle2 size={14} /> Mark Practiced
                  </button>
                )}
              </div>
            </div>

            <p className="tech-question-text">{q.question}</p>

            {visibleAnswers[q.id] && (
              <div className="tech-answer-section">
                <h4>💡 Ideal Answer</h4>
                <div className="markdown-body">
                  <MarkdownRenderer remarkPlugins={[remarkGfm]}>{q.correct_answer || q.explanation || ''}</MarkdownRenderer>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="empty-state">
          <p>Select a topic and generate questions to start practicing.</p>
        </div>
      )}
    </div>
  );
}
