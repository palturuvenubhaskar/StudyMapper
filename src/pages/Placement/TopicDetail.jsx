import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, CheckCircle, Sparkles, Lightbulb, 
  Calculator, BookMarked, Play, Bookmark, BookmarkCheck,
  Clock, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../data/db';
import { callOpenRouterStream } from '../../core/api/aiService';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import './LearnMode.css';

export function TopicDetail({ categoryId, topic, config, onBack, onComplete }) {
  const [content, setContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState('explanation');
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef(null);

  const fullTopicId = `${categoryId}-${topic.id}`;

  useEffect(() => {
    loadTopicContent();
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [fullTopicId]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Every minute
  };

  const loadTopicContent = async () => {
    try {
      const existing = await db.placement_topic_content.where('topic_id').equals(fullTopicId).first();
      if (existing) {
        setContent(existing);
      } else {
        generateContent();
      }
      
      const bookmark = await db.placement_bookmarks.where({ topic_id: fullTopicId }).first();
      setIsBookmarked(!!bookmark);
      
      const progress = await db.placement_learning_progress.where({ topic_id: fullTopicId }).first();
      if (!progress) {
        await db.placement_learning_progress.put({
          id: fullTopicId,
          topic_id: fullTopicId,
          status: 'in_progress',
          completion_percentage: 0,
          time_spent_minutes: 0,
          last_studied_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load topic content: ' + err.message);
    }
  };

  const generateContent = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    
    // Set empty skeleton to render UI immediately
    setContent({
      id: fullTopicId,
      topic_id: fullTopicId,
      content_markdown: '',
      formulas_json: '[]',
      examples_json: '[]',
      tips_json: '[]',
      is_ai_generated: true,
      created_at: new Date().toISOString(),
    });
    
    const promptStr = buildTopicPrompt(categoryId, topic);
    const messages = [
      { role: 'system', content: 'You are an expert AI tutor. Generate ONLY valid JSON matching the exact requested structure, with no markdown fences around the JSON.' },
      { role: 'user', content: promptStr }
    ];
    
    try {
      const finalGeneratedText = await callOpenRouterStream(messages, (fullTextSoFar) => {
        const parsed = parseStreamingJSON(fullTextSoFar);
        setContent(prev => ({
          ...prev,
          content_markdown: parsed.explanation,
          formulas_json: parsed.formulas,
          examples_json: parsed.examples,
          tips_json: parsed.tips,
        }));
      });
      
      if (!finalGeneratedText) {
        throw new Error("AI returned empty response");
      }
      
      const parsed = parseStreamingJSON(finalGeneratedText);
      const contentRecord = {
        id: fullTopicId,
        topic_id: fullTopicId,
        content_markdown: parsed.explanation,
        formulas_json: parsed.formulas,
        examples_json: parsed.examples,
        tips_json: parsed.tips,
        is_ai_generated: true,
        created_at: new Date().toISOString(),
      };
      
      await db.placement_topic_content.put(contentRecord);
      setContent(contentRecord);
    } catch (err) {
      console.error('Failed to generate content:', err);
      setError(err.message || 'Unknown error during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const markComplete = async () => {
    await db.placement_learning_progress.update(fullTopicId, {
      status: 'completed',
      completion_percentage: 100,
      time_spent_minutes: timeSpent,
      last_studied_at: new Date().toISOString(),
    });
    onComplete();
    onBack();
  };

  const toggleBookmark = async () => {
    if (isBookmarked) {
      const bookmark = await db.placement_bookmarks.where({ topic_id: fullTopicId }).first();
      if (bookmark) {
          await db.placement_bookmarks.delete(bookmark.id);
      }
    } else {
      await db.placement_bookmarks.put({
        id: `bookmark-${fullTopicId}`,
        topic_id: fullTopicId,
        section_type: 'topic',
        note: topic.title,
        created_at: new Date().toISOString(),
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  const sections = [
    { id: 'explanation', label: 'Concept', icon: BookMarked },
    { id: 'formulas', label: 'Formulas', icon: Calculator },
    { id: 'examples', label: 'Examples', icon: Lightbulb },
    { id: 'tips', label: 'Tips', icon: Sparkles },
  ];

  if (error) {
    return (
      <div className="topic-detail">
        <div className="topic-detail-header">
          <button onClick={onBack} className="back-btn"><ArrowLeft size={18} /> Back</button>
        </div>
        <div className="topic-content-area" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-error)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Sparkles size={48} />
            <h2>Generation Failed</h2>
            <p>{error}</p>
            <button onClick={generateContent} className="btn btn-primary">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-detail">
      {/* Header */}
      <div className="topic-detail-header">
        <div className="topic-detail-header-top">
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={18} />
            Back to Topics
          </button>
          <div className="topic-detail-actions">
            <button onClick={toggleBookmark} className={`icon-btn ${isBookmarked ? 'active' : ''}`}>
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>
        
        <h1>{topic.title}</h1>
        <div className="topic-detail-meta">
          <span className="difficulty-badge">{topic.difficulty}</span>
          <span><Clock size={14} /> {topic.estimated} min read</span>
          {isGenerating ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)' }}>
              <Sparkles size={14} className="spin" /> Generating...
            </span>
          ) : (
            <span><BookOpen size={14} /> AI Generated</span>
          )}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="topic-section-tabs">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`section-tab ${activeSection === id ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="topic-content-area">
        {activeSection === 'explanation' && content && (
          <div className="content-section">
            <MarkdownRenderer>{content.content_markdown || (isGenerating ? 'Thinking...' : '')}</MarkdownRenderer>
          </div>
        )}
        
        {activeSection === 'formulas' && content?.formulas_json && (
          <div className="content-section formulas">
            {JSON.parse(content.formulas_json).map((formula, i) => (
              <div key={i} className="formula-card">
                <div className="formula-name">{formula.name}</div>
                <div className="formula-math">{formula.formula}</div>
                <div className="formula-desc">{formula.description}</div>
              </div>
            ))}
          </div>
        )}
        
        {activeSection === 'examples' && content?.examples_json && (
          <div className="content-section examples">
            {JSON.parse(content.examples_json).map((ex, i) => (
              <div key={i} className="example-card">
                <div className="example-number">Example {i + 1}</div>
                <div className="example-question">{ex.question}</div>
                <div className="example-solution">
                  <strong>Solution:</strong>
                  <MarkdownRenderer>{ex.solution}</MarkdownRenderer>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeSection === 'tips' && content?.tips_json && (
          <div className="content-section tips">
            {JSON.parse(content.tips_json).map((tip, i) => (
              <div key={i} className="tip-card">
                <Lightbulb size={18} className="tip-icon" />
                <p>{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="topic-detail-footer">
        <div className="time-tracker">
          <Clock size={14} />
          <span>Time spent: {timeSpent} min</span>
        </div>
        <div className="footer-actions">
          <button onClick={generateContent} className="btn btn-secondary" disabled={isGenerating}>
            <Sparkles size={16} />
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
          <Link to={`/placement/${categoryId}/test?topic=${topic.id}`} className="btn btn-primary">
            <Play size={16} />
            Practice Now
          </Link>
          <button onClick={markComplete} className="btn btn-success">
            <CheckCircle size={16} />
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to build AI prompt
function buildTopicPrompt(categoryId, topic) {
  const categoryPrompts = {
    aptitude: `You are a placement aptitude trainer. Explain "${topic.title}" for engineering campus placements.
Generate content in this exact JSON structure:
{
  "explanation": "Detailed markdown explanation with ## headings",
  "formulas": [{"name": "Formula name", "formula": "LaTeX or plain text formula", "description": "When to use"}],
  "examples": [{"question": "Problem statement", "solution": "Step-by-step markdown solution"}],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
Keep explanations concise but thorough. Include 2-3 solved examples.`,

    technical: `You are a technical interview coach. Explain "${topic.title}" for software engineering interviews.
Generate content in this exact JSON structure:
{
  "explanation": "Detailed markdown with ## headings covering concepts, common interview questions, and key points",
  "formulas": [{"name": "Concept/Formula name", "formula": "Code snippet or formula", "description": "Explanation"}],
  "examples": [{"question": "Interview question or problem", "solution": "Detailed answer with code if applicable"}],
  "tips": ["Interview tip 1", "Common mistake to avoid", "Quick recall tip"]
}
Focus on interview-relevant depth. Include time/space complexity where applicable.`,

    hr: `You are an HR interview coach. Explain "${topic.title}" for behavioral interviews.
Generate content in this exact JSON structure:
{
  "explanation": "Markdown guide on how to answer this type of question, with ## headings",
  "formulas": [{"name": "Framework", "formula": "STAR or other framework structure", "description": "How to apply"}],
  "examples": [{"question": "Common question", "solution": "Sample answer with reasoning"}],
  "tips": ["What interviewers look for", "How to structure your answer", "Mistakes to avoid"]
}
Include sample answers that sound natural, not robotic. Focus on authenticity.`
  };

  return categoryPrompts[categoryId] || categoryPrompts.aptitude;
}

function parseStreamingJSON(text) {
  let cleanText = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
  if (!cleanText) return { explanation: '', formulas: '[]', examples: '[]', tips: '[]' };
  
  try {
    const parsed = JSON.parse(cleanText);
    return {
      explanation: parsed.explanation || '',
      formulas: JSON.stringify(parsed.formulas || []),
      examples: JSON.stringify(parsed.examples || []),
      tips: JSON.stringify(parsed.tips || [])
    };
  } catch (e) {
    let explanation = '';
    const expRegex = /"explanation"\s*:\s*"([\s\S]*?)(?="\s*,\s*"(?:formulas|examples|tips)"|$)/;
    const expMatch = cleanText.match(expRegex);
    
    if (expMatch) {
        let rawExp = expMatch[1];
        if (rawExp.endsWith('"')) rawExp = rawExp.slice(0, -1);
        explanation = rawExp.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    } else {
        const startMatch = cleanText.match(/"explanation"\s*:\s*"([\s\S]*)/);
        if (startMatch) {
            let rawExp = startMatch[1];
            explanation = rawExp.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        } else if (!cleanText.includes('{"')) {
            explanation = cleanText;
        }
    }

    const extractPartialArray = (key) => {
        const regex = new RegExp(`"${key}"\\s*:\\s*(\\[[\\s\\S]*)`);
        const match = cleanText.match(regex);
        if (match) {
            let arrStr = match[1];
            const nextKeyRegex = /,\s*"(?:formulas|examples|tips)"\s*:/;
            const nextKeyMatch = arrStr.match(nextKeyRegex);
            if (nextKeyMatch) {
                arrStr = arrStr.substring(0, nextKeyMatch.index);
            }
            
            let inString = false;
            let escape = false;
            let openBraces = 0;
            let openBrackets = 0;
            
            for (let i = 0; i < arrStr.length; i++) {
                const char = arrStr[i];
                if (escape) { escape = false; continue; }
                if (char === '\\') { escape = true; continue; }
                if (char === '"') { inString = !inString; continue; }
                if (!inString) {
                    if (char === '{') openBraces++;
                    if (char === '}') openBraces--;
                    if (char === '[') openBrackets++;
                    if (char === ']') openBrackets--;
                }
            }
            
            let fixed = arrStr;
            if (inString) fixed += '"';
            while (openBraces > 0) { fixed += '}'; openBraces--; }
            while (openBrackets > 0) { fixed += ']'; openBrackets--; }
            
            try {
                JSON.parse(fixed);
                return fixed;
            } catch (err) {
                return '[]';
            }
        }
        return '[]';
    };

    return {
      explanation: explanation,
      formulas: extractPartialArray('formulas'),
      examples: extractPartialArray('examples'),
      tips: extractPartialArray('tips')
    };
  }
}
