import { useState } from 'react';
import { hackerrankProblems, type HRProblem } from '../data/hackerrankProblems';
import StripeSimulator from '../components/StripeSimulator';

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
  const [tab, setTab] = useState<'problem' | 'solution' | 'simulator'>('problem');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!problem.solution?.code) return;
    navigator.clipboard.writeText(problem.solution.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Company Spotlight */}
      {problem.company === 'Stripe' && (
        <div className="rounded-xl border border-[#635BFF]/35 bg-gradient-to-r from-[#635BFF]/20 via-[#0A2540]/50 to-purple-950/20 p-4 shadow-lg shadow-[#635BFF]/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#635BFF] flex items-center justify-center font-black text-white text-lg shrink-0 shadow-md shadow-[#635BFF]/40">
              S
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Asked at Stripe</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#635BFF]/25 text-[#c2b5ff] border border-[#635BFF]/40 font-mono font-medium">
                  Payment Infrastructure & Routing Screen
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Stripe handles mission-critical payment traffic across distributed datacenters worldwide. This problem tests real-time command processing, Haversine geospatial calculations, health state tracking, and deterministic failover under peak capacity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Meta Badges */}
      <div className="flex flex-wrap gap-2 items-center">
        {problem.company && (
          <span className="text-xs px-2.5 py-1 rounded border font-semibold bg-[#635BFF]/15 text-[#a594fd] border-[#635BFF]/40 flex items-center gap-1.5">
            <span>💳</span> {problem.company}
          </span>
        )}
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
      <div className="flex gap-2 border-b border-gray-700 pb-0">
        <button
          onClick={() => setTab('problem')}
          className={`px-4 py-2 text-xs font-semibold rounded-t transition-colors ${
            tab === 'problem'
              ? 'bg-primary text-white border-b-2 border-primary'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          📋 Problem Breakdown
        </button>
        <button
          onClick={() => setTab('solution')}
          className={`px-4 py-2 text-xs font-semibold rounded-t transition-colors ${
            tab === 'solution'
              ? 'bg-primary text-white border-b-2 border-primary'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          ☕ Java Solution
        </button>
        <button
          onClick={() => setTab('simulator')}
          className={`px-4 py-2 text-xs font-semibold rounded-t transition-colors flex items-center gap-1.5 ${
            tab === 'simulator'
              ? 'bg-[#635BFF] text-white border-b-2 border-[#635BFF]'
              : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
          }`}
        >
          <span>⚡</span> Live Simulator
        </button>
      </div>

      {/* Tab: Simulator */}
      {tab === 'simulator' && <StripeSimulator />}

      {/* Tab: Solution */}
      {tab === 'solution' && (
        problem.solution ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/30 font-semibold">
                  {problem.solution.language}
                </span>
                <span className="text-xs text-gray-400 font-mono">Clean Modular Architecture</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1.5 font-medium"
              >
                {copied ? '✓ Copied to Clipboard!' : '📋 Copy Solution'}
              </button>
            </div>

            <div className="rounded-lg border border-yellow-500/25 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-200/90 leading-relaxed">
              <span className="font-bold text-yellow-400">Core Strategy & Architecture: </span>
              {problem.solution.notes}
            </div>

            <div className="relative">
              <pre className="rounded-lg bg-black/70 border border-gray-700 p-4 text-xs text-gray-200 font-mono overflow-x-auto whitespace-pre leading-relaxed max-h-[550px] overflow-y-auto">
                {problem.solution.code}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm">No solution added yet.</div>
        )
      )}

      {/* Tab: Problem */}
      {tab === 'problem' && (
        <>
          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Summary</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{problem.summary}</p>
          </div>

          {/* Stripe Evaluation Criteria Rubric */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>🎯</span> What Stripe Interviewers Look For
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="flex gap-2">
                <span className="text-indigo-400 font-bold">1.</span>
                <span><strong>Clean Dispatcher:</strong> Clean command line parser with switch/case or command pattern instead of monolithic spaghetti code.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400 font-bold">2.</span>
                <span><strong>Boundary Validation:</strong> Strict checks for latitude <code className="text-primary font-mono">[-90, 90]</code>, longitude <code className="text-primary font-mono">[-180, 180]</code>, and capacity <code className="text-primary font-mono">&gt; 0</code>.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400 font-bold">3.</span>
                <span><strong>Deterministic Tie-Breaking:</strong> Alphabetical sorting by name when two healthy datacenters share the exact same Haversine distance.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400 font-bold">4.</span>
                <span><strong>Persistent State:</strong> Datacenter loads must accumulate across consecutive <code className="text-primary font-mono">ROUTE</code> calls until capacity is exhausted.</span>
              </div>
            </div>
          </div>

          {/* Input/Output */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Input / Output Format</h3>
            <p className="text-sm text-gray-300 mb-2">{problem.inputOutputFormat}</p>
            <div className="rounded-lg bg-black/40 border border-gray-700 px-3 py-2.5 space-y-1">
              {problem.outputRules.map((rule, i) => (
                <div key={i} className="text-xs text-gray-300 flex gap-2">
                  <span className="text-gray-500 flex-shrink-0">•</span>
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
                <div key={part.number} className="border border-gray-700 rounded-lg overflow-hidden bg-surface-dark/60">
                  <button
                    onClick={() => setExpandedPart(expandedPart === part.number ? null : part.number)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs text-primary font-bold flex-shrink-0 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      Part {part.number}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-white">{part.title}</span>
                    <span className="text-gray-500 text-xs">{expandedPart === part.number ? '▲' : '▼'}</span>
                  </button>

                  {expandedPart === part.number && (
                    <div className="px-4 pb-4 border-t border-gray-700/50 pt-3 space-y-4">
                      {/* Description */}
                      <p className="text-sm text-gray-300 leading-relaxed">{part.description}</p>

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
                            <div key={cmd.name} className="rounded bg-black/40 border border-gray-700 p-3 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                  {cmd.name}
                                </code>
                                <code className="text-xs text-gray-300 font-mono">{cmd.syntax}</code>
                              </div>

                              <p className="text-xs text-gray-400">{cmd.description}</p>

                              <div className="flex gap-1 items-start">
                                <span className="text-xs text-gray-500 flex-shrink-0">Returns:</span>
                                <code className="text-xs text-green-300 font-mono">{cmd.returns}</code>
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
                          <pre className="rounded bg-black/50 border border-gray-700 px-3 py-2.5 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {part.pseudocode}
                          </pre>
                        </div>
                      )}

                      {/* Example */}
                      {part.example && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 mb-2">Example</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-gray-500 block mb-1">Input</span>
                              <pre className="rounded bg-black/50 border border-gray-700 px-3 py-2 text-xs text-gray-200 font-mono whitespace-pre leading-relaxed">
                                {part.example.input}
                              </pre>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 block mb-1">Output</span>
                              <pre className="rounded bg-black/50 border border-green-900/40 px-3 py-2 text-xs text-green-300 font-mono whitespace-pre leading-relaxed">
                                {part.example.output}
                              </pre>
                            </div>
                          </div>
                          {part.example.explanation && (
                            <p className="text-xs text-yellow-200/80 mt-2 border border-yellow-500/20 bg-yellow-500/5 rounded px-3 py-2">
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
            <div className="rounded-lg border border-yellow-500/25 bg-yellow-500/5 px-4 py-3">
              <span className="text-xs text-yellow-400 font-semibold">Interview Note: </span>
              <span className="text-xs text-yellow-200/80 leading-relaxed">{problem.notes}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function HackerRankPage() {
  const [selected, setSelected] = useState<HRProblem | null>(hackerrankProblems[0] ?? null);
  const [filter, setFilter] = useState<'All' | 'Stripe' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [search, setSearch] = useState('');

  const filtered = hackerrankProblems.filter((p) => {
    let matchFilter = true;
    if (filter === 'Stripe') matchFilter = p.company === 'Stripe';
    else if (filter !== 'All') matchFilter = p.difficulty === filter;

    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.company && p.company.toLowerCase().includes(search.toLowerCase())) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">HackerRank & Company Interview Problems</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#635BFF]/20 text-[#a594fd] border border-[#635BFF]/40 font-mono">
            Featured: Stripe Screen
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Authentic multi-part coding challenges asked in top-tier company interviews — complete with working simulators and production solutions.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-wrap">
        <div className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-400 bg-white/5">
          Total Problems: <span className="font-bold text-white">{hackerrankProblems.length}</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg border bg-[#635BFF]/15 text-[#a594fd] border-[#635BFF]/30 text-xs font-medium flex items-center gap-1.5">
          <span>💳</span> Stripe Screen: 1
        </div>
        <div className="px-3 py-1.5 rounded-lg border bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs">
          Interview Tested: {hackerrankProblems.filter((p) => p.usedInInterview).length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search problems by name, company, or topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-xs bg-surface border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary flex-1 min-w-56 text-gray-200"
        />
        <div className="flex gap-1">
          {(['All', 'Stripe', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                filter === d
                  ? d === 'Stripe'
                    ? 'bg-[#635BFF] text-white border-[#635BFF] font-semibold'
                    : 'bg-primary text-white border-primary font-semibold'
                  : 'border-gray-700 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {d === 'Stripe' ? '💳 Stripe' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Two-pane layout: list + detail */}
      <div className="flex flex-col md:flex-row gap-5 min-h-[550px]">
        {/* List */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-2.5">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm rounded-lg border border-gray-800 bg-surface-dark">
              No problems found matching criteria.
            </div>
          )}
          {filtered.map((problem) => (
            <button
              key={problem.id}
              onClick={() => setSelected(selected?.id === problem.id ? null : problem)}
              className={`w-full text-left border rounded-xl p-4 transition-all duration-200 ${
                selected?.id === problem.id
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                  : 'border-gray-700 bg-surface-light hover:border-gray-600 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs w-2.5 h-2.5 rounded-full bg-current flex-shrink-0 ${DIFFICULTY_DOT[problem.difficulty]}`} />
                <span className="text-sm font-bold text-white truncate">{problem.title}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {problem.company && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-[#635BFF]/20 text-[#a594fd] border border-[#635BFF]/35">
                    💳 {problem.company}
                  </span>
                )}
                <span className={`text-[11px] px-2 py-0.5 rounded border ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                {problem.usedInInterview && (
                  <span className="text-[11px] px-2 py-0.5 rounded border bg-purple-500/15 text-purple-300 border-purple-500/30">
                    Interview
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {problem.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[11px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="flex-1 border border-gray-700 rounded-xl bg-surface-light p-6 shadow-xl overflow-hidden">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                {selected.company && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#635BFF]/20 text-[#c2b5ff] border border-[#635BFF]/40 font-mono">
                    {selected.company} Tech Screen
                  </span>
                )}
              </div>
              <ProblemDetail problem={selected} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Select a problem from the list to view breakdown and simulator
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
