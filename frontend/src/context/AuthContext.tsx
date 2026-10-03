import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  isPro: boolean;
  provider: 'email' | 'google' | 'linkedin';
  joinedAt: string;
}

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain/simple hashed string in local store
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
  loginWithSocial: (provider: 'google' | 'linkedin', email?: string, name?: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradeToPro: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'sdp_current_user_session';
const USERS_DB_KEY = 'sdp_registered_users_db';
const PRO_EMAILS_KEY = 'sdp_verified_pro_emails';

// Initial pre-registered admin account
const INITIAL_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr_admin_01',
    name: 'Admin',
    email: 'admin',
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
    // Ensure admin accounts exist and have Japan@2027 password
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
  // Default: NULL (user is NOT logged in by default)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return null; // Guest by default!
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync session changes
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

  const login = async (email: string, password: string): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();

    // Special master check for admin / Japan@2027
    if ((cleanEmail === 'admin' || cleanEmail === 'admin@sdp.dev') && password === 'Japan@2027') {
      const sessionUser: User = {
        id: 'usr_admin_01',
        name: 'Admin',
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=admin`,
        role: 'admin',
        isPro: true,
        provider: 'email',
        joinedAt: new Date().toISOString(),
      };
      setUser(sessionUser);
      setIsAuthModalOpen(false);
      return;
    }

    const db = getUsersDB();
    const matched = db.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!matched) {
      throw new Error('No account found with this email. Please create an account.');
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
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
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

    const db = getUsersDB();
    const existing = db.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
    const isProUser = proList.includes(cleanEmail);

    const newAccount: StoredAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: password,
      role: 'user', // New signups are ALWAYS regular users, NEVER admin
      isPro: isProUser,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    db.push(newAccount);
    saveUsersDB(db);

    const sessionUser: User = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      role: 'user',
      isPro: isProUser,
      provider: 'email',
      joinedAt: newAccount.createdAt,
    };

    setUser(sessionUser);
    setIsAuthModalOpen(false);
  };

  const loginWithSocial = async (
    provider: 'google' | 'linkedin',
    socialEmail?: string,
    socialName?: string
  ): Promise<void> => {
    const cleanEmail = (socialEmail || `${provider}.user@gmail.com`).trim().toLowerCase();
    const cleanName = socialName || (provider === 'google' ? 'Google Account' : 'LinkedIn Member');

    const db = getUsersDB();
    let matched = db.find((u) => u.email.toLowerCase() === cleanEmail);

    const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
    const isProUser = proList.includes(cleanEmail);

    if (!matched) {
      // Register social account
      matched = {
        id: `usr_${provider}_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        passwordHash: `social_oauth_${Date.now()}`,
        role: 'user', // NEVER admin
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
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      role: matched.role,
      isPro: matched.isPro || isProUser || matched.role === 'admin',
      provider,
      joinedAt: matched.createdAt,
    };

    setUser(sessionUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const upgradeToPro = () => {
    if (!user) return;
    const updated = { ...user, isPro: true };
    setUser(updated);

    // Save in persistent pro list
    try {
      const proList = JSON.parse(localStorage.getItem(PRO_EMAILS_KEY) || '[]');
      if (!proList.includes(user.email.toLowerCase())) {
        proList.push(user.email.toLowerCase());
        localStorage.setItem(PRO_EMAILS_KEY, JSON.stringify(proList));
      }
      // Also update DB
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

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isPro: Boolean(user?.isPro || user?.role === 'admin'),
        login,
        loginWithSocial,
        signup,
        logout,
        upgradeToPro,
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
