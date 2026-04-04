import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/algorithms',
    title: 'Algorithm Patterns',
    description: 'Sliding window, two pointers, binary search, BFS/DFS, dynamic programming, backtracking, and more.',
    count: '12 patterns',
    color: 'from-blue-600/20 to-blue-600/5',
    border: 'border-blue-600/30',
    icon: '⚡',
  },
  {
    to: '/system-design',
    title: 'System Design Patterns',
    description: 'Caching, sharding, rate limiting, circuit breaker, event-driven, CQRS, CDN, and more.',
    count: '11 patterns',
    color: 'from-purple-600/20 to-purple-600/5',
    border: 'border-purple-600/30',
    icon: '🏗️',
  },
  {
    to: '/problems',
    title: 'Practice Problems',
    description: 'Curated LeetCode-style problems tagged by pattern. Filter by difficulty or pattern to focus your practice.',
    count: '30+ problems',
    color: 'from-green-600/20 to-green-600/5',
    border: 'border-green-600/30',
    icon: '🧩',
  },
  {
    to: '/canvas',
    title: 'AI Interview Canvas',
    description: 'Draw system architecture diagrams and get real-time AI feedback. Practice live system design interviews.',
    count: 'AI-powered',
    color: 'from-orange-600/20 to-orange-600/5',
    border: 'border-orange-600/30',
    icon: '🤖',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">System Design Prep</h1>
        <p className="text-gray-400 text-base">
          Master algorithm patterns, system design concepts, and practice interview problems — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`block rounded-xl border ${card.border} bg-gradient-to-br ${card.color} p-6 hover:scale-[1.01] transition-transform`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{card.count}</span>
            </div>
            <h2 className="text-white font-semibold text-lg mb-1">{card.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-4 rounded-lg bg-white/5 border border-gray-700 text-sm text-gray-400">
        <span className="text-white font-medium">Tip:</span> Start with{' '}
        <Link to="/algorithms" className="text-primary underline underline-offset-2">Algorithm Patterns</Link> to
        build your pattern recognition, then move to{' '}
        <Link to="/problems" className="text-primary underline underline-offset-2">Problems</Link> to practice.
      </div>
    </div>
  );
}
