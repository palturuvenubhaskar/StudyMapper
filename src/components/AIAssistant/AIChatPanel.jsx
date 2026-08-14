import { useState, useRef, useEffect } from 'react';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ArrowUp, Paperclip, Loader, X, FileText, Sparkles } from 'lucide-react';
import { addAIMessage, createAISession } from '../../data/repository';
import { callAIAssistantStream } from '../../core/api/aiService';
import { buildAIContext } from '../../core/api/aiContextHelper';
import { useLocation } from 'react-router-dom';
import { useToast } from '../ToastProvider/ToastProvider';
import MermaidRenderer from '../MarkdownRenderer/MermaidRenderer';

export default function AIChatPanel({ sessionId, setSessionId, onSessionUpdated, messages, setMessages }) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const toast = useToast();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleFileAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only text-based files for now due to model constraints
    const validTypes = ['text/plain', 'text/markdown', 'text/javascript', 'application/json', 'text/html', 'text/css', 'application/xml', 'text/csv'];
    const validExts = ['.js', '.jsx', '.py', '.txt', '.md', '.json', '.html', '.css', '.java', '.cpp', '.c', '.h', '.hpp'];
    
    const isValidType = validTypes.includes(file.type);
    const isValidExt = validExts.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (isValidType || isValidExt) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttachment({ name: file.name, content: ev.target.result });
      };
      reader.readAsText(file);
    } else {
      toast('Currently, only text/code files are supported by the AI model.', 'error');
    }
    e.target.value = null; // reset
  };

  const removeAttachment = () => setAttachment(null);

  const handleSend = async (overrideText = null) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if ((!textToSend.trim() && !attachment) || isGenerating) return;

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = await createAISession(textToSend.substring(0, 30) + (textToSend.length > 30 ? '...' : ''));
      if (setSessionId) setSessionId(currentSessionId);
      if (onSessionUpdated) onSessionUpdated();
    }

    let userContent = textToSend.trim();
    if (attachment) {
      userContent += `\n\n--- Attached File: ${attachment.name} ---\n\`\`\`\n${attachment.content}\n\`\`\``;
    }

    const newUserMsg = await addAIMessage(currentSessionId, 'user', userContent);
    setMessages(prev => [...prev, newUserMsg]);
    if (typeof overrideText !== 'string') {
      setInput('');
    }
    setAttachment(null);
    setIsGenerating(true);
    setStreamingText('');

    try {
      const currentContext = await buildAIContext(location);
      const apiHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));
      apiHistory.push({ role: 'user', content: userContent });

      const fullResponse = await callAIAssistantStream(apiHistory, currentContext, (chunk) => {
        setStreamingText(chunk);
      });

      const newAsstMsg = await addAIMessage(currentSessionId, 'assistant', fullResponse);
      setMessages(prev => [...prev, newAsstMsg]);
    } catch (err) {
      console.error(err);
      toast('AI Assistant Error: ' + err.message, 'error');
    }

    setIsGenerating(false);
    setStreamingText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getQuickActions = () => {
    const path = location.pathname;
    if (path.startsWith('/topic/')) {
      return ['Explain Topic', 'Ask Follow-up Questions'];
    }
    if (path.startsWith('/coding/')) {
      return ['Explain algorithm', 'Detect logical errors', 'Suggest optimizations'];
    }
    if (path.startsWith('/subject/') || path.startsWith('/qb/')) {
      return ['Create Revision Sheet', 'Generate Quiz'];
    }
    return ['Generate Summary', 'Practice Questions'];
  };

  return (
    <>
      <div className="ai-chat-area">
        <div className="ai-chat-container">
          {messages.length === 0 && !isGenerating && (
            <div className="empty-state">
              <Sparkles size={48} style={{ color: 'var(--primary)', opacity: 0.8 }} />
              <h2>How can I help you today?</h2>
              <p>I can explain concepts, write code, or summarize your notes.</p>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`ai-message ${m.role}`}>
              {m.role === 'assistant' && (
                <div className="ai-avatar">
                  <Sparkles size={16} />
                </div>
              )}
              <div className="ai-message-bubble">
                {m.role === 'user' ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {m.content.replace(/--- Attached File:.*?---[\s\S]*```[\s\S]*?```/, '[File Attached]')}
                  </div>
                ) : (
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
                      {m.content}
                    </MarkdownRenderer>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="ai-message assistant">
              <div className="ai-avatar">
                <Loader size={16} className="spin-icon" />
              </div>
              <div className="ai-message-bubble">
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
                    {streamingText || '...'}
                  </MarkdownRenderer>
                  <span className="cursor-blink" style={{ display: 'inline-block', width: '8px', height: '16px', background: '#e2e2e2', marginLeft: '4px', animation: 'blink 1s step-start infinite' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="ai-input-area">
        
        {messages.length === 0 && (
          <div className="ai-quick-actions">
            {getQuickActions().map((action, idx) => (
              <button 
                key={idx} 
                className="ai-quick-action-chip" 
                onClick={() => handleSend(action)}
                disabled={isGenerating}
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {attachment && (
          <div style={{ maxWidth: '800px', width: '100%', marginBottom: '8px', display: 'flex' }}>
            <div style={{ background: '#1e2020', padding: '8px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <FileText size={14} />
              <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachment.name}</span>
              <button className="ai-btn-ghost" style={{ padding: '2px' }} onClick={removeAttachment}><X size={14} /></button>
            </div>
          </div>
        )}

        <div className="ai-input-wrapper">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileAttach}
          />
          <button 
            className="ai-btn-ghost" 
            onClick={() => fileInputRef.current?.click()}
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>
          
          <textarea
            className="ai-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            rows={1}
            disabled={isGenerating}
          />
          
          <button 
            className="ai-btn-send" 
            onClick={handleSend}
            disabled={(!input.trim() && !attachment) || isGenerating}
          >
            {isGenerating ? <Loader size={16} className="spin-icon" /> : <ArrowUp size={18} strokeWidth={3} />}
          </button>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#948e9d', marginTop: '12px', textAlign: 'center' }}>
          AI Assistant can make mistakes. Consider verifying important information.
        </div>
      </div>
    </>
  );
}
