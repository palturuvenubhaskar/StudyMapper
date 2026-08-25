import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../data/db';
import { getLatestTopicContent, saveTopicContent, recordTopicOpened, isTopicBookmarked, addBookmark, deleteBookmark, getBookmarksForTopic, getNotesForTopic, addNote, updateNote, deleteNote } from '../../data/repository';
import { callOpenRouterStream, getTopicNotesPrompt, extractJson, generatePodcastScriptPrompt, generateQuickQuizPrompt, generateConceptWebPrompt } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, RefreshCw, Bookmark, BookmarkCheck, StickyNote, Plus, Trash2, Save, ChevronDown, ChevronUp, Loader, Layers, Copy, Download, Star, Volume2, Mic, CheckSquare, GitBranch, Pause, Square, Play, X } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import MermaidRenderer from '../../components/MarkdownRenderer/MermaidRenderer';
import YouTubeLinker from '../../components/YouTubeLinker/YouTubeLinker';
import { awardXP } from '../../core/gamification/xpEngine';
import { updateQuestProgress } from '../../core/gamification/dailyQuests';
import { checkAchievements } from '../../core/gamification/achievementChecker';
import { updateStreak } from '../../core/gamification/streakTracker';
import { logEvent } from '../../core/analytics/tracker';
import './TopicStudy.css';

const SECTION_MAP = [
  ['learning_objectives', 'Learning Objectives'],
  ['prerequisites', 'Prerequisites'],
  ['introduction', 'Introduction'],
  ['core_concepts', 'Core Concepts'],
  ['how_it_works', 'How It Works'],
  ['diagram', 'Diagram / Visual Representation'],
  ['real_life_analogy', 'Real-Life Analogy'],
  ['real_world_example', 'Real-World Example'],
  ['applications', 'Applications'],
  ['advantages', 'Advantages'],
  ['disadvantages', 'Disadvantages / Limitations'],
  ['comparison', 'Comparison'],
  ['key_terms', 'Key Terms'],
  ['key_points', 'Key Points to Remember'],
  ['summary', 'Summary'],
];

// Try to parse partial JSON by closing open brackets/braces
const tryParsePartialJson = (raw) => {
  if (!raw) return null;
  // Clean trailing markdown backticks that AI models often append
  let cleanedRaw = raw.replace(/```[\s\S]*$/, '').replace(/`+$/, '');
  
  const start = cleanedRaw.indexOf('{');
  if (start === -1) return null;

  let text = cleanedRaw.substring(start);

  // Count open brackets and braces, close them
  let openBraces = 0, openBrackets = 0;
  let inString = false, escape = false;
  for (const ch of text) {
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') openBraces++;
    if (ch === '}') openBraces--;
    if (ch === '[') openBrackets++;
    if (ch === ']') openBrackets--;
  }

  // Remove a trailing incomplete string value (after last complete key-value)
  // Try to find the last complete value by trimming trailing partial data
  // Remove trailing comma if present
  text = text.replace(/,\s*$/, '');
  // If we're in the middle of a string, try to close it
  if (inString) text += '"';
  // Close brackets and braces
  for (let i = 0; i < openBrackets; i++) text += ']';
  for (let i = 0; i < openBraces; i++) text += '}';

  try {
    return JSON.parse(text);
  } catch {
    // Try more aggressive cleanup: remove the last incomplete key-value pair
    const lastComma = text.lastIndexOf(',');
    if (lastComma > 0) {
      let trimmed = text.substring(0, lastComma);
      // Re-close
      let ob = 0, obrk = 0, inStr = false, esc = false;
      for (const ch of trimmed) {
        if (esc) { esc = false; continue; }
        if (ch === '\\') { esc = true; continue; }
        if (ch === '"') { inStr = !inStr; continue; }
        if (inStr) continue;
        if (ch === '{') ob++;
        if (ch === '}') ob--;
        if (ch === '[') obrk++;
        if (ch === ']') obrk--;
      }
      if (inStr) trimmed += '"';
      for (let i = 0; i < obrk; i++) trimmed += ']';
      for (let i = 0; i < ob; i++) trimmed += '}';
      try { return JSON.parse(trimmed); } catch {}
    }
    return null;
  }
};

