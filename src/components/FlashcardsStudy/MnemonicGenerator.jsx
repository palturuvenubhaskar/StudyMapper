import React, { useState } from 'react';
import { generateFlashcardMnemonic } from '../../core/api/aiService';
import { Lightbulb } from 'lucide-react';
import GeneratingState from '../GeneratingState/GeneratingState';
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
        <GeneratingState
          size="sm"
          label="Brainstorming a memory hook"
          hint="Turning this card into a weird little story."
        />
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
