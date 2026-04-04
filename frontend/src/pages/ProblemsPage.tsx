import { useState } from 'react';
import { problems } from '../data/problems';
import { algorithmPatterns } from '../data/algorithmPatterns';

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

const DIFFICULTY_BG = {
  Easy: 'bg-green-500/10 text-green-300 border-green-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  Hard: 'bg-red-500/10 text-red-300 border-red-500/30',
};

export default function ProblemsPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [patternFilter, setPatternFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const patternOptions = ['All', ...algorithmPatterns.map((p) => p.id)];
  const patternName = (id: string) => algorithmPatterns.find((p) => p.id === id)?.name ?? id;

  const filtered = problems.filter((p) => {
    const matchDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchPat = patternFilter === 'All' || p.patterns.includes(patternFilter);
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchPat && matchSearch;
  });

  const counts = {
    Easy: problems.filter((p) => p.difficulty === 'Easy').length,
    Medium: problems.filter((p) => p.difficulty === 'Medium').length,
    Hard: problems.filter((p) => p.difficulty === 'Hard').length,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Stats row */}
      <div className="flex gap-4 mb-6">
        {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
          <div key={d} className={`px-4 py-2 rounded-lg border ${DIFFICULTY_BG[d]} text-sm font-medium`}>
            {d}: {counts[d]}
          </div>
        ))}
        <div className="px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-400">
          Total: {problems.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search problems…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm bg-surface border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Difficulty filter */}
        <div className="flex gap-1">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                difficultyFilter === d
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Pattern filter */}
        <select
          value={patternFilter}
          onChange={(e) => setPatternFilter(e.target.value)}
          className="text-xs px-3 py-1.5 bg-surface border border-gray-600 rounded text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {patternOptions.map((id) => (
            <option key={id} value={id}>
              {id === 'All' ? 'All Patterns' : patternName(id)}
            </option>
          ))}
        </select>
      </div>

      {/* Problem list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No problems match your filters.</div>
        )}
        {filtered.map((problem, idx) => (
          <div
            key={problem.id}
            className="border border-gray-700 rounded-lg overflow-hidden bg-surface-light"
          >
            {/* Row header */}
            <button
              onClick={() => setExpanded(expanded === problem.id ? null : problem.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-xs text-gray-600 w-6">{idx + 1}</span>
              <span className={`text-xs w-2 h-2 rounded-full mt-0.5 ${DIFFICULTY_COLORS[problem.difficulty]} bg-current flex-shrink-0`} />
              <span className="flex-1 text-sm font-medium text-white">{problem.title}</span>
              {problem.leetcodeNumber && (
                <a
                  href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-gray-500 hover:text-primary flex-shrink-0"
                >
                  LC #{problem.leetcodeNumber} ↗
                </a>
              )}
              <span className={`text-xs ${DIFFICULTY_COLORS[problem.difficulty]} flex-shrink-0`}>
                {problem.difficulty}
              </span>
              <div className="flex gap-1 flex-shrink-0">
                {problem.patterns.slice(0, 2).map((pid) => (
                  <span key={pid} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-gray-700">
                    {patternName(pid)}
                  </span>
                ))}
                {problem.patterns.length > 2 && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-600">
                    +{problem.patterns.length - 2}
                  </span>
                )}
              </div>
              <span className="text-gray-600 text-xs flex-shrink-0">{expanded === problem.id ? '▲' : '▼'}</span>
            </button>

            {/* Expanded detail */}
            {expanded === problem.id && (
              <div className="px-4 pb-4 border-t border-gray-700/50 space-y-3 pt-3">
                <p className="text-sm text-gray-300">{problem.description}</p>
                <div>
                  <span className="text-xs font-semibold text-white">Hints:</span>
                  <ol className="mt-1 space-y-0.5">
                    {problem.hints.map((h, i) => (
                      <li key={i} className="text-xs text-gray-400 ml-4 list-decimal">{h}</li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-wrap gap-1">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
