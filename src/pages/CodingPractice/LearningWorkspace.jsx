import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningLessonById, updateLearningLesson } from '../../data/repository';
import { analyzeCodingSolutionPrompt, callOpenRouterStream, generateLearningLessonPrompt, extractJson } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import GeneratingState from '../../components/GeneratingState/GeneratingState';
import GenerationError from '../../components/GenerationError/GenerationError';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Play, Loader, Code2, BookOpen } from 'lucide-react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CodeEditorPanel from './components/CodeEditorPanel';
import './CodingPractice.css';

export default function LearningWorkspace() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [lesson, setLesson] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Generation state
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [streamedTheory, setStreamedTheory] = useState('');
  const [lessonError, setLessonError] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [streamingAnalysis, setStreamingAnalysis] = useState('');
  const [analysisError, setAnalysisError] = useState(null);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' or 'problem'

  // Stack the panes on narrow screens instead of squeezing them side by side
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMountedRef = useRef(true);

  const generateLesson = useCallback(async (l) => {
    if (!l) return;
    setGeneratingLesson(true);
    setLessonError(null);
    setStreamedTheory('');

    try {
      const messages = generateLearningLessonPrompt(l.language, l.topic);
      const finalResponse = await callOpenRouterStream(messages, (chunkText) => {
        // Try to extract just the theory part for a nice streaming view
        const theoryMatch = chunkText.match(/"theory":\s*"([\s\S]*?)(?:",\s*"problem_statement"|"$)/);
        if (theoryMatch && theoryMatch[1]) {
          // Replace escaped newlines with actual newlines for markdown rendering
          setStreamedTheory(theoryMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
        } else {
          setStreamedTheory("");
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
        setAnalysis(l.ai_analysis || '');
        setLoading(false);
      }

      // If the lesson is marked as generating, kick off the stream
      if (l.status === 'generating') {
        generateLesson(l);
      }
    })();

    return () => { isMountedRef.current = false; };
  }, [lessonId, navigate, generateLesson]);

  const handleSubmit = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    setAnalyzing(true);
    setStreamingAnalysis('');
    setAnalysis('');
    setAnalysisError(null);

    try {
      await updateLearningLesson(lessonId, { user_code: code });

      const messages = analyzeCodingSolutionPrompt(lesson, code, lesson.language);
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        setStreamingAnalysis(textSoFar);
      });

      setAnalysis(fullText);
      setStreamingAnalysis('');

      const isSolved = fullText.toLowerCase().includes('✅') || fullText.toLowerCase().includes('correct');
      await updateLearningLesson(lessonId, { ai_analysis: fullText, status: isSolved ? 'solved' : 'attempted' });
      setLesson(prev => ({ ...prev, status: isSolved ? 'solved' : 'attempted', ai_analysis: fullText, user_code: code }));
      toast(isSolved ? 'Solution looks correct!' : 'Analysis complete', isSolved ? 'success' : 'info');
    } catch (err) {
      console.error(err);
      setAnalysisError('The AI service did not respond. Your code is saved — try the review again.');
    }
    setAnalyzing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  if (loading || !lesson) {
    return <div style={{ padding: '40px', textAlign: 'center' }}><Loader className="spin-icon" size={32} /></div>;
  }

  return (
    <div className="coding-workspace">
      <div className="workspace-header">
        <button className="btn btn-ghost" onClick={() => navigate('/coding')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="header-title">
          <span className="badge badge-accent">{lesson.language}</span>
          <h2>Lesson: {lesson.topic}</h2>
        </div>
        <div className="header-status">
          <span className="badge" style={{ background: lesson.status === 'solved' ? 'var(--success-soft)' : 'var(--warning-soft)', color: lesson.status === 'solved' ? 'var(--success)' : 'var(--warning)' }}>
            {lesson.status === 'solved' ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>

      <div className="split-pane">
        <PanelGroup orientation={isMobile ? 'vertical' : 'horizontal'}>
          
          {/* Left Pane: Theory and Problem Statement */}
          <Panel defaultSize={45} minSize={30}>
            <div className="pane-left-content">
              <div className="glass-card problem-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
                <div className="coding-tabs" style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  <button 
                    className={`btn ${activeTab === 'theory' ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setActiveTab('theory')}
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <BookOpen size={16} /> Theory
                  </button>
                  <button 
                    className={`btn ${activeTab === 'problem' ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setActiveTab('problem')}
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <Code2 size={16} /> Exercise
                  </button>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                  {lessonError && !generatingLesson && (
                    <GenerationError
                      title="Couldn't generate this lesson"
                      message={lessonError}
                      onRetry={() => generateLesson(lesson)}
                      retrying={generatingLesson}
                      className="lesson-generation-error"
                    />
                  )}
                  {generatingLesson ? (
                    <div className="markdown-body">
                      {streamedTheory ? (
                        <>
                          <MarkdownRenderer remarkPlugins={[remarkGfm]}>{streamedTheory}</MarkdownRenderer>
                          <span className="cursor-blink">|</span>
                        </>
                      ) : (
                        <GeneratingState
                          inline
                          label="Writing your lesson"
                          hint="Theory, examples, and an exercise are on the way."
                        />
                      )}
                    </div>
                  ) : activeTab === 'theory' ? (
                    <div className="markdown-body">
                      <h1 style={{ color: 'var(--text-accent)' }}>{lesson.title}</h1>
                      <MarkdownRenderer remarkPlugins={[remarkGfm]}>{lesson.theory}</MarkdownRenderer>
                    </div>
                  ) : (
                    <div className="markdown-body">
                      <h2 style={{ color: 'var(--text-accent)' }}>Exercise</h2>
                      <p>{lesson.problem_statement}</p>

                      {lesson.sample_input && (
                        <>
                          <h3>Sample Input</h3>
                          <pre>{lesson.sample_input}</pre>
                        </>
                      )}

                      <h3>Sample Output</h3>
                      <pre>{lesson.sample_output}</pre>

                      {lesson.hints && (
                        <>
                          <h3>Hint</h3>
                          <div className="hints-content">{lesson.hints}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Panel>

          {!isMobile && <PanelResizeHandle style={{ width: '16px', background: 'transparent', cursor: 'col-resize' }} />}

          {/* Right Pane: Code editor */}
          <Panel defaultSize={55} minSize={40}>
            <div className="pane-right-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: '16px', paddingRight: '4px' }}>
              <div className="pane-right-top" style={{ height: '90vh', flexShrink: 0 }}>
                <CodeEditorPanel 
                  code={code} 
                  setCode={setCode} 
                  language={lesson.language} 
                  setLanguage={() => {}}
                  onRun={() => {}}
                  isRunning={false}
                  onSubmit={handleSubmit}
                  isSubmitting={analyzing}
                  onReset={() => setCode('')}
                  onAskAI={() => {}}
                />
              </div>

              {/* Analysis */}
              {analysisError && !analyzing && (
                <div className="pane-right-bottom" style={{ flexShrink: 0, marginBottom: '24px' }}>
                  <GenerationError
                    title="Couldn't review your solution"
                    message={analysisError}
                    onRetry={handleSubmit}
                    retrying={analyzing}
                  />
                </div>
              )}
              {(analyzing || analysis) && (
                <div className="pane-right-bottom" style={{ minHeight: '400px', flexShrink: 0, marginBottom: '24px' }}>
                  <div className="glass-card analysis-panel" style={{ height: '100%' }}>
                    <div className="markdown-body">
                      <MarkdownRenderer remarkPlugins={[remarkGfm]}>{analyzing ? streamingAnalysis : analysis}</MarkdownRenderer>
                      {analyzing && <span className="cursor-blink">|</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Panel>
          
        </PanelGroup>
      </div>
    </div>
  );
}
