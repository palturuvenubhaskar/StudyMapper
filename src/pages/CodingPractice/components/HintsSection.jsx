import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight, Lock } from 'lucide-react';
import { db } from '../../../data/db';
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog';
import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';

export function HintsSection({ hints, problemId }) {
  const [unlockedHints, setUnlockedHints] = useState(new Set());
  const [expandedHint, setExpandedHint] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    if (problemId) {
      loadUnlockedHints();
    }
  }, [problemId]);

  const loadUnlockedHints = async () => {
    try {
      const unlocked = await db.coding_hints_unlocked.where('problem_id').equals(problemId).toArray();
      setUnlockedHints(new Set(unlocked.map(h => h.hint_index)));
    } catch (e) {
      console.error("Failed to load unlocked hints", e);
    }
  };

  const handleUnlock = async (index, penalty) => {
    try {
      await db.coding_hints_unlocked.add({
        problem_id: problemId,
        hint_index: index,
        points_deducted: penalty,
        unlocked_at: new Date().toISOString(),
      });
      setUnlockedHints(prev => new Set([...prev, index]));
      setExpandedHint(index);
    } catch (e) {
      console.error("Failed to unlock hint", e);
    }
    setShowConfirm(null);
  };

  // If hints is just a markdown string (legacy or generated), we don't use the penalty system
  if (typeof hints === 'string') {
    return (
      <div className="practice-section practice-hints-section">
        <div className="practice-section-head">
          <Lightbulb size={14} />
          <h3 className="practice-section-title">Hints</h3>
        </div>
        <div className="practice-hints-note markdown-body">
          <MarkdownRenderer remarkPlugins={[remarkGfm]}>{hints}</MarkdownRenderer>
        </div>
      </div>
    );
  }

  // If no hints or empty array
  if (!hints || !Array.isArray(hints) || hints.length === 0) {
    return null;
  }

  return (
    <div className="practice-section practice-hints-section">
      <div className="practice-section-head">
        <Lightbulb size={14} />
        <h3 className="practice-section-title">Hints</h3>
      </div>

      {hints.map((hint, idx) => {
        const isUnlocked = unlockedHints.has(idx);
        const isExpanded = expandedHint === idx;

        return (
          <div key={idx} className={`hint-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
            <button 
              className="hint-toggle"
              onClick={() => {
                if (isUnlocked) {
                  setExpandedHint(isExpanded ? null : idx);
                } else {
                  setShowConfirm({ index: idx, penalty: hint.penalty || 2 });
                }
              }}
            >
              {isUnlocked ? (
                <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              ) : (
                <Lock size={14} />
              )}
              <span>Hint {idx + 1}</span>
              {!isUnlocked && (
                <span className="hint-penalty">-{hint.penalty || 2} pts</span>
              )}
            </button>

            {isUnlocked && isExpanded && (
              <div className="hint-content markdown-body">
                <MarkdownRenderer remarkPlugins={[remarkGfm]}>{hint.text}</MarkdownRenderer>
              </div>
            )}
          </div>
        );
      })}

      <ConfirmDialog
        isOpen={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        onConfirm={() => handleUnlock(showConfirm?.index, showConfirm?.penalty)}
        title="Unlock Hint?"
        description={`Revealing this hint will deduct ${showConfirm?.penalty || 0} points from your final score. Use hints wisely!`}
        confirmLabel="Unlock Hint"
        cancelLabel="Keep Hidden"
        variant="warning"
      />
    </div>
  );
}
