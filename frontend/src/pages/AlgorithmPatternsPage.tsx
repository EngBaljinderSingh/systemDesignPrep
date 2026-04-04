import { useState } from 'react';
import { algorithmPatterns, type AlgorithmPattern } from '../data/algorithmPatterns';

const CATEGORY_COLORS: Record<string, string> = {
  Array: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Tree: 'bg-green-500/20 text-green-300 border-green-500/30',
  Graph: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  String: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  DP: 'bg-red-500/20 text-red-300 border-red-500/30',
  Heap: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

function PatternDetail({ pattern }: { pattern: AlgorithmPattern }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-white">{pattern.name}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[pattern.category]}`}>
          {pattern.category}
        </span>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">⏱ {pattern.timeComplexity}</span>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">💾 {pattern.spaceComplexity}</span>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed">{pattern.description}</p>

      {/* When to use */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">When to Use</h3>
        <ul className="space-y-1">
          {pattern.whenToUse.map((tip, i) => (
            <li key={i} className="text-sm text-gray-400 flex gap-2">
              <span className="text-primary mt-0.5">›</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Code template */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Code Template</h3>
        <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto leading-relaxed border border-gray-700 whitespace-pre-wrap">
          {pattern.template}
        </pre>
      </div>

      {/* Related problems */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Related Problems</h3>
        <div className="flex flex-wrap gap-2">
          {pattern.problems.map((p) => (
            <span
              key={p.id}
              className="text-xs px-2 py-1 rounded bg-white/5 border border-gray-700 flex items-center gap-1.5"
            >
              <span className={DIFFICULTY_COLORS[p.difficulty]}>●</span>
              {p.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AlgorithmPatternsPage() {
  const [selected, setSelected] = useState<AlgorithmPattern>(algorithmPatterns[0]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(algorithmPatterns.map((p) => p.category)))];

  const filtered = algorithmPatterns.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-700 flex flex-col">
        <div className="p-3 space-y-2 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search patterns…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-surface border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <ul className="overflow-y-auto flex-1">
          {filtered.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setSelected(p)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-gray-800 transition-colors ${
                  selected.id === p.id
                    ? 'bg-primary/10 text-white border-l-2 border-l-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="font-medium">{p.name}</div>
                <div className={`text-xs mt-0.5 ${CATEGORY_COLORS[p.category].split(' ')[1]}`}>{p.category}</div>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-sm text-gray-500 text-center">No patterns match</li>
          )}
        </ul>
      </aside>

      {/* Detail panel */}
      <main className="flex-1 overflow-y-auto p-6">
        <PatternDetail pattern={selected} />
      </main>
    </div>
  );
}
