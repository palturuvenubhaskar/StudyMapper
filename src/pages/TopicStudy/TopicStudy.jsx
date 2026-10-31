import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../data/db';
import { getLatestTopicContent, saveTopicContent, recordTopicOpened, isTopicBookmarked, addBookmark, deleteBookmark, getBookmarksForTopic, getNotesForTopic, addNote, updateNote, deleteNote } from '../../data/repository';
import { callOpenRouterStream, getTopicNotesPrompt, extractJson, generatePodcastScriptPrompt, generateQuickQuizPrompt, generateConceptWebPrompt } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import GeneratingState from '../../components/GeneratingState/GeneratingState';
import GenerationError from '../../components/GenerationError/GenerationError';
import { ArrowLeft, RefreshCw, Bookmark, BookmarkCheck, StickyNote, Plus, Trash2, Save, ChevronDown, ChevronRight, Loader, Layers, Copy, Star, Volume2, Mic, CheckSquare, GitBranch, Pause, Square, Play, X, Clock, BookOpen, Sparkles } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import MermaidRenderer from '../../components/MarkdownRenderer/MermaidRenderer';
import YouTubeLinker from '../../components/YouTubeLinker/YouTubeLinker';
import { awardXP } from '../../core/gamification/xpEngine';
import { updateQuestProgress } from '../../core/gamification/dailyQuests';
import { updateWeeklyChallengeProgress } from '../../core/gamification/weeklyChallenges';
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

const INLINE_COMPONENTS = { p: 'span' };

// Sections that carry a different reading weight get their own accent.
const SECTION_TONES = {
  key_points: 'is-key',
  summary: 'is-summary',
  advantages: 'is-positive',
  disadvantages: 'is-caution',
};

