import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, createPlacementSession, savePlacementQuestions, updatePlacementQuestion } from '../../data/repository';
import { generateHRInterviewPrompt, evaluateHRAnswerPrompt, callOpenRouterStream, callOpenRouter, extractJson } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Loader, RefreshCw, Send, MessageSquare } from 'lucide-react';
import './Placement.css';


export default function HRInterview() {
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [streamingId, setStreamingId] = useState(null);
  const [streamingText, setStreamingText] = useState('');

  useEffect(() => {
    (async () => { const p = await getStudentProfile(); setProfile(p); })();
  }, []);

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const messages = generateHRInterviewPrompt(profile?.career_goal || 'Software Engineer');
      const responseText = await callOpenRouter(messages);
      const parsed = extractJson(responseText);

      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        const sid = await createPlacementSession(profile?.id || 'guest', 'hr');
        const saved = await savePlacementQuestions(sid, parsed.map(q => ({
          question: q.question, correct_answer: q.tips, explanation: q.tips,
          category: 'hr', subcategory: 'HR Interview', difficulty: 'Medium'
        })));
        setQuestions(saved);
        setAnswers({});
        setFeedback({});
        toast('HR questions generated!', 'success');
      } else {
        toast('Failed to generate questions.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    }
    setGenerating(false);
  };

  const getAIFeedback = async (q) => {
    const answer = answers[q.id];
    if (!answer || !answer.trim()) { toast('Write your answer first', 'error'); return; }

    setStreamingId(q.id);
    setStreamingText('');
    try {
      const messages = evaluateHRAnswerPrompt(q.question, answer);
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        setStreamingText(textSoFar);
      });
      setFeedback(prev => ({ ...prev, [q.id]: fullText }));
      await updatePlacementQuestion(q.id, { user_answer: answer });
    } catch (err) {
      console.error(err);
      toast('Failed to get feedback', 'error');
    }
    setStreamingId(null);
  };

  return (
    <div className="practice-page">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/placement')}>
        <ArrowLeft size={18} /> Back to Placement Hub
      </button>

      <h1 style={{ marginBottom: '24px' }}>HR Interview Practice</h1>

      <div className="practice-controls">
        <button className="btn btn-primary" onClick={generateQuestions} disabled={generating}>
          {generating ? <><Loader size={16} className="spin-icon" /> Generating...</> : <><RefreshCw size={16} /> Generate HR Questions</>}
        </button>
        {profile && <span className="badge badge-accent">Career: {profile.career_goal}</span>}
      </div>

      <div className="hr-questions-list">
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card hr-question-card">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-primary">Q{idx + 1}</span>
              <MessageSquare size={16} color="var(--text-muted)" />
            </div>
            <p className="hr-question-text">{q.question}</p>
            {q.correct_answer && <p className="hr-tips">💡 Tip: {q.correct_answer}</p>}

            <div className="hr-answer-area">
              <textarea
                className="textarea"
                placeholder="Type your answer here... Be genuine and confident."
                value={answers[q.id] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                rows={4}
              />
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '10px' }}
                onClick={() => getAIFeedback(q)}
                disabled={streamingId === q.id || !answers[q.id]?.trim()}
              >
                {streamingId === q.id ? <><Loader size={14} className="spin-icon" /> Analyzing...</> : <><Send size={14} /> Get AI Feedback</>}
              </button>
            </div>

            {(streamingId === q.id || feedback[q.id]) && (
              <div className="hr-feedback-section">
                <div className="markdown-body">
                  <MarkdownRenderer remarkPlugins={[remarkGfm]}>{streamingId === q.id ? streamingText : feedback[q.id]}</MarkdownRenderer>
                  {streamingId === q.id && <span className="cursor-blink">|</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="empty-state">
          <p>Generate HR interview questions to start practicing.</p>
        </div>
      )}
    </div>
  );
}
