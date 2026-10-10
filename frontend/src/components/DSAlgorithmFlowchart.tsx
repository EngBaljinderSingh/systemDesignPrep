import { useState } from 'react';

interface Props {
  onSelectPattern?: (patternId: string) => void;
}

interface ApproachOption {
  title: string;
  patternId?: string;
  category: string;
  lcProblems: { id: string; title: string; num: number; url: string }[];
  description: string;
  complexity: string;
}

const APPROACHES: Record<string, ApproachOption> = {
  'two-pointers': {
    title: 'Two Pointers',
    patternId: 'two-pointers',
    category: 'Array',
    description: 'Use two pointers from both ends or same direction on a sorted array.',
    complexity: 'O(n) time • O(1) space',
    lcProblems: [
      { id: '167', title: 'Two Sum II - Input Array Is Sorted', num: 167, url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: '15', title: '3Sum', num: 15, url: 'https://leetcode.com/problems/3sum/' },
    ],
  },
  'binary-search': {
    title: 'Binary Search',
    patternId: 'binary-search',
    category: 'Array',
    description: 'Halve the search space repeatedly on sorted arrays or monotonic condition ranges.',
    complexity: 'O(log n) time • O(1) space',
    lcProblems: [
      { id: '35', title: 'Search Insert Position', num: 35, url: 'https://leetcode.com/problems/search-insert-position/' },
      { id: '34', title: 'Find First and Last Position of Element', num: 34, url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
    ],
  },
  'sliding-window': {
    title: 'Sliding Window',
    patternId: 'sliding-window',
    category: 'Array',
    description: 'Expand right pointer, contract left pointer when window condition breaks (requires non-negative numbers).',
    complexity: 'O(n) time • O(1) space',
    lcProblems: [
      { id: '209', title: 'Minimum Size Subarray Sum', num: 209, url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
      { id: '3', title: 'Longest Substring Without Repeating Characters', num: 3, url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    ],
  },
  'kadane': {
    title: "Kadane's Algorithm",
    patternId: 'sliding-window',
    category: 'Array / DP',
    description: 'Find maximum sum contiguous subarray when negative numbers exist: curMax = max(x, curMax + x).',
    complexity: 'O(n) time • O(1) space',
    lcProblems: [
      { id: '53', title: 'Maximum Subarray', num: 53, url: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: '918', title: 'Maximum Sum Circular Subarray', num: 918, url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/' },
    ],
  },
  'prefix-sum': {
    title: 'Prefix / Suffix Sum with HashMap',
    patternId: 'sliding-window',
    category: 'Array / Hash Table',
    description: 'Store running prefix sums in a HashMap to find subarray sums in O(1) time per query.',
    complexity: 'O(n) time • O(n) space',
    lcProblems: [
      { id: '560', title: 'Subarray Sum Equals K', num: 560, url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { id: '303', title: 'Range Sum Query - Immutable', num: 303, url: 'https://leetcode.com/problems/range-sum-query-immutable/' },
    ],
  },
  'dp': {
    title: 'Dynamic Programming (DP)',
    patternId: 'dynamic-programming',
    category: 'DP',
    description: 'Subproblems overlap with optimal substructure for non-contiguous subsequences.',
    complexity: 'O(n²) / O(n log n) time',
    lcProblems: [
      { id: '300', title: 'Longest Increasing Subsequence', num: 300, url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: '1143', title: 'Longest Common Subsequence', num: 1143, url: 'https://leetcode.com/problems/longest-common-subsequence/' },
    ],
  },
  'backtracking': {
    title: 'Backtracking',
    patternId: 'backtracking',
    category: 'Search',
    description: 'Explore all candidate combinations/subsets with DFS and prune invalid paths.',
    complexity: 'O(2ⁿ) or O(n!) time',
    lcProblems: [
      { id: '78', title: 'Subsets', num: 78, url: 'https://leetcode.com/problems/subsets/' },
      { id: '77', title: 'Combinations', num: 77, url: 'https://leetcode.com/problems/combinations/' },
    ],
  },
  'topological-sort': {
    title: "Kahn's Algorithm (Topological Sort / BFS)",
    patternId: 'bfs',
    category: 'Graph',
    description: 'Linear ordering of DAG vertices using in-degrees and a queue for task prerequisite resolution.',
    complexity: 'O(V + E) time • O(V) space',
    lcProblems: [
      { id: '207', title: 'Course Schedule I', num: 207, url: 'https://leetcode.com/problems/course-schedule/' },
      { id: '210', title: 'Course Schedule II', num: 210, url: 'https://leetcode.com/problems/course-schedule-ii/' },
    ],
  },
  'heap': {
    title: 'Heap / Priority Queue',
    patternId: 'top-k-elements',
    category: 'Heap',
    description: 'Maintain a min-heap or max-heap of size K to efficiently track top/bottom K elements in streams.',
    complexity: 'O(N log K) time • O(K) space',
    lcProblems: [
      { id: '215', title: 'Kth Largest Element in an Array', num: 215, url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: '23', title: 'Merge k Sorted Lists', num: 23, url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    ],
  },
  'segment-tree': {
    title: 'Segment Tree / Fenwick Tree & Difference Array',
    patternId: 'merge-intervals',
    category: 'Advanced Tree / Range',
    description: 'Logarithmic range sum/min/max queries with point/range updates, or O(1) difference array range updates.',
    complexity: 'O(log n) query/update • O(n) space',
    lcProblems: [
      { id: '307', title: 'Range Sum Query - Mutable', num: 307, url: 'https://leetcode.com/problems/range-sum-query-mutable/' },
      { id: '1094', title: 'Car Pooling (Difference Array)', num: 1094, url: 'https://leetcode.com/problems/car-pooling/' },
    ],
  },
};

export default function DSAlgorithmFlowchart({ onSelectPattern }: Props) {
  const [activeTab, setActiveTab] = useState<'flowchart' | 'wizard'>('flowchart');
  const [zoom, setZoom] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Wizard state
  const [sorted, setSorted] = useState<boolean | null>(null);
  const [seqType, setSeqType] = useState<'subarray' | 'subsequence' | null>(null);
  const [hasConstraint, setHasConstraint] = useState<boolean | null>(null);
  const [hasNegative, setHasNegative] = useState<boolean | null>(null);
  const [hasOrdering, setHasOrdering] = useState<boolean | null>(null);
  const [isTopK, setIsTopK] = useState<boolean | null>(null);
  const [isRanges, setIsRanges] = useState<boolean | null>(null);

  const resetWizard = () => {
    setSorted(null);
    setSeqType(null);
    setHasConstraint(null);
    setHasNegative(null);
    setHasOrdering(null);
    setIsTopK(null);
    setIsRanges(null);
  };

  const renderApproachCard = (key: string) => {
    const app = APPROACHES[key];
    if (!app) return null;

    return (
      <div
        key={key}
        className="rounded-xl border border-gray-700 bg-surface-dark/90 p-4 space-y-3 hover:border-primary/50 transition-all shadow-md"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>⚡</span> {app.title}
            </h4>
            <span className="text-[11px] text-primary font-mono">{app.complexity}</span>
          </div>
          {app.patternId && onSelectPattern && (
            <button
              onClick={() => onSelectPattern(app.patternId!)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 transition-colors font-medium flex items-center gap-1"
            >
              Open Pattern ↗
            </button>
          )}
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">{app.description}</p>

        <div>
          <span className="text-[11px] font-semibold text-gray-400 block mb-1.5 uppercase tracking-wider">
            LeetCode Benchmarks:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {app.lcProblems.map((lc) => (
              <a
                key={lc.id}
                href={lc.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-primary/10 border border-gray-700 hover:border-primary/40 text-gray-200 transition-colors flex items-center gap-1"
              >
                <span className="font-bold text-amber-400 font-mono">#{lc.num}</span>
                <span className="truncate max-w-[180px]">{lc.title}</span>
                <span className="text-gray-500 text-[10px]">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="rounded-xl border border-gray-700 bg-gradient-to-r from-surface-light via-surface to-surface-dark p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🗺️</span>
              <h2 className="text-base font-bold text-white">
                Choosing the Right Array/Algorithm Approach (LC #)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Diagnostic decision tree mapping your problem constraints directly to Two Pointers, Binary Search, Sliding Window, Kadane's, DP, Kahn's Algo, Heap, and Segment Trees.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setActiveTab('flowchart')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'flowchart'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🖼️ Visual Diagram
            </button>
            <button
              onClick={() => setActiveTab('wizard')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'wizard'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🧭 Interactive Wizard
            </button>
          </div>
        </div>
      </div>

      {/* Visual Diagram Mode */}
      {activeTab === 'flowchart' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">Zoom: {Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-200"
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-200"
              >
                -
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-400 hover:text-white"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightboxOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>🔍</span> Fullscreen View
              </button>
              <a
                href="/ds-algorithm-flowchart.jpg"
                download="DS_Algorithm_Flowchart.jpg"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-700 font-medium transition-colors flex items-center gap-1.5"
              >
                <span>💾</span> Download Diagram
              </a>
            </div>
          </div>

          {/* Diagram Container */}
          <div className="rounded-2xl border border-gray-700/80 bg-black/60 p-4 md:p-6 flex justify-center items-center overflow-auto max-h-[700px] shadow-2xl relative group">
            <div
              className="transition-transform duration-200 origin-top flex justify-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                src="/ds-algorithm-flowchart.jpg"
                alt="Choosing the Right Array/Algorithm Approach Flowchart"
                className="rounded-xl shadow-2xl max-w-full md:max-w-2xl cursor-zoom-in border border-gray-800"
                onClick={() => setLightboxOpen(true)}
              />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity bg-black/80 px-2.5 py-1 rounded-md text-[11px] text-gray-300 border border-gray-700">
              Click image to view fullscreen
            </div>
          </div>
        </div>
      )}

      {/* Interactive Wizard Mode */}
      {activeTab === 'wizard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Approach Decision Wizard</h3>
              <p className="text-xs text-gray-400">Answer the questions below to pinpoint the exact algorithm:</p>
            </div>
            <button
              onClick={resetWizard}
              className="text-xs px-3 py-1.5 rounded-md border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-300"
            >
              ↺ Reset Answers
            </button>
          </div>

          {/* Question 1: Is it sorted? */}
          <div className="rounded-xl border border-gray-700 bg-surface-dark/70 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-semibold text-white">Is the input array / sequence sorted?</h4>
            </div>
            <div className="flex gap-2 pl-8">
              <button
                onClick={() => setSorted(true)}
                className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                  sorted === true
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                }`}
              >
                ✓ YES, it is Sorted
              </button>
              <button
                onClick={() => setSorted(false)}
                className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                  sorted === false
                    ? 'bg-primary/20 text-primary border-primary shadow-sm'
                    : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                }`}
              >
                ✗ NO, unsorted / arbitrary
              </button>
            </div>

            {sorted === true && (
              <div className="mt-4 pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-800">
                {renderApproachCard('two-pointers')}
                {renderApproachCard('binary-search')}
              </div>
            )}
          </div>

          {/* Question 2: Subarray or Subsequence? (Only if unsorted or continuing) */}
          {sorted === false && (
            <div className="rounded-xl border border-gray-700 bg-surface-dark/70 p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Does the problem ask for a Subarray (contiguous) or Subsequence (non-contiguous)?
                </h4>
              </div>
              <div className="flex gap-2 pl-8">
                <button
                  onClick={() => setSeqType('subarray')}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                    seqType === 'subarray'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  Contiguous Subarray [i...j]
                </button>
                <button
                  onClick={() => setSeqType('subsequence')}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                    seqType === 'subsequence'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  Non-contiguous Subsequence
                </button>
              </div>

              {seqType === 'subarray' && (
                <div className="pl-8 pt-3 space-y-3 border-t border-gray-800">
                  <p className="text-xs text-gray-300 font-medium">Is there a Sum or Size constraint?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHasConstraint(true)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        hasConstraint === true
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : 'bg-white/5 text-gray-400 border-gray-700 hover:bg-white/10'
                      }`}
                    >
                      Yes (Target sum, Max/Min size)
                    </button>
                    <button
                      onClick={() => setHasConstraint(false)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        hasConstraint === false
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500'
                          : 'bg-white/5 text-gray-400 border-gray-700 hover:bg-white/10'
                      }`}
                    >
                      No (Random / Multiple Range Queries)
                    </button>
                  </div>

                  {hasConstraint === true && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs text-gray-300 font-medium">Do negative numbers exist in the array?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setHasNegative(false)}
                          className={`text-xs px-3 py-1.5 rounded-lg border ${
                            hasNegative === false
                              ? 'bg-green-500/20 text-green-300 border-green-500'
                              : 'bg-white/5 text-gray-400 border-gray-700'
                          }`}
                        >
                          Non-negative only
                        </button>
                        <button
                          onClick={() => setHasNegative(true)}
                          className={`text-xs px-3 py-1.5 rounded-lg border ${
                            hasNegative === true
                              ? 'bg-red-500/20 text-red-300 border-red-500'
                              : 'bg-white/5 text-gray-400 border-gray-700'
                          }`}
                        >
                          Negative numbers exist
                        </button>
                      </div>

                      {hasNegative === false && renderApproachCard('sliding-window')}
                      {hasNegative === true && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {renderApproachCard('kadane')}
                          {renderApproachCard('prefix-sum')}
                        </div>
                      )}
                    </div>
                  )}

                  {hasConstraint === false && renderApproachCard('prefix-sum')}
                </div>
              )}

              {seqType === 'subsequence' && (
                <div className="pl-8 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-800">
                  {renderApproachCard('dp')}
                  {renderApproachCard('backtracking')}
                </div>
              )}
            </div>
          )}

          {/* Question 3: Dependencies, Heap, Ranges */}
          <div className="rounded-xl border border-gray-700 bg-surface-dark/70 p-4 space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>🎯</span> Other Common Array / Sequence Patterns
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setHasOrdering((v) => !v)}
                className={`p-3 text-left rounded-lg border transition-all ${
                  hasOrdering
                    ? 'border-cyan-500 bg-cyan-950/30 text-white'
                    : 'border-gray-700 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-xs mb-1">🔗 Element Dependencies</div>
                <div className="text-[11px] text-gray-400">Prerequisites, DAG, Course schedule order</div>
              </button>

              <button
                onClick={() => setIsTopK((v) => !v)}
                className={`p-3 text-left rounded-lg border transition-all ${
                  isTopK
                    ? 'border-amber-500 bg-amber-950/30 text-white'
                    : 'border-gray-700 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-xs mb-1">👑 Top K / Max / Min</div>
                <div className="text-[11px] text-gray-400">Kth largest element, merge k sorted streams</div>
              </button>

              <button
                onClick={() => setIsRanges((v) => !v)}
                className={`p-3 text-left rounded-lg border transition-all ${
                  isRanges
                    ? 'border-pink-500 bg-pink-950/30 text-white'
                    : 'border-gray-700 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-xs mb-1">📊 Ranges & Mutable Queries</div>
                <div className="text-[11px] text-gray-400">Intervals, multiple updates, car pooling</div>
              </button>
            </div>

            {hasOrdering && renderApproachCard('topological-sort')}
            {isTopK && renderApproachCard('heap')}
            {isRanges && renderApproachCard('segment-tree')}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-white">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Choosing the Right Array/Algorithm Approach (LC #)</span>
              <span className="text-xs text-gray-400 hidden sm:inline">• High-Resolution Cheat Sheet</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/ds-algorithm-flowchart.jpg"
                download="DS_Algorithm_Flowchart.jpg"
                onClick={(e) => e.stopPropagation()}
                className="text-xs px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium"
              >
                Download
              </a>
              <button
                onClick={() => setLightboxOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/ds-algorithm-flowchart.jpg"
              alt="High Resolution Flowchart"
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
