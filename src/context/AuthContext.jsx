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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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
      setLoading(false);
    });

    return unsubscribe;
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
      {!loading && children}
    </AuthContext.Provider>
  );
};
