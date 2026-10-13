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

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));

  const categories = ['All', ...Array.from(new Set(systemDesignPatterns.map((p) => p.category)))];

  const filtered = systemDesignPatterns.filter(
    (p) => categoryFilter === 'All' || p.category === categoryFilter,
  );

  return (
    <div className="flex h-full min-h-[calc(100vh-3rem)] relative overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 bg-surface flex flex-col w-72 max-w-[85vw] border-r border-gray-700 transition-transform duration-200 ease-in-out shadow-2xl md:shadow-none
          md:static md:z-auto
          ${isSidebarOpen
            ? 'translate-x-0 md:w-64 md:flex'
            : '-translate-x-full md:w-0 md:hidden md:border-none'
          }
        `}
      >
        <div className="p-3 space-y-2 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏗️</span> Architecture ({filtered.length})
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close panel"
            >
              <span className="text-xs font-mono">✕</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer ${
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
                onClick={() => {
                  setSelected(p);
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full text-left px-4 py-3 text-sm border-b border-gray-800 transition-colors cursor-pointer ${
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
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 bg-surface-dark">
        {/* Top Control Bar for toggling sidebar */}
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            {!isSidebarOpen ? (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 transition-colors shadow-sm cursor-pointer"
                title="Show patterns list"
              >
                <span>🏗️</span>
                <span>Browse Patterns ({filtered.length})</span>
                <span className="text-[10px]">▶</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-gray-700 transition-colors cursor-pointer"
                title="Collapse sidebar panel"
              >
                <span>◀</span>
                <span>Collapse Panel</span>
              </button>
            )}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-surface border border-gray-700 text-gray-200 hover:text-white"
            >
              <span>📋</span> Change Pattern
            </button>
          </div>
          <div className="text-xs text-gray-400 truncate">
            <span className="text-gray-500 hidden sm:inline">Pattern: </span>
            <span className="font-semibold text-white">{selected.name}</span>
          </div>
        </div>

        <PatternDetail pattern={selected} />
      </main>
    </div>
  );
}
