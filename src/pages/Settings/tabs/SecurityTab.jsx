import { useState } from 'react';
import { ShieldCheck, KeyRound, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { getAuth, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog';
import { db } from '../../../data/db';

function PasswordField({ id, label, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="set-field">
      <label htmlFor={id}>{label}</label>
      <div className="set-input-affix">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="set-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="set-affix-btn"
          onClick={() => setVisible((open) => !open)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export function SecurityTab() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState(null);

  const canSubmit = Boolean(currentPassword && newPassword && confirmPassword) && !isChanging;

  const handleChangePassword = async () => {
    setMessage(null);

    if (!user) {
      setMessage({ type: 'error', text: 'Sign in to change your password.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'The new passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Use at least 8 characters for your new password.' });
      return;
    }

    setIsChanging(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage({ type: 'success', text: 'Password updated. Use it the next time you sign in.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.code === 'auth/wrong-password' ? 'That current password is not correct.' : 'We could not update your password. Try again.',
      });
    } finally {
      setIsChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user);
      await db.delete();
      window.location.href = '/';
    } catch {
      setMessage({ type: 'error', text: 'Deleting the account needs a recent sign-in. Sign in again, then retry.' });
    }
  };

  return (
    <div className="settings-tab">
      <header className="set-head">
        <div className="set-head-copy">
          <h2>Security</h2>
          <p>Keep your account protected with a password only you know.</p>
        </div>
        <span className="set-status">
          <ShieldCheck size={13} />
          Password protected
        </span>
      </header>

      <section className="set-panel">
        <div className="set-panel-head">
          <h3>Change password</h3>
          <p>You will stay signed in on this device after changing it.</p>
        </div>

        <div className="set-panel-body set-field-stack">
          <PasswordField
            id="security-current-password"
            label="Current password"
            value={currentPassword}
            onChange={(value) => {
              setCurrentPassword(value);
              setMessage(null);
            }}
            autoComplete="current-password"
          />
          <div className="set-field-grid">
            <PasswordField
              id="security-new-password"
              label="New password"
              value={newPassword}
              onChange={(value) => {
                setNewPassword(value);
                setMessage(null);
              }}
              autoComplete="new-password"
            />
            <PasswordField
              id="security-confirm-password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setMessage(null);
              }}
              autoComplete="new-password"
            />
          </div>
          <p className="set-hint">
            <KeyRound size={13} />
            Use at least 8 characters. Longer passphrases are easier to remember and harder to guess.
          </p>

          {message && (
            <p className={`set-alert ${message.type}`} role="status">
              {message.text}
            </p>
          )}
        </div>

        <div className="set-panel-foot">
          <span className="set-foot-note">Changing your password signs out other devices.</span>
          <div className="set-actions">
            <button type="button" className="btn btn-primary" onClick={handleChangePassword} disabled={!canSubmit}>
              {isChanging ? <Loader2 size={16} className="spin" /> : <ShieldCheck size={16} />}
              {isChanging ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </div>
      </section>

      <section className="set-panel set-panel-danger">
        <div className="set-panel-head">
          <h3>
            <Trash2 size={16} />
            Delete account
          </h3>
          <p>
            Permanently remove your account along with every subject, note, flashcard and study session on this
            device. This cannot be undone.
          </p>
        </div>
        <div className="set-panel-foot">
          <span className="set-foot-note">Export your data first if you want a copy.</span>
          <div className="set-actions">
            <button type="button" className="btn btn-danger" onClick={() => setShowDeleteDialog(true)}>
              Delete account
            </button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account?"
        description="This will permanently delete all your study data, notes, flashcards, and account information. This action cannot be undone."
        confirmLabel="Delete Account"
        variant="danger"
        requireText="DELETE"
      />
    </div>
  );
}
