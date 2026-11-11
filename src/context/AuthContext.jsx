import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setLoading(false);
    };

    // Never block the whole app on Firebase. If the SDK cannot reach the
    // network (offline, blocked, misconfigured project) we still show the
    // local-first app instead of a blank screen.
    const fallback = window.setTimeout(finish, 6000);

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              mobile: firebaseUser.phoneNumber,
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email || firebaseUser.phoneNumber || 'User'}`
            });
          } else {
            setUser(null);
          }
          finish();
        },
        (error) => {
          console.error('Auth state listener failed:', error);
          finish();
        }
      );
    } catch (error) {
      console.error('Auth could not be initialized:', error);
      finish();
    }

    return () => {
      window.clearTimeout(fallback);
      settled = true;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
  };

  const sendPhoneOtp = async (phoneNumber, containerId) => {
    setupRecaptcha(containerId);
    const appVerifier = window.recaptchaVerifier;
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const verifyPhoneOtp = async (confirmationResult, otpCode) => {
    return await confirmationResult.confirm(otpCode);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const value = {
    user,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    sendPhoneOtp,
    verifyPhoneOtp,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
