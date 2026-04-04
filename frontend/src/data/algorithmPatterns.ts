export interface AlgorithmPattern {
  id: string;
  name: string;
  category: 'Array' | 'Tree' | 'Graph' | 'String' | 'DP' | 'Heap' | 'Other';
  description: string;
  whenToUse: string[];
  timeComplexity: string;
  spaceComplexity: string;
  template: string;
  problems: { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; id: string }[];
}

export const algorithmPatterns: AlgorithmPattern[] = [
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Array',
    description:
      'Maintain a window of elements that satisfies a condition. Expand the window by moving the right pointer and shrink it by moving the left pointer. Avoids recomputing overlapping sub-arrays.',
    whenToUse: [
      'Find max/min subarray/substring of size k',
      'Longest substring with at most k distinct characters',
      'Problems with contiguous subarrays or substrings',
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) or O(k)',
    template: `function slidingWindow(nums: number[], k: number): number {
  let left = 0, result = 0, windowSum = 0;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];          // expand window

    while (/* window is invalid */) {
      windowSum -= nums[left];         // shrink window
      left++;
    }

    result = Math.max(result, windowSum);
  }
  return result;
}`,
    problems: [
      { id: 'max-subarray-k', title: 'Maximum Sum Subarray of Size K', difficulty: 'Easy' },
      { id: 'longest-substring-k-distinct', title: 'Longest Substring with K Distinct Chars', difficulty: 'Medium' },
      { id: 'min-window-substring', title: 'Minimum Window Substring', difficulty: 'Hard' },
      { id: 'permutation-in-string', title: 'Permutation in String', difficulty: 'Medium' },
    ],
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Array',
    description:
      'Use two indices moving towards each other (or in the same direction) to reduce O(n²) brute force to O(n). Works best on sorted arrays.',
    whenToUse: [
      'Find a pair/triplet in a sorted array that sums to a target',
      'Remove duplicates from sorted array in-place',
      'Reverse an array or string',
      'Squaring/merging sorted arrays',
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    template: `function twoPointers(nums: number[], target: number): number[] {
  let left = 0, right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
    problems: [
      { id: 'two-sum-sorted', title: 'Two Sum II (Sorted Array)', difficulty: 'Medium' },
      { id: 'three-sum', title: '3Sum', difficulty: 'Medium' },
      { id: 'container-most-water', title: 'Container With Most Water', difficulty: 'Medium' },
      { id: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard' },
    ],
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    category: 'Other',
    description:
      "Floyd's cycle detection. A slow pointer moves one step and a fast pointer moves two steps. If they meet, there's a cycle. Used in linked lists and arrays.",
    whenToUse: [
      'Detect a cycle in a linked list',
      'Find the start of a cycle',
      'Find the middle of a linked list',
      'Check if a number is a happy number',
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    template: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;  // cycle detected
  }
  return false;
}`,
    problems: [
      { id: 'linked-list-cycle', title: 'Linked List Cycle', difficulty: 'Easy' },
      { id: 'linked-list-cycle-ii', title: 'Linked List Cycle II (find start)', difficulty: 'Medium' },
      { id: 'middle-linked-list', title: 'Middle of the Linked List', difficulty: 'Easy' },
      { id: 'happy-number', title: 'Happy Number', difficulty: 'Easy' },
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Array',
    description:
      'Halve the search space at each step by comparing the midpoint. Can be applied to any monotonic function, not just sorted arrays.',
    whenToUse: [
      'Search in a sorted array',
      'Find the first/last position of a value',
      'Search in a rotated sorted array',
      'Minimize/maximize a value subject to a condition (binary search on answer)',
    ],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    template: `function binarySearch(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    problems: [
      { id: 'binary-search-basic', title: 'Binary Search', difficulty: 'Easy' },
      { id: 'search-rotated', title: 'Search in Rotated Sorted Array', difficulty: 'Medium' },
      { id: 'find-min-rotated', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium' },
      { id: 'median-two-sorted', title: 'Median of Two Sorted Arrays', difficulty: 'Hard' },
    ],
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Graph',
    description:
      'Explore all neighbors at the current depth before going deeper. Uses a queue. Finds shortest path in unweighted graphs.',
    whenToUse: [
      'Shortest path in unweighted graph/grid',
      'Level-order tree traversal',
      'Minimum number of steps/moves',
      'Word ladder / graph distance problems',
    ],
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    template: `function bfs(graph: Map<number, number[]>, start: number): number[] {
  const visited = new Set<number>();
  const queue: number[] = [start];
  const result: number[] = [];
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}`,
    problems: [
      { id: 'binary-tree-level-order', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium' },
      { id: 'word-ladder', title: 'Word Ladder', difficulty: 'Hard' },
      { id: 'rotting-oranges', title: 'Rotting Oranges', difficulty: 'Medium' },
      { id: 'shortest-path-binary-matrix', title: 'Shortest Path in Binary Matrix', difficulty: 'Medium' },
    ],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Graph',
    description:
      'Explore as deep as possible before backtracking. Uses recursion (or explicit stack). Essential for path-finding, cycle detection, and topological sort.',
    whenToUse: [
      'Path existence in a graph/grid',
      'Number of connected components / islands',
      'Topological sort (DAG)',
      'Detect cycles in directed/undirected graphs',
    ],
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V) recursion stack',
    template: `function dfs(graph: Map<number, number[]>, node: number, visited: Set<number>): void {
  visited.add(node);
  // process node

  for (const neighbor of graph.get(node) ?? []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
    problems: [
      { id: 'number-of-islands', title: 'Number of Islands', difficulty: 'Medium' },
      { id: 'pacific-atlantic', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium' },
      { id: 'course-schedule', title: 'Course Schedule (Topo Sort)', difficulty: 'Medium' },
      { id: 'clone-graph', title: 'Clone Graph', difficulty: 'Medium' },
    ],
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    category: 'DP',
    description:
      'Break a problem into overlapping subproblems and store results to avoid recomputation. Two styles: top-down (memoization) and bottom-up (tabulation).',
    whenToUse: [
      'Optimization: min/max cost, count of ways',
      'Subproblems overlap and have optimal substructure',
      'Fibonacci-like recurrences',
      'Subsequence/substring problems (LCS, LIS)',
    ],
    timeComplexity: 'O(n²) or better depending on problem',
    spaceComplexity: 'O(n) to O(n²)',
    template: `// Bottom-up tabulation example: 0/1 Knapsack
function knapsack(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w]; // skip item
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][W];
}`,
    problems: [
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy' },
      { id: 'coin-change', title: 'Coin Change', difficulty: 'Medium' },
      { id: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence', difficulty: 'Medium' },
      { id: 'edit-distance', title: 'Edit Distance', difficulty: 'Hard' },
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'Other',
    description:
      'Build up a solution incrementally and abandon (backtrack) as soon as a constraint is violated. Used for combinations, permutations, and constraint satisfaction.',
    whenToUse: [
      'Generate all subsets/permutations/combinations',
      'N-Queens, Sudoku solver',
      'Word search in a grid',
      'Any problem requiring exhaustive search with pruning',
    ],
    timeComplexity: 'O(2ⁿ) or O(n!) depending on choices',
    spaceComplexity: 'O(n) recursion stack',
    template: `function backtrack(result: number[][], current: number[], start: number, nums: number[]): void {
  result.push([...current]);          // record candidate

  for (let i = start; i < nums.length; i++) {
    current.push(nums[i]);            // choose
    backtrack(result, current, i + 1, nums);
    current.pop();                    // unchoose (backtrack)
  }
}`,
    problems: [
      { id: 'subsets', title: 'Subsets', difficulty: 'Medium' },
      { id: 'permutations', title: 'Permutations', difficulty: 'Medium' },
      { id: 'combination-sum', title: 'Combination Sum', difficulty: 'Medium' },
      { id: 'n-queens', title: 'N-Queens', difficulty: 'Hard' },
    ],
  },
  {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    category: 'Array',
    description:
      'Sort intervals by start time, then merge overlapping ones. Also useful for inserting into an interval list or finding gaps.',
    whenToUse: [
      'Merge overlapping intervals',
      'Insert a new interval into a sorted list',
      'Find free time between meetings',
      'Minimum number of platforms/rooms needed',
    ],
    timeComplexity: 'O(n log n) due to sort',
    spaceComplexity: 'O(n)',
    template: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);  // merge
    } else {
      result.push(intervals[i]);
    }
  }
  return result;
}`,
    problems: [
      { id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium' },
      { id: 'insert-interval', title: 'Insert Interval', difficulty: 'Medium' },
      { id: 'non-overlapping-intervals', title: 'Non-Overlapping Intervals', difficulty: 'Medium' },
      { id: 'meeting-rooms-ii', title: 'Meeting Rooms II', difficulty: 'Medium' },
    ],
  },
  {
    id: 'top-k-elements',
    name: 'Top K Elements',
    category: 'Heap',
    description:
      'Use a min-heap of size k. For each new element, if larger than the heap root, replace it. The heap always holds the k largest elements.',
    whenToUse: [
      'Find K most frequent elements',
      'K closest points to origin',
      'K-th largest/smallest in a stream',
      'Merge K sorted lists',
    ],
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    template: `// Using a min-heap (simulated with sort for clarity)
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}`,
    problems: [
      { id: 'kth-largest-element', title: 'Kth Largest Element in an Array', difficulty: 'Medium' },
      { id: 'top-k-frequent', title: 'Top K Frequent Elements', difficulty: 'Medium' },
      { id: 'k-closest-points', title: 'K Closest Points to Origin', difficulty: 'Medium' },
      { id: 'merge-k-sorted', title: 'Merge K Sorted Lists', difficulty: 'Hard' },
    ],
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'Array',
    description:
      'Maintain a stack in strictly increasing or decreasing order. When a new element breaks the order, pop elements and process them before pushing.',
    whenToUse: [
      'Next greater/smaller element',
      'Largest rectangle in histogram',
      'Daily temperatures',
      'Stock span problem',
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    template: `function nextGreaterElement(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = [];  // stores indices

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      result[idx] = nums[i];  // nums[i] is the next greater for idx
    }
    stack.push(i);
  }
  return result;
}`,
    problems: [
      { id: 'daily-temperatures', title: 'Daily Temperatures', difficulty: 'Medium' },
      { id: 'largest-rectangle-histogram', title: 'Largest Rectangle in Histogram', difficulty: 'Hard' },
      { id: 'next-greater-element', title: 'Next Greater Element I', difficulty: 'Easy' },
      { id: 'trapping-rain-water-stack', title: 'Trapping Rain Water', difficulty: 'Hard' },
    ],
  },
  {
    id: 'trie',
    name: 'Trie (Prefix Tree)',
    category: 'String',
    description:
      'A tree where each node represents a character. Efficient for prefix-based operations on strings. Each path from root to a marked node forms a word.',
    whenToUse: [
      'Autocomplete / typeahead search',
      'Word dictionary with prefix search',
      'Longest common prefix',
      'Word search II (multiple word search in grid)',
    ],
    timeComplexity: 'O(m) per operation where m = word length',
    spaceComplexity: 'O(m × n) for n words',
    template: `class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return node.isEnd;
  }
}`,
    problems: [
      { id: 'implement-trie', title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium' },
      { id: 'word-search-ii', title: 'Word Search II', difficulty: 'Hard' },
      { id: 'design-add-search', title: 'Design Add and Search Words', difficulty: 'Medium' },
    ],
  },
];
