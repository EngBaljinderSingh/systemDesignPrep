import { useState, useEffect } from 'react';

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
  badge?: string;
}

const APPROACHES: Record<string, ApproachOption> = {
  'two-pointers': {
    title: 'Two Pointers',
    patternId: 'two-pointers',
    category: 'Array',
    badge: 'Sorted / Opposing Pointers',
    description: 'Use two pointers from both ends or same direction on a sorted array to reduce O(n²) to O(n).',
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
    badge: 'Logarithmic Search',
    description: 'Halve the search space repeatedly on sorted arrays or monotonic condition predicates.',
    complexity: 'O(log n) time • O(1) space',
    lcProblems: [
      { id: '35', title: 'Search Insert Position', num: 35, url: 'https://leetcode.com/problems/search-insert-position/' },
      { id: '34', title: 'Find First & Last Position of Element', num: 34, url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
    ],
  },
  'sliding-window': {
    title: 'Sliding Window',
    patternId: 'sliding-window',
    category: 'Array',
    badge: 'Contiguous Subarray (Non-negative)',
    description: 'Expand right pointer, contract left pointer when window condition breaks. Optimal for sum or size constraints.',
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
    badge: 'Contiguous Subarray (Negative Numbers)',
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
    badge: 'Arbitrary Range Queries',
    description: 'Store running prefix sums in a HashMap to answer subarray sum queries in O(1) amortized time.',
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
    badge: 'Non-contiguous Subsequences',
    description: 'Overlapping subproblems with optimal substructure for non-contiguous subsequences.',
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
    badge: 'Exhaustive Combinations',
    description: 'Explore all candidate combinations or subsets with DFS and prune invalid search paths.',
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
    badge: 'Task Prerequisites / Ordering',
    description: 'Linear ordering of DAG vertices using in-degrees and a queue for prerequisite resolution.',
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
    badge: 'Top / Bottom K Extremes',
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
    badge: 'Mutable Ranges / Overlaps',
    description: 'Logarithmic range queries with dynamic updates, or O(1) difference array range updates.',
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
  const [widthMode, setWidthMode] = useState<'full' | 'wide' | 'compact'>('full');
  const [viewHeightMode, setViewHeightMode] = useState<'natural' | 'contained'>('natural');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        className="rounded-xl border border-gray-700 bg-surface-dark/95 p-4 space-y-3 hover:border-primary/50 transition-all shadow-md group"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>⚡</span> {app.title}
              </h4>
              {app.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 font-medium">
                  {app.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-400 font-mono mt-0.5 block">{app.complexity}</span>
          </div>
          {app.patternId && onSelectPattern && (
            <button
              onClick={() => onSelectPattern(app.patternId!)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 transition-colors font-medium flex items-center gap-1 shrink-0"
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
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-primary/10 border border-gray-700 hover:border-primary/40 text-gray-200 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span className="font-bold text-amber-400 font-mono">#{lc.num}</span>
                <span className="truncate max-w-[200px]">{lc.title}</span>
                <span className="text-gray-500 text-[10px]">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner & Mode Switcher */}
      <div className="rounded-2xl border border-gray-700/80 bg-gradient-to-r from-surface-light via-surface to-surface-dark p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🗺️</span>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Choosing the Right Array/Algorithm Approach (LC #)
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 max-w-3xl leading-relaxed">
                  High-resolution visual flowchart mapping constraint patterns directly to Two Pointers, Binary Search, Sliding Window, Kadane's, DP, Kahn's Algo, Heap, and Segment Trees.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-gray-700 shrink-0">
            <button
              onClick={() => setActiveTab('flowchart')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'flowchart'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🖼️</span> Visual Diagram
            </button>
            <button
              onClick={() => setActiveTab('wizard')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'wizard'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🧭</span> Interactive Wizard
            </button>
          </div>
        </div>
      </div>

      {/* Visual Diagram Mode */}
      {activeTab === 'flowchart' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-surface border border-gray-700/80 rounded-xl px-4 py-2.5 shadow-md">
            {/* Width Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Width:</span>
              <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-gray-700/80">
                <button
                  onClick={() => { setWidthMode('full'); setZoom(1); }}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                    widthMode === 'full'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Fills the entire container width (up to 1024px+)"
                >
                  ↔ 100% Full Width
                </button>
                <button
                  onClick={() => { setWidthMode('wide'); setZoom(1); }}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                    widthMode === 'wide'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Comfortable 768px reading width"
                >
                  Wide (768px)
                </button>
                <button
                  onClick={() => { setWidthMode('compact'); setZoom(1); }}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                    widthMode === 'compact'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Native 571px resolution"
                >
                  Original (571px)
                </button>
              </div>
            </div>

            {/* Height Display Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Height:</span>
              <button
                onClick={() => setViewHeightMode(viewHeightMode === 'natural' ? 'contained' : 'natural')}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  viewHeightMode === 'natural'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-gray-700 bg-white/5 text-gray-300'
                }`}
                title="Toggle between natural page scrolling and a contained scroll window"
              >
                {viewHeightMode === 'natural' ? '📜 Full Height (No Crop)' : '🔲 Contained Box'}
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-gray-700/80">
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, parseFloat((z - 0.15).toFixed(2))))}
                  className="px-2.5 py-1 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="text-xs text-gray-300 px-2 font-mono min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(2.5, parseFloat((z + 0.15).toFixed(2))))}
                  className="px-2.5 py-1 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded border-l border-gray-700"
                  title="Reset Zoom to 100%"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setLightboxZoom(1); setLightboxOpen(true); }}
                className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>🔍</span> Fullscreen Lightbox
              </button>
              <a
                href="/ds-algorithm-flowchart.jpg"
                download="DS_Algorithm_Flowchart.jpg"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-700 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <span>💾</span> Download
              </a>
            </div>
          </div>

          {/* Diagram Container - FIXED: items-start prevents top "START" node from ever being clipped */}
          <div
            className={`rounded-2xl border border-gray-700/80 bg-black/70 p-4 md:p-8 flex justify-center items-start shadow-2xl relative group overflow-x-auto ${
              viewHeightMode === 'contained' ? 'max-h-[80vh] overflow-y-auto' : 'overflow-visible'
            }`}
          >
            {/* Inner scaler wrapper with origin-top center */}
            <div
              className={`transition-all duration-300 origin-top flex justify-center w-full ${
                widthMode === 'full'
                  ? 'max-w-4xl lg:max-w-5xl'
                  : widthMode === 'wide'
                  ? 'max-w-3xl'
                  : 'max-w-[571px]'
              }`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                marginBottom: zoom > 1 ? `${(zoom - 1) * 800}px` : 0,
              }}
            >
              <img
                src="/ds-algorithm-flowchart.jpg"
                alt="Choosing the Right Array/Algorithm Approach with LeetCode Problem Numbers"
                className="rounded-xl shadow-2xl w-full h-auto object-contain cursor-zoom-in border border-gray-600/70 bg-[#f9f7f1]"
                onClick={() => setLightboxOpen(true)}
              />
            </div>

            <div className="absolute top-4 right-4 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity bg-black/80 px-2.5 py-1 rounded-md text-[11px] text-gray-300 border border-gray-700">
              Click diagram to expand fullscreen
            </div>
          </div>

          {/* Quick Decision Reference Grid */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <span>📌</span> Quick Decision Reference & LeetCode Benchmarks
              </h3>
              <span className="text-[11px] text-gray-500">Click any card to inspect the pattern or open LeetCode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.keys(APPROACHES).map((key) => renderApproachCard(key))}
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
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-300"
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
                    ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm'
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
                    ? 'border-amber-500 bg-amber-950/30 text-white shadow-sm'
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
                    ? 'border-pink-500 bg-pink-950/30 text-white shadow-sm'
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

      {/* Lightbox Modal - FIXED: items-start guarantees top START node is always at the top */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-3 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm">Choosing the Right Array/Algorithm Approach (LC #)</span>
              <span className="text-xs text-gray-400 hidden sm:inline">• Fullscreen High-Resolution Viewer</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/10 rounded-lg p-0.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setLightboxZoom((z) => Math.max(0.6, parseFloat((z - 0.2).toFixed(2))))}
                  className="px-2.5 py-1 text-xs text-gray-300 hover:text-white"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="text-xs px-2 font-mono">{Math.round(lightboxZoom * 100)}%</span>
                <button
                  onClick={() => setLightboxZoom((z) => Math.min(3.0, parseFloat((z + 0.2).toFixed(2))))}
                  className="px-2.5 py-1 text-xs text-gray-300 hover:text-white"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => setLightboxZoom(1)}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-white border-l border-white/20"
                >
                  100%
                </button>
              </div>

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
                className="text-gray-400 hover:text-white text-xl font-bold px-2 py-1 leading-none"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lightbox Scroll Viewport: items-start so START node is top-aligned */}
          <div
            className="flex-1 overflow-auto flex justify-center items-start p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="transition-transform duration-200 origin-top flex justify-center max-w-4xl lg:max-w-5xl w-full"
              style={{ transform: `scale(${lightboxZoom})`, transformOrigin: 'top center' }}
            >
              <img
                src="/ds-algorithm-flowchart.jpg"
                alt="High Resolution Flowchart"
                className="w-full h-auto object-contain rounded-xl shadow-2xl border border-gray-700 bg-[#f9f7f1]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
