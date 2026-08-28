import { useState, useEffect } from 'react';
import { User, Camera, Save, Loader2 } from 'lucide-react';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../../../data/db';

export function ProfileTab() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await updateProfile(auth.currentUser, { displayName, photoURL });
      await db.user_settings.update(user.uid, { display_name: displayName, photo_url: photoURL, updated_at: new Date().toISOString() });
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-tab">
      <h2><User size={20} /> Profile</h2>

      <div className="settings-section">
        <div className="profile-photo-section">
          <div className="profile-photo">
            {photoURL ? (
              <img src={photoURL} alt="Profile" />
            ) : (
              <User size={40} />
            )}
            <button className="photo-upload-btn" aria-label="Change photo">
              <Camera size={14} />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} disabled />
          <span className="field-hint">Email cannot be changed. Contact support for assistance.</span>
        </div>

        {message && (
          <div className={`settings-message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
          {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
