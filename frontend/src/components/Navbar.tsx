import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import ProMonetizationModal from './ProMonetizationModal';

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

const navGroups: NavGroup[] = [
  {
    sectionTitle: 'Core',
    items: [
      { to: '/', label: 'Home', icon: '🏠', end: true },
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
  const [isProOpen, setIsProOpen] = useState(false);
  const isLight = theme === 'light';

  const border = isLight ? 'border-gray-200' : 'border-gray-800';
  const bg = isLight ? 'bg-white' : 'bg-gray-950';
  const textMuted = isLight ? 'text-gray-500' : 'text-gray-400';

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
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-primary/20 text-primary uppercase">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Go Pro / Monetization Trigger Button ── */}
        <div className={`p-2 border-t ${border}`}>
          <button
            onClick={() => setIsProOpen(true)}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-2.5 text-xs font-bold transition-all shadow-sm ${
              isOpen
                ? 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white'
                : 'bg-primary text-white p-2'
            }`}
            title="Unlock System Design Prep Pro"
          >
            <Sparkles size={14} className="text-yellow-300 shrink-0" />
            {isOpen && <span>Go Pro ($29)</span>}
          </button>
        </div>

        {/* ── Footer: theme toggle ── */}
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
          {isOpen && (
            <span className={`px-2 text-[10px] font-mono ${textMuted}`}>
              v1.0
            </span>
          )}
        </div>
      </aside>

      <ProMonetizationModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
    </>
  );
}
