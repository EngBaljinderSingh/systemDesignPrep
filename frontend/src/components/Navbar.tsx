import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Shield, LogOut, LogIn, User, Coffee } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../context/AuthContext';
import ProMonetizationModal from './ProMonetizationModal';
import AuthModal from './AuthModal';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
  badge?: string;
}

interface NavGroup {
  sectionTitle: string;
  items: NavItem[];
}

const baseNavGroups: NavGroup[] = [
  {
    sectionTitle: 'Core',
    items: [
      { to: '/', label: 'Home', icon: '🏠', end: true },
      { to: '/profile', label: 'My Profile', icon: '👤' },
    ],
  },
  {
    sectionTitle: 'System Design',
    items: [
      { to: '/hld-case-studies', label: 'HLD Case Studies', icon: '📐', badge: 'Interactive' },
      { to: '/system-design', label: 'Architecture Patterns', icon: '🏗️' },
      { to: '/canvas', label: 'Interview Canvas', icon: '🎨' },
    ],
  },
  {
    sectionTitle: 'Coding & DSA',
    items: [
      { to: '/algorithms', label: 'Algo Patterns', icon: '⚡' },
      { to: '/problems', label: 'Problem Bank', icon: '🧩' },
      { to: '/hackerrank', label: 'HackerRank Lab', icon: '🏆' },
      { to: '/code', label: 'Code Editor', icon: '💻' },
    ],
  },
  {
    sectionTitle: 'Interview Prep',
    items: [
      { to: '/learning', label: 'Engineering Hub', icon: '🎓' },
      { to: '/design-patterns', label: 'Design Patterns', icon: '🏛️' },
      { to: '/interview-questions', label: 'Interview Q&A', icon: '💬' },
      { to: '/mock-interview', label: 'Mock Interview', icon: '🎤' },
      { to: '/resume', label: 'Resume Builder', icon: '📄' },
    ],
  },
];

interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Navbar({ isOpen, onToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, isPro, logout, openAuthModal } = useAuth();
  const [isProOpen, setIsProOpen] = useState(false);
  const isLight = theme === 'light';

  const border = isLight ? 'border-gray-200' : 'border-gray-800';
  const bg = isLight ? 'bg-white' : 'bg-gray-950';

  // Include Admin group if user is admin
  const navGroups = isAdmin
    ? [
        ...baseNavGroups,
        {
          sectionTitle: 'Administration',
          items: [
            { to: '/admin', label: 'Admin Portal', icon: '⚙️', badge: 'Admin' },
          ],
        },
      ]
    : baseNavGroups;

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          transition-all duration-200 ease-in-out
          border-r ${border} ${bg}
          ${isOpen ? 'w-56' : 'w-14'}
        `}
      >
        {/* ── Header ── */}
        <div className={`flex items-center justify-between h-13 px-3 border-b ${border} shrink-0`} style={{ height: '52px' }}>
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={onToggle}
              title={isOpen ? 'Collapse menu' : 'Expand menu'}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/8 text-gray-400'
              }`}
            >
              <Menu size={18} />
            </button>
            {isOpen && (
              <span className={`text-base font-black tracking-tight whitespace-nowrap ${isLight ? 'text-gray-900' : 'text-white'}`}>
                SDP<span className="text-primary">.prep</span>
              </span>
            )}
          </div>
        </div>

        {/* ── User Account Bar ── */}
        <div className={`p-2 border-b ${border} bg-surface-light/40`}>
          {user ? (
            <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-xl bg-black/20 border border-gray-800">
              <Link
                to="/profile"
                title="View & Edit Profile"
                className="flex items-center gap-2 overflow-hidden flex-1 group hover:opacity-90 transition-opacity"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover bg-primary/20 shrink-0 group-hover:ring-2 group-hover:ring-primary/50 transition-all"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {isOpen && (
                  <div className="truncate text-left leading-tight">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1 group-hover:text-primary transition-colors">
                      <span className="truncate">{user.name}</span>
                      {isAdmin ? (
                        <span className="text-[9px] font-mono px-1 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shrink-0">
                          ADMIN
                        </span>
                      ) : isPro ? (
                        <span className="text-[9px] font-mono px-1 rounded bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30 shrink-0">
                          PRO
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1 rounded bg-gray-700 text-gray-300 shrink-0">
                          FREE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
                  </div>
                )}
              </Link>
              {isOpen && (
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to="/profile"
                    title="Profile & Settings"
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                  >
                    <User size={13} />
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-gray-700/80 text-xs font-bold text-white transition-colors"
            >
              <LogIn size={13} className="text-primary" />
              {isOpen && <span>Sign In / Sign Up</span>}
            </button>
          )}
        </div>

        {/* ── Nav links grouped ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {isOpen && (
                <div className="px-2 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {group.sectionTitle}
                </div>
              )}
              {group.items.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  title={!isOpen ? link.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-primary/15 text-primary border border-primary/25 shadow-sm'
                        : isLight
                          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm leading-none shrink-0 w-4 text-center">{link.icon}</span>
                    {isOpen && <span className="truncate">{link.label}</span>}
                  </div>
                  {isOpen && link.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      link.badge === 'Admin'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Buy Me a Coffee Supporter Button ── */}
        <div className={`p-2 border-t ${border}`}>
          <button
            onClick={() => setIsProOpen(true)}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isOpen
                ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300'
                : 'bg-amber-500/20 text-amber-300 p-2'
            }`}
            title="Buy Me a Coffee — Support Free Tech Prep"
          >
            <Coffee size={14} className="text-yellow-400 shrink-0" />
            {isOpen && <span>Buy Me a Coffee</span>}
          </button>
        </div>

        {/* ── Footer: theme toggle & quick admin ── */}
        <div className={`border-t ${border} p-2 shrink-0 flex items-center justify-between`}>
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
              isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-white/6 hover:text-white'
            }`}
          >
            <span className="text-sm leading-none shrink-0">{isLight ? '🌙' : '☀️'}</span>
            {isOpen && <span>{isLight ? 'Dark mode' : 'Light mode'}</span>}
          </button>
          {isOpen && isAdmin && (
            <NavLink
              to="/admin"
              title="Creator Admin Portal"
              className="px-2 py-0.5 rounded text-[10px] font-mono text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <Shield size={10} /> Admin
            </NavLink>
          )}
        </div>
      </aside>

      <ProMonetizationModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
      <AuthModal />
    </>
  );
}
