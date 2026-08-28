import { useState } from 'react';
import { Shield, Lock, Trash2, Loader2 } from 'lucide-react';
import { getAuth, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog';
import { db } from '../../../data/db';

export function SecurityTab() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    setIsChanging(true);
    setMessage('');
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.code === 'auth/wrong-password' ? 'Current password is incorrect' : 'Failed to update password');
    } finally {
      setIsChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user);
      await db.delete();
      window.location.href = '/';
    } catch (err) {
      setMessage('Failed to delete account. Please re-authenticate and try again.');
    }
  };

  return (
    <div className="settings-tab">
      <h2><Shield size={20} /> Security</h2>

      <div className="settings-section">
        <h3>Change Password</h3>
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        {message && <div className="settings-message error">{message}</div>}
        <button onClick={handleChangePassword} disabled={isChanging} className="btn btn-primary">
          {isChanging ? <Loader2 size={16} className="spin" /> : <Lock size={16} />}
          Update Password
        </button>
      </div>

      <div className="settings-section danger-zone">
        <h3>Danger Zone</h3>
        <p>Once you delete your account, there is no going back. All your local data and cloud backups will be permanently removed.</p>
        <button onClick={() => setShowDeleteDialog(true)} className="btn btn-danger">
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>

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
