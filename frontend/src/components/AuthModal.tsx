import React, { useState } from 'react';
import { X, Sparkles, Shield, User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, loginWithSocial, signup } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (tab === 'signup') {
      signup(name || email.split('@')[0], email);
    } else {
      login(email, email.includes('admin') ? 'admin' : 'user');
    }
  };

  const handleQuickDemo = (role: 'free' | 'pro' | 'admin') => {
    if (role === 'admin') {
      login('admin@sdp.dev', 'admin');
    } else if (role === 'pro') {
      login('pro.engineer@gmail.com', 'user');
      // Ensure pro is granted
      const proList = JSON.parse(localStorage.getItem('sdp_verified_pro_emails') || '[]');
      if (!proList.includes('pro.engineer@gmail.com')) {
        proList.push('pro.engineer@gmail.com');
        localStorage.setItem('sdp_verified_pro_emails', JSON.stringify(proList));
      }
      login('pro.engineer@gmail.com', 'user');
    } else {
      login('engineer@sdp.dev', 'user');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-surface border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-indigo-600 px-6 py-5 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
              Secure Access
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {tab === 'login' ? 'Welcome Back to SDP' : 'Join System Design Prep'}
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Access your blueprints, practice progress, and personalized mock sessions.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-800 bg-surface-light/50">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              tab === 'login'
                ? 'border-primary text-white bg-primary/5'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              tab === 'signup'
                ? 'border-primary text-white bg-primary/5'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Social Logins */}
          <div className="space-y-2">
            <button
              onClick={() => loginWithSocial('google')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white text-gray-900 font-semibold text-xs hover:bg-gray-100 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => loginWithSocial('linkedin')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-xs transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.75a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
              </svg>
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 my-2">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span>or with email</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'signup' && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all mt-2"
            >
              {tab === 'login' ? 'Sign In to SDP' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="border-t border-gray-800 pt-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              ⚡ Instant Demo Role Switch (Testing):
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('free')}
                className="py-1.5 px-2 rounded-lg bg-surface-light hover:bg-white/10 text-gray-300 font-medium border border-gray-800 transition-colors text-center"
              >
                Free User
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('pro')}
                className="py-1.5 px-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30 transition-colors text-center flex items-center justify-center gap-1"
              >
                <Sparkles size={11} /> Pro User
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 transition-colors text-center flex items-center justify-center gap-1"
              >
                <Shield size={11} /> Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
