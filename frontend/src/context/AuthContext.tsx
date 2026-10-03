import React, { createContext, useContext, useState } from 'react';

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

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isPro: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithSocial: (provider: 'google' | 'linkedin', email?: string, name?: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradeToPro: (targetEmail?: string) => void;
  updateUserProfile: (details: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  previewAsFree: boolean;
  togglePreviewAsFree: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pure lightweight zero-dependency provider (No Firebase, fully free & unlocked for all)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = async () => {};
  const loginWithGoogle = async () => {};
  const loginWithSocial = async () => {};
  const signup = async () => {};
  const logout = () => { setUser(null); };
  const upgradeToPro = () => {};
  const updateUserProfile = async (details: Partial<User>) => {
    if (user) setUser({ ...user, ...details });
  };
  const changePassword = async () => {};
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const togglePreviewAsFree = () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: false,
        isPro: true, // Everyone has 100% full Pro access for free
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
        previewAsFree: false,
        togglePreviewAsFree,
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
