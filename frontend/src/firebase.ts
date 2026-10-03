import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  updatePassword as updateFirebasePassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDM3E7KJ2C6Jk-yXXrmV-xMYrqGjmNC32Q",
  authDomain: "sdp-prep.firebaseapp.com",
  projectId: "sdp-prep",
  storageBucket: "sdp-prep.firebasestorage.app",
  messagingSenderId: "116031542099",
  appId: "1:116031542099:web:7d93e05f6a4f5636d4c7a6",
  measurementId: "G-3HS0ZXDNM5"
};

// Initialize Firebase only once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication and provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateFirebaseProfile,
  updateFirebasePassword,
  onAuthStateChanged
};
export type { FirebaseUser };
