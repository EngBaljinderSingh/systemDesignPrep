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

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isPro: boolean;
  login: (email: string, role?: 'user' | 'admin') => void;
  loginWithSocial: (provider: 'google' | 'linkedin') => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  upgradeToPro: () => void;
  switchUserRole: (role: 'user' | 'admin') => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sdp_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default demo guest user
    return {
      id: 'usr_guest',
      name: 'Guest Engineer',
      email: 'engineer@sdp.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'user',
      isPro: false,
      provider: 'email',
      joinedAt: new Date().toISOString(),
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user is in verified pro emails list
      try {
        const proList = JSON.parse(localStorage.getItem('sdp_verified_pro_emails') || '[]');
        if (proList.includes(user.email.toLowerCase()) && !user.isPro) {
          const updated = { ...user, isPro: true };
          setUser(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return;
        }
      } catch (err) {
        console.error(err);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, role: 'user' | 'admin' = 'user') => {
    const isProEmail = (() => {
      try {
        const proList = JSON.parse(localStorage.getItem('sdp_verified_pro_emails') || '[]');
        return proList.includes(email.toLowerCase());
      } catch {
        return false;
      }
    })();

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      role,
      isPro: isProEmail || role === 'admin',
      provider: 'email',
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const loginWithSocial = (provider: 'google' | 'linkedin') => {
    const demoEmail = provider === 'google' ? 'developer@gmail.com' : 'lead.architect@linkedin.com';
    const demoName = provider === 'google' ? 'Alex Rivera (Google)' : 'Sarah Connor (LinkedIn)';
    const avatar = provider === 'google'
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80';

    const newUser: User = {
      id: `usr_${provider}_${Date.now()}`,
      name: demoName,
      email: demoEmail,
      avatar,
      role: 'user',
      isPro: false,
      provider,
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const signup = (name: string, email: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      role: 'user',
      isPro: false,
      provider: 'email',
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const upgradeToPro = () => {
    if (!user) return;
    const updated = { ...user, isPro: true };
    setUser(updated);
    // Add to persistent pro list
    try {
      const proList = JSON.parse(localStorage.getItem('sdp_verified_pro_emails') || '[]');
      if (!proList.includes(user.email.toLowerCase())) {
        proList.push(user.email.toLowerCase());
        localStorage.setItem('sdp_verified_pro_emails', JSON.stringify(proList));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const switchUserRole = (role: 'user' | 'admin') => {
    if (!user) return;
    setUser({ ...user, role });
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
        switchUserRole,
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
