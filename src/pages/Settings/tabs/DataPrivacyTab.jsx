import { useState } from 'react';
import { Database, Download, Trash2, Cookie } from 'lucide-react';
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
      <h2><Database size={20} /> Data & Privacy</h2>

      <div className="settings-section">
        <h3>Export Your Data</h3>
        <p>Download a complete copy of all your study data in JSON format.</p>
        <button onClick={handleExportJSON} className="btn btn-secondary">
          <Download size={16} />
          Export All Data (JSON)
        </button>
      </div>

      <div className="settings-section">
        <h3>Cookie Preferences</h3>
        <p>Manage your cookie consent settings at any time.</p>
        <button onClick={() => window.dispatchEvent(new CustomEvent('openCookiePrefs'))} className="btn btn-secondary">
          <Cookie size={16} />
          Manage Cookies
        </button>
      </div>

      <div className="settings-section danger-zone">
        <h3>Clear Local Data</h3>
        <p>Remove all study data from this device. This does not affect your cloud backup if enabled.</p>
        <button onClick={() => setShowClearDialog(true)} className="btn btn-danger">
          <Trash2 size={16} />
          Clear All Local Data
        </button>
      </div>

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
