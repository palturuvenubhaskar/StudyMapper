import { useState } from 'react';
import { useToast } from '../ToastProvider/ToastProvider';
import { Download, Loader } from 'lucide-react';

export default function ExportComponent({ onExport }) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const data = await onExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'studymapper-export.json';
      a.click();
      URL.revokeObjectURL(url);
      setIsLoading(false);
      toast('Study data exported successfully!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      toast('Failed to export data. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Export Study Data</h3>
        
        <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
          Export all your study progress, subjects, question banks, and progress data as a JSON file.
        </p>
        
        <button
          type="button"
          onClick={handleExport}
          disabled={isLoading}
          aria-busy={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            background: isLoading ? 'var(--bg-surface-active)' : 'var(--accent-primary)',
            color: isLoading ? 'var(--text-muted)' : 'var(--accent-primary-fg)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color var(--transition-fast), color var(--transition-fast)'
          }}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="spin-icon" aria-hidden="true" /> Generating…
            </>
          ) : (
            <>
              <Download size={18} aria-hidden="true" /> Download JSON Export
            </>
          )}
        </button>
      </div>
    </div>
  );
}