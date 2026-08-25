import React, { useState } from 'react';
import { generateFlashcardMnemonic } from '../../core/api/aiService';
import { Lightbulb, Loader2 } from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';

const MnemonicGenerator = ({ flashcard }) => {
  const [mnemonic, setMnemonic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generated = await generateFlashcardMnemonic(flashcard.front, flashcard.back);
      setMnemonic(generated);
    } catch (err) {
      console.error(err);
      setError("Failed to generate memory hook.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mnemonic-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
      {!mnemonic && !loading && (
        <button className="btn btn-outline" onClick={handleGenerate}>
          <Lightbulb size={18} /> Generate Memory Hook
        </button>
      )}

      {loading && (
        <div style={{ color: '#6b7280' }}>
          <Loader2 className="spin-icon" size={24} style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '0.5rem' }}>AI is brainstorming a weird story...</p>
        </div>
      )}

      {error && <div style={{ color: '#ef4444' }}>{error}</div>}

      {mnemonic && !loading && (
        <div className="mnemonic-result" style={{
          background: '#fef3c7',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #fde68a',
          textAlign: 'left',
          marginTop: '1rem'
        }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', marginBottom: '1rem' }}>
            <Lightbulb size={20} /> Memory Hook
          </h4>
          <div className="markdown-body" style={{ fontSize: '1rem', color: '#451a03' }}>
            <MarkdownRenderer content={mnemonic} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MnemonicGenerator;
