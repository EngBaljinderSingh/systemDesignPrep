import { useState } from 'react';
import { hackerrankProblems, type HRProblem } from '../data/hackerrankProblems';

const DIFFICULTY_COLOR = {
  Easy:   'bg-green-500/10 text-green-300 border-green-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  Hard:   'bg-red-500/10 text-red-300 border-red-500/30',
};

const DIFFICULTY_DOT = {
  Easy:   'text-green-400',
  Medium: 'text-yellow-400',
  Hard:   'text-red-400',
};

function ProblemDetail({ problem }: { problem: HRProblem }) {
  const [expandedPart, setExpandedPart] = useState<number | null>(1);
  const [tab, setTab] = useState<'problem' | 'solution'>('problem');

  return (
    <div className="space-y-5">
      {/* Meta */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className={`text-xs px-2.5 py-1 rounded border font-medium ${DIFFICULTY_COLOR[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        {problem.timeLimitMinutes && (
          <span className="text-xs px-2.5 py-1 rounded border bg-orange-500/15 text-orange-300 border-orange-500/30">
            ⏱ {problem.timeLimitMinutes} min
          </span>
        )}
        {problem.usedInInterview && (
          <span className="text-xs px-2.5 py-1 rounded border bg-purple-500/15 text-purple-300 border-purple-500/30">
            Used in Interview
          </span>
        )}
        {problem.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-gray-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-700 pb-0">
        {(['problem', 'solution'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-t transition-colors capitalize ${
              tab === t
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'solution' ? (
        problem.solution ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/30">
                {problem.solution.language}
              </span>
            </div>
            <div className="rounded border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-200/80">
              <span className="font-semibold text-yellow-400">Approach: </span>
              {problem.solution.notes}
            </div>
            <pre className="rounded bg-black/50 border border-gray-700 p-3 text-xs text-gray-200 font-mono overflow-x-auto whitespace-pre leading-relaxed max-h-[500px] overflow-y-auto">
              {problem.solution.code}
            </pre>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm">No solution added yet.</div>
        )
      ) : (
        <>
      {/* Summary */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Summary</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{problem.summary}</p>
      </div>

      {/* Input/Output */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Input / Output Format</h3>
        <p className="text-sm text-gray-300 mb-2">{problem.inputOutputFormat}</p>
        <div className="rounded bg-black/30 border border-gray-700 px-3 py-2 space-y-1">
          {problem.outputRules.map((rule, i) => (
            <div key={i} className="text-xs text-gray-300 flex gap-2">
              <span className="text-gray-600 flex-shrink-0">•</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Parts */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Problem Parts</h3>
        <div className="space-y-2">
          {problem.parts.map((part) => (
            <div key={part.number} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedPart(expandedPart === part.number ? null : part.number)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-xs text-primary font-bold flex-shrink-0">Part {part.number}</span>
                <span className="flex-1 text-sm font-medium text-white">{part.title}</span>
                <span className="text-gray-600 text-xs">{expandedPart === part.number ? '▲' : '▼'}</span>
              </button>

              {expandedPart === part.number && (
                <div className="px-4 pb-4 border-t border-gray-700/50 pt-3 space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-300">{part.description}</p>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {part.requirements.map((req, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-300">
                          <span className="text-primary flex-shrink-0 mt-0.5">›</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Commands */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 mb-2">Commands to Implement</h4>
                    <div className="space-y-3">
                      {part.commands.map((cmd) => (
                        <div key={cmd.name} className="rounded bg-black/30 border border-gray-700 p-3 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {cmd.name}
                            </code>
                            <code className="text-xs text-gray-300 font-mono">{cmd.syntax}</code>
                          </div>

                          <p className="text-xs text-gray-400">{cmd.description}</p>

                          <div className="flex gap-1 items-start">
                            <span className="text-xs text-gray-500 flex-shrink-0">Returns:</span>
                            <code className="text-xs text-green-300">{cmd.returns}</code>
                          </div>

                          {cmd.errorCases.length > 0 && (
                            <div>
                              <span className="text-xs text-gray-500 block mb-1">Error cases:</span>
                              <ul className="space-y-0.5">
                                {cmd.errorCases.map((err, i) => (
                                  <li key={i} className="text-xs text-red-300/80 flex gap-2">
                                    <span className="flex-shrink-0">—</span>
                                    <span>{err}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pseudocode */}
                  {part.pseudocode && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-2">Formula / Pseudocode</h4>
                      <pre className="rounded bg-black/40 border border-gray-700 px-3 py-2.5 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {part.pseudocode}
                      </pre>
                    </div>
                  )}

                  {/* Example */}
                  {part.example && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-2">Example</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Input</span>
                          <pre className="rounded bg-black/40 border border-gray-700 px-3 py-2 text-xs text-gray-200 font-mono whitespace-pre leading-relaxed">
                            {part.example.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Output</span>
                          <pre className="rounded bg-black/40 border border-green-900/30 px-3 py-2 text-xs text-green-300 font-mono whitespace-pre leading-relaxed">
                            {part.example.output}
                          </pre>
                        </div>
                      </div>
                      {part.example.explanation && (
                        <p className="text-xs text-yellow-200/70 mt-2 border border-yellow-500/20 bg-yellow-500/5 rounded px-3 py-2">
                          <span className="font-semibold text-yellow-400">Explanation: </span>
                          {part.example.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {problem.notes && (
        <div className="rounded border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
          <span className="text-xs text-yellow-400 font-semibold">Note: </span>
          <span className="text-xs text-yellow-200/70">{problem.notes}</span>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default function HackerRankPage() {
  const [selected, setSelected] = useState<HRProblem | null>(null);
  const [diffFilter, setDiffFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [search, setSearch] = useState('');

  const filtered = hackerrankProblems.filter((p) => {
    const matchDiff = diffFilter === 'All' || p.difficulty === diffFilter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchDiff && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">HackerRank Problems</h1>
        <p className="text-sm text-gray-400">
          Real coding challenges from interviews — with full problem breakdowns.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="px-3 py-1.5 rounded border border-gray-700 text-xs text-gray-400">
          Total: {hackerrankProblems.length}
        </div>
        <div className="px-3 py-1.5 rounded border bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs">
          Used in Interview: {hackerrankProblems.filter((p) => p.usedInInterview).length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search problems…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm bg-surface border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary flex-1 min-w-48"
        />
        <div className="flex gap-1">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                diffFilter === d
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Two-pane layout: list + detail */}
      <div className="flex gap-4 min-h-[500px]">
        {/* List */}
        <div className="w-72 flex-shrink-0 space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">No problems found.</div>
          )}
          {filtered.map((problem) => (
            <button
              key={problem.id}
              onClick={() => setSelected(selected?.id === problem.id ? null : problem)}
              className={`w-full text-left border rounded-lg px-4 py-3 transition-colors ${
                selected?.id === problem.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-700 bg-surface-light hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs w-2 h-2 rounded-full bg-current flex-shrink-0 ${DIFFICULTY_DOT[problem.difficulty]}`} />
                <span className="text-sm font-medium text-white truncate">{problem.title}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded border ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                {problem.usedInInterview && (
                  <span className="text-xs px-1.5 py-0.5 rounded border bg-purple-500/15 text-purple-300 border-purple-500/30">
                    Interview
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {problem.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs text-gray-500">{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="flex-1 border border-gray-700 rounded-lg bg-surface-light overflow-auto">
          {selected ? (
            <div className="p-5">
              <h2 className="text-lg font-bold text-white mb-4">{selected.title}</h2>
              <ProblemDetail problem={selected} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
              Select a problem to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
