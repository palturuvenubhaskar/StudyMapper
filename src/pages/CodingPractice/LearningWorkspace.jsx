import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningLessonById, updateLearningLesson } from '../../data/repository';
import { reviewLearningSolutionPrompt, callOpenRouterStream, generateLearningLessonPrompt, extractJson } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import GeneratingState from '../../components/GeneratingState/GeneratingState';
import GenerationError from '../../components/GenerationError/GenerationError';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronRight, Clock,
  Code2, Lightbulb, Loader, Sparkles,
} from 'lucide-react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CodeEditorPanel from './components/CodeEditorPanel';
import { openAICoach } from '../../components/AIAssistant/coachBridge';
import { getLessonStep } from './data/curriculum';
import './CodingPractice.css';
import './LearningWorkspace.css';

// Only the Verdict section decides pass/fail; a ✅ mentioned elsewhere must not.
const readVerdict = (review) => {
  const verdictSection = review.split(/^##\s*Verdict\s*$/im).pop() || review;
  return /✅/.test(verdictSection) && !/❌/.test(verdictSection);
};

const wordsOf = (text) => new Set(
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)
);

const looksLikeSameTitle = (a, b) => {
  const first = wordsOf(a);
  const second = wordsOf(b);
  if (!first.size || !second.size) return false;
  let shared = 0;
  first.forEach((word) => { if (second.has(word)) shared += 1; });
  return shared / Math.min(first.size, second.size) >= 0.5;
};

