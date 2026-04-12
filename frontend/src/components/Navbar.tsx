import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/algorithms', label: 'Algo Patterns' },
  { to: '/system-design', label: 'System Design' },
  { to: '/problems', label: 'Problems' },
  { to: '/hackerrank', label: 'HackerRank' },
  { to: '/interview-questions', label: 'Interview Q&A' },
  { to: '/mock-interview', label: 'Mock Interview' },
  { to: '/code', label: 'Code Editor' },
  { to: '/canvas', label: 'Interview Canvas' },
];

export default function Navbar() {
  return (
    <nav className="flex items-center gap-1 px-6 py-0 bg-surface-light border-b border-gray-700 h-12">
      <span className="text-base font-bold tracking-tight text-white mr-6">
        SDP<span className="text-primary">.</span>
      </span>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
