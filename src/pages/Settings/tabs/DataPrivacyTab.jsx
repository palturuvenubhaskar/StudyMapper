import { useState } from 'react';
import { Database, Download, Trash2, Cookie, ShieldCheck } from 'lucide-react';
import { db } from '../../../data/db';
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog';

export function DataPrivacyTab() {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExportJSON = async () => {
    const data = {};
    for (const table of db.tables) {
      data[table.name] = await table.toArray();
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymapper-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    for (const table of db.tables) {
      if (!['user_settings', 'cookie_consent'].includes(table.name)) {
        await table.clear();
      }
    }
    window.location.reload();
  };

  return (
    <div className="settings-tab">
      <header className="set-head">
        <div className="set-head-copy">
          <h2>Data & privacy</h2>
          <p>Everything you create in StudyMapper is stored on this device first.</p>
        </div>
        <span className="set-status">
          <ShieldCheck size={13} />
          Local first
        </span>
      </header>

      <section className="set-panel">
        <div className="set-panel-head">
          <h3>Your study data</h3>
          <p>Take a copy with you or reset what is stored on this browser.</p>
        </div>

        <div className="set-rows">
          <div className="set-row">
            <span className="set-row-icon">
              <Download size={17} />
            </span>
            <div className="set-row-copy">
              <span className="set-row-label">Export everything</span>
              <span className="set-row-description">
                Subjects, notes, flashcards, question banks and progress as a JSON file.
              </span>
            </div>
            <button type="button" className="btn btn-secondary btn-sm set-row-action" onClick={handleExportJSON}>
              Export JSON
            </button>
          </div>

          <div className="set-row">
            <span className="set-row-icon">
              <Cookie size={17} />
            </span>
            <div className="set-row-copy">
              <span className="set-row-label">Cookie preferences</span>
              <span className="set-row-description">
                Review which optional cookies and analytics this browser allows.
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm set-row-action"
              onClick={() => window.dispatchEvent(new CustomEvent('openCookiePrefs'))}
            >
              Manage cookies
            </button>
          </div>
        </div>
      </section>

      <section className="set-panel set-panel-danger">
        <div className="set-panel-head">
          <h3>
            <Database size={16} />
            Clear local data
          </h3>
          <p>
            Remove every subject, note, flashcard and question bank from this device. Cloud backups and your
            account stay untouched.
          </p>
        </div>
        <div className="set-panel-foot">
          <span className="set-foot-note">Export a copy first if you may need this data later.</span>
          <div className="set-actions">
            <button type="button" className="btn btn-danger" onClick={() => setShowClearDialog(true)}>
              <Trash2 size={16} />
              Clear local data
            </button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearData}
        title="Clear All Local Data?"
        description="This will permanently delete all subjects, notes, flashcards, and question banks from this device. This action cannot be undone."
        confirmLabel="Clear Data"
        variant="danger"
        requireText="CLEAR"
      />
    </div>
  );
}
