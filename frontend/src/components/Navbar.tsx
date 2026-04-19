import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/learning', label: '🎓 Learning Hub' },
  { to: '/design-patterns', label: '🏛️ Design Patterns' },
  { to: '/algorithms', label: 'Algo Patterns' },
  { to: '/system-design', label: 'System Design' },
  { to: '/problems', label: 'Problems' },
  { to: '/hackerrank', label: 'HackerRank' },
  { to: '/interview-questions', label: 'Interview Q&A' },
  { to: '/mock-interview', label: 'Mock Interview' },
  { to: '/code', label: 'Code Editor' },
  { to: '/canvas', label: 'Interview Canvas' },
  { to: '/resume', label: 'Resume Builder' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <nav className={`flex items-center gap-1 px-4 py-0 bg-surface-light border-b h-12 overflow-x-auto scrollbar-none ${isLight ? 'border-gray-200' : 'border-gray-700'}`}>
      <span className={`text-base font-bold tracking-tight mr-4 shrink-0 ${isLight ? 'text-gray-900' : 'text-white'}`}>
        SDP<span className="text-primary">.</span>
      </span>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-primary text-white'
                : isLight
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        className={`ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
          isLight
            ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm'
            : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
        }`}
      >
        {isLight ? <span>🌙</span> : <span>☀️</span>}
      </button>
    </nav>
  );
}
