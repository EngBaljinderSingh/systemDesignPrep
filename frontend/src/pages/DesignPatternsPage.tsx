import { useState } from 'react';
import {
  designPatterns,
  CATEGORY_COLORS,
  CATEGORY_ORDER,
  type DesignPattern,
  type PatternCategory,
} from '../data/designPatterns';

const CATEGORY_ICONS: Record<PatternCategory, string> = {
  SOLID:      '🏛️',
  Principles: '⚡',
  Creational: '🏗️',
  Structural: '🔩',
  Behavioral: '🎭',
};

const CATEGORY_DESCRIPTIONS: Record<PatternCategory, string> = {
  SOLID:      'Five design principles that make software more maintainable and flexible.',
  Principles: 'Foundational engineering principles: KISS, YAGNI, and DRY for simple, lean, and maintainable software.',
  Creational: 'Patterns that handle object creation mechanisms for reuse and flexibility.',
  Structural: 'Patterns that simplify the design by identifying a way to realize relationships among entities.',
  Behavioral: 'Patterns concerned with algorithms and the assignment of responsibilities between objects.',
};

function PatternDetail({ pattern }: { pattern: DesignPattern }) {
  return (
    <div className="space-y-5 p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        {pattern.abbrev && (
          <span className="text-3xl font-black text-primary opacity-60">{pattern.abbrev}</span>
        )}
        <div>
          <h2 className="text-xl font-bold text-white leading-tight">{pattern.name}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[pattern.category]}`}>
            {CATEGORY_ICONS[pattern.category]} {pattern.category}
          </span>
        </div>
      </div>

      {/* Intent */}
      <div className="bg-primary/10 border border-primary/25 rounded-lg p-4">
        <p className="text-sm text-gray-200 italic leading-relaxed">"{pattern.intent}"</p>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
          <h3 className="text-sm font-semibold text-red-300 mb-2">🚨 Problem</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{pattern.problem}</p>
        </div>
        <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
          <h3 className="text-sm font-semibold text-green-300 mb-2">✅ Solution</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{pattern.solution}</p>
        </div>
      </div>

      {/* Java Code Example */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span>☕</span> Java Code Example
        </h3>
        <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto leading-relaxed border border-gray-700 whitespace-pre-wrap">
          {pattern.javaExample}
        </pre>
      </div>

      {/* Consequences */}
      <div className="bg-white/5 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-2">⚖️ Consequences</h3>
        <ul className="space-y-1">
          {pattern.consequences.map((c, i) => (
            <li key={i} className="text-sm text-gray-400 flex gap-2">
              <span className="text-primary mt-0.5 shrink-0">›</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Real-world examples + Related patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">🌍 Real-World Examples</h3>
          <div className="flex flex-wrap gap-2">
            {pattern.realWorldExamples.map((e, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 border border-gray-700 text-gray-300">
                {e}
              </span>
            ))}
          </div>
        </div>
        {pattern.relatedPatterns.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">🔗 Related Patterns</h3>
            <div className="flex flex-wrap gap-2">
              {pattern.relatedPatterns.map((id) => {
                const rel = designPatterns.find((p) => p.id === id);
                return rel ? (
                  <span key={id} className="text-xs px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary">
                    {rel.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mnemonic */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
        <span className="text-yellow-300 text-sm font-medium">💡 Remember: </span>
        <span className="text-gray-300 text-sm">{pattern.mnemonic}</span>
      </div>
    </div>
  );
}

export default function DesignPatternsPage() {
  const [selected, setSelected] = useState<DesignPattern>(designPatterns[0]);
  const [categoryFilter, setCategoryFilter] = useState<PatternCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));

  const filtered = designPatterns.filter((p) => {
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const q = search.trim().toLowerCase();
    if (!q) return matchCategory;
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.abbrev && p.abbrev.toLowerCase().includes(q)) ||
      (p.aliases && p.aliases.some((a) => a.toLowerCase().includes(q))) ||
      p.intent.toLowerCase().includes(q) ||
      p.problem.toLowerCase().includes(q) ||
      p.mnemonic.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const grouped = CATEGORY_ORDER.reduce<Record<PatternCategory, DesignPattern[]>>((acc, cat) => {
    const patterns = filtered.filter((p) => p.category === cat);
    if (patterns.length) acc[cat] = patterns;
    return acc;
  }, {} as Record<PatternCategory, DesignPattern[]>);

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
        {/* Header & Search & Category filter */}
        <div className="p-3 border-b border-gray-700 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️</span> Patterns ({filtered.length})
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close panel"
            >
              <span className="text-xs font-mono">✕</span>
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search patterns (KISS, YAGNI...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-surface border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 placeholder-gray-500"
            />
          </div>

          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold px-0.5 mb-1.5">Category</p>
            <div className="flex flex-wrap gap-1">
              {(['All', ...CATEGORY_ORDER] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-primary text-white font-medium shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {cat !== 'All' && CATEGORY_ICONS[cat as PatternCategory]}{' '}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern list */}
        <div className="flex-1 overflow-y-auto py-2">
          {Object.keys(grouped).length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">
              No patterns found for "{search}"
            </div>
          ) : (
            Object.entries(grouped).map(([cat, patterns]) => (
              <div key={cat} className="mb-2">
                <div className="px-3 py-1.5 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {CATEGORY_ICONS[cat as PatternCategory]} {cat}
                  </span>
                </div>
                {patterns.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelected(p);
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 cursor-pointer ${
                      selected.id === p.id
                        ? 'bg-primary/15 text-white border-r-2 border-primary font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p.abbrev && (
                      <span className="w-5 text-xs font-bold text-primary shrink-0">{p.abbrev}</span>
                    )}
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Detail */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-surface-dark">
        {/* Top Control Bar for toggling aside */}
        <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between gap-3 bg-surface/60 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {!isSidebarOpen ? (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 transition-colors cursor-pointer shadow-sm"
                title="Show patterns list"
              >
                <span>📋</span>
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
          <div className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
            <span className="text-gray-500 hidden sm:inline">Active:</span>
            <span className="font-semibold text-white truncate">{selected.name}</span>
          </div>
        </div>

        {/* Page header when no category selected or All */}
        {categoryFilter === 'All' && selected.category && (
          <div className="px-5 pt-4 pb-2 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CATEGORY_ICONS[selected.category]}</span>
              <div>
                <h1 className="text-lg font-bold text-white">Design Patterns</h1>
                <p className="text-xs text-gray-500">
                  {CATEGORY_DESCRIPTIONS[selected.category]}
                </p>
              </div>
            </div>
          </div>
        )}
        <PatternDetail pattern={selected} />
      </main>
    </div>
  );
}
