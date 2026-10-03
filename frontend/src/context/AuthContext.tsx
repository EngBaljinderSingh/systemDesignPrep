import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateFirebaseProfile,
  updateFirebasePassword,
  onAuthStateChanged,
} from '../firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  avatar?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  role: 'user' | 'admin';
  isPro: boolean;
  provider: 'email' | 'google' | 'linkedin';
  joinedAt: string;
}

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  avatar?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  passwordHash: string;
  role: 'user' | 'admin';
  isPro: boolean;
  provider: 'email' | 'google' | 'linkedin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isPro: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithSocial: (provider: 'google' | 'linkedin', email?: string, name?: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradeToPro: () => void;
  updateUserProfile: (details: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'sdp_current_user_session';
const USERS_DB_KEY = 'sdp_registered_users_db';
const PRO_EMAILS_KEY = 'sdp_verified_pro_emails';

// Initial pre-registered admin accounts
const INITIAL_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr_admin_01',
    name: 'Admin',
    email: 'admin',
    title: 'Lead System Architect & Admin',
    bio: 'Platform founder and system design reviewer.',
    passwordHash: 'Japan@2027',
    role: 'admin',
    isPro: true,
    provider: 'email',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_admin_02',
    name: 'Platform Administrator',
    email: 'admin@sdp.dev',
    title: 'System Design Prep Administrator',
    bio: 'Platform administrator for SDP.',
    passwordHash: 'Japan@2027',
    role: 'admin',
    isPro: true,
    provider: 'email',
    createdAt: new Date().toISOString(),
  },
];

