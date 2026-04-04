import { useState } from 'react';
import { systemDesignPatterns, type SystemDesignPattern } from '../data/systemDesignPatterns';

const CATEGORY_COLORS: Record<string, string> = {
  Scalability: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Reliability: 'bg-red-500/20 text-red-300 border-red-500/30',
  Data: 'bg-green-500/20 text-green-300 border-green-500/30',
  Messaging: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Architecture: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

function PatternDetail({ pattern }: { pattern: SystemDesignPattern }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-white">{pattern.name}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[pattern.category]}`}>
          {pattern.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed">{pattern.description}</p>

      {/* Use cases + Key components side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">Use Cases</h3>
          <ul className="space-y-1">
            {pattern.useCases.map((u, i) => (
              <li key={i} className="text-sm text-gray-400 flex gap-2">
                <span className="text-primary mt-0.5">›</span>{u}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">Key Components</h3>
          <ul className="space-y-1">
            {pattern.keyComponents.map((c, i) => (
              <li key={i} className="text-sm text-gray-400 flex gap-2">
                <span className="text-yellow-400 mt-0.5">⚙</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tradeoffs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
          <h3 className="text-sm font-semibold text-green-300 mb-2">✓ Pros</h3>
          <ul className="space-y-1">
            {pattern.pros.map((p, i) => (
              <li key={i} className="text-sm text-gray-400">{p}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
          <h3 className="text-sm font-semibold text-red-300 mb-2">✗ Cons</h3>
          <ul className="space-y-1">
            {pattern.cons.map((c, i) => (
              <li key={i} className="text-sm text-gray-400">{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Real world examples */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Real-World Examples</h3>
        <div className="flex flex-wrap gap-2">
          {pattern.realWorldExamples.map((e, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 border border-gray-700 text-gray-300">
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Related patterns */}
      {pattern.relatedPatterns.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Related Patterns</h3>
          <div className="flex flex-wrap gap-2">
            {pattern.relatedPatterns.map((id) => {
              const related = systemDesignPatterns.find((p) => p.id === id);
              return related ? (
                <span key={id} className="text-xs px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary">
                  {related.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SystemDesignPatternsPage() {
  const [selected, setSelected] = useState<SystemDesignPattern>(systemDesignPatterns[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(systemDesignPatterns.map((p) => p.category)))];

  const filtered = systemDesignPatterns.filter(
    (p) => categoryFilter === 'All' || p.category === categoryFilter,
  );

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-700 flex flex-col">
        <div className="p-3 space-y-2 border-b border-gray-700">
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
                <div className={`text-xs mt-0.5 ${CATEGORY_COLORS[p.category].split(' ')[1]}`}>
                  {p.category}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Detail panel */}
      <main className="flex-1 overflow-y-auto p-6">
        <PatternDetail pattern={selected} />
      </main>
    </div>
  );
}
