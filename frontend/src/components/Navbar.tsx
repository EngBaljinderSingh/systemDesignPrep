import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Coffee } from 'lucide-react';
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

// Prefetch triggers on tab hover so chunks load into memory before the click finishes
const pagePreloaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/HomePage'),
  '/profile': () => import('../pages/ProfilePage'),
  '/hld-case-studies': () => import('../pages/HLDCaseStudiesPage'),
  '/system-design': () => import('../pages/SystemDesignPatternsPage'),
  '/canvas': () => import('../pages/CanvasPage'),
  '/algorithms': () => import('../pages/AlgorithmPatternsPage'),
  '/problems': () => import('../pages/ProblemsPage'),
  '/hackerrank': () => import('../pages/HackerRankPage'),
  '/code': () => import('../pages/CodeEditorPage'),
  '/learning': () => import('../pages/LearningHubPage'),
  '/design-patterns': () => import('../pages/DesignPatternsPage'),
  '/interview-questions': () => import('../pages/InterviewQuestionsPage'),
  '/mock-interview': () => import('../pages/MockInterviewPage'),
  '/resume': () => import('../pages/ResumePage'),
};

interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Navbar({ isOpen, onToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);
  const isLight = theme === 'light';

  const border = isLight ? 'border-gray-200' : 'border-gray-800';

  const handlePreload = (path: string) => {
    try {
      pagePreloaders[path]?.();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-200 ease-in-out select-none ${
          isOpen ? 'w-56' : 'w-14'
        } ${border} border-r ${isLight ? 'bg-white' : 'bg-surface'}`}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between p-3 border-b ${border} h-14`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={onToggle}
              title={isOpen ? 'Collapse menu' : 'Expand menu'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/8 text-gray-400'
              }`}
            >
              <Menu size={18} />
            </button>
            {isOpen && (
              <span className={`text-base font-black tracking-tight whitespace-nowrap ${isLight ? 'text-gray-900' : 'text-white'}`}>
                SDP<span className="text-primary-400">.prep</span>
              </span>
            )}
          </div>
        </div>

        {/* Free Access Badge */}
        {isOpen && (
          <div className={`px-3 py-2 border-b ${border} bg-surface-light/30`}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                100% Free Access
              </span>
            </div>
          </div>
        )}

        {/* Nav Links with Instant Hover Prefetch */}
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
                  onMouseEnter={() => handlePreload(link.to)}
                  title={!isOpen ? link.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-sm'
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
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase bg-primary-500/20 text-primary-300">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Buy Me a Coffee Supporter Button */}
        <div className={`p-2 border-t ${border}`}>
          <button
            onClick={() => setIsCoffeeOpen(true)}
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

        {/* Footer: theme toggle */}
        <div className={`border-t ${border} p-2 shrink-0 flex items-center justify-between`}>
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-white/6 hover:text-white'
            }`}
          >
            <span className="text-sm leading-none shrink-0">{isLight ? '🌙' : '☀️'}</span>
            {isOpen && <span>{isLight ? 'Dark mode' : 'Light mode'}</span>}
          </button>
        </div>
      </aside>

      <ProMonetizationModal isOpen={isCoffeeOpen} onClose={() => setIsCoffeeOpen(false)} />
    </>
  );
}