const hasSectionContent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const countWords = (value) => {
  if (!value) return 0;
  if (typeof value === 'string') return value.trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(value)) return value.reduce((total, item) => total + countWords(item), 0);
  if (typeof value === 'object') return Object.values(value).reduce((total, item) => total + countWords(item), 0);
  return 0;
};

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
  const [generateError, setGenerateError] = useState(null);
  const previousContentRef = useRef({ content: null, parsed: null });

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
  const [activeSection, setActiveSection] = useState(null);

  // Phase 9 Features
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [isTTSPaused, setIsTTSPaused] = useState(false);
  
  const [podcastScript, setPodcastScript] = useState('');
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [showPodcast, setShowPodcast] = useState(false);
  const [podcastError, setPodcastError] = useState(null);
  
  const [quickQuiz, setQuickQuiz] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizError, setQuizError] = useState(null);

  const [conceptWeb, setConceptWeb] = useState('');
  const [isGeneratingConceptWeb, setIsGeneratingConceptWeb] = useState(false);
  const [showConceptWeb, setShowConceptWeb] = useState(false);
  const [conceptWebError, setConceptWebError] = useState(null);

  const studyStartTime = useRef(Date.now());

  // Use whichever data we have: final parsed or streaming partial
  const displayData = parsedContent || streamParsed;
  const visibleSections = displayData
    ? SECTION_MAP.filter(([key]) => hasSectionContent(displayData[key]))
    : [];
  const readMinutes = Math.max(1, Math.round(countWords(displayData) / 200));
  const progressPercent = Math.round(readingProgress);

  // Reading progress: this page scrolls inside the app shell, not on the window.
  useEffect(() => {
    const measure = () => {
      const nodes = [
        document.scrollingElement,
        document.querySelector('.main-content-wrapper'),
        document.querySelector('.content-container'),
      ];
      let ratio = 0;
      for (const node of nodes) {
        if (!node) continue;
        const scrollable = node.scrollHeight - node.clientHeight;
        if (scrollable > 8 && node.scrollTop > 0) {
          ratio = Math.max(ratio, node.scrollTop / scrollable);
        }
      }
      setReadingProgress(Math.min(100, Math.max(0, ratio * 100)));
    };

    measure();
    document.addEventListener('scroll', measure, { capture: true, passive: true });
    window.addEventListener('resize', measure);

    return () => {
      document.removeEventListener('scroll', measure, { capture: true });
      window.removeEventListener('resize', measure);
      // Log duration when leaving the page
      if (topicId) {
        const durationSeconds = Math.floor((Date.now() - studyStartTime.current) / 1000);
        logEvent('guest', topicId, 'topic_study', durationSeconds, null).catch(console.error);
      }
    };
  }, [topicId]);

  // Keep the outline rail in sync with whichever section is in view.
  useEffect(() => {
    const updateActive = () => {
      const nodes = document.querySelectorAll('#topic-content-export .content-section');
      if (!nodes.length) {
        setActiveSection(null);
        return;
      }
      const shellTop = document.querySelector('.main-content-wrapper')?.getBoundingClientRect().top ?? 0;
      const threshold = shellTop + 150;
      const scroller = document.querySelector('.main-content-wrapper') || document.scrollingElement;
      const atBottom = scroller
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
        : false;
      let current = nodes[0].getAttribute('data-section-key');
      nodes.forEach((node) => {
        if (node.getBoundingClientRect().top <= threshold) {
          current = node.getAttribute('data-section-key');
        }
      });
      if (atBottom) {
        current = nodes[nodes.length - 1].getAttribute('data-section-key');
      }
      setActiveSection(current);
    };

    updateActive();
    document.addEventListener('scroll', updateActive, { capture: true, passive: true });
    window.addEventListener('resize', updateActive);

    return () => {
      document.removeEventListener('scroll', updateActive, { capture: true });
      window.removeEventListener('resize', updateActive);
    };
  }, [displayData, collapsedSections]);

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

  const restorePreviousContent = () => {
    const previous = previousContentRef.current;
    if (previous?.content) {
      setContent(previous.content);
      setParsedContent(previous.parsed);
    }
    setStreamParsed(null);
  };

  const handleGenerate = async (regenerate = false) => {
    if (!subject || !topic) return;
    previousContentRef.current = { content, parsed: parsedContent };
    setGenerateError(null);
    setStreaming(true);
    setStreamParsed(null);
    setParsedContent(null);
    setContent(null);

    let lastSuccessfulParse = null;

    try {
      const messages = getTopicNotesPrompt(topic.title, subject.title);

      let lastStreamUpdate = 0;
      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        const now = Date.now();
        if (now - lastStreamUpdate < 150) return;
        lastStreamUpdate = now;
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
          await updateWeeklyChallengeProgress('guest', 'notes', 1);
          await updateStreak('guest');
          await checkAchievements('guest');
          await logEvent('guest', topicId, 'generate_notes', 0, null);
        }

        toast(regenerate ? 'Topic regenerated!' : 'Notes generated!', 'success');
      } else {
        setGenerateError('The AI response was incomplete. Try again to finish generating these notes.');
        restorePreviousContent();
      }
    } catch (err) {
      console.error(err);
      setGenerateError('The AI service did not respond. This is usually temporary.');
      restorePreviousContent();
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

  const jumpToSection = (key) => {
    setCollapsedSections(prev => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    requestAnimationFrame(() => {
      document.getElementById(`topic-section-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    setPodcastError(null);
    setPodcastScript('');
    try {
      const prompt = generatePodcastScriptPrompt(topic?.title, content);
      await callOpenRouterStream(prompt, setPodcastScript);
    } catch (err) {
      console.error(err);
      setPodcastError('The AI service did not respond. Your notes are safe — try the script again.');
    }
    setIsGeneratingPodcast(false);
  };

  const handleGenerateQuickQuiz = async () => {
    if (!content) return;
    setShowQuizResult(false);
    setQuizAnswers({});
    setQuickQuiz(null);
    setQuizError(null);
    setIsGeneratingQuiz(true);
    try {
      const prompt = generateQuickQuizPrompt(topic?.title, content);
      let jsonString = '';
      await callOpenRouterStream(prompt, (t) => { jsonString = t; });
      const parsed = extractJson(jsonString);
      if (Array.isArray(parsed)) {
        setQuickQuiz(parsed);
      } else {
        setQuizError('The AI response was incomplete. Try again to build the quiz.');
      }
    } catch (err) {
      console.error(err);
      setQuizError('The AI service did not respond. This is usually temporary.');
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
    setConceptWebError(null);
    setConceptWeb('');
    try {
      const prompt = generateConceptWebPrompt(topic?.title, content);
      let mmText = '';
      await callOpenRouterStream(prompt, (t) => {
        mmText = t;
        const cleaned = t.replace(/```mermaid\n?/g, '').replace(/```/g, '');
        setConceptWeb(cleaned);
      });
      if (!mmText.trim()) {
        setConceptWebError('The AI response was empty. Try again to map this topic.');
      }
    } catch (err) {
      console.error(err);
      setConceptWebError('The AI service did not respond. This is usually temporary.');
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
  const renderSection = (key, title, data, index) => {
    if (!data) return null;
    const isCollapsed = collapsedSections.has(key);
    const tone = SECTION_TONES[key] || '';

    return (
      <section
        id={`topic-section-${key}`}
        data-section-key={key}
        className={`content-section ${tone}`}
        key={key}
      >
        <button
          type="button"
          className="section-header"
          onClick={() => toggleSection(key)}
          aria-expanded={!isCollapsed}
          aria-controls={`topic-section-body-${key}`}
        >
          <span className="section-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="section-title">{title}</h3>
          <span className={`section-toggle ${isCollapsed ? '' : 'is-open'}`} aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </button>
        {!isCollapsed && (
          <div className="section-body" id={`topic-section-body-${key}`}>
            {typeof data === 'string' && (
              <MarkdownRenderer>
                {normalizeMarkdown(data)}
              </MarkdownRenderer>
            )}
            {Array.isArray(data) && data.length > 0 && (
              typeof data[0] === 'string' ? (
                <ul>{data.map((item, i) => <li key={i}><MarkdownRenderer components={INLINE_COMPONENTS}>{normalizeMarkdown(item)}</MarkdownRenderer></li>)}</ul>
              ) : (
                <div className="qa-list">
                  {data.map((item, i) => (
                    <div key={i} className="qa-item">
                      {item.term && <><strong>{item.term}:</strong> <MarkdownRenderer components={INLINE_COMPONENTS}>{normalizeMarkdown(item.definition)}</MarkdownRenderer></>}
                      {item.q && (
                        <>
                          <div className="qa-q"><strong>Q:</strong> <MarkdownRenderer components={INLINE_COMPONENTS}>{normalizeMarkdown(item.q)}</MarkdownRenderer></div>
                          <div className="qa-a"><strong>A:</strong> <MarkdownRenderer components={INLINE_COMPONENTS}>{normalizeMarkdown(item.a)}</MarkdownRenderer></div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="topic-study is-plain">
        <div className="ts-hero ts-skeleton-hero">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>
        </div>
        <div className="ts-skeleton-body">
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
      <div className="topic-study is-plain">
        <div className="ts-empty">
          <button type="button" className="ts-back ts-empty-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Back</span>
          </button>
          <span className="ts-empty-icon" aria-hidden="true"><Sparkles size={20} /></span>
          {subject?.name && <span className="ts-eyebrow">{subject.name}</span>}
          <h1 className="ts-empty-title">{topic?.title}</h1>
          <p>No notes yet. Generate a structured set of AI study notes for this topic, then come back to revise it anytime.</p>
          {generateError && (
            <GenerationError
              title="Couldn't generate notes"
              message={generateError}
              onRetry={() => handleGenerate(false)}
              retrying={streaming}
              style={{ maxWidth: '520px', width: '100%' }}
            />
          )}
          <div className="ts-empty-actions">
            <button className="btn btn-primary btn-lg" onClick={() => handleGenerate(false)}>Generate notes</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate(`/topic/${topicId}/flashcards`)}><Layers size={18} /> Flashcards</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-study">
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} aria-hidden="true"></div>

      <div className="ts-main">
        <header className="ts-hero">
          <div className="ts-hero-top">
            <div className="ts-crumbs">
              <button type="button" className="ts-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={15} aria-hidden="true" />
                <span>Back</span>
              </button>
              {subject?.name && (
                <span className="ts-crumb-path">
                  <span className="ts-crumb-sep" aria-hidden="true">/</span>
                  <span className="ts-crumb-name">{subject.name}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              className={`ts-icon-btn ${bookmarked ? 'is-on' : ''}`}
              onClick={toggleBookmark}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
            >
              {bookmarked ? <BookmarkCheck size={17} fill="currentColor" /> : <Bookmark size={17} />}
            </button>
          </div>

          <div className="ts-hero-copy">
            {subject?.name && <span className="ts-eyebrow">{subject.name}</span>}
            <h1 className="ts-title">{displayData?.topic_title || topic?.title}</h1>

            <div className="ts-meta">
              <span className="ts-meta-item">
                <BookOpen size={14} aria-hidden="true" />
                {visibleSections.length} {visibleSections.length === 1 ? 'section' : 'sections'}
              </span>
              <span className="ts-meta-item">
                <Clock size={14} aria-hidden="true" />
                {readMinutes} min read
              </span>
              <span className="ts-meta-sep" aria-hidden="true" />
              <span className="ts-difficulty">
                <span className="ts-difficulty-label">Difficulty</span>
                <span className="ts-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => handleRateDifficulty(star)}
                      aria-label={`Rate difficulty ${star} of 5`}
                    >
                      <Star
                        size={14}
                        fill={(topic?.difficulty_rating || 0) >= star ? '#f59e0b' : 'transparent'}
                        color={(topic?.difficulty_rating || 0) >= star ? '#f59e0b' : 'var(--text-muted)'}
                      />
                    </button>
                  ))}
                </span>
              </span>
            </div>
          </div>

          {prerequisites.length > 0 && (
            <div className="ts-prereqs">
              <span className="ts-prereq-label">Prerequisites</span>
              <div className="ts-prereq-list">
                {prerequisites.map((pr) => (
                  <button
                    key={pr.id}
                    type="button"
                    className="prereq-tag"
                    onClick={() => navigate(`/topic/${pr.id}`)}
                    title={`Go to ${pr.title}`}
                  >
                    <span>{pr.title}</span>
                    <ChevronRight size={12} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ts-toolbar">
            <div className="ts-toolbar-main">
              {!streaming && (
                <>
                  <button
                    type="button"
                    className={`ts-tool ${showNotes ? 'is-on' : ''}`}
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    <StickyNote size={14} aria-hidden="true" />
                    <span>Notes</span>
                    <span className="ts-tool-count">{notes.length}</span>
                  </button>

                  <button
                    type="button"
                    className="ts-tool"
                    onClick={() => navigate(`/topic/${topicId}/flashcards`)}
                  >
                    <Layers size={14} aria-hidden="true" />
                    <span>Flashcards</span>
                  </button>

                  {isTTSPlaying ? (
                    <button type="button" className="ts-tool is-on" onClick={handleTTSPause}>
                      <Pause size={14} aria-hidden="true" />
                      <span>Pause</span>
                    </button>
                  ) : isTTSPaused ? (
                    <button type="button" className="ts-tool is-on" onClick={handleTTSPlay}>
                      <Play size={14} aria-hidden="true" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button type="button" className="ts-tool" onClick={handleTTSPlay}>
                      <Volume2 size={14} aria-hidden="true" />
                      <span>Listen</span>
                    </button>
                  )}

                  {(isTTSPlaying || isTTSPaused) && (
                    <button
                      type="button"
                      className="ts-tool is-icon"
                      onClick={handleTTSStop}
                      title="Stop audio playback"
                      aria-label="Stop audio playback"
                    >
                      <Square size={12} fill="currentColor" />
                    </button>
                  )}

                  <button
                    type="button"
                    className="ts-tool is-icon"
                    onClick={handleCopyContent}
                    title="Copy notes to clipboard"
                    aria-label="Copy notes"
                  >
                    <Copy size={15} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className="ts-tool is-regenerate"
              onClick={() => handleGenerate(true)}
              disabled={streaming}
            >
              {streaming ? <Loader size={14} className="spin-icon" /> : <RefreshCw size={14} aria-hidden="true" />}
              <span>{streaming ? 'Generating…' : 'Regenerate'}</span>
            </button>
          </div>
        </header>

        {streaming && (
          <div className="stream-indicator-bar">
            <GeneratingState inline label="Generating notes" hint="Sections appear as they're ready." />
          </div>
        )}

        {generateError && !streaming && (
          <GenerationError
            title="Couldn't regenerate notes"
            message={generateError}
            onRetry={() => handleGenerate(true)}
            className="topic-generate-error"
          />
        )}

        {/* Notes panel */}
        {showNotes && !streaming && (
          <div className="ts-panel notes-panel">
            <div className="ts-panel-head">
              <h3><StickyNote size={16} aria-hidden="true" /> Personal notes</h3>
              <span className="ts-pill">{notes.length}</span>
            </div>
            <div className="note-input-row">
              <textarea className="textarea" placeholder="Write a personal note…" value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={2} />
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddNote}><Plus size={14} /> Add</button>
            </div>
            {notes.length === 0 && (
              <p className="ts-panel-hint">Notes you add here stay with this topic while you revise.</p>
            )}
            {notes.map(note => (
              <div key={note.id} className="note-item">
                {editingNote === note.id ? (
                  <div className="note-edit-row">
                    <textarea className="textarea" value={editNoteText} onChange={(e) => setEditNoteText(e.target.value)} rows={2} />
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleUpdateNote(note.id)}><Save size={14} /></button>
                  </div>
                ) : (
                  <>
                    <p>{note.content}</p>
                    <div className="note-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditingNote(note.id); setEditNoteText(note.content); }}>Edit</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleDeleteNote(note.id)}><Trash2 size={12} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content sections — same layout for streaming and final */}
        <div className="content-sections" id="topic-content-export">
          {displayData && visibleSections.map(([key, title], index) =>
            renderSection(key, title, displayData[key], index)
          )}
        </div>

        {!streaming && displayData && (
          <section className="ts-next">
            <div className="ts-next-head">
              <span className="ts-eyebrow">Keep going</span>
              <h2 className="ts-next-title">Turn these notes into practice</h2>
            </div>
            <div className="ts-next-grid">
              <button type="button" className="ts-next-card is-primary" onClick={handleGenerateQuickQuiz} disabled={isGeneratingQuiz}>
                <span className="ts-next-icon" aria-hidden="true">
                  {isGeneratingQuiz ? <Loader size={18} className="spin-icon" /> : <CheckSquare size={18} />}
                </span>
                <span className="ts-next-body">
                  <strong>Quick quiz</strong>
                  <span>Five questions on what you just read.</span>
                </span>
                <ChevronRight size={16} className="ts-next-arrow" aria-hidden="true" />
              </button>

              <button type="button" className="ts-next-card" onClick={handleGenerateConceptWeb} disabled={isGeneratingConceptWeb}>
                <span className="ts-next-icon" aria-hidden="true">
                  {isGeneratingConceptWeb ? <Loader size={18} className="spin-icon" /> : <GitBranch size={18} />}
                </span>
                <span className="ts-next-body">
                  <strong>Concept web</strong>
                  <span>See how the key ideas connect.</span>
                </span>
                <ChevronRight size={16} className="ts-next-arrow" aria-hidden="true" />
              </button>

              <button type="button" className="ts-next-card" onClick={handleGeneratePodcast} disabled={isGeneratingPodcast}>
                <span className="ts-next-icon" aria-hidden="true">
                  {isGeneratingPodcast ? <Loader size={18} className="spin-icon" /> : <Mic size={18} />}
                </span>
                <span className="ts-next-body">
                  <strong>Podcast script</strong>
                  <span>Hear this topic as a conversation.</span>
                </span>
                <ChevronRight size={16} className="ts-next-arrow" aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {quizError && !isGeneratingQuiz && (
          <GenerationError
            compact
            title="Couldn't build the quiz"
            message={quizError}
            onRetry={handleGenerateQuickQuiz}
            className="topic-generate-error"
          />
        )}

        {/* Podcast Panel */}
        {showPodcast && (
          <div className="ts-panel podcast-panel">
            <div className="ts-panel-head">
              <h2>Podcast script</h2>
              <button type="button" className="ts-icon-btn is-small" onClick={() => setShowPodcast(false)} aria-label="Close podcast script">
                <X size={16} />
              </button>
            </div>
            {isGeneratingPodcast && !podcastScript && (
              <GeneratingState label="Writing the podcast script" hint="Turning this topic into a two-host conversation." />
            )}
            {podcastError && !isGeneratingPodcast && (
              <GenerationError
                compact
                title="Couldn't write the podcast script"
                message={podcastError}
                onRetry={handleGeneratePodcast}
                retrying={isGeneratingPodcast}
              />
            )}
            <div className="markdown-body">
              <MarkdownRenderer>{podcastScript}</MarkdownRenderer>
            </div>
          </div>
        )}

        {/* Concept Web Panel */}
        {showConceptWeb && (
          <div className="ts-panel concept-web-panel">
            <div className="ts-panel-head">
              <h2>Concept web</h2>
              <button type="button" className="ts-icon-btn is-small" onClick={() => setShowConceptWeb(false)} aria-label="Close concept web">
                <X size={16} />
              </button>
            </div>
            {isGeneratingConceptWeb && !conceptWeb && (
              <GeneratingState label="Mapping the concept web" hint="Connecting the key ideas in this topic." />
            )}
            {conceptWebError && !isGeneratingConceptWeb && (
              <GenerationError
                compact
                title="Couldn't build the concept web"
                message={conceptWebError}
                onRetry={handleGenerateConceptWeb}
                retrying={isGeneratingConceptWeb}
              />
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
          <div className="ts-panel quiz-panel">
            <div className="ts-panel-head">
              <h2>Quick quiz</h2>
              <button type="button" className="ts-icon-btn is-small" onClick={() => setQuickQuiz(null)} aria-label="Close quiz">
                <X size={16} />
              </button>
            </div>
            <div className="quiz-questions">
              {quickQuiz.map((q, i) => (
                <div key={i} className="quiz-question">
                  <p className="quiz-question-text">{i + 1}. {q.question}</p>
                  <div className="quiz-options">
                    {q.options.map((opt, j) => {
                      const isSelected = quizAnswers[i] === opt;
                      const isCorrect = opt === q.answer;
                      const showStatus = showQuizResult;
                      const state = showStatus
                        ? (isCorrect ? 'is-correct' : isSelected ? 'is-wrong' : '')
                        : (isSelected ? 'is-selected' : '');

                      return (
                        <button
                          key={j}
                          type="button"
                          className={`quiz-option ${state}`}
                          onClick={() => !showQuizResult && handleQuizSelect(i, opt)}
                          disabled={showQuizResult}
                        >
                          <span className="quiz-option-letter" aria-hidden="true">{String.fromCharCode(65 + j)}</span>
                          <span className="quiz-option-text">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {showQuizResult && (
                    <p className="quiz-explanation">
                      <strong>Why:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {!showQuizResult && Object.keys(quizAnswers).length === quickQuiz.length && (
              <button type="button" className="btn btn-primary btn-lg quiz-submit" onClick={handleQuizSubmit}>Submit answers</button>
            )}
            {showQuizResult && (
              <p className="quiz-score">
                You scored <strong>{quickQuiz.filter((q, i) => quizAnswers[i] === q.answer).length}</strong> / {quickQuiz.length}
              </p>
            )}
          </div>
        )}

        {displayData?.video_queries && displayData.video_queries.length > 0 && (
          <YouTubeLinker queries={displayData.video_queries} />
        )}
      </div>

      <aside className="ts-rail" aria-label="Reading outline">
        <div className="ts-rail-card">
          <div className="ts-rail-head">
            <span>Reading progress</span>
            <strong className="ts-rail-value">{progressPercent}%</strong>
          </div>
          <div
            className="ts-progress-track"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="ts-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="ts-rail-note">{readMinutes} min · {visibleSections.length} sections</p>
        </div>

        {visibleSections.length > 0 && (
          <nav className="ts-toc">
            <p className="ts-toc-title">On this page</p>
            <ul>
              {visibleSections.map(([key, title], index) => (
                <li key={key}>
                  <button
                    type="button"
                    className={`ts-toc-link ${activeSection === key ? 'is-active' : ''}`}
                    onClick={() => jumpToSection(key)}
                    aria-current={activeSection === key ? 'true' : undefined}
                  >
                    <span className="ts-toc-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="ts-toc-text">{title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>
    </div>
  );
}
