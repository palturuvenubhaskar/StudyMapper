import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../data/db';
import { getLatestTopicContent, saveTopicContent, recordTopicOpened, isTopicBookmarked, addBookmark, deleteBookmark, getBookmarksForTopic, getNotesForTopic, addNote, updateNote, deleteNote } from '../../data/repository';
import { callOpenRouterStream, getTopicNotesPrompt, extractJson } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, RefreshCw, Bookmark, BookmarkCheck, StickyNote, Plus, Trash2, Save, ChevronDown, ChevronUp, Loader, Layers, Copy, Download } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import MermaidRenderer from '../../components/MarkdownRenderer/MermaidRenderer';
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
  const start = raw.indexOf('{');
  if (start === -1) return null;

  let text = raw.substring(start);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollTotal > 0) {
        const scrolled = (document.documentElement.scrollTop / scrollTotal) * 100;
        setReadingProgress(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleGenerate = async (regenerate = false) => {
    if (!subject || !topic) return;
    setStreaming(true);
    setStreamParsed(null);
    setParsedContent(null);
    setContent(null);

    try {
      const messages = getTopicNotesPrompt(topic.title, subject.title);

      const fullText = await callOpenRouterStream(messages, (textSoFar) => {
        const partial = tryParsePartialJson(textSoFar);
        if (partial) setStreamParsed(partial);
      });

      // Final parse
      const parsed = extractJson(fullText);
      if (parsed) {
        const jsonStr = JSON.stringify(parsed);
        const saved = await saveTopicContent(topicId, jsonStr);
        setContent(saved);
        setParsedContent(parsed);
        setStreamParsed(null);
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
                remarkPlugins={[remarkGfm]} 
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
                {data}
              </MarkdownRenderer>
            )}
            {Array.isArray(data) && data.length > 0 && (
              typeof data[0] === 'string' ? (
                <ul>{data.map((item, i) => <li key={i}><MarkdownRenderer remarkPlugins={[remarkGfm]} components={{ p: 'span' }}>{item}</MarkdownRenderer></li>)}</ul>
              ) : (
                <div className="qa-list">
                  {data.map((item, i) => (
                    <div key={i} className="qa-item">
                      {item.term && <><strong>{item.term}:</strong> <MarkdownRenderer remarkPlugins={[remarkGfm]} components={{ p: 'span' }}>{item.definition}</MarkdownRenderer></>}
                      {item.q && (
                        <>
                          <div className="qa-q"><strong>Q:</strong> <MarkdownRenderer remarkPlugins={[remarkGfm]} components={{ p: 'span' }}>{item.q}</MarkdownRenderer></div>
                          <div className="qa-a"><strong>A:</strong> <MarkdownRenderer remarkPlugins={[remarkGfm]} components={{ p: 'span' }}>{item.a}</MarkdownRenderer></div>
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
    return <div className="loading-container"><div className="spinner spinner-lg"></div><p>Loading topic...</p></div>;
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
        <div className="topic-top-actions">
          {!streaming && (
            <>
              <button className="btn btn-ghost btn-icon" onClick={toggleBookmark} title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
                {bookmarked ? <BookmarkCheck size={20} color="var(--accent)" /> : <Bookmark size={20} />}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNotes(!showNotes)}>
                <StickyNote size={14} /> Notes ({notes.length})
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/topic/${topicId}/flashcards`)}>
                <Layers size={14} /> Flashcards
              </button>
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

    </div>
  );
}
