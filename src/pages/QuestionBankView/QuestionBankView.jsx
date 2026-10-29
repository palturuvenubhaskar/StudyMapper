import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionBankById, getQuestionsForBank, updateQuestionAnswer, updateQuestionBank } from '../../data/repository';
import { callOpenRouterStream, getQuestionAnswerPrompt } from '../../core/api/aiService';
import { db } from '../../data/db';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import GeneratingState, { GeneratingDots } from '../../components/GeneratingState/GeneratingState';
import GenerationError from '../../components/GenerationError/GenerationError';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit2,
  FileText,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import QuestionVariantGenerator from '../../components/MockExamSimulator/QuestionVariantGenerator';
import './QuestionBankView.css';

const REMARK_PLUGINS = [remarkGfm];

const STREAMING_COMPONENTS = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match && match[1] === 'mermaid') {
      return (
        <pre className={className} style={{ margin: '16px 0', padding: '16px', background: 'var(--bg-hover)', borderRadius: '8px', overflowX: 'auto' }}>
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    }
    return <code className={className} {...props}>{children}</code>;
  }
};

const normalizeForCompare = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/**
 * Answers sometimes open by restating the question as a heading or bold line.
 * Rendering that twice (once as the prompt, once at the top of the answer) is
 * noise, so drop the echoed line when it clearly repeats the question.
 */
