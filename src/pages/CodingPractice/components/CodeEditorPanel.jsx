import Editor from '@monaco-editor/react';
import { Play, RefreshCw, Sparkles, Send, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* Map display language names → Monaco editor language IDs */
const LANGUAGE_MAP = {
  'HTML': 'html',
  'CSS': 'css',
  'C': 'c',
  'C++': 'cpp',
  'C#': 'csharp',
  'Java': 'java',
  'Python': 'python',
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'Go': 'go',
  'Rust': 'rust',
  'Ruby': 'ruby',
  'PHP': 'php',
  'Swift': 'swift',
  'Kotlin': 'kotlin',
  'R': 'r',
  'Dart': 'dart',
  'Scala': 'scala',
};

const ALL_LANGUAGES = Object.keys(LANGUAGE_MAP);

export default function CodeEditorPanel({ 
  code, setCode, language, setLanguage, 
  onRun, isRunning, onReset, onSubmit, isSubmitting,
  onAskAI
}) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  /* Resolve the Monaco language ID from the display name */
  const monacoLang = LANGUAGE_MAP[language] || language?.toLowerCase() || 'plaintext';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          if (onSubmit && !isSubmitting) onSubmit();
        } else {
          if (onRun && !isRunning) onRun();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRun, onSubmit, isRunning, isSubmitting]);

  return (
    <div className="code-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Editor Header / Action Bar */}
      <div className="code-editor-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#252526', borderBottom: '1px solid #333' }}>
        <div className="toolbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--success)' }}>&lt; / &gt;</span> Code
          </div>
          <div className="lang-selector" ref={dropdownRef} style={{ marginLeft: '12px' }}>
            <button 
              className="lang-btn"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              {language || 'Select Language'} <ChevronDown size={14} />
            </button>
            {showLangDropdown && (
              <div className="lang-dropdown">
                {ALL_LANGUAGES.map(lang => (
                  <button 
                    key={lang}
                    className={`lang-option ${language === lang ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangDropdown(false);
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="toolbar-btn" 
            onClick={onReset}
            title="Reset to starter code"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
        
        <div className="toolbar-right">
          <button 
            className="toolbar-btn ask-ai" 
            onClick={() => onAskAI && onAskAI()}
          >
            <Sparkles size={14} /> Ask AI
          </button>
          
          <button 
            className="btn-run" 
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            title="Run visible test cases (Ctrl+Enter)"
          >
            {isRunning ? (
              <><RefreshCw size={14} className="spin-icon" /> Running</>
            ) : (
              <><Play size={14} /> Run</>
            )}
          </button>
          
          <button 
            className="btn-submit" 
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            title="Submit all test cases (Ctrl+Shift+Enter)"
          >
            {isSubmitting ? (
              <><RefreshCw size={14} className="spin-icon" /> Submitting</>
            ) : (
              <><Send size={14} /> Submit</>
            )}
          </button>
        </div>
      </div>
      
      {/* Monaco Editor */}
      <div className="editor-container">
        <Editor
          height="100%"
          language={monacoLang}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            wordWrap: 'on',
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 16 }
          }}
          loading={<div style={{ padding: '24px', color: '#6e7681' }}>Loading editor...</div>}
        />
      </div>
    </div>
  );
}
