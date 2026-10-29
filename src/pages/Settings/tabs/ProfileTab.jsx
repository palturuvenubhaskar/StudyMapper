import { useMemo, useRef, useState } from 'react';
import { Camera, Check, Loader2, Lock, User } from 'lucide-react';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../../../data/db';

function resizeImage(file, size = 192) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Could not read that image.'));
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');
        const edge = Math.min(image.width, image.height);
        context.drawImage(
          image,
          (image.width - edge) / 2,
          (image.height - edge) / 2,
          edge,
          edge,
          0,
          0,
          size,
          size,
        );
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfileTab() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedName, setSavedName] = useState(user?.displayName || '');
  const [savedPhoto, setSavedPhoto] = useState(user?.photoURL || '');
  const fileInputRef = useRef(null);

  const email = user?.email || '';
  const isDirty = displayName !== savedName || photoURL !== savedPhoto;

  const initials = useMemo(() => {
    const source = displayName.trim() || email.replace(/@.*/, '');
    return source
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [displayName, email]);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file to use as your photo.');
      return;
    }
    try {
      setError('');
      setPhotoURL(await resizeImage(file));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDiscard = () => {
    setDisplayName(savedName);
    setPhotoURL(savedPhoto);
    setError('');
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      setError('Sign in again to update your profile.');
      return;
    }
    if (!displayName.trim()) {
      setError('Add a display name before saving.');
      return;
    }

    setIsSaving(true);
    setError('');
    const name = displayName.trim();
    try {
      try {
        await updateProfile(auth.currentUser, { displayName: name, photoURL });
      } catch {
        // Some providers reject large data URLs; keep the name, store the photo locally.
        await updateProfile(auth.currentUser, { displayName: name });
      }
      await db.user_settings.update(auth.currentUser.uid, {
        display_name: name,
        photo_url: photoURL,
        updated_at: new Date().toISOString(),
      });
      setDisplayName(name);
      setSavedName(name);
      setSavedPhoto(photoURL);
    } catch {
      setError('We could not save your profile. Check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-tab">
      <header className="set-head">
        <div className="set-head-copy">
          <h2>Profile</h2>
          <p>How you appear across your subjects, notes and study summaries.</p>
        </div>
        <span className={`set-status ${isDirty ? 'pending' : ''}`}>
          {isDirty ? 'Unsaved changes' : <><Check size={13} /> Saved</>}
        </span>
      </header>

      <section className="set-panel set-identity">
        <div className="set-identity-row">
          <div className="set-avatar">
            {photoURL ? (
              <img src={photoURL} alt="" />
            ) : (
              <span className="set-avatar-fallback">{initials || <User size={26} />}</span>
            )}
            <button
              type="button"
              className="set-avatar-edit"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change profile photo"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="set-file-input"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="set-identity-copy">
            <p className="set-identity-name">{displayName.trim() || 'Add your name'}</p>
            <p className="set-identity-email">{email || 'Not signed in'}</p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm set-photo-action"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={15} />
            Change photo
          </button>
        </div>
      </section>

      <section className="set-panel">
        <div className="set-panel-head">
          <h3>Personal details</h3>
          <p>Your name appears on shared notes and exported study data.</p>
        </div>

        <div className="set-panel-body">
          <div className="set-field">
            <label htmlFor="settings-display-name">Display name</label>
            <input
              id="settings-display-name"
              type="text"
              className="set-input"
              value={displayName}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setError('');
              }}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div className="set-field">
            <label htmlFor="settings-email">Email address</label>
            <div className="set-input-locked">
              <input id="settings-email" type="email" className="set-input" value={email} disabled placeholder="No email on this account" />
              <span className="set-locked-badge">
                <Lock size={12} />
                Sign-in
              </span>
            </div>
            <span className="set-hint">This email comes from your sign-in provider and cannot be changed here.</span>
          </div>

          {error && (
            <p className="set-alert" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="set-panel-foot">
          <span className="set-foot-note">
            {isDirty ? 'Changes are not saved yet.' : 'Up to date.'}
          </span>
          <div className="set-actions">
            <button type="button" className="btn btn-ghost" onClick={handleDiscard} disabled={!isDirty || isSaving}>
              Discard
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
            >
              {isSaving ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