function stripQuestionEcho(answer, questionText) {
  if (!answer || !questionText) return answer;

  const lines = answer.split('\n');
  let firstContent = 0;
  while (firstContent < lines.length && !lines[firstContent].trim()) firstContent += 1;
  if (firstContent === lines.length) return answer;

  const rawLine = lines[firstContent].trim();
  const heading = rawLine.match(/^#{1,6}\s+(.*)$/);
  const candidate = (heading ? heading[1] : rawLine.replace(/^\*\*(.*)\*\*$/, '$1'))
    .replace(/[*_`]/g, '')
    .trim();

  const echo = normalizeForCompare(candidate);
  const question = normalizeForCompare(questionText);
  if (!echo || !question) return answer;

  const isSame = echo === question;
  const isNearSame =
    echo.length > 20 &&
    question.length > 20 &&
    Math.abs(echo.length - question.length) <= 8 &&
    (echo.startsWith(question) || question.startsWith(echo));

  if (!isSame && !isNearSame) return answer;

  lines.splice(firstContent, 1);
  return lines.join('\n').replace(/^\s+/, '');
}

const formatMarks = (marks) => {
  if (marks == null || marks === '') return null;
  const value = String(marks).trim();
  if (!value || /^unknown$/i.test(value)) return null;
  return /^\d+$/.test(value) ? `${value} mark${value === '1' ? '' : 's'}` : value;
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Answered' },
];

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

  // Navigator state
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [railOpen, setRailOpen] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(max-width: 1024px)').matches
  );

  // Streaming state for active question
  const [activeQId, setActiveQId] = useState(null);
  const [streamingStreamText, setStreamingStreamText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [answerErrors, setAnswerErrors] = useState({});
  const activeQRef = useRef(null);
  const copyTimerRef = useRef(null);
  const detailRef = useRef(null);
  const hasSelectedOnceRef = useRef(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    hasSelectedOnceRef.current = false;
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
  }, [bankId, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  // Bring a newly chosen question into view without jumping the whole page.
  // The first selection comes from loading the bank, so leave the header visible.
  useEffect(() => {
    if (selectedQId == null) return;
    if (!hasSelectedOnceRef.current) {
      hasSelectedOnceRef.current = true;
      return;
    }
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCopied(false);
  }, [selectedQId]);

  const answeredCount = useMemo(() => questions.filter(q => q.answer).length, [questions]);
  const totalMarks = useMemo(
    () => questions.reduce((sum, q) => sum + (Number.parseInt(q.marks, 10) || 0), 0),
    [questions]
  );
  const indexById = useMemo(
    () => new Map(questions.map((q, index) => [q.id, index])),
    [questions]
  );
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const visibleQuestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    return questions.filter(q => {
      if (filter === 'done' && !q.answer) return false;
      if (filter === 'todo' && q.answer) return false;
      if (!term) return true;
      return q.text?.toLowerCase().includes(term);
    });
  }, [questions, filter, query]);

  const selectedQuestion = questions.find(q => q.id === selectedQId);
  const selectedIndex = selectedQuestion ? indexById.get(selectedQuestion.id) : -1;
  const selectedMarks = selectedQuestion ? formatMarks(selectedQuestion.marks) : null;
  const answerText = useMemo(
    () => stripQuestionEcho(selectedQuestion?.answer, selectedQuestion?.text),
    [selectedQuestion]
  );

  const generateAnswer = async (question, detailLevel = 'detailed') => {
    if (isStreaming) return;
    setActiveQId(question.id);
    setIsStreaming(true);
    setStreamingStreamText('');
    setAnswerErrors(prev => ({ ...prev, [question.id]: null }));

    try {
      const messages = getQuestionAnswerPrompt(question.text, question.marks, subject?.title || '', detailLevel);

      let lastStreamUpdate = 0;
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        const now = Date.now();
        if (now - lastStreamUpdate < 150) return;
        lastStreamUpdate = now;
        setStreamingStreamText(textSoFar);
      });

      await updateQuestionAnswer(question.id, fullText);

      // Update local state
      setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, answer: fullText } : q));
      toast('Answer generated successfully', 'success');
    } catch (err) {
      console.error(err);
      setAnswerErrors(prev => ({ ...prev, [question.id]: 'The AI service did not respond. This is usually temporary.' }));
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

  const handleCopyAnswer = async () => {
    if (!selectedQuestion?.answer) return;
    try {
      await navigator.clipboard.writeText(selectedQuestion.answer);
      setCopied(true);
      toast('Answer copied to clipboard', 'success');
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      toast('Could not copy the answer', 'error');
    }
  };

  const goToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    setSelectedQId(questions[index].id);
  };

  if (loading) return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;

  const isActive = activeQId === selectedQuestion?.id;
  const activeError = selectedQuestion ? answerErrors[selectedQuestion.id] : null;
  const filterCounts = {
    all: questions.length,
    todo: questions.length - answeredCount,
    done: answeredCount,
  };

  return (
    <div className="qb-page">

      <header className="qb-head">
        <div className="qb-head-copy">
          <span className="qb-eyebrow">
            Question Bank
            {subject && (
              <>
                <span className="qb-eyebrow-dot" aria-hidden="true">·</span>
                <button
                  type="button"
                  className="qb-eyebrow-subject"
                  onClick={() => navigate(`/subject/${bank.subject_id}`)}
                >
                  {subject.title}
                </button>
              </>
            )}
          </span>

          {isEditingTitle ? (
            <div className="qb-title-edit">
              <input
                type="text"
                className="input qb-title-input"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                autoFocus
                aria-label="Question bank name"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <button className="btn btn-primary btn-icon btn-sm" onClick={handleSaveTitle} aria-label="Save name"><Check size={15} /></button>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setIsEditingTitle(false)} aria-label="Cancel rename"><X size={15} /></button>
            </div>
          ) : (
            <h1 className="qb-title">
              {bank.title}
              <button
                type="button"
                className="qb-title-edit-btn"
                onClick={() => { setEditTitle(bank.title); setIsEditingTitle(true); }}
                title="Rename question bank"
                aria-label="Rename question bank"
              >
                <Edit2 size={15} />
              </button>
            </h1>
          )}

          <p className="qb-subtitle">
            {questions.length} question{questions.length === 1 ? '' : 's'}
            {questions.length > 0 && <> · {answeredCount} answered</>}
            {totalMarks > 0 && <> · {totalMarks} marks total</>}
          </p>
        </div>

        <div className="qb-head-actions">
          {questions.length > 0 && (
            <button className="btn btn-primary qb-exam-btn" onClick={() => navigate(`/mock-exam/setup/${bankId}`)}>
              <Play size={15} /> Take mock exam
            </button>
          )}
        </div>
      </header>

      <div className="qb-workspace">
        <aside className={`qb-rail ${railOpen ? 'is-open' : ''}`} aria-label="Questions in this bank">
          <div className="qb-rail-head">
            <div className="qb-rail-title-row">
              <h2 className="qb-rail-title">Questions</h2>
              <span className="qb-rail-total">{answeredCount}/{questions.length}</span>
              <button
                type="button"
                className="qb-rail-toggle"
                onClick={() => setRailOpen(open => !open)}
                aria-expanded={railOpen}
                aria-label={railOpen ? 'Hide question list' : 'Show question list'}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div
              className="qb-progress"
              role="progressbar"
              aria-label="Questions answered"
              aria-valuemin={0}
              aria-valuemax={Math.max(questions.length, 1)}
              aria-valuenow={answeredCount}
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            <p className="qb-progress-text">
              {questions.length === 0
                ? 'No questions in this bank yet'
                : questions.length - answeredCount === 0
                  ? 'Every question answered'
                  : `${questions.length - answeredCount} still need${questions.length - answeredCount === 1 ? 's' : ''} an answer`}
            </p>

            <div className="qb-rail-controls">
              <div className="qb-search">
                <Search size={14} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search questions"
                  aria-label="Search questions"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="qb-filters" role="group" aria-label="Filter questions">
                {FILTERS.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`qb-filter ${filter === option.id ? 'is-active' : ''}`}
                    aria-pressed={filter === option.id}
                    onClick={() => setFilter(option.id)}
                  >
                    {option.label}
                    <span className="qb-filter-count">{filterCounts[option.id]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="qb-rail-list">
            {visibleQuestions.length === 0 ? (
              <p className="qb-rail-empty">
                {questions.length === 0 ? 'No questions in this bank yet.' : 'No questions match this view.'}
              </p>
            ) : visibleQuestions.map(q => {
              const index = indexById.get(q.id);
              const active = selectedQId === q.id;
              return (
                <button
                  key={q.id}
                  type="button"
                  className={`qb-row ${active ? 'is-active' : ''} ${q.answer ? 'is-answered' : ''}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => { setSelectedQId(q.id); setRailOpen(false); }}
                >
                  <span className="qb-row-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="qb-row-copy">
                    <span className="qb-row-text">{q.text}</span>
                    <span className="qb-row-meta">
                      <span>{formatMarks(q.marks) || 'Marks not set'}</span>
                      {q.answer && (
                        <span className="qb-row-done">
                          <Check size={11} aria-hidden="true" /> Answered
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="qb-detail" ref={detailRef}>
          {!selectedQuestion ? (
            <div className="qb-card qb-card--empty">
              <span className="qb-empty-icon"><FileText size={22} /></span>
              <h2>No question selected</h2>
              <p>{questions.length === 0 ? 'Add questions to this bank to start studying.' : 'Pick a question from the list to read or generate its answer.'}</p>
            </div>
          ) : (
            <article className={`qb-card ${isActive ? 'is-streaming' : ''}`}>
              <div className="qb-card-head">
                <div className="qb-q-meta">
                  <span className="qb-q-num">Q{selectedIndex + 1}</span>
                  {selectedMarks && <span className="qb-chip">{selectedMarks}</span>}
                  {isActive ? (
                    <span className="qb-chip is-live">
                      <GeneratingDots size="sm" /> Generating
                    </span>
                  ) : selectedQuestion.answer ? (
                    <span className="qb-chip is-done">
                      <CheckCircle2 size={12} aria-hidden="true" /> Answered
                    </span>
                  ) : null}
                </div>

                {!isActive && !isStreaming && (
                  <div className="qb-actions">
                    <select
                      className="qb-mode"
                      aria-label="Answer detail level"
                      onChange={e => setQuestions(prev => prev.map(p => p.id === selectedQuestion.id ? { ...p, detailPreference: e.target.value } : p))}
                      value={selectedQuestion.detailPreference || 'simple'}
                    >
                      <option value="simple">Simple</option>
                      <option value="detailed">Detailed</option>
                    </select>
                    {selectedQuestion.answer && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => generateAnswer(selectedQuestion, selectedQuestion.detailPreference || 'simple')}
                      >
                        <RefreshCw size={14} /> Regenerate
                      </button>
                    )}
                    <QuestionVariantGenerator
                      originalQuestion={selectedQuestion}
                      onVariantGenerated={(variant) => {
                        setQuestions(prev => [...prev, variant]);
                        setSelectedQId(variant.id);
                        toast('Variant generated and saved successfully', 'success');
                      }}
                    />
                  </div>
                )}
              </div>

              <h2 className="qb-q-text">{selectedQuestion.text}</h2>

              {isActive && (
                <div className="qb-answer qb-answer--streaming" ref={activeQRef} aria-live="polite">
                  {streamingStreamText.length === 0 ? (
                    <GeneratingState inline label="Thinking" hint="Working through this question." />
                  ) : (
                    <div className="markdown-body qb-markdown">
                      <MarkdownRenderer
                        remarkPlugins={REMARK_PLUGINS}
                        components={STREAMING_COMPONENTS}
                      >
                        {streamingStreamText}
                      </MarkdownRenderer>
                      <span className="cursor-blink">|</span>
                    </div>
                  )}
                </div>
              )}

              {!isActive && selectedQuestion.answer && (
                <div className="qb-answer">
                  <div className="qb-answer-bar">
                    <span className="qb-answer-status">
                      <span className="qb-status-dot" aria-hidden="true" /> Generated answer
                    </span>
                    <button type="button" className="qb-copy" onClick={handleCopyAnswer}>
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="markdown-body qb-markdown">
                    <MarkdownRenderer remarkPlugins={REMARK_PLUGINS}>
                      {answerText}
                    </MarkdownRenderer>
                  </div>
                </div>
              )}

              {!isActive && !selectedQuestion.answer && !activeError && (
                <div className="qb-no-answer">
                  <span className="qb-no-answer-icon"><Sparkles size={18} /></span>
                  <div className="qb-no-answer-copy">
                    <h3>No answer yet</h3>
                    <p>Generate a clear, exam-ready answer for this question.</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => generateAnswer(selectedQuestion, selectedQuestion.detailPreference || 'simple')}
                  >
                    <Sparkles size={14} /> Generate answer
                  </button>
                </div>
              )}

              {!isActive && activeError && (
                <GenerationError
                  className="qb-generation-error"
                  title="Couldn't generate an answer"
                  message={activeError}
                  onRetry={() => generateAnswer(selectedQuestion, selectedQuestion.detailPreference || 'simple')}
                  retrying={isStreaming && activeQId === selectedQuestion.id}
                />
              )}

              <nav className="qb-pager" aria-label="Question navigation">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => goToQuestion(selectedIndex - 1)}
                  disabled={selectedIndex <= 0 || isStreaming}
                >
                  <ChevronLeft size={15} /> Previous
                </button>
                <span className="qb-pager-count">{selectedIndex + 1} of {questions.length}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => goToQuestion(selectedIndex + 1)}
                  disabled={selectedIndex >= questions.length - 1 || isStreaming}
                >
                  Next <ChevronRight size={15} />
                </button>
              </nav>
            </article>
          )}
        </section>
      </div>

    </div>
  );
}