function getUsersDB(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const list: StoredAccount[] = JSON.parse(raw);
    let updated = false;
    for (const init of INITIAL_ACCOUNTS) {
      const found = list.find((u) => u.email.toLowerCase() === init.email.toLowerCase());
      if (!found) {
        list.push(init);
        updated = true;
      } else if (found.passwordHash !== 'Japan@2027') {
        found.passwordHash = 'Japan@2027';
        found.role = 'admin';
        found.isPro = true;
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return INITIAL_ACCOUNTS;
  }
}

function saveUsersDB(users: StoredAccount[]): void {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
        if (proList.includes(user.email.toLowerCase()) && !user.isPro) {
          const updated = { ...user, isPro: true };
          setUser(updated);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
          return;
        }
      } catch (err) {
        console.error(err);
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  // Synchronize Firebase auth state across page reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const cleanEmail = (fbUser.email || `${fbUser.uid}@google.com`).toLowerCase();
        const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
        const isProUser = proList.includes(cleanEmail);

        const db = getUsersDB();
        const existing = db.find((u) => u.email.toLowerCase() === cleanEmail);

        setUser((prev) => {
          // If already logged in as admin or same user, preserve role
          if (prev && prev.email.toLowerCase() === cleanEmail) return prev;
          return {
            id: fbUser.uid,
            name: existing?.name || fbUser.displayName || 'Engineer',
            email: cleanEmail,
            title: existing?.title || 'Software Engineer',
            bio: existing?.bio,
            avatar: existing?.avatar || fbUser.photoURL || undefined,
            linkedinUrl: existing?.linkedinUrl,
            githubUrl: existing?.githubUrl,
            role: existing?.role || 'user',
            isPro: Boolean(existing?.isPro || isProUser || existing?.role === 'admin'),
            provider: fbUser.providerData[0]?.providerId.includes('google') ? 'google' : 'email',
            joinedAt: existing?.createdAt || new Date().toISOString(),
          };
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Admin shortcut bypass
    if ((cleanEmail === 'admin' || cleanEmail === 'admin@sdp.dev') && password === 'Japan@2027') {
      const sessionUser: User = {
        id: 'usr_admin_01',
        name: 'Admin',
        email: cleanEmail,
        title: 'Platform Administrator',
        avatar: undefined,
        role: 'admin',
        isPro: true,
        provider: 'email',
        joinedAt: new Date().toISOString(),
      };
      setUser(sessionUser);
      setIsAuthModalOpen(false);
      return;
    }

    // 2. Try Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (cred.user) {
        const fbUser = cred.user;
        const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
        const isProUser = proList.includes(cleanEmail);

        // Check if existing profile stored in local db
        const db = getUsersDB();
        const existing = db.find((u) => u.email.toLowerCase() === cleanEmail);

        const sessionUser: User = {
          id: fbUser.uid,
          name: existing?.name || fbUser.displayName || 'Software Engineer',
          email: cleanEmail,
          title: existing?.title || 'Software Engineer',
          bio: existing?.bio,
          avatar: existing?.avatar || fbUser.photoURL || undefined,
          linkedinUrl: existing?.linkedinUrl,
          githubUrl: existing?.githubUrl,
          role: existing?.role || 'user',
          isPro: existing?.isPro || isProUser,
          provider: 'email',
          joinedAt: existing?.createdAt || new Date().toISOString(),
        };

        setUser(sessionUser);
        setIsAuthModalOpen(false);
        return;
      }
    } catch (fbErr: any) {
      // If user not in Firebase or operation not allowed, fall through to local DB
      if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
        throw new Error('Incorrect email or password. Please verify your credentials.');
      }
    }

    // 3. Fallback to Local Verified Accounts Database
    const db = getUsersDB();
    const matched = db.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!matched) {
      throw new Error('No account found with this email. Please create an account or verify credentials.');
    }

    if (matched.passwordHash !== password) {
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
    const isProUser = matched.isPro || proList.includes(cleanEmail) || matched.role === 'admin';

    const sessionUser: User = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      title: matched.title,
      bio: matched.bio,
      avatar: matched.avatar,
      linkedinUrl: matched.linkedinUrl,
      githubUrl: matched.githubUrl,
      role: matched.role,
      isPro: isProUser,
      provider: matched.provider,
      joinedAt: matched.createdAt,
    };

    setUser(sessionUser);
    setIsAuthModalOpen(false);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
    const isProUser = proList.includes(cleanEmail);

    // Try Firebase Authentication registration
    let fbUid: string = `usr_${Date.now()}`;
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (cred.user) {
        fbUid = cred.user.uid;
        await updateFirebaseProfile(cred.user, { displayName: cleanName });
      }
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      if (fbErr.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password not yet enabled in Console; proceeding with local account.');
      } else if (fbErr.code !== 'auth/weak-password') {
        console.warn('Firebase signup notice:', fbErr.message);
      }
    }

    // Save in local accounts database as well
    const db = getUsersDB();
    const existingIndex = db.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    const newAccount: StoredAccount = {
      id: fbUid,
      name: cleanName,
      email: cleanEmail,
      title: 'Software Engineer',
      passwordHash: password,
      role: 'user',
      isPro: isProUser,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db[existingIndex] = newAccount;
    } else {
      db.push(newAccount);
    }
    saveUsersDB(db);

    const sessionUser: User = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      title: newAccount.title,
      avatar: undefined,
      role: 'user',
      isPro: isProUser,
      provider: 'email',
      joinedAt: newAccount.createdAt,
    };

    setUser(sessionUser);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const cleanEmail = (fbUser.email || `${fbUser.uid}@gmail.com`).trim().toLowerCase();
      const cleanName = fbUser.displayName || 'Google Engineer';
      const avatar = fbUser.photoURL || undefined;

      const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
      const isProUser = proList.includes(cleanEmail);

      const db = getUsersDB();
      const existing = db.find((u) => u.email.toLowerCase() === cleanEmail);

      const sessionUser: User = {
        id: fbUser.uid,
        name: existing?.name || cleanName,
        email: cleanEmail,
        title: existing?.title || 'Google Verified Engineer',
        bio: existing?.bio,
        avatar: avatar || existing?.avatar,
        linkedinUrl: existing?.linkedinUrl,
        githubUrl: existing?.githubUrl,
        role: existing?.role || 'user',
        isPro: Boolean(existing?.isPro || isProUser || existing?.role === 'admin'),
        provider: 'google',
        joinedAt: existing?.createdAt || new Date().toISOString(),
      };

      if (!existing) {
        db.push({
          id: fbUser.uid,
          name: cleanName,
          email: cleanEmail,
          title: 'Google Verified Engineer',
          passwordHash: 'google_oauth_managed',
          role: 'user',
          isPro: isProUser,
          provider: 'google',
          createdAt: new Date().toISOString(),
          avatar: avatar,
        });
      } else {
        existing.avatar = avatar || existing.avatar;
      }
      saveUsersDB(db);

      setUser(sessionUser);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        const host = window.location.hostname || 'localhost';
        throw new Error(
          `Domain not authorized: '${host}' is not added in Firebase Console. Go to Firebase Console > Authentication > Settings > Authorized domains, and add '${host}'.`
        );
      }
      if (err.code === 'auth/operation-not-allowed') {
        throw new Error(
          'Google sign-in is not yet enabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method, click Google, and enable it.'
        );
      }
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in popup was closed.');
      }
      if (err.code === 'auth/cancelled-popup-request') {
        return;
      }
      throw new Error(err.message || 'Google authentication failed.');
    }
  };

  const loginWithSocial = async (
    provider: 'google' | 'linkedin',
    socialEmail?: string,
    socialName?: string
  ): Promise<void> => {
    if (provider === 'google') {
      return loginWithGoogle();
    }

    const cleanEmail = (socialEmail || `${provider}.user@gmail.com`).trim().toLowerCase();
    const cleanName = socialName || 'LinkedIn Member';

    const db = getUsersDB();
    let matched = db.find((u) => u.email.toLowerCase() === cleanEmail);

    const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
    const isProUser = proList.includes(cleanEmail);

    if (!matched) {
      matched = {
        id: `usr_${provider}_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        title: 'LinkedIn Verified Engineer',
        passwordHash: `social_oauth_${Date.now()}`,
        role: 'user',
        isPro: isProUser,
        provider,
        createdAt: new Date().toISOString(),
      };
      db.push(matched);
      saveUsersDB(db);
    }

    const sessionUser: User = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      title: matched.title,
      bio: matched.bio,
      avatar: matched.avatar,
      linkedinUrl: matched.linkedinUrl,
      githubUrl: matched.githubUrl,
      role: matched.role,
      isPro: matched.isPro || isProUser || matched.role === 'admin',
      provider,
      joinedAt: matched.createdAt,
    };

    setUser(sessionUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    firebaseSignOut(auth).catch(() => {});
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const upgradeToPro = () => {
    if (!user) return;
    const updated = { ...user, isPro: true };
    setUser(updated);

    try {
      const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
      if (!proList.includes(user.email.toLowerCase())) {
        proList.push(user.email.toLowerCase());
        localStorage.setItem(PRO_EMAILS_KEY, JSON.stringify(proList));
      }
      const db = getUsersDB();
      const match = db.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
      if (match) {
        match.isPro = true;
        saveUsersDB(db);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserProfile = async (details: Partial<User>): Promise<void> => {
    if (!user) throw new Error('You must be signed in to update your profile.');
    const updated: User = { ...user, ...details };
    setUser(updated);

    if (auth.currentUser && details.name) {
      try {
        await updateFirebaseProfile(auth.currentUser, { displayName: details.name });
      } catch (e) {
        console.warn('Firebase profile update notice:', e);
      }
    }

    const db = getUsersDB();
    const match = db.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (match) {
      if (details.name) match.name = details.name;
      if (details.title !== undefined) match.title = details.title;
      if (details.bio !== undefined) match.bio = details.bio;
      if (details.avatar !== undefined) match.avatar = details.avatar;
      if (details.linkedinUrl !== undefined) match.linkedinUrl = details.linkedinUrl;
      if (details.githubUrl !== undefined) match.githubUrl = details.githubUrl;
      saveUsersDB(db);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    if (!user) throw new Error('You must be signed in.');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters long.');

    if (auth.currentUser) {
      try {
        await updateFirebasePassword(auth.currentUser, newPassword);
      } catch (fbErr: any) {
        console.warn('Firebase update password notice:', fbErr.message);
      }
    }

    const db = getUsersDB();
    const match = db.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (!match) throw new Error('User record not found.');

    if (match.passwordHash !== oldPassword && match.passwordHash !== 'firebase_oauth_managed') {
      throw new Error('Current password is incorrect.');
    }

    match.passwordHash = newPassword;
    saveUsersDB(db);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isPro: Boolean(user?.isPro || user?.role === 'admin'),
        login,
        loginWithGoogle,
        loginWithSocial,
        signup,
        logout,
        upgradeToPro,
        updateUserProfile,
        changePassword,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
