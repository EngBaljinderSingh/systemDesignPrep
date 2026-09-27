import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const links = [
  { to: '/',                   label: 'Home',              icon: '🏠', end: true  },
  { to: '/learning',           label: 'Learning Hub',      icon: '🎓'             },
  { to: '/design-patterns',    label: 'Design Patterns',   icon: '🏛️'             },
  { to: '/algorithms',         label: 'Algo Patterns',     icon: '📊'             },
  { to: '/system-design',      label: 'System Design',     icon: '🏗️'             },
  { to: '/problems',           label: 'Problems',          icon: '💡'             },
  { to: '/hackerrank',         label: 'HackerRank',        icon: '🏆'             },
  { to: '/interview-questions',label: 'Interview Q&A',     icon: '💬'             },
  { to: '/mock-interview',     label: 'Mock Interview',    icon: '🎤'             },
  { to: '/code',               label: 'Code Editor',       icon: '💻'             },
  { to: '/canvas',             label: 'Interview Canvas',  icon: '🎨'             },
  { to: '/resume',             label: 'Resume Builder',    icon: '📄'             },
  { to: '/campaign',           label: 'Campaign',          icon: '⚔️'             },
];

interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Navbar({ isOpen, onToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const border  = isLight ? 'border-gray-200'  : 'border-gray-700/60';
  const bg      = isLight ? 'bg-white'          : 'bg-gray-900';
  const textMuted = isLight ? 'text-gray-500'   : 'text-gray-400';

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        transition-all duration-200 ease-in-out
        border-r ${border} ${bg}
        ${isOpen ? 'w-56' : 'w-14'}
      `}
    >
      {/* ── Header ── */}
      <div className={`flex items-center h-13 px-3 border-b ${border} shrink-0`} style={{ height: '52px' }}>
        <button
          onClick={onToggle}
          title={isOpen ? 'Collapse menu' : 'Expand menu'}
          className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/8 text-gray-400'}`}
        >
          <Menu size={18} />
        </button>
        {isOpen && (
          <span className={`ml-3 text-base font-bold tracking-tight whitespace-nowrap ${isLight ? 'text-gray-900' : 'text-white'}`}>
            SDP<span className="text-primary">.</span>
          </span>
        )}
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5 px-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            title={!isOpen ? link.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : isLight
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    : 'text-gray-400 hover:bg-white/6 hover:text-white'
              }`
            }
          >
            <span className="text-base leading-none shrink-0 w-5 text-center">{link.icon}</span>
            {isOpen && <span className="truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer: theme toggle ── */}
      <div className={`border-t ${border} p-2 shrink-0`}>
        <button
          onClick={toggleTheme}
          title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          className={`w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
            isLight
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-400 hover:bg-white/6 hover:text-white'
          }`}
        >
          <span className="text-base leading-none shrink-0 w-5 text-center">
            {isLight ? '🌙' : '☀️'}
          </span>
          {isOpen && <span className="truncate">{isLight ? 'Dark mode' : 'Light mode'}</span>}
        </button>
        {isOpen && (
          <p className={`mt-2 px-2 text-xs ${textMuted}`}>
            SDP <span className="text-primary font-semibold">v0.1</span>
          </p>
        )}
      </div>
    </aside>
  );
}