const withoutTitleHeading = (markdown, title, topic) => {
  if (!markdown) return '';
  const match = markdown.match(/^\s*#{1,3}\s+([^\n]+)\n+/);
  if (!match) return markdown;
  const heading = match[1].trim();
  if (!looksLikeSameTitle(heading, title) && !looksLikeSameTitle(heading, topic)) return markdown;
  return markdown.slice(match[0].length);
};

// Below this width the workspace becomes a single-pane tab flow.
const MOBILE_MAX_WIDTH = 900;

export default function LearningWorkspace() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [lesson, setLesson] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Lesson generation
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [streamedTheory, setStreamedTheory] = useState('');
  const [lessonError, setLessonError] = useState(null);

  // AI review of the user's code
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [streamingAnalysis, setStreamingAnalysis] = useState('');
  const [analysisError, setAnalysisError] = useState(null);
  const [reviewCollapsed, setReviewCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'exercise'

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_MAX_WIDTH);
  const [mobileView, setMobileView] = useState('learn'); // 'learn' | 'code' | 'review'

  const isMountedRef = useRef(true);
  const savedCodeRef = useRef('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToPath = useCallback(() => {
    const language = lesson?.language || 'Python';
    navigate(`/coding?tab=learn&lang=${encodeURIComponent(language)}`);
  }, [lesson?.language, navigate]);

  const openAssistant = () => {
    openAICoach();
  };

  const generateLesson = useCallback(async (l) => {
    if (!l) return;
    setGeneratingLesson(true);
    setLessonError(null);
    setStreamedTheory('');

    try {
      const messages = generateLearningLessonPrompt(l.language, l.topic);
      const finalResponse = await callOpenRouterStream(messages, (chunkText) => {
        // Show the theory field while the rest of the JSON is still arriving.
        const theoryMatch = chunkText.match(/"theory":\s*"([\s\S]*?)(?:",\s*"problem_statement"|"$)/);
        if (theoryMatch && theoryMatch[1]) {
          setStreamedTheory(theoryMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
        } else {
          setStreamedTheory('');
        }
      });

      const parsed = extractJson(finalResponse);
      if (parsed && parsed.title && parsed.theory) {
        const updated = {
          title: parsed.title,
          theory: parsed.theory,
          problem_statement: parsed.problem_statement || 'No exercise provided.',
          sample_input: parsed.sample_input || '',
          sample_output: parsed.sample_output || '',
          hints: parsed.hints || '',
          status: 'attempted' // Generation complete, ready to be attempted
        };
        await updateLearningLesson(lessonId, updated);
        setLesson(prev => ({ ...(prev || l), ...updated }));
        toast('Lesson generated successfully!', 'success');
      } else {
        setLessonError('The AI response was incomplete. Try again to finish this lesson.');
        await updateLearningLesson(lessonId, { status: 'attempted' });
        setLesson(prev => prev ? { ...prev, status: 'attempted' } : prev);
      }
    } catch (err) {
      console.error(err);
      setLessonError('The AI service did not respond. This is usually temporary.');
      await updateLearningLesson(lessonId, { status: 'attempted' });
      setLesson(prev => prev ? { ...prev, status: 'attempted' } : prev);
    } finally {
      setGeneratingLesson(false);
    }
  }, [lessonId, toast]);

  useEffect(() => {
    isMountedRef.current = true;

    (async () => {
      const l = await getLearningLessonById(lessonId);
      if (!l) { if (isMountedRef.current) navigate('/coding'); return; }

      if (isMountedRef.current) {
        setLesson(l);
        setCode(l.user_code || '');
        savedCodeRef.current = l.user_code || '';
        setAnalysis(l.ai_analysis || '');
        setLoading(false);
      }

      if (l.status === 'generating') {
        generateLesson(l);
      }
    })();

    return () => { isMountedRef.current = false; };
  }, [lessonId, navigate, generateLesson]);

  // Keep a draft of the code so leaving the lesson never loses work.
  useEffect(() => {
    if (loading || !lesson || code === savedCodeRef.current) return undefined;
    const timer = setTimeout(() => {
      savedCodeRef.current = code;
      updateLearningLesson(lessonId, { user_code: code }).catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [code, lesson, lessonId, loading]);

  const handleSubmit = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    setAnalyzing(true);
    setStreamingAnalysis('');
    setAnalysis('');
    setAnalysisError(null);
    setReviewCollapsed(false);
    if (isMobile) setMobileView('review');

    try {
      await updateLearningLesson(lessonId, { user_code: code });

      // The learning lesson stores its exercise in problem_statement, while the
      // review prompt expects a problem-shaped object.
      const exercise = {
        title: lesson.title,
        statement: lesson.problem_statement,
        sample_input: lesson.sample_input,
        sample_output: lesson.sample_output,
      };
      const messages = reviewLearningSolutionPrompt(exercise, code, lesson.language);
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        setStreamingAnalysis(textSoFar);
      });

      setAnalysis(fullText);
      setStreamingAnalysis('');

      const isSolved = readVerdict(fullText);
      await updateLearningLesson(lessonId, { ai_analysis: fullText, status: isSolved ? 'solved' : 'attempted' });
      setLesson(prev => ({ ...prev, status: isSolved ? 'solved' : 'attempted', ai_analysis: fullText, user_code: code }));
      savedCodeRef.current = code;
      toast(isSolved ? 'Lesson complete — nice work!' : 'Feedback ready', isSolved ? 'success' : 'info');
    } catch (err) {
      console.error(err);
      setAnalysisError('The AI service did not respond. Your code is saved — try the review again.');
    }
    setAnalyzing(false);
  };

  const handleReset = () => {
    if (!code.trim()) return;
    if (!window.confirm('Clear your code and start this exercise over?')) return;
    setCode('');
    setAnalysis('');
    setAnalysisError(null);
    setReviewCollapsed(false);
    savedCodeRef.current = '';
    updateLearningLesson(lessonId, { user_code: '', ai_analysis: '' }).catch(() => {});
    setLesson(prev => prev ? { ...prev, ai_analysis: '', status: 'attempted' } : prev);
    toast('Editor cleared', 'info');
  };

  if (loading || !lesson) {
    return (
      <div className="lesson-loading">
        <Loader className="spin-icon" size={26} />
        <span>Opening lesson…</span>
      </div>
    );
  }

  const progress = getLessonStep(lesson.language, lesson.topic);
  const isBuilding = generatingLesson || lesson.status === 'generating';
  const status = isBuilding
    ? { label: 'Building lesson', tone: 'info' }
    : lesson.status === 'solved'
      ? { label: 'Completed', tone: 'success' }
      : lesson.status === 'attempted'
        ? { label: 'In progress', tone: 'warning' }
        : { label: 'Not started', tone: 'neutral' };

  const hasReview = analyzing || Boolean(analysis) || Boolean(analysisError);
  const theoryBody = withoutTitleHeading(lesson.theory, lesson.title, lesson.topic);
  const reviewStatus = analyzing
    ? 'Reviewing your code…'
    : analysisError
      ? 'Review did not finish'
      : lesson.status === 'solved'
        ? 'Passed — lesson complete'
        : 'Feedback ready';

  const renderGenerating = () => (
    <div className="lesson-prose" aria-busy="true">
      {streamedTheory ? (
        <div className="markdown-body">
          <MarkdownRenderer remarkPlugins={[remarkGfm]}>
            {withoutTitleHeading(streamedTheory, lesson.title, lesson.topic)}
          </MarkdownRenderer>
          <span className="lesson-caret">|</span>
        </div>
      ) : (
        <div className="lesson-generating">
          <GeneratingState
            inline
            label="Writing your lesson"
            hint="Theory, an example, and an exercise are on the way."
          />
          <div className="lesson-skeleton" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
        </div>
      )}
    </div>
  );

  const renderTheory = () => (
    <article className="lesson-prose markdown-body">
      <MarkdownRenderer remarkPlugins={[remarkGfm]}>{theoryBody}</MarkdownRenderer>
    </article>
  );

  const renderExercise = () => (
    <article className="lesson-prose markdown-body">
      <h2 className="lesson-exercise-title">Your task</h2>
      <div className="lesson-task">
        <MarkdownRenderer remarkPlugins={[remarkGfm]}>{lesson.problem_statement}</MarkdownRenderer>
      </div>

      {(lesson.sample_input || lesson.sample_output) && (
        <div className="lesson-io">
          <div className="lesson-io-card">
            <span className="lesson-io-label">Sample input</span>
            <pre>{lesson.sample_input || '—'}</pre>
          </div>
          <div className="lesson-io-card">
            <span className="lesson-io-label">Expected output</span>
            <pre>{lesson.sample_output || '—'}</pre>
          </div>
        </div>
      )}

      {lesson.hints && (
        <details className="lesson-hint">
          <summary>
            <Lightbulb size={15} />
            Stuck? Show a hint
          </summary>
          <div className="lesson-hint-body">
            <MarkdownRenderer remarkPlugins={[remarkGfm]}>{lesson.hints}</MarkdownRenderer>
          </div>
        </details>
      )}

      <p className="lesson-next">
        Write your program in the editor, then choose <strong>Check my code</strong> to get tutor feedback.
      </p>
    </article>
  );

  const renderLearningPane = () => (
    <section className="lesson-pane" aria-label="Lesson material">
      <div className="lesson-pane-head">
        <div className="lesson-seg" role="tablist" aria-label="Lesson material">
          <button
            type="button"
            role="tab"
            className="lesson-seg-btn"
            aria-selected={activeTab === 'theory'}
            onClick={() => setActiveTab('theory')}
          >
            <BookOpen size={15} /> Learn
          </button>
          <button
            type="button"
            role="tab"
            className="lesson-seg-btn"
            aria-selected={activeTab === 'exercise'}
            onClick={() => setActiveTab('exercise')}
          >
            <Code2 size={15} /> Exercise
          </button>
        </div>
        {progress && (
          <span className="lesson-pane-meta">
            <Clock size={13} /> {progress.time}
          </span>
        )}
      </div>

      <div className="lesson-pane-body" role="tabpanel">
        {lessonError && !generatingLesson && (
          <GenerationError
            title="Couldn't generate this lesson"
            message={lessonError}
            onRetry={() => generateLesson(lesson)}
            retrying={generatingLesson}
            className="lesson-generation-error"
          />
        )}
        {isBuilding ? renderGenerating() : activeTab === 'theory' ? renderTheory() : renderExercise()}
      </div>
    </section>
  );

  const renderReviewDock = () => (
    <section className={`lesson-review${reviewCollapsed ? ' is-collapsed' : ''}`} aria-label="AI review">
      <div className="lesson-review-head">
        <span className="lesson-review-icon" aria-hidden="true">
          <Sparkles size={15} />
        </span>
        <div className="lesson-review-copy">
          <span className="lesson-review-title">AI review</span>
          <span className="lesson-review-sub">{reviewStatus}</span>
        </div>
        {lesson.status === 'solved' && !analyzing && (
          <span className="lesson-verdict is-correct">
            <CheckCircle2 size={12} /> Correct
          </span>
        )}
        <div className="lesson-review-actions">
          {analysis && !analyzing && (
            <button type="button" className="lesson-text-btn" onClick={openAssistant}>
              Ask a follow-up
            </button>
          )}
          <button
            type="button"
            className="lesson-icon-btn"
            aria-expanded={!reviewCollapsed}
            aria-label={reviewCollapsed ? 'Expand review' : 'Collapse review'}
            onClick={() => setReviewCollapsed(value => !value)}
          >
            <ChevronDown size={16} className={reviewCollapsed ? 'is-flipped' : ''} />
          </button>
        </div>
      </div>

      {!reviewCollapsed && (
        <div className="lesson-review-body">
          {lesson.status === 'solved' && !analyzing && (
            <div className="lesson-complete">
              <CheckCircle2 size={18} />
              <div className="lesson-complete-copy">
                <strong>Lesson complete</strong>
                <span>{progress ? `Step ${progress.step} is done and the next one is unlocked.` : 'The next lesson is unlocked.'}</span>
              </div>
              <button type="button" className="lesson-complete-btn" onClick={goToPath}>
                Continue
              </button>
            </div>
          )}

          {analysisError ? (
            <GenerationError
              compact
              title="Couldn't review your solution"
              message={analysisError}
              onRetry={handleSubmit}
              retrying={analyzing}
            />
          ) : analyzing && !streamingAnalysis ? (
            <GeneratingState
              inline
              label="Reading your code"
              hint="Checking it against the exercise and your sample output."
            />
          ) : (
            <div className="lesson-review-prose markdown-body">
              <MarkdownRenderer remarkPlugins={[remarkGfm]}>
                {analyzing ? streamingAnalysis : analysis}
              </MarkdownRenderer>
              {analyzing && <span className="lesson-caret">|</span>}
            </div>
          )}
        </div>
      )}
    </section>
  );

  const renderCodePane = (showReview = true) => (
    <section className="lesson-code" aria-label="Code editor">
      <div className="lesson-editor">
        <CodeEditorPanel
          code={code}
          setCode={setCode}
          language={lesson.language}
          setLanguage={() => {}}
          lockLanguage
          mode="learn"
          onRun={undefined}
          isRunning={false}
          onSubmit={handleSubmit}
          isSubmitting={analyzing}
          onReset={handleReset}
          onAskAI={openAssistant}
        />
      </div>
      {showReview && hasReview && renderReviewDock()}
    </section>
  );

  const renderReviewEmpty = () => (
    <div className="lesson-empty">
      <span className="lesson-empty-icon" aria-hidden="true"><Sparkles size={20} /></span>
      <h2>No review yet</h2>
      <p>
        Write your program in the editor, then choose <strong>Check my code</strong>.
        Your tutor will point out what works and the smallest thing to fix.
      </p>
      <button type="button" className="lesson-empty-btn" onClick={() => setMobileView('code')}>
        <Code2 size={15} /> Open editor
      </button>
    </div>
  );

  const mobileTabs = [
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'review', label: 'Review', icon: Sparkles },
  ];

  return (
    <div className="lesson-workspace">
      <header className="lesson-bar">
        <button
          type="button"
          className="lesson-back"
          onClick={goToPath}
          aria-label="Back to the learning path"
          title="Back to the learning path"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="lesson-bar-main">
          <nav className="lesson-crumbs" aria-label="Breadcrumb">
            <button type="button" className="lesson-crumb-link" onClick={goToPath}>
              Coding practice
            </button>
            <ChevronRight size={12} className="lesson-crumb-sep" aria-hidden="true" />
            <span>{lesson.language}</span>
            {progress && (
              <>
                <span className="lesson-crumb-dot" aria-hidden="true" />
                <span>Step {progress.step} of {progress.total}</span>
              </>
            )}
          </nav>
          <h1 className="lesson-heading" title={lesson.title}>{lesson.title}</h1>
        </div>

        <div className="lesson-bar-side">
          {progress && (
            <div
              className="lesson-progress"
              role="img"
              aria-label={`Step ${progress.step} of ${progress.total} in the ${lesson.language} track`}
            >
              <div className="lesson-progress-text">
                <span>{progress.step} / {progress.total}</span>
                <span>{Math.round((progress.step / progress.total) * 100)}%</span>
              </div>
              <div className="lesson-progress-track">
                <div
                  className="lesson-progress-fill"
                  style={{ width: `${(progress.step / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
          <span className={`lesson-status is-${status.tone}`}>
            {status.tone === 'info' && <Loader size={12} className="spin-icon" />}
            {status.tone === 'success' && <CheckCircle2 size={12} />}
            {status.label}
          </span>
        </div>
      </header>

      {isMobile ? (
        <>
          <div className="lesson-mobile-tabs" role="tablist" aria-label="Workspace">
            {mobileTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                className="lesson-mobile-tab"
                aria-selected={mobileView === id}
                onClick={() => setMobileView(id)}
              >
                <Icon size={15} />
                {label}
                {id === 'review' && hasReview && <span className="lesson-tab-dot" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="lesson-mobile-body">
            {mobileView === 'learn' && renderLearningPane()}
            {mobileView === 'code' && renderCodePane(false)}
            {mobileView === 'review' && (hasReview ? renderReviewDock() : renderReviewEmpty())}
          </div>
        </>
      ) : (
        <div className="lesson-shell">
          <PanelGroup orientation="horizontal">
            <Panel defaultSize={43} minSize={30}>
              {renderLearningPane()}
            </Panel>

            <PanelResizeHandle className="lesson-resize">
              <span className="lesson-resize-grip" aria-hidden="true" />
            </PanelResizeHandle>

            <Panel defaultSize={57} minSize={38}>
              {renderCodePane()}
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
}
