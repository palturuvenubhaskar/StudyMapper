import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionBankById, getQuestionsForBank, updateQuestionAnswer, updateQuestionBank } from '../../data/repository';
import { callOpenRouterStream, getQuestionAnswerPrompt } from '../../core/api/aiService';
import { db } from '../../data/db';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, Play, Loader, FileText, CheckCircle2, Edit2, Check, X, Download } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import MermaidRenderer from '../../components/MarkdownRenderer/MermaidRenderer';
import QuestionVariantGenerator from '../../components/MockExamSimulator/QuestionVariantGenerator';
import './QuestionBankView.css';

export default function QuestionBankView() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [bank, setBank] = useState(null);
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQId, setSelectedQId] = useState(null);
  
  // Renaming state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  // Streaming state for active question
  const [activeQId, setActiveQId] = useState(null);
  const [streamingStreamText, setStreamingStreamText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const activeQRef = useRef(null);



  const loadData = async () => {
    setLoading(true);
    const b = await getQuestionBankById(bankId);
    if (!b) { navigate('/'); return; }
    setBank(b);

    if (b.subject_id) {
      const sub = await db.subjects.get(b.subject_id);
      setSubject(sub);
    } else {
      setSubject(null);
    }

    const qs = await getQuestionsForBank(bankId);
    setQuestions(qs);
    if (qs.length > 0) setSelectedQId(qs[0].id);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [bankId]);

  // Removed auto-scroll during streaming to keep the view stationary at the top

  const generateAnswer = async (question, detailLevel = 'detailed') => {
    if (isStreaming) return;
    setActiveQId(question.id);
    setIsStreaming(true);
    setStreamingStreamText('');

    try {
      const messages = getQuestionAnswerPrompt(question.text, question.marks, subject?.title || '', detailLevel);
      
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        setStreamingStreamText(textSoFar);
      });

      await updateQuestionAnswer(question.id, fullText);
      
      // Update local state
      setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, answer: fullText } : q));
      toast('Answer generated successfully', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to generate answer: ' + err.message, 'error');
    }

    setIsStreaming(false);
    setActiveQId(null);
  };

  const handleSaveTitle = async () => {
    if (!editTitle.trim() || editTitle === bank.title) {
      setIsEditingTitle(false);
      return;
    }
    
    try {
      await updateQuestionBank(bank.id, { title: editTitle });
      setBank({ ...bank, title: editTitle });
      setIsEditingTitle(false);
      toast('Question Bank renamed successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to rename: ' + err.message, 'error');
    }
  };



  if (loading) return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;

  return (
    <div className="qb-view-page">
      <div className="qb-header">
        <div className="qb-title-section">
          {isEditingTitle ? (
            <div className="inline-edit-group">
              <input 
                type="text" 
                className="input inline-edit-input" 
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <button className="btn btn-primary btn-icon" onClick={handleSaveTitle}><Check size={16} /></button>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsEditingTitle(false)}><X size={16} /></button>
            </div>
          ) : (
            <h1>
              <FileText size={28} /> {bank.title}
              <button 
                className="btn btn-ghost btn-icon edit-title-btn" 
                onClick={() => { setEditTitle(bank.title); setIsEditingTitle(true); }}
                title="Rename Question Bank"
              >
                <Edit2 size={18} />
              </button>
            </h1>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="badge badge-accent">{questions.length} Questions</div>
          {questions.length > 0 && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/mock-exam/setup/${bankId}`)}
            >
              <Play size={16} /> Take Mock Exam
            </button>
          )}
        </div>
      </div>

      <div className="qb-split-layout">
        <div className="qb-sidebar-list">
          {questions.map((q, idx) => (
            <button 
              key={q.id} 
              className={`qb-sidebar-item ${selectedQId === q.id ? 'active' : ''}`}
              onClick={() => setSelectedQId(q.id)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0, alignItems: 'center', minWidth: '40px' }}>
                <span className="badge badge-primary badge-sm" style={{ width: '100%', justifyContent: 'center' }}>Q{idx + 1}</span>
                <span className="badge badge-warning badge-sm" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', width: '100%', justifyContent: 'center' }}>{q.marks}</span>
              </div>
              <span className="truncate-multiline qb-sidebar-item-text" style={{ flex: 1 }}>{q.text}</span>
              {q.answer && <CheckCircle2 size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: '4px' }} />}
            </button>
          ))}
        </div>

        <div className="qb-main-detail">
          {(() => {
            const selectedQuestion = questions.find(q => q.id === selectedQId);
            if (!selectedQuestion) return (
              <div className="empty-state">
                <FileText size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
                <h3>No question selected</h3>
                <p>Select a question from the sidebar to view its details.</p>
              </div>
            );
            
            const isActive = activeQId === selectedQuestion.id;
            const qIndex = questions.findIndex(q => q.id === selectedQId);
            
            return (
              <div className={`glass-card qb-question-card ${isActive ? 'active-streaming' : ''}`}>
                <div className="qb-question-header">
                  <div className="qb-q-info">
                    <span className="badge badge-primary">Q{qIndex + 1}</span>
                    <span className="badge badge-warning">{selectedQuestion.marks}</span>
                  </div>
                  {!isActive && !isStreaming && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select 
                        className="input input-sm" 
                        style={{ padding: '0 8px', height: '28px', fontSize: '12px', background: 'var(--bg-surface)' }}
                        onChange={(e) => setQuestions(prev => prev.map(p => p.id === selectedQuestion.id ? {...p, detailPreference: e.target.value} : p))}
                        value={selectedQuestion.detailPreference || 'simple'}
                      >
                        <option value="simple">Simple Mode</option>
                        <option value="detailed">Detailed Mode</option>
                      </select>
                      <button className="btn btn-secondary btn-sm" onClick={() => generateAnswer(selectedQuestion, selectedQuestion.detailPreference || 'simple')}>
                        {selectedQuestion.answer ? <RefreshCwIcon /> : <Play size={14} />} {selectedQuestion.answer ? 'Regenerate' : 'Generate Answer'}
                      </button>
                      <QuestionVariantGenerator 
                        originalQuestion={selectedQuestion} 
                        onVariantGenerated={(variant) => {
                          setQuestions(prev => [...prev, variant]);
                          setSelectedQId(variant.id);
                          toast("Variant generated and saved successfully", "success");
                        }} 
                      />
                    </div>
                  )}
                  {isActive && <div className="spinner"></div>}
                </div>
                
                <h3 className="qb-question-text">{selectedQuestion.text}</h3>

                {isActive && (
                  <div className="qb-answer-streaming" ref={activeQRef}>
                    {streamingStreamText.length === 0 ? (
                      <div className="thinking-indicator">
                        Thinking...
                      </div>
                    ) : (
                      <div className="markdown-body">
                        <MarkdownRenderer 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '')
                              if (!inline && match && match[1] === 'mermaid') {
                                if (isActive) {
                                  return (
                                    <pre className={className} style={{ margin: '16px 0', padding: '16px', background: 'var(--bg-hover)', borderRadius: '8px', overflowX: 'auto' }}>
                                      <code className={className} {...props}>{children}</code>
                                    </pre>
                                  );
                                }
                                return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />
                              }
                              return <code className={className} {...props}>{children}</code>
                            }
                          }}
                        >
                          {streamingStreamText}
                        </MarkdownRenderer>
                        <span className="cursor-blink">|</span>
                      </div>
                    )}
                  </div>
                )}

                {!isActive && selectedQuestion.answer && (
                  <div className="qb-answer-final">
                    <div className="answer-badge"><CheckCircle2 size={16} /> Generated Answer</div>
                    <div className="markdown-body">
                      <MarkdownRenderer 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            if (!inline && match && match[1] === 'mermaid') {
                              return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />
                            }
                            return <code className={className} {...props}>{children}</code>
                          }
                        }}
                      >
                        {selectedQuestion.answer}
                      </MarkdownRenderer>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>


    </div>
  );
}

const RefreshCwIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
