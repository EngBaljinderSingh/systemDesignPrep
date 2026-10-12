import { useState, useEffect, useMemo } from 'react';

interface Props {
  onSelectPattern?: (patternId: string) => void;
}

interface ApproachOption {
  key: string;
  title: string;
  patternId?: string;
  category: string;
  badge: string;
  badgeColor?: string;
  description: string;
  complexity: string;
  lcProblems: { id: string; title: string; num: number; url: string }[];
}

const APPROACHES: Record<string, ApproachOption> = {
  // 1: 2D Matrix Classification
  'matrix-bfs': {
    key: 'matrix-bfs',
    title: 'Matrix BFS',
    patternId: 'bfs',
    category: '1. 2D Matrix',
    badge: '1: Shortest Path / Unweighted Levels',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    description: 'Level-order queue traversal to find the shortest path in unweighted 4/8-direction grids or simulate multi-source cell propagation (e.g. rotting oranges).',
    complexity: 'O(R × C) time • O(R × C) space',
    lcProblems: [
      { id: '1091', title: 'Shortest Path in Binary Matrix', num: 1091, url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/' },
      { id: '994', title: 'Rotting Oranges', num: 994, url: 'https://leetcode.com/problems/rotting-oranges/' },
    ],
  },
  'matrix-dfs': {
    key: 'matrix-dfs',
    title: 'Matrix DFS / Union-Find',
    patternId: 'dfs',
    category: '1. 2D Matrix',
    badge: '1: Connected Components / Islands',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    description: 'Explore connected cells recursively or group disjoint sets with Union-Find to count island clusters, compute max connected area, or identify flood-fill boundaries.',
    complexity: 'O(R × C) time • O(R × C) space',
    lcProblems: [
      { id: '200', title: 'Number of Islands', num: 200, url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: '695', title: 'Max Area of Island', num: 695, url: 'https://leetcode.com/problems/max-area-of-island/' },
    ],
  },
  'matrix-simulation': {
    key: 'matrix-simulation',
    title: 'Spiral / Coordinate Simulation',
    patternId: 'two-pointers',
    category: '1. 2D Matrix',
    badge: '1: Layer-by-layer / In-place Rotate',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    description: 'Maintain 4 boundary pointers (top, bottom, left, right) for spiral iteration, or apply mathematical index mappings (transpose + reverse) for in-place 90° rotation.',
    complexity: 'O(R × C) time • O(1) space',
    lcProblems: [
      { id: '54', title: 'Spiral Matrix', num: 54, url: 'https://leetcode.com/problems/spiral-matrix/' },
      { id: '48', title: 'Rotate Image', num: 48, url: 'https://leetcode.com/problems/rotate-image/' },
    ],
  },
  'matrix-staircase': {
    key: 'matrix-staircase',
    title: 'Staircase Search / Binary Search',
    patternId: 'binary-search',
    category: '1. 2D Matrix',
    badge: '1: Row-wise & Column-wise Sorted',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    description: 'Start at the top-right or bottom-left corner to eliminate an entire row or column per comparison in O(R + C), or treat flattened matrix as a single sorted array.',
    complexity: 'O(R + C) or O(log(R × C)) time • O(1) space',
    lcProblems: [
      { id: '240', title: 'Search a 2D Matrix II', num: 240, url: 'https://leetcode.com/problems/search-a-2d-matrix-ii/' },
      { id: '74', title: 'Search a 2D Matrix', num: 74, url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
    ],
  },
  'matrix-dp': {
    key: 'matrix-dp',
    title: '2D Grid DP',
    patternId: 'dynamic-programming',
    category: '1. 2D Matrix',
    badge: '1: Path Optimization with Obstacles',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    description: 'State transition dp[r][c] = cost[r][c] + min/max(dp[r-1][c], dp[r][c-1]) when navigating cells moving only right or down under obstacle or cost constraints.',
    complexity: 'O(R × C) time • O(C) space',
    lcProblems: [
      { id: '62', title: 'Unique Paths', num: 62, url: 'https://leetcode.com/problems/unique-paths/' },
      { id: '64', title: 'Minimum Path Sum', num: 64, url: 'https://leetcode.com/problems/minimum-path-sum/' },
    ],
  },

  // 2: Two Pointers (Sorted Array)
  'two-pointers': {
    key: 'two-pointers',
    title: 'Two Pointers (Sorted Array)',
    patternId: 'two-pointers',
    category: '2. Sorted Array',
    badge: '2: Opposing / Same Direction Pointers',
    badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
    description: 'Move left and right pointers inward from both ends to hit target sums, or use fast/slow pointers for in-place deduplication without extra memory.',
    complexity: 'O(n) time • O(1) space',
    lcProblems: [
      { id: '167', title: 'Two Sum II - Input Array Is Sorted', num: 167, url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: '15', title: '3Sum', num: 15, url: 'https://leetcode.com/problems/3sum/' },
      { id: '26', title: 'Remove Duplicates from Sorted Array', num: 26, url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
    ],
  },
  'binary-search': {
    key: 'binary-search',
    title: 'Binary Search (Sorted / Rotated)',
    patternId: 'binary-search',
    category: '2. Sorted Array',
    badge: '2: Logarithmic Lookup',
    badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
    description: 'Repeatedly halve the search interval on sorted or rotated-sorted arrays by inspecting the middle element and choosing the monotonic half.',
    complexity: 'O(log n) time • O(1) space',
    lcProblems: [
      { id: '704', title: 'Binary Search', num: 704, url: 'https://leetcode.com/problems/binary-search/' },
      { id: '33', title: 'Search in Rotated Sorted Array', num: 33, url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: '153', title: 'Find Minimum in Rotated Sorted Array', num: 153, url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
    ],
  },

  // 3: Sort + Greedy / Two Pointers
  'sort-greedy': {
    key: 'sort-greedy',
    title: 'Sort + Greedy / Two Pointers',
    patternId: 'two-pointers',
    category: '3. Sort + Greedy',
    badge: '3: Can Sort Without Breaking Problem',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    description: 'When original indices are not strictly fixed or order can be reconstructed. Sorting in O(n log n) enables greedy merging or opposite-end pairing.',
    complexity: 'O(n log n) time • O(1) or O(n) space',
    lcProblems: [
      { id: '56', title: 'Merge Intervals', num: 56, url: 'https://leetcode.com/problems/merge-intervals/' },
      { id: '881', title: 'Boats to Save People', num: 881, url: 'https://leetcode.com/problems/boats-to-save-people/' },
    ],
  },

  // 4: Binary Search on Range / Feasibility
  'binary-search-range': {
    key: 'binary-search-range',
    title: 'Binary Search on Range / Feasibility',
    patternId: 'binary-search',
    category: '4. BS on Feasibility',
    badge: '4: Binary Search on Answer Value',
    badgeColor: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
    description: 'Instead of searching existing indices, binary search over the monotonic answer space [minPossible, maxPossible] with a greedy helper validator isFeasible(val).',
    complexity: 'O(n log(high - low)) time • O(1) space',
    lcProblems: [
      { id: '875', title: 'Koko Eating Bananas', num: 875, url: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { id: '1011', title: 'Capacity To Ship Packages Within D Days', num: 1011, url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/' },
      { id: '410', title: 'Split Array Largest Sum', num: 410, url: 'https://leetcode.com/problems/split-array-largest-sum/' },
    ],
  },

  // 5: Prefix / Suffix Accumulation
  'prefix-suffix': {
    key: 'prefix-suffix',
    title: 'Prefix / Suffix Accumulation',
    patternId: 'sliding-window',
    category: '5. Prefix / Suffix',
    badge: '5: Left & Right Cumulative Dependency',
    badgeColor: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
    description: 'When the result at index i depends on accumulated left and/or right metrics. Use running prefix sums with a HashMap for zero/target-sum subarrays, or prefix & suffix arrays for products/maxima.',
    complexity: 'O(n) time • O(n) or O(1) space',
    lcProblems: [
      { id: '303', title: 'Range Sum Query - Immutable', num: 303, url: 'https://leetcode.com/problems/range-sum-query-immutable/' },
      { id: '560', title: 'Subarray Sum Equals K', num: 560, url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { id: '238', title: 'Product of Array Except Self', num: 238, url: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: '42', title: 'Trapping Rain Water', num: 42, url: 'https://leetcode.com/problems/trapping-rain-water/' },
    ],
  },

  // 6: Sliding Window / Kadane's
  'sliding-window': {
    key: 'sliding-window',
    title: 'Sliding Window',
    patternId: 'sliding-window',
    category: '6. Contiguous Subarray',
    badge: '6: Dynamic Valid Window / At Most K Distinct',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    description: 'Expand right pointer to accumulate window state, then contract left pointer as soon as constraint is violated. Ideal for substring/subarray length optimization.',
    complexity: 'O(n) time • O(k) or O(1) space',
    lcProblems: [
      { id: '3', title: 'Longest Substring Without Repeating Characters', num: 3, url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: '76', title: 'Minimum Window Substring', num: 76, url: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: '209', title: 'Minimum Size Subarray Sum', num: 209, url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
    ],
  },
  'monotonic-queue': {
    key: 'monotonic-queue',
    title: 'Monotonic Queue / Deque',
    patternId: 'monotonic-stack',
    category: '6. Contiguous Subarray',
    badge: '6: Sliding Window Maximum / Local Extrema',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    description: 'Maintain monotonically decreasing indices in a double-ended queue (deque) to query the maximum or minimum of every sliding window of size k in O(1) amortized.',
    complexity: 'O(n) time • O(k) space',
    lcProblems: [
      { id: '239', title: 'Sliding Window Maximum', num: 239, url: 'https://leetcode.com/problems/sliding-window-maximum/' },
    ],
  },
  'kadane': {
    key: 'kadane',
    title: "Kadane's Algorithm",
    patternId: 'dynamic-programming',
    category: '6. Contiguous Subarray',
    badge: '6: Max/Min Contiguous Sum (with Negatives)',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    description: 'Single-pass dynamic optimization: curMax = max(num, curMax + num). Captures optimal contiguous subarray sum even when negative elements exist.',
    complexity: 'O(n) time • O(1) space',
    lcProblems: [
      { id: '53', title: 'Maximum Subarray', num: 53, url: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: '918', title: 'Maximum Sum Circular Subarray', num: 918, url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/' },
    ],
  },

  // 7: Non-Contiguous Subsequence / Subset
  'dp': {
    key: 'dp',
    title: 'Dynamic Programming (DP)',
    patternId: 'dynamic-programming',
    category: '7. Non-Contiguous Subsequence',
    badge: '7: Optimal Length / Max Profit / Counting',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    description: 'Decompose non-contiguous choices into overlapping subproblems (e.g. pick vs skip item i, or match s1[i] with s2[j]) with memoization or tabulation.',
    complexity: 'O(n²) / O(n log n) time • O(n) space',
    lcProblems: [
      { id: '300', title: 'Longest Increasing Subsequence', num: 300, url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: '1143', title: 'Longest Common Subsequence', num: 1143, url: 'https://leetcode.com/problems/longest-common-subsequence/' },
    ],
  },
  'backtracking': {
    key: 'backtracking',
    title: 'Backtracking',
    patternId: 'backtracking',
    category: '7. Non-Contiguous Subsequence',
    badge: '7: Enumerate / Print / Generate All',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    description: 'Exhaustively build permutations, subsets, and combinations via DFS recursion, undoing the state change on return to explore all valid paths.',
    complexity: 'O(2ⁿ) or O(n!) time • O(n) recursion depth',
    lcProblems: [
      { id: '78', title: 'Subsets', num: 78, url: 'https://leetcode.com/problems/subsets/' },
      { id: '46', title: 'Permutations', num: 46, url: 'https://leetcode.com/problems/permutations/' },
      { id: '39', title: 'Combination Sum', num: 39, url: 'https://leetcode.com/problems/combination-sum/' },
    ],
  },

  // Special Requirements (Structural / Element-Level Logic)
  'monotonic-stack': {
    key: 'monotonic-stack',
    title: 'Monotonic Stack',
    patternId: 'monotonic-stack',
    category: 'Special Requirements',
    badge: 'Special: Next Greater/Smaller / Histogram Area',
    badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    description: 'Keep stack values monotonic to resolve the next greater or next smaller element for every position in O(1) amortized, or calculate max rectangular area in histograms.',
    complexity: 'O(n) time • O(n) space',
    lcProblems: [
      { id: '739', title: 'Daily Temperatures', num: 739, url: 'https://leetcode.com/problems/daily-temperatures/' },
      { id: '496', title: 'Next Greater Element I', num: 496, url: 'https://leetcode.com/problems/next-greater-element-i/' },
      { id: '84', title: 'Largest Rectangle in Histogram', num: 84, url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
    ],
  },
  'topological-sort': {
    key: 'topological-sort',
    title: "Topological Sort / Kahn's BFS",
    patternId: 'bfs',
    category: 'Special Requirements',
    badge: 'Special: Prerequisites / Task Ordering / Cycle',
    badgeColor: 'border-teal-500/40 bg-teal-500/10 text-teal-300',
    description: 'Track in-degrees of DAG vertices and consume zero in-degree items with a queue to establish a valid topological order or detect dependency cycles.',
    complexity: 'O(V + E) time • O(V + E) space',
    lcProblems: [
      { id: '207', title: 'Course Schedule', num: 207, url: 'https://leetcode.com/problems/course-schedule/' },
      { id: '210', title: 'Course Schedule II', num: 210, url: 'https://leetcode.com/problems/course-schedule-ii/' },
    ],
  },
  'segment-tree': {
    key: 'segment-tree',
    title: 'Segment Tree / Fenwick Tree',
    patternId: 'merge-intervals',
    category: 'Special Requirements',
    badge: 'Special: Range Updates & Frequent Queries',
    badgeColor: 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300',
    description: 'Tree structures designed for dynamic arrays needing both O(log n) point/range modifications and O(log n) range sum/min/max queries.',
    complexity: 'O(log n) update & query • O(n) space',
    lcProblems: [
      { id: '307', title: 'Range Sum Query - Mutable', num: 307, url: 'https://leetcode.com/problems/range-sum-query-mutable/' },
    ],
  },
  'hash-window': {
    key: 'hash-window',
    title: 'Sliding Window + Hash Set (Within K Distance)',
    patternId: 'sliding-window',
    category: 'Special Requirements',
    badge: 'Special: Duplicate in Distance K / Fixed Hash Window',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    description: 'Maintain a rolling hash set restricted to a maximum window of k items to detect duplicate occurrences within index distance |i - j| ≤ k in O(1).',
    complexity: 'O(n) time • O(k) space',
    lcProblems: [
      { id: '219', title: 'Contains Duplicate II', num: 219, url: 'https://leetcode.com/problems/contains-duplicate-ii/' },
    ],
  },
  'heap': {
    key: 'heap',
    title: 'Heap / Priority Queue',
    patternId: 'top-k-elements',
    category: 'Special Requirements',
    badge: 'Special: Dynamic Top K / Continuous Median',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    description: 'Use a min/max heap of size K to maintain extreme elements in streaming data, or two balancing heaps (max-heap + min-heap) to calculate a running median in O(1).',
    complexity: 'O(n log k) time • O(k) space',
    lcProblems: [
      { id: '215', title: 'Kth Largest Element in an Array', num: 215, url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: '295', title: 'Find Median from Data Stream', num: 295, url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    ],
  },
  'intervals': {
    key: 'intervals',
    title: 'Intervals / Line Sweep / Difference Array',
    patternId: 'merge-intervals',
    category: 'Special Requirements',
    badge: 'Special: Overlapping Intervals / Events',
    badgeColor: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
    description: 'Sort events by boundary timestamps, sweep a timeline to detect maximum simultaneous overlaps, merge overlapping spans, or execute batch range increments with difference arrays.',
    complexity: 'O(n log n) time • O(n) space',
    lcProblems: [
      { id: '56', title: 'Merge Intervals', num: 56, url: 'https://leetcode.com/problems/merge-intervals/' },
      { id: '253', title: 'Meeting Rooms II', num: 253, url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      { id: '1094', title: 'Car Pooling', num: 1094, url: 'https://leetcode.com/problems/car-pooling/' },
    ],
  },
  'union-find': {
    key: 'union-find',
    title: 'Union-Find / DSU',
    patternId: 'dfs',
    category: 'Special Requirements',
    badge: 'Special: Dynamic Connectivity / Group Merging',
    badgeColor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    description: 'Disjoint Set Union with path compression and union-by-rank. Answers connectivity and component merges in near-constant α(n) inverse Ackermann time.',
    complexity: 'O(α(n)) amortized per op • O(n) space',
    lcProblems: [
      { id: '128', title: 'Longest Consecutive Sequence', num: 128, url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { id: '684', title: 'Redundant Connection', num: 684, url: 'https://leetcode.com/problems/redundant-connection/' },
    ],
  },
  'boyer-moore': {
    key: 'boyer-moore',
    title: 'Boyer-Moore Voting Algorithm',
    patternId: 'two-pointers',
    category: 'Special Requirements',
    badge: 'Special: Majority Element / O(1) Space Frequency',
    badgeColor: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    description: 'Find the element appearing more than ⌊n/2⌋ times in a single linear pass and strictly O(1) auxiliary space by pairing up unequal elements.',
    complexity: 'O(n) time • O(1) space',
    lcProblems: [
      { id: '169', title: 'Majority Element', num: 169, url: 'https://leetcode.com/problems/majority-element/' },
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

  // Reference filter & search in Visual tab
  const [selectedRefCategory, setSelectedRefCategory] = useState<string>('all');
  const [refSearch, setRefSearch] = useState('');

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Wizard state aligned precisely to the flowchart decision diamonds
  // Step 1: 2D Matrix or 1D Sequence?
  const [isGrid, setIsGrid] = useState<boolean | null>(null);
  const [matrixSubCategory, setMatrixSubCategory] = useState<string | null>(null);

  // Step 2: Is input array sorted?
  const [isSorted, setIsSorted] = useState<boolean | null>(null);
  const [sortedSubCategory, setSortedSubCategory] = useState<string | null>(null);

  // Step 3: Can we sort or binary search on answer range?
  const [canSortOrBS, setCanSortOrBS] = useState<'sort' | 'bs-answer' | 'neither' | null>(null);

  // Step 4: Does index i depend on accumulation left and/or right?
  const [hasAccumulation, setHasAccumulation] = useState<boolean | null>(null);

  // Step 5: Subarray, Subsequence, or Neither (Structural)?
  const [sequenceScope, setSequenceScope] = useState<'subarray' | 'subsequence' | 'neither' | null>(null);

  // Sub-filters for Contiguous Subarray
  const [subarrayGoal, setSubarrayGoal] = useState<string | null>(null);

  // Sub-filters for Subsequence / Subset
  const [subseqGoal, setSubseqGoal] = useState<string | null>(null);

  // Special Requirement Selector
  const [specialReq, setSpecialReq] = useState<string | null>(null);

  const resetWizard = () => {
    setIsGrid(null);
    setMatrixSubCategory(null);
    setIsSorted(null);
    setSortedSubCategory(null);
    setCanSortOrBS(null);
    setHasAccumulation(null);
    setSequenceScope(null);
    setSubarrayGoal(null);
    setSubseqGoal(null);
    setSpecialReq(null);
  };

  const filteredApproaches = useMemo(() => {
    const list = Object.values(APPROACHES);
    return list.filter((app) => {
      const matchesCat =
        selectedRefCategory === 'all' ||
        app.category.toLowerCase().includes(selectedRefCategory.toLowerCase());
      const matchesSearch =
        !refSearch.trim() ||
        app.title.toLowerCase().includes(refSearch.toLowerCase()) ||
        app.badge.toLowerCase().includes(refSearch.toLowerCase()) ||
        app.description.toLowerCase().includes(refSearch.toLowerCase()) ||
        app.lcProblems.some(
          (p) =>
            p.num.toString().includes(refSearch.trim()) ||
            p.title.toLowerCase().includes(refSearch.toLowerCase())
        );
      return matchesCat && matchesSearch;
    });
  }, [selectedRefCategory, refSearch]);

  const renderApproachCard = (key: string) => {
    const app = APPROACHES[key];
    if (!app) return null;

    return (
      <div
        key={key}
        className="rounded-xl border border-gray-700 bg-surface-dark/95 p-4 space-y-3 hover:border-primary/50 transition-all shadow-md group relative flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="text-amber-400">⚡</span> {app.title}
                </h4>
                {app.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      app.badgeColor || 'bg-primary/10 text-primary border-primary/30'
                    }`}
                  >
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

          <p className="text-xs text-gray-300 leading-relaxed mb-3">{app.description}</p>
        </div>

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
    <div className="space-y-6 w-full">
      {/* Top Banner & Mode Switcher */}
      <div className="rounded-2xl border border-gray-700/80 bg-gradient-to-r from-surface-light via-surface to-surface-dark p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🗺️</span>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Choosing the Right Array, Matrix, or Sequence Algorithm
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 max-w-3xl leading-relaxed">
                  Decision roadmap mapping 2D Grids, Sorted Arrays, Greedy Sorting, Feasibility BS, Left/Right Accumulation, Sliding Windows, DP Subsequences, and Monotonic/DSU structures directly to LeetCode benchmarks.
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
                  title="Fills the entire container width"
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
                {viewHeightMode === 'natural' ? '📜 Full Height' : '🔲 Contained Box'}
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
                href="/ds-algorithm-flowchart.png"
                download="DS_Algorithm_Flowchart.png"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-700 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <span>💾</span> Download
              </a>
            </div>
          </div>

          {/* Diagram Container */}
          <div
            className={`rounded-2xl border border-gray-700/80 bg-black/70 p-4 md:p-8 flex justify-center items-start shadow-2xl relative group overflow-x-auto ${
              viewHeightMode === 'contained' ? 'max-h-[80vh] overflow-y-auto' : 'overflow-visible'
            }`}
          >
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
                src="/ds-algorithm-flowchart.png"
                alt="Choosing the Right Array, Matrix, or Sequence Algorithm (LeetCode Benchmarks)"
                className="rounded-xl shadow-2xl w-full h-auto object-contain cursor-zoom-in border border-gray-600/70 bg-[#f9f7f1]"
                onClick={() => setLightboxOpen(true)}
              />
            </div>

            <div className="absolute top-4 right-4 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity bg-black/80 px-2.5 py-1 rounded-md text-[11px] text-gray-300 border border-gray-700">
              Click diagram to expand fullscreen
            </div>
          </div>

          {/* Quick Decision Reference Grid & Search */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <span>📌</span> Flowchart Benchmarks & Decision Index ({filteredApproaches.length})
                </h3>
                <span className="text-[11px] text-gray-500">Filter by flowchart category or search problem # / algorithm name</span>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search LC # (e.g. 239) or pattern..."
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.target.value)}
                  className="w-full text-xs bg-black/40 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
                {refSearch && (
                  <button
                    onClick={() => setRefSearch('')}
                    className="absolute right-2.5 top-1.5 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Categories' },
                { id: '1. 2D Matrix', label: '1. 2D Matrix (5)' },
                { id: '2. Sorted Array', label: '2. Sorted Array (2)' },
                { id: '3. Sort + Greedy', label: '3. Sort + Greedy (1)' },
                { id: '4. BS on Feasibility', label: '4. BS on Feasibility (1)' },
                { id: '5. Prefix / Suffix', label: '5. Prefix / Suffix (1)' },
                { id: '6. Contiguous Subarray', label: '6. Subarray & Kadane (3)' },
                { id: '7. Non-Contiguous Subsequence', label: '7. Subsequence & DP (2)' },
                { id: 'Special Requirements', label: 'Special Requirements (8)' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedRefCategory(pill.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    selectedRefCategory === pill.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white/5 text-gray-400 border-gray-800 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredApproaches.map((app) => renderApproachCard(app.key))}
            </div>

            {filteredApproaches.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-xs bg-surface-dark/50 rounded-xl border border-gray-800">
                No algorithm matches found for "{refSearch}". Try searching for problem numbers like 56, 239, 1091, or 739.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Wizard Mode */}
      {activeTab === 'wizard' && (
        <div className="space-y-6">
          {/* Wizard Header & Breadcrumb Trail */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🧭</span> Interactive Flowchart Decision Wizard
              </h3>
              <p className="text-xs text-gray-400">
                Follow the flowchart step-by-step to pinpoint the optimal algorithmic pattern and LeetCode benchmarks.
              </p>
            </div>
            <button
              onClick={resetWizard}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>↺</span> Reset Decisions
            </button>
          </div>

          {/* Breadcrumb Path Tracker */}
          <div className="bg-surface-dark/80 rounded-xl border border-gray-800 p-3 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-gray-400 font-semibold flex items-center gap-1">
              <span>📍</span> Path:
            </span>
            <button
              onClick={() => {
                setIsGrid(null);
                setMatrixSubCategory(null);
                setIsSorted(null);
                setCanSortOrBS(null);
                setHasAccumulation(null);
                setSequenceScope(null);
              }}
              className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
            >
              Start: Problem Input
            </button>

            {isGrid === true && (
              <>
                <span className="text-gray-600">›</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-medium">
                  2D Grid / Matrix
                </span>
              </>
            )}

            {isGrid === false && (
              <>
                <span className="text-gray-600">›</span>
                <button
                  onClick={() => {
                    setIsSorted(null);
                    setCanSortOrBS(null);
                    setHasAccumulation(null);
                    setSequenceScope(null);
                  }}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
                >
                  1D Array / Sequence
                </button>
              </>
            )}

            {isSorted === true && (
              <>
                <span className="text-gray-600">›</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-medium">
                  Sorted Array
                </span>
              </>
            )}

            {isSorted === false && (
              <>
                <span className="text-gray-600">›</span>
                <button
                  onClick={() => {
                    setCanSortOrBS(null);
                    setHasAccumulation(null);
                    setSequenceScope(null);
                  }}
                  className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
                >
                  Unsorted Array
                </button>
              </>
            )}

            {canSortOrBS === 'sort' && (
              <>
                <span className="text-gray-600">›</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium">
                  Sortable (Greedy / 2 Pointers)
                </span>
              </>
            )}

            {canSortOrBS === 'bs-answer' && (
              <>
                <span className="text-gray-600">›</span>
                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-medium">
                  BS on Answer Range
                </span>
              </>
            )}

            {canSortOrBS === 'neither' && (
              <>
                <span className="text-gray-600">›</span>
                <button
                  onClick={() => {
                    setHasAccumulation(null);
                    setSequenceScope(null);
                  }}
                  className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/30 hover:bg-pink-500/20"
                >
                  Index Order Matters
                </button>
              </>
            )}

            {hasAccumulation === true && (
              <>
                <span className="text-gray-600">›</span>
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-medium">
                  Prefix / Suffix Accumulation
                </span>
              </>
            )}

            {hasAccumulation === false && (
              <>
                <span className="text-gray-600">›</span>
                <button
                  onClick={() => {
                    setSequenceScope(null);
                  }}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
                >
                  No Accumulation
                </button>
              </>
            )}

            {sequenceScope && (
              <>
                <span className="text-gray-600">›</span>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 font-medium">
                  {sequenceScope === 'subarray'
                    ? 'Contiguous Subarray'
                    : sequenceScope === 'subsequence'
                    ? 'Non-Contiguous Subsequence'
                    : 'Special Requirement'}
                </span>
              </>
            )}
          </div>

          {/* STEP 1: Diamond 1 - 2D Grid vs 1D Array */}
          <div className="rounded-xl border border-emerald-700/60 bg-surface-dark/70 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-semibold text-white">
                Is the input a 2D Grid / Matrix?
              </h4>
            </div>

            <div className="flex gap-2 pl-8">
              <button
                onClick={() => {
                  setIsGrid(true);
                  setIsSorted(null);
                  setCanSortOrBS(null);
                  setHasAccumulation(null);
                  setSequenceScope(null);
                }}
                className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                  isGrid === true
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-sm'
                    : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                }`}
              >
                ✓ YES (2D Grid / Matrix)
              </button>
              <button
                onClick={() => {
                  setIsGrid(false);
                  setMatrixSubCategory(null);
                }}
                className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                  isGrid === false
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                }`}
              >
                ✗ NO (1D Array / Sequence)
              </button>
            </div>

            {/* If YES: Box 1 (2D Matrix Classification) */}
            {isGrid === true && (
              <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-4">
                <div className="rounded-lg bg-purple-950/20 border border-purple-500/30 p-3">
                  <span className="text-xs font-bold text-purple-300 block mb-1">
                    🟣 Flowchart Box 1: 2D Matrix Classification
                  </span>
                  <p className="text-xs text-gray-300">
                    What is your primary operation or objective on the 2D grid?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { id: 'matrix-bfs', label: 'Shortest path / Unweighted levels / Fire spread', sub: 'Matrix BFS' },
                    { id: 'matrix-dfs', label: 'Connected components / Islands / Flood fill', sub: 'Matrix DFS / Union-Find' },
                    { id: 'matrix-simulation', label: 'Layer-by-layer / In-place rotate / Spiral boundaries', sub: 'Spiral Simulation' },
                    { id: 'matrix-staircase', label: 'Row-wise & Column-wise sorted matrix lookup', sub: 'Staircase Search' },
                    { id: 'matrix-dp', label: 'Path optimization with obstacles (Right/Down moves)', sub: '2D Grid DP' },
                    { id: 'all', label: 'Show all 5 Matrix patterns', sub: 'Full Section 1' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setMatrixSubCategory(btn.id)}
                      className={`p-2.5 text-left rounded-lg border transition-all ${
                        matrixSubCategory === btn.id
                          ? 'border-purple-500 bg-purple-500/20 text-white shadow-sm'
                          : 'border-gray-700 bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-semibold">{btn.sub}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{btn.label}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(matrixSubCategory === 'matrix-bfs' || matrixSubCategory === 'all' || !matrixSubCategory) &&
                    renderApproachCard('matrix-bfs')}
                  {(matrixSubCategory === 'matrix-dfs' || matrixSubCategory === 'all' || !matrixSubCategory) &&
                    renderApproachCard('matrix-dfs')}
                  {(matrixSubCategory === 'matrix-simulation' || matrixSubCategory === 'all') &&
                    renderApproachCard('matrix-simulation')}
                  {(matrixSubCategory === 'matrix-staircase' || matrixSubCategory === 'all') &&
                    renderApproachCard('matrix-staircase')}
                  {(matrixSubCategory === 'matrix-dp' || matrixSubCategory === 'all') &&
                    renderApproachCard('matrix-dp')}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Diamond 2 - Sorted Array */}
          {isGrid === false && (
            <div className="rounded-xl border border-blue-700/60 bg-surface-dark/70 p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Is the input Array Sorted?
                </h4>
              </div>

              <div className="flex gap-2 pl-8">
                <button
                  onClick={() => {
                    setIsSorted(true);
                    setCanSortOrBS(null);
                    setHasAccumulation(null);
                    setSequenceScope(null);
                  }}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                    isSorted === true
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  ✓ YES, it is Sorted
                </button>
                <button
                  onClick={() => {
                    setIsSorted(false);
                    setSortedSubCategory(null);
                  }}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                    isSorted === false
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  ✗ NO, unsorted / arbitrary
                </button>
              </div>

              {/* If YES: Box 2 (Two Pointers / Binary Search) */}
              {isSorted === true && (
                <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-4">
                  <div className="rounded-lg bg-blue-950/20 border border-blue-500/30 p-3">
                    <span className="text-xs font-bold text-blue-300 block mb-1">
                      🔵 Flowchart Box 2: Two Pointers (Sorted Array)
                    </span>
                    <p className="text-xs text-gray-300">
                      Target sum pairing or logarithmic search on monotonic boundaries:
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortedSubCategory('two-pointers')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        sortedSubCategory === 'two-pointers'
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Pairing / Target Sum (Two Pointers)
                    </button>
                    <button
                      onClick={() => setSortedSubCategory('binary-search')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        sortedSubCategory === 'binary-search'
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Target Lookup / Rotated Search (Binary Search)
                    </button>
                    <button
                      onClick={() => setSortedSubCategory(null)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        sortedSubCategory === null
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Show Both
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(sortedSubCategory === 'two-pointers' || sortedSubCategory === null) &&
                      renderApproachCard('two-pointers')}
                    {(sortedSubCategory === 'binary-search' || sortedSubCategory === null) &&
                      renderApproachCard('binary-search')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Diamond 3 - Can we sort or BS on Answer? */}
          {isGrid === false && isSorted === false && (
            <div className="rounded-xl border border-amber-700/60 bg-surface-dark/70 p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Can we sort, or does answer depend on target / range without full sorting?
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-8">
                <button
                  onClick={() => {
                    setCanSortOrBS('sort');
                    setHasAccumulation(null);
                    setSequenceScope(null);
                  }}
                  className={`text-xs p-3 rounded-lg border text-left transition-all ${
                    canSortOrBS === 'sort'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-amber-300 mb-0.5">🟡 Can Sort Without Breaking Problem</div>
                  <div className="text-[11px] text-gray-400">Order doesn't matter (e.g. interval merging, pairing)</div>
                </button>

                <button
                  onClick={() => {
                    setCanSortOrBS('bs-answer');
                    setHasAccumulation(null);
                    setSequenceScope(null);
                  }}
                  className={`text-xs p-3 rounded-lg border text-left transition-all ${
                    canSortOrBS === 'bs-answer'
                      ? 'bg-yellow-500/20 text-yellow-200 border-yellow-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-yellow-300 mb-0.5">🔍 Binary Search on Answer Value</div>
                  <div className="text-[11px] text-gray-400">Monotonic predicate isFeasible(mid) on range [low, high]</div>
                </button>

                <button
                  onClick={() => {
                    setCanSortOrBS('neither');
                  }}
                  className={`text-xs p-3 rounded-lg border text-left transition-all ${
                    canSortOrBS === 'neither'
                      ? 'bg-primary/20 text-primary border-primary shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-white mb-0.5">✗ NO (Order Is Fixed)</div>
                  <div className="text-[11px] text-gray-400">Original relative indices matter & not searching answer</div>
                </button>
              </div>

              {/* If Sortable: Box 3 */}
              {canSortOrBS === 'sort' && (
                <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-3">
                  <div className="rounded-lg bg-amber-950/20 border border-amber-500/30 p-3">
                    <span className="text-xs font-bold text-amber-300 block mb-1">
                      🟡 Flowchart Box 3: Sort + Greedy / Two Pointers
                    </span>
                    <p className="text-xs text-gray-300">
                      Sort in O(n log n), then apply greedy sweeps or opposing pointers:
                    </p>
                  </div>
                  {renderApproachCard('sort-greedy')}
                </div>
              )}

              {/* If BS on Answer: Box 4 */}
              {canSortOrBS === 'bs-answer' && (
                <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-3">
                  <div className="rounded-lg bg-yellow-950/20 border border-yellow-500/30 p-3">
                    <span className="text-xs font-bold text-yellow-300 block mb-1">
                      🟡 Flowchart Box 4: Binary Search on Range / Feasibility
                    </span>
                    <p className="text-xs text-gray-300">
                      Monotonic binary search over possible values:
                    </p>
                  </div>
                  {renderApproachCard('binary-search-range')}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Diamond 4 - Accumulation Left/Right Dependency */}
          {isGrid === false && isSorted === false && canSortOrBS === 'neither' && (
            <div className="rounded-xl border border-pink-700/60 bg-surface-dark/70 p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Does index i depend on accumulation of elements to left and/or right?
                </h4>
              </div>

              <div className="flex gap-2 pl-8">
                <button
                  onClick={() => {
                    setHasAccumulation(true);
                    setSequenceScope(null);
                  }}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                    hasAccumulation === true
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  ✓ YES (Cumulative Dependency)
                </button>
                <button
                  onClick={() => {
                    setHasAccumulation(false);
                  }}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                    hasAccumulation === false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  ✗ NO (No Cumulative Left/Right Dependence)
                </button>
              </div>

              {/* If YES: Box 5 (Prefix / Suffix Accumulation) */}
              {hasAccumulation === true && (
                <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-3">
                  <div className="rounded-lg bg-pink-950/20 border border-pink-500/30 p-3">
                    <span className="text-xs font-bold text-pink-300 block mb-1">
                      🌸 Flowchart Box 5: Prefix / Suffix Accumulation
                    </span>
                    <p className="text-xs text-gray-300">
                      Store running sums in HashMap (Subarray Sum = K) or calculate prefix & suffix arrays (Product Except Self, Trapping Rain Water):
                    </p>
                  </div>
                  {renderApproachCard('prefix-suffix')}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Diamond 5 - Subarray vs Subsequence vs Structural */}
          {isGrid === false && isSorted === false && canSortOrBS === 'neither' && hasAccumulation === false && (
            <div className="rounded-xl border border-purple-700/60 bg-surface-dark/70 p-4 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center">
                  5
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Is it asking for Subarray, Subsequence, or Window?
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-8">
                <button
                  onClick={() => {
                    setSequenceScope('subarray');
                    setSpecialReq(null);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    sequenceScope === 'subarray'
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-emerald-300 mb-0.5">🟩 Contiguous Subarray</div>
                  <div className="text-[11px] text-gray-400">Sliding Window, Monotonic Deque, or Kadane's</div>
                </button>

                <button
                  onClick={() => {
                    setSequenceScope('subsequence');
                    setSpecialReq(null);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    sequenceScope === 'subsequence'
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-purple-300 mb-0.5">🟪 Non-Contiguous Subsequence / Subset</div>
                  <div className="text-[11px] text-gray-400">Dynamic Programming (DP) or Backtracking</div>
                </button>

                <button
                  onClick={() => {
                    setSequenceScope('neither');
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    sequenceScope === 'neither'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-gray-700 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-amber-300 mb-0.5">⚡ Neither (Structural / Special Requirements)</div>
                  <div className="text-[11px] text-gray-400">Stack, Graph, Intervals, Heap, DSU, Trees, Voting</div>
                </button>
              </div>

              {/* BRANCH 1: Contiguous Subarray (Box 6) */}
              {sequenceScope === 'subarray' && (
                <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-4">
                  <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-3">
                    <span className="text-xs font-bold text-emerald-300 block mb-1">
                      🟢 Flowchart Box 6: Sliding Window / Kadane's
                    </span>
                    <p className="text-xs text-gray-300">
                      Which specific contiguous condition applies?
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSubarrayGoal('window')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        subarrayGoal === 'window'
                          ? 'border-emerald-500 bg-emerald-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Dynamic Valid Window / At Most K Distinct / Sum Condition
                    </button>
                    <button
                      onClick={() => setSubarrayGoal('deque')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        subarrayGoal === 'deque'
                          ? 'border-emerald-500 bg-emerald-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Sliding Window Maximum / Local Extrema (Size K)
                    </button>
                    <button
                      onClick={() => setSubarrayGoal('kadane')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        subarrayGoal === 'kadane'
                          ? 'border-emerald-500 bg-emerald-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Max/Min Contiguous Sum (with Negatives)
                    </button>
                    <button
                      onClick={() => setSubarrayGoal(null)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        subarrayGoal === null
                          ? 'border-emerald-500 bg-emerald-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Show All 3
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(subarrayGoal === 'window' || subarrayGoal === null) &&
                      renderApproachCard('sliding-window')}
                    {(subarrayGoal === 'deque' || subarrayGoal === null) &&
                      renderApproachCard('monotonic-queue')}
                    {(subarrayGoal === 'kadane' || subarrayGoal === null) &&
                      renderApproachCard('kadane')}
                  </div>
                </div>
              )}

              {/* BRANCH 2: Non-Contiguous Subsequence / Subset (Box 7) */}
              {sequenceScope === 'subsequence' && (
                <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-4">
                  <div className="rounded-lg bg-purple-950/20 border border-purple-500/30 p-3">
                    <span className="text-xs font-bold text-purple-300 block mb-1">
                      🟣 Flowchart Box 7: Non-Contiguous Subsequence / Subset
                    </span>
                    <p className="text-xs text-gray-300">
                      Do you need optimal value/counts (DP) or generating all explicit combinations (Backtracking)?
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSubseqGoal('dp')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        subseqGoal === 'dp'
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Optimal Length / Max Profit / Counting (DP)
                    </button>
                    <button
                      onClick={() => setSubseqGoal('backtracking')}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        subseqGoal === 'backtracking'
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Generate / Print / Enumerate All (Backtracking)
                    </button>
                    <button
                      onClick={() => setSubseqGoal(null)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        subseqGoal === null
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-gray-700 bg-white/5 text-gray-300'
                      }`}
                    >
                      Show Both
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(subseqGoal === 'dp' || subseqGoal === null) &&
                      renderApproachCard('dp')}
                    {(subseqGoal === 'backtracking' || subseqGoal === null) &&
                      renderApproachCard('backtracking')}
                  </div>
                </div>
              )}

              {/* BRANCH 3: Neither -> Special Requirements Dispatcher */}
              {sequenceScope === 'neither' && (
                <div className="mt-4 pl-8 pt-3 border-t border-gray-800 space-y-4">
                  <div className="rounded-lg bg-amber-950/20 border border-amber-500/30 p-3">
                    <span className="text-xs font-bold text-amber-300 block mb-1">
                      🔶 Flowchart Bottom: What is the Special Requirement?
                    </span>
                    <p className="text-xs text-gray-300">
                      Select the distinctive property of your sequence problem:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                      { id: 'monotonic-stack', title: 'Next Greater/Smaller or Histogram Area', sub: 'Monotonic Stack (LC #739, #84)' },
                      { id: 'topological-sort', title: 'Prerequisites, Task Ordering, or Cycle', sub: "Topological Sort / Kahn's BFS (LC #207)" },
                      { id: 'segment-tree', title: 'Range Updates & Frequent Queries', sub: 'Segment Tree / Fenwick (LC #307)' },
                      { id: 'hash-window', title: 'Cart Report / Distance K Duplicate', sub: 'Sliding Window + Hash Set (LC #219)' },
                      { id: 'heap', title: 'Dynamic Top K / Continuous Median', sub: 'Heap / Priority Queue (LC #215, #295)' },
                      { id: 'intervals', title: 'Overlapping Intervals / Events', sub: 'Line Sweep / Difference Array (LC #56, #253)' },
                      { id: 'union-find', title: 'Dynamic Connectivity / Group Merging', sub: 'Union-Find / DSU (LC #128, #684)' },
                      { id: 'boyer-moore', title: 'Majority Element / O(1) Space Frequency', sub: 'Boyer-Moore Voting (LC #169)' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSpecialReq(specialReq === item.id ? null : item.id)}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          specialReq === item.id
                            ? 'border-amber-400 bg-amber-500/20 text-white shadow-md'
                            : 'border-gray-700 bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                        <div className="text-[11px] text-gray-400">{item.sub}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    {specialReq ? (
                      renderApproachCard(specialReq)
                    ) : (
                      <div className="p-3 bg-black/30 rounded-lg text-xs text-gray-400 text-center border border-gray-800">
                        Click any special requirement tile above to reveal its benchmark details and LeetCode problems.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-3 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm">Choosing the Right Array, Matrix, or Sequence Algorithm</span>
              <span className="text-xs text-gray-400 hidden sm:inline">• Fullscreen High-Resolution Flowchart</span>
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
                href="/ds-algorithm-flowchart.png"
                download="DS_Algorithm_Flowchart.png"
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

          {/* Lightbox Scroll Viewport */}
          <div
            className="flex-1 overflow-auto flex justify-center items-start p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="transition-transform duration-200 origin-top flex justify-center max-w-4xl lg:max-w-5xl w-full"
              style={{ transform: `scale(${lightboxZoom})`, transformOrigin: 'top center' }}
            >
              <img
                src="/ds-algorithm-flowchart.png"
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
