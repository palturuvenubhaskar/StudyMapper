import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningLessonById, updateLearningLesson } from '../../data/repository';
import { analyzeCodingSolutionPrompt, callOpenRouterStream, generateLearningLessonPrompt, extractJson } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Play, Loader, Code2, BookOpen, Sparkles } from 'lucide-react';
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

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [streamingAnalysis, setStreamingAnalysis] = useState('');
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' or 'problem'

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const l = await getLearningLessonById(lessonId);
      if (!l) { if (isMounted) navigate('/coding'); return; }
      
      if (isMounted) {
        setLesson(l);
        setCode(l.user_code || '');
        setAnalysis(l.ai_analysis || '');
        setLoading(false);
      }

      // If the lesson is marked as generating, kick off the stream
      if (l.status === 'generating') {
        if (isMounted) setGeneratingLesson(true);
        
        try {
          const messages = generateLearningLessonPrompt(l.language, l.topic);
          let rawJsonString = "";
          
          const finalResponse = await callOpenRouterStream(messages, (chunkText) => {
            if (!isMounted) return;
            rawJsonString = chunkText;
            
            // Try to extract just the theory part for a nice streaming view
            const theoryMatch = chunkText.match(/"theory":\s*"([\s\S]*?)(?:",\s*"problem_statement"|"$)/);
            if (theoryMatch && theoryMatch[1]) {
               // Replace escaped newlines with actual newlines for markdown rendering
               setStreamedTheory(theoryMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
            } else {
               setStreamedTheory("Generating lesson content...");
            }
          });

          if (!isMounted) return;

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
            setLesson({ ...l, ...updated });
            toast('Lesson generated successfully!', 'success');
          } else {
            throw new Error("Failed to parse the generated lesson format.");
          }
        } catch (err) {
          console.error(err);
          if (isMounted) toast('Error generating lesson: ' + err.message, 'error');
        } finally {
          if (isMounted) setGeneratingLesson(false);
        }
      }
    })();

    return () => { isMounted = false; };
  }, [lessonId, navigate]);

  const handleSubmit = async () => {
    if (!code.trim()) { toast('Write some code first', 'error'); return; }
    setAnalyzing(true);
    setStreamingAnalysis('');
    setAnalysis('');

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
      toast(isSolved ? '✅ Solution looks correct!' : '⚠️ Analysis complete', isSolved ? 'success' : 'info');
    } catch (err) {
      console.error(err);
      toast('Failed to analyze: ' + err.message, 'error');
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
            {lesson.status === 'solved' ? '✅ Completed' : '⏳ In Progress'}
          </span>
        </div>
      </div>

      <div className="workspace-split">
        {/* Left: Theory and Problem Statement */}
        <div className="workspace-left">
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
              {generatingLesson ? (
                <div className="markdown-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--accent-brand)' }}>
                     <Sparkles size={24} className="spin-icon" />
                     <h2 style={{ margin: 0, color: 'var(--accent-brand)' }}>Generating Lesson...</h2>
                  </div>
                  <MarkdownRenderer remarkPlugins={[remarkGfm]}>{streamedTheory}</MarkdownRenderer>
                  <span className="cursor-blink">|</span>
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

        {/* Right: Code editor */}
        <div className="workspace-right">
          <div className="glass-card code-panel">
            <div className="code-editor-header">
              <span>{lesson.language} Code</span>
              <span>{code.split('\n').length} lines</span>
            </div>
            <textarea
              className="code-textarea"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`// Write your ${lesson.language} solution here...`}
              spellCheck="false"
            />
            <div className="code-actions">
              <button className="btn btn-primary" onClick={handleSubmit} disabled={analyzing || !code.trim()}>
                {analyzing ? <><Loader size={16} className="spin-icon" /> Analyzing...</> : <><Play size={16} /> Submit Code</>}
              </button>
            </div>
          </div>

          {/* Analysis */}
          {(analyzing || analysis) && (
            <div className="glass-card analysis-panel">
              <div className="markdown-body">
                <MarkdownRenderer remarkPlugins={[remarkGfm]}>{analyzing ? streamingAnalysis : analysis}</MarkdownRenderer>
                {analyzing && <span className="cursor-blink">|</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