export default function TopicStudy() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [topic, setTopic] = useState(null);
  const [subject, setSubject] = useState(null);
  const [prerequisites, setPrerequisites] = useState([]);
  const [content, setContent] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Streaming
  const [streaming, setStreaming] = useState(false);
  const [streamParsed, setStreamParsed] = useState(null);

  const [bookmarked, setBookmarked] = useState(false);

  // Notes
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');

  // Collapsed sections
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [readingProgress, setReadingProgress] = useState(0);

  // Phase 9 Features
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [isTTSPaused, setIsTTSPaused] = useState(false);
  
  const [podcastScript, setPodcastScript] = useState('');
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [showPodcast, setShowPodcast] = useState(false);
  
  const [quickQuiz, setQuickQuiz] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [conceptWeb, setConceptWeb] = useState('');
  const [isGeneratingConceptWeb, setIsGeneratingConceptWeb] = useState(false);
  const [showConceptWeb, setShowConceptWeb] = useState(false);

  const studyStartTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollTotal > 0) {
        const scrolled = (document.documentElement.scrollTop / scrollTotal) * 100;
        setReadingProgress(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Log duration when leaving the page
      if (topicId) {
        const durationSeconds = Math.floor((Date.now() - studyStartTime.current) / 1000);
        logEvent('guest', topicId, 'topic_study', durationSeconds, null).catch(console.error);
      }
    };
  }, [topicId]);

  const loadTopicData = async () => {
    setLoading(true);
    const topicData = await db.topics.get(topicId);
    if (!topicData) { navigate('/'); return; }
    setTopic(topicData);

    const unit = await db.units.get(topicData.unit_id);
    if (unit) {
      const sub = await db.subjects.get(unit.subject_id);
      setSubject(sub);
    }

    if (topicData.prerequisite_topic_ids && topicData.prerequisite_topic_ids.length > 0) {
      const prereqs = await db.topics.where('id').anyOf(topicData.prerequisite_topic_ids).toArray();
      setPrerequisites(prereqs);
    } else {
      setPrerequisites([]);
    }

    await recordTopicOpened(topicId);
    setBookmarked(await isTopicBookmarked(topicId));
    setNotes(await getNotesForTopic(topicId));

    const existing = await getLatestTopicContent(topicId);
    if (existing) {
      setContent(existing);
      try { setParsedContent(JSON.parse(existing.generated_json)); } catch {}
    }
    setLoading(false);
  };

  useEffect(() => { loadTopicData(); }, [topicId]);

  const handleRateDifficulty = async (rating) => {
    if (!topic) return;
    try {
      const updated = { ...topic, difficulty_rating: rating };
      await db.topics.put(updated);
      setTopic(updated);
      toast(`Difficulty rated ${rating} stars`, 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to save rating', 'error');
    }
  };

  const handleGenerate = async (regenerate = false) => {
    if (!subject || !topic) return;
    setStreaming(true);
    setStreamParsed(null);
    setParsedContent(null);
    setContent(null);

    let lastSuccessfulParse = null;

    try {
      const messages = getTopicNotesPrompt(topic.title, subject.title);

      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        const partial = tryParsePartialJson(textSoFar);
        if (partial) {
          lastSuccessfulParse = partial;
          setStreamParsed(partial);
        }
      });

      // Final parse
      let parsed = extractJson(fullText);
      if (!parsed) {
        // Fallback: If strict parsing failed (e.g. model hit length limit, or added markdown backticks)
        // use our robust partial parser to salvage what was generated
        parsed = tryParsePartialJson(fullText);
      }
      
      // Absolute final fallback: use the last successful parse from the stream
      if (!parsed && lastSuccessfulParse) {
        parsed = lastSuccessfulParse;
      }

      if (parsed) {
        const jsonStr = JSON.stringify(parsed);
        const saved = await saveTopicContent(topicId, jsonStr);
        setContent(saved);
        setParsedContent(parsed);
        setStreamParsed(null);
        
        if (!regenerate) {
          await awardXP('guest', 50, 'generate_notes', topicId);
          await updateQuestProgress('guest', 'generate_notes', 1);
          await updateStreak('guest');
          await checkAchievements('guest');
          await logEvent('guest', topicId, 'generate_notes', 0, null);
        }

        toast(regenerate ? 'Topic regenerated!' : 'Notes generated!', 'success');
      } else {
        toast('AI response could not be parsed. Try regenerating.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Generation failed: ' + err.message, 'error');
    }
    setStreaming(false);
  };

  const toggleBookmark = async () => {
    if (bookmarked) {
      const bms = await getBookmarksForTopic(topicId);
      for (const bm of bms) { if (!bm.section_id) await deleteBookmark(bm.id); }
      setBookmarked(false);
      toast('Bookmark removed', 'info');
    } else {
      await addBookmark(topicId);
      setBookmarked(true);
      toast('Topic bookmarked!', 'success');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addNote(topicId, newNote.trim());
    setNewNote('');
    setNotes(await getNotesForTopic(topicId));
    toast('Note saved', 'success');
  };

  const handleUpdateNote = async (noteId) => {
    if (!editNoteText.trim()) return;
    await updateNote(noteId, editNoteText.trim());
    setEditingNote(null);
    setNotes(await getNotesForTopic(topicId));
    toast('Note updated', 'success');
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
    setNotes(await getNotesForTopic(topicId));
    toast('Note deleted', 'info');
  };

  const toggleSection = (key) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Phase 9 Handlers
  const handleTTSPlay = () => {
    if (!parsedContent) return;
    if (isTTSPaused) {
      window.speechSynthesis.resume();
      setIsTTSPaused(false);
      setIsTTSPlaying(true);
      return;
    }
    window.speechSynthesis.cancel();
    
    // Build text to read
    let textToRead = `${parsedContent.topic_header?.topic_name || topic?.title}. `;
    SECTION_MAP.forEach(([key, title]) => {
      if (parsedContent[key]) {
        textToRead += `${title}. `;
        if (Array.isArray(parsedContent[key])) {
          textToRead += parsedContent[key].map(item => typeof item === 'string' ? item : item.term).join('. ') + '. ';
        } else {
          textToRead += `${parsedContent[key]}. `;
        }
      }
    });

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.onend = () => { setIsTTSPlaying(false); setIsTTSPaused(false); };
    window.speechSynthesis.speak(utterance);
    setIsTTSPlaying(true);
    setIsTTSPaused(false);
  };

  const handleTTSPause = () => {
    window.speechSynthesis.pause();
    setIsTTSPaused(true);
    setIsTTSPlaying(false);
  };

  const handleTTSStop = () => {
    window.speechSynthesis.cancel();
    setIsTTSPlaying(false);
    setIsTTSPaused(false);
  };

  const handleGeneratePodcast = async () => {
    if (!content) return;
    setShowPodcast(true);
    setIsGeneratingPodcast(true);
    setPodcastScript('');
    try {
      const prompt = generatePodcastScriptPrompt(topic?.title, content);
      await callOpenRouterStream(prompt, setPodcastScript);
    } catch (err) {
      toast('Podcast generation failed.', 'error');
    }
    setIsGeneratingPodcast(false);
  };

  const handleGenerateQuickQuiz = async () => {
    if (!content) return;
    setShowQuizResult(false);
    setQuizAnswers({});
    setQuickQuiz(null);
    setIsGeneratingQuiz(true);
    try {
      const prompt = generateQuickQuizPrompt(topic?.title, content);
      let jsonString = '';
      await callOpenRouterStream(prompt, (t) => { jsonString = t; });
      const parsed = extractJson(jsonString);
      if (Array.isArray(parsed)) {
        setQuickQuiz(parsed);
      } else {
        toast('Quiz format invalid.', 'error');
      }
    } catch (err) {
      toast('Quiz generation failed.', 'error');
    }
    setIsGeneratingQuiz(false);
  };

  const handleQuizSelect = (qIndex, option) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleQuizSubmit = () => {
    setShowQuizResult(true);
  };

  const handleGenerateConceptWeb = async () => {
    if (!content) return;
    setShowConceptWeb(true);
    setIsGeneratingConceptWeb(true);
    setConceptWeb('');
    try {
      const prompt = generateConceptWebPrompt(topic?.title, content);
      let mmText = '';
      await callOpenRouterStream(prompt, (t) => {
        mmText = t;
        const cleaned = t.replace(/```mermaid\n?/g, '').replace(/```/g, '');
        setConceptWeb(cleaned);
      });
    } catch (err) {
      toast('Concept Web generation failed.', 'error');
    }
    setIsGeneratingConceptWeb(false);
  };

  const handleCopyContent = () => {
    if (!parsedContent && !streamParsed) return;
    const data = parsedContent || streamParsed;
    let fullText = `# ${data.topic_header?.topic_name || topic?.title}\n\n`;
    
    SECTION_MAP.forEach(([key, title]) => {
      if (data[key]) {
        fullText += `## ${title}\n`;
        if (Array.isArray(data[key])) {
          if (data[key].length > 0 && typeof data[key][0] === 'string') {
            data[key].forEach(item => fullText += `- ${item}\n`);
          } else if (data[key].length > 0 && typeof data[key][0] === 'object') {
            data[key].forEach(item => {
              if (item.term) fullText += `- **${item.term}**: ${item.definition}\n`;
            });
          }
        } else {
          fullText += `${data[key]}\n`;
        }
        fullText += '\n';
      }
    });

    navigator.clipboard.writeText(fullText)
      .then(() => toast('Content copied to clipboard!', 'success'))
      .catch(() => toast('Failed to copy content.', 'error'));
  };



  // Normalize markdown strings: fix literal \n, escaped pipes, table formatting
  const normalizeMarkdown = (text) => {
    if (typeof text !== 'string') return text;
    let result = text
      .replace(/\\n/g, '\n')       // literal \n → real newline
      .replace(/\\t/g, '\t')       // literal \t → real tab
      .replace(/\\\|/g, '|')       // escaped pipes → real pipes
      .replace(/\r\n/g, '\n');     // normalize line endings

    // Fix markdown tables: ensure table rows have no leading whitespace
    // and separator rows use proper dashes
    const lines = result.split('\n');
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      // If line looks like a table row (starts and/or contains pipes)
      if (trimmed.startsWith('|') || (trimmed.includes('|') && trimmed.match(/^\|.*\|$/))) {
        return trimmed; // Remove leading/trailing whitespace
      }
      // Fix separator lines like |---|---|
      if (trimmed.match(/^\|[\s\-:]+(\|[\s\-:]+)+\|?$/)) {
        return trimmed;
      }
      return line;
    });
    result = fixedLines.join('\n');

    // Ensure a blank line before table starts (required by markdown parsers)
    result = result.replace(/([^\n])\n(\|[^\n]+\|\n\|[-:\s|]+\|)/g, '$1\n\n$2');

    return result;
  };

  // Render a section card (same for streaming and final)
  const renderSection = (key, title, data) => {
    if (!data) return null;
    const isCollapsed = collapsedSections.has(key);

    return (
      <div className="content-section glass-card" key={key}>
        <div className="section-header" onClick={() => toggleSection(key)}>
          <h3>{title}</h3>
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
        {!isCollapsed && (
          <div className="section-body">
            {typeof data === 'string' && (
              <MarkdownRenderer 
                components={{ 
                  p: 'p',
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match && match[1] === 'mermaid') {
                      return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
                    }
                    return <code className={className} {...props}>{children}</code>;
                  }
                }}
              >
                {normalizeMarkdown(data)}
              </MarkdownRenderer>
            )}
            {Array.isArray(data) && data.length > 0 && (
              typeof data[0] === 'string' ? (
                <ul>{data.map((item, i) => <li key={i}><MarkdownRenderer components={{ p: 'span' }}>{normalizeMarkdown(item)}</MarkdownRenderer></li>)}</ul>
              ) : (
                <div className="qa-list">
                  {data.map((item, i) => (
                    <div key={i} className="qa-item">
                      {item.term && <><strong>{item.term}:</strong> <MarkdownRenderer components={{ p: 'span' }}>{normalizeMarkdown(item.definition)}</MarkdownRenderer></>}
                      {item.q && (
                        <>
                          <div className="qa-q"><strong>Q:</strong> <MarkdownRenderer components={{ p: 'span' }}>{normalizeMarkdown(item.q)}</MarkdownRenderer></div>
                          <div className="qa-a"><strong>A:</strong> <MarkdownRenderer components={{ p: 'span' }}>{normalizeMarkdown(item.a)}</MarkdownRenderer></div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="topic-study" style={{ padding: '2rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        <div style={{ marginTop: '2rem' }}>
          <div className="skeleton skeleton-title" style={{ width: '40%' }}></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>
    );
  }

  // No content, not streaming
  if (!content && !streaming) {
    return (
      <div className="topic-study">
        <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
        <div className="empty-state">
          <StickyNote size={64} />
          <h3>{topic?.title}</h3>
          <p>No notes generated yet. Click below to generate AI-powered study notes for this topic.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-primary btn-lg" onClick={() => handleGenerate(false)}>Generate Notes</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate(`/topic/${topicId}/flashcards`)}><Layers size={18} /> Flashcards</button>
          </div>
        </div>
      </div>
    );
  }

  // Use whichever data we have: final parsed or streaming partial
  const displayData = parsedContent || streamParsed;

  return (
    <div className="topic-study">
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }}></div>
      <div className="topic-top-bar">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
          <div className="topic-header-main">
            <h1 className="topic-title">{topic.title}</h1>
            <div className="topic-actions">
              <button className="btn-icon" onClick={toggleBookmark} title="Bookmark Topic">
                {bookmarked ? <BookmarkCheck size={22} fill="#10b981" color="#10b981" /> : <Bookmark size={22} />}
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '8px', display: 'inline-flex' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Difficulty:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => handleRateDifficulty(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star 
                      size={14} 
                      fill={(topic.difficulty_rating || 0) >= star ? "#f59e0b" : "transparent"} 
                      color={(topic.difficulty_rating || 0) >= star ? "#f59e0b" : "var(--border-color)"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {prerequisites.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prerequisites:</span>
                {prerequisites.map(pr => (
                  <button 
                    key={pr.id} 
                    className="btn btn-ghost btn-sm" 
                    style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '2px 8px', fontSize: '0.8rem', borderRadius: '4px' }}
                    onClick={() => navigate(`/topic/${pr.id}`)}
                  >
                    {pr.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        <div className="topic-top-actions">
          {!streaming && (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNotes(!showNotes)}>
                <StickyNote size={14} /> Notes ({notes.length})
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/topic/${topicId}/flashcards`)}>
                <Layers size={14} /> Flashcards
              </button>
              {isTTSPlaying ? (
                <button className="btn btn-primary btn-sm" onClick={handleTTSPause}>
                  <Pause size={14} /> Pause Listen
                </button>
              ) : isTTSPaused ? (
                <button className="btn btn-primary btn-sm" onClick={handleTTSPlay}>
                  <Play size={14} /> Resume Listen
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={handleTTSPlay}>
                  <Volume2 size={14} /> Listen
                </button>
              )}
              {isTTSPlaying || isTTSPaused ? (
                <button className="btn btn-ghost btn-icon" onClick={handleTTSStop} title="Stop Listen">
                  <Square size={14} fill="currentColor" />
                </button>
              ) : null}
              <button className="btn btn-ghost btn-icon" onClick={handleCopyContent} title="Copy Notes">
                <Copy size={20} />
              </button>

            </>
          )}
          <button className="btn btn-secondary btn-sm" onClick={() => handleGenerate(true)} disabled={streaming}>
            {streaming ? <Loader size={14} className="spin-icon" /> : <RefreshCw size={14} />}
            {streaming ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      <h1 className="topic-title">{displayData?.topic_title || topic?.title}</h1>

      {streaming && (
        <div className="stream-indicator-bar">
          <div className="spinner"></div>
          <span>AI is generating notes — sections appear as they're ready</span>
        </div>
      )}

      {/* Notes panel */}
      {showNotes && !streaming && (
        <div className="glass-card notes-panel">
          <h3><StickyNote size={16} /> Personal Notes</h3>
          <div className="note-input-row">
            <textarea className="textarea" placeholder="Write a personal note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={2} />
            <button className="btn btn-primary btn-sm" onClick={handleAddNote}><Plus size={14} /> Add</button>
          </div>
          {notes.map(note => (
            <div key={note.id} className="note-item">
              {editingNote === note.id ? (
                <div className="note-edit-row">
                  <textarea className="textarea" value={editNoteText} onChange={(e) => setEditNoteText(e.target.value)} rows={2} />
                  <button className="btn btn-primary btn-sm" onClick={() => handleUpdateNote(note.id)}><Save size={14} /></button>
                </div>
              ) : (
                <>
                  <p>{note.content}</p>
                  <div className="note-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditingNote(note.id); setEditNoteText(note.content); }}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteNote(note.id)}><Trash2 size={12} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content sections — same layout for streaming and final */}
      <div className="content-sections" id="topic-content-export">
        {displayData && SECTION_MAP.map(([key, title]) =>
          renderSection(key, title, displayData[key])
        )}
      </div>

      {!streaming && displayData && (
        <div className="phase9-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleGenerateConceptWeb} disabled={isGeneratingConceptWeb}>
            {isGeneratingConceptWeb ? <Loader size={16} className="spin-icon"/> : <GitBranch size={16} />} 
            Generate Concept Web
          </button>
          <button className="btn btn-secondary" onClick={handleGeneratePodcast} disabled={isGeneratingPodcast}>
            {isGeneratingPodcast ? <Loader size={16} className="spin-icon"/> : <Mic size={16} />} 
            Generate Podcast Script
          </button>
          <button className="btn btn-primary" onClick={handleGenerateQuickQuiz} disabled={isGeneratingQuiz}>
            {isGeneratingQuiz ? <Loader size={16} className="spin-icon"/> : <CheckSquare size={16} />} 
            Take Quick Quiz
          </button>
        </div>
      )}

      {/* Podcast Panel */}
      {showPodcast && (
        <div className="glass-card podcast-panel" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🎙️ Podcast Script</h2>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowPodcast(false)}><X size={16}/></button>
          </div>
          {isGeneratingPodcast && !podcastScript && (
            <div className="loading-container"><Loader className="spin-icon" /> Generating script...</div>
          )}
          <div className="markdown-body">
            <MarkdownRenderer>{podcastScript}</MarkdownRenderer>
          </div>
        </div>
      )}

      {/* Concept Web Panel */}
      {showConceptWeb && (
        <div className="glass-card concept-web-panel" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🕸️ Concept Web</h2>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowConceptWeb(false)}><X size={16}/></button>
          </div>
          {isGeneratingConceptWeb && !conceptWeb && (
            <div className="loading-container"><Loader className="spin-icon" /> Generating mindmap...</div>
          )}
          {conceptWeb && (
            <div className="mindmap-container">
              <MermaidRenderer chart={conceptWeb} />
            </div>
          )}
        </div>
      )}

      {/* Quick Quiz Panel */}
      {quickQuiz && (
        <div className="glass-card quiz-panel" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🧠 Quick Quiz</h2>
            <button className="btn btn-ghost btn-icon" onClick={() => setQuickQuiz(null)}><X size={16}/></button>
          </div>
          <div className="quiz-questions">
            {quickQuiz.map((q, i) => (
              <div key={i} className="quiz-question" style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 'bold' }}>{i + 1}. {q.question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {q.options.map((opt, j) => {
                    const isSelected = quizAnswers[i] === opt;
                    const isCorrect = opt === q.answer;
                    const showStatus = showQuizResult;
                    
                    let btnClass = "btn btn-outline";
                    if (isSelected && !showStatus) btnClass = "btn btn-primary";
                    if (showStatus) {
                      if (isCorrect) btnClass = "btn btn-success";
                      else if (isSelected && !isCorrect) btnClass = "btn btn-danger";
                    }

                    return (
                      <button 
                        key={j} 
                        className={btnClass}
                        style={{ textAlign: 'left', justifyContent: 'flex-start', height: 'auto', padding: '0.75rem' }}
                        onClick={() => !showQuizResult && handleQuizSelect(i, opt)}
                        disabled={showQuizResult}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {showQuizResult && (
                  <div className="quiz-explanation" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!showQuizResult && Object.keys(quizAnswers).length === quickQuiz.length && (
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} onClick={handleQuizSubmit}>Submit Answers</button>
          )}
          {showQuizResult && (
            <div style={{ marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
              You scored {quickQuiz.filter((q, i) => quizAnswers[i] === q.answer).length} / {quickQuiz.length}!
            </div>
          )}
        </div>
      )}

      {displayData?.video_queries && displayData.video_queries.length > 0 && (
        <YouTubeLinker queries={displayData.video_queries} />
      )}

    </div>
  );
}
