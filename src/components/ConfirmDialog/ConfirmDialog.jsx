import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  requireText = null,
}) {
  const [inputValue, setInputValue] = useState('');
  const isConfirmDisabled = requireText ? inputValue !== requireText : false;

  const handleConfirm = () => {
    if (isConfirmDisabled) return;
    onConfirm();
    onClose();
    setInputValue('');
  };

  const handleClose = () => {
    setInputValue('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm" variant={variant}>
      <div className="confirm-dialog" style={{ textAlign: 'center' }}>
        {variant === 'danger' && (
          <AlertTriangle style={{ color: 'var(--danger)', marginBottom: '16px' }} size={40} />
        )}
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
          {description}
        </p>

        {requireText && (
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Type <strong style={{ color: 'var(--text-primary)' }}>{requireText}</strong> to confirm
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
              }}
              autoFocus
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={handleClose}>
            {cancelLabel}
          </button>
          <button
            className={`btn btn-${variant}`}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            style={{ opacity: isConfirmDisabled ? 0.5 : 1 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
