import Editor from '@monaco-editor/react';
import { Play, RefreshCw, Sparkles, Send } from 'lucide-react';

export default function EditorPanel({ 
  code, setCode, language, setLanguage, 
  onRunTests, isRunning, onReset, 
  onAskAI, canAskAI, canSubmit
}) {

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  return (
    <div className="editor-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e1e1e' }}>
      {/* Editor Header / Action Bar */}
      <div className="editor-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-strong)' }}>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ width: '120px', padding: '6px 12px', height: 'auto', background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}
        >
          <option value="python">Python</option>
        </select>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-sm btn-ghost" 
            onClick={onReset}
            title="Reset to starter code"
          >
            <RefreshCw size={14} /> Reset
          </button>
          
          <button 
            className="btn btn-sm" 
            style={{ background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)', opacity: canAskAI ? 1 : 0.5, cursor: canAskAI ? 'pointer' : 'not-allowed' }}
            onClick={() => onAskAI('review')}
            disabled={!canAskAI}
          >
            <Sparkles size={14} style={{ color: 'var(--accent-brand)' }} /> Ask AI
          </button>
          
          <button 
            className="btn btn-sm btn-primary" 
            onClick={onRunTests}
            disabled={isRunning}
            style={{ minWidth: '110px' }}
          >
            {isRunning ? (
              <><RefreshCw size={14} className="spin-icon" /> Running</>
            ) : (
              <><Play size={14} /> Run Tests</>
            )}
          </button>
          
          <button 
            className="btn btn-sm" 
            onClick={() => onAskAI('review')}
            disabled={!canSubmit}
            style={{ 
              background: canSubmit ? 'var(--success)' : 'var(--success-soft)', 
              color: canSubmit ? '#fff' : 'var(--success)', 
              opacity: canSubmit ? 1 : 0.5,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              border: 'none'
            }}
          >
            <Send size={14} /> Submit
          </button>
        </div>
      </div>
      
      {/* Monaco Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
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
          loading={<div style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading editor...</div>}
        />
      </div>
    </div>
  );
}
