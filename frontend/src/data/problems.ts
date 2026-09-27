export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  patterns: string[];   // algorithm pattern IDs
  tags: string[];
  description: string;
  hints: string[];
  examples: Example[];
  leetcodeNumber?: number;
}

export const problems: Problem[] = [
  // Sliding Window
  {
    id: 'max-subarray-k',
    title: 'Maximum Sum Subarray of Size K',
    difficulty: 'Easy',
    patterns: ['sliding-window'],
    tags: ['Array', 'Sliding Window'],
    description: 'Given an array of positive numbers and a positive number k, find the maximum sum of any contiguous subarray of size k.',
    hints: ['Keep a running sum of the current window', 'Slide by adding the next element and removing the first'],
    examples: [
      { input: 'arr = [2, 1, 5, 1, 3, 2], k = 3', output: '9', explanation: 'Subarray [5, 1, 3] has the maximum sum.' },
      { input: 'arr = [2, 3, 4, 1, 5], k = 2', output: '7', explanation: 'Subarray [3, 4] has the maximum sum.' },
    ],
    leetcodeNumber: undefined,
  },
  {
    id: 'longest-substring-k-distinct',
    title: 'Longest Substring with K Distinct Characters',
    difficulty: 'Medium',
    patterns: ['sliding-window'],
    tags: ['String', 'Hash Map', 'Sliding Window'],
    description: 'Given a string, find the length of the longest substring that has no more than K distinct characters.',
    hints: ['Use a frequency map to track characters in the window', 'Shrink the window when distinct count exceeds k'],
    examples: [
      { input: 's = "araaci", k = 2', output: '4', explanation: 'Longest substring with 2 distinct chars is "araa".' },
      { input: 's = "araaci", k = 1', output: '2', explanation: 'Longest substring with 1 distinct char is "aa".' },
    ],
    leetcodeNumber: 340,
  },
  {
    id: 'min-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    patterns: ['sliding-window'],
    tags: ['String', 'Hash Map', 'Sliding Window'],
    description: 'Given strings s and t, return the minimum window substring of s that contains all characters of t.',
    hints: ['Two frequency maps: target and window', 'Track how many characters are "satisfied"', 'Shrink from left when all satisfied'],
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The minimum window containing A, B, C is "BANC".' },
      { input: 's = "a", t = "a"', output: '"a"' },
    ],
    leetcodeNumber: 76,
  },
  {
    id: 'permutation-in-string',
    title: 'Permutation in String',
    difficulty: 'Medium',
    patterns: ['sliding-window'],
    tags: ['String', 'Sliding Window'],
    description: 'Given strings s1 and s2, return true if s2 contains a permutation of s1.',
    hints: ['Fixed window of size s1.length', 'Compare character frequencies'],
    examples: [
      { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', explanation: 's2 contains permutation "ba" starting at index 3.' },
      { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false' },
    ],
    leetcodeNumber: 567,
  },
  // Two Pointers
  {
    id: 'two-sum-sorted',
    title: 'Two Sum II',
    difficulty: 'Medium',
    patterns: ['two-pointers'],
    tags: ['Array', 'Two Pointers', 'Binary Search'],
    description: 'Given a 1-indexed sorted array, find two numbers that add up to a given target.',
    hints: ['Array is sorted — left pointer from start, right from end', 'Move pointers based on sum vs target'],
    examples: [
      { input: 'numbers = [2, 7, 11, 15], target = 9', output: '[1, 2]', explanation: 'numbers[1] + numbers[2] = 2 + 7 = 9.' },
      { input: 'numbers = [2, 3, 4], target = 6', output: '[1, 3]' },
    ],
    leetcodeNumber: 167,
  },
  {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'Medium',
    patterns: ['two-pointers'],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    description: 'Given an array, return all unique triplets that sum to zero.',
    hints: ['Sort the array first', 'Fix one element and use two pointers for the rest', 'Skip duplicates'],
    examples: [
      { input: 'nums = [-1, 0, 1, 2, -1, -4]', output: '[[-1, -1, 2], [-1, 0, 1]]' },
      { input: 'nums = [0, 1, 1]', output: '[]' },
    ],
    leetcodeNumber: 15,
  },
  {
    id: 'container-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    patterns: ['two-pointers'],
    tags: ['Array', 'Two Pointers', 'Greedy'],
    description: 'Given n heights, find two lines that form a container holding the most water.',
    hints: ['Start with widest possible container', 'Move pointer pointing to shorter line'],
    examples: [
      { input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]', output: '49', explanation: 'Lines at index 1 and 8 form container of area 49.' },
      { input: 'height = [1, 1]', output: '1' },
    ],
    leetcodeNumber: 11,
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    patterns: ['two-pointers', 'monotonic-stack'],
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    description: 'Given elevation heights, compute total water that can be trapped.',
    hints: ['Water at each position = min(maxLeft, maxRight) - height', 'Two pointers move from the lower side'],
    examples: [
      { input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', output: '6' },
      { input: 'height = [4, 2, 0, 3, 2, 5]', output: '9' },
    ],
    leetcodeNumber: 42,
  },
  // Fast & Slow Pointers
  {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    patterns: ['fast-slow-pointers'],
    tags: ['Linked List', 'Two Pointers'],
    description: 'Given head of a linked list, determine if it has a cycle.',
    hints: ['Fast pointer moves 2x speed', 'If cycle exists they will meet'],
    examples: [
      { input: 'head = [3, 2, 0, -4], pos = 1', output: 'true', explanation: 'Tail connects to node at index 1 forming a cycle.' },
      { input: 'head = [1, 2], pos = -1', output: 'false', explanation: 'No cycle; tail does not connect to any node.' },
    ],
    leetcodeNumber: 141,
  },
  {
    id: 'linked-list-cycle-ii',
    title: 'Linked List Cycle II',
    difficulty: 'Medium',
    patterns: ['fast-slow-pointers'],
    tags: ['Linked List', 'Two Pointers'],
    description: 'Return the node where the cycle begins, or null if no cycle.',
    hints: ['After meeting, reset one pointer to head', 'Move both at speed 1 — they meet at cycle start'],
    examples: [
      { input: 'head = [3, 2, 0, -4], pos = 1', output: 'Node with value 2', explanation: 'Cycle starts at index 1 (value 2).' },
      { input: 'head = [1, 2], pos = 0', output: 'Node with value 1', explanation: 'Cycle starts at index 0 (value 1).' },
    ],
    leetcodeNumber: 142,
  },
  {
    id: 'happy-number',
    title: 'Happy Number',
    difficulty: 'Easy',
    patterns: ['fast-slow-pointers'],
    tags: ['Math', 'Hash Set', 'Two Pointers'],
    description: 'Determine if a number is "happy" (repeatedly summing digit squares eventually reaches 1).',
    hints: ['Treat the sequence as a linked list — cycles can be detected with fast/slow'],
    examples: [
      { input: 'n = 19', output: 'true', explanation: '1² + 9² = 82 → 8² + 2² = 68 → ... → 1.' },
      { input: 'n = 2', output: 'false', explanation: 'Sequence enters a cycle that never reaches 1.' },
    ],
    leetcodeNumber: 202,
  },
  // Binary Search
  {
    id: 'binary-search-basic',
    title: 'Binary Search',
    difficulty: 'Easy',
    patterns: ['binary-search'],
    tags: ['Array', 'Binary Search'],
    description: 'Given a sorted array, return the index of target or -1.',
    hints: ['lo + Math.floor((hi - lo) / 2) avoids overflow'],
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 exists at index 4.' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: '2 does not exist in the array.' },
    ],
    leetcodeNumber: 704,
  },
  {
    id: 'search-rotated',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    patterns: ['binary-search'],
    tags: ['Array', 'Binary Search'],
    description: 'Search for a target in a rotated sorted array with distinct values.',
    hints: ['One half is always sorted', 'Check if target is in the sorted half, else go to the other'],
    examples: [
      { input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4', explanation: '0 is at index 4.' },
      { input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3', output: '-1', explanation: '3 is not in the array.' },
    ],
    leetcodeNumber: 33,
  },
  {
    id: 'find-min-rotated',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    patterns: ['binary-search'],
    tags: ['Array', 'Binary Search'],
    description: 'Find the minimum element in a rotated sorted array with distinct values.',
    hints: ['Compare mid with right to determine which side the minimum is on'],
    examples: [
      { input: 'nums = [3, 4, 5, 1, 2]', output: '1', explanation: 'The minimum element is 1.' },
      { input: 'nums = [4, 5, 6, 7, 0, 1, 2]', output: '0' },
    ],
    leetcodeNumber: 153,
  },
  // BFS
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    patterns: ['bfs'],
    tags: ['Tree', 'BFS'],
    description: 'Return the level-order traversal of a binary tree as a list of lists.',
    hints: ['Track queue size at start of each level'],
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]' },
      { input: 'root = [1]', output: '[[1]]' },
    ],
    leetcodeNumber: 102,
  },
  {
    id: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    patterns: ['bfs'],
    tags: ['Array', 'BFS', 'Matrix'],
    description: 'Find the minimum minutes until no fresh orange remains, given rotten oranges spread each minute.',
    hints: ['Multi-source BFS starting from all rotten oranges simultaneously'],
    examples: [
      { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4', explanation: 'All fresh oranges rot after 4 minutes.' },
      { input: 'grid = [[0,2]]', output: '0', explanation: 'No fresh oranges to rot.' },
    ],
    leetcodeNumber: 994,
  },
  // DFS
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    patterns: ['dfs', 'bfs'],
    tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'],
    description: 'Count the number of islands in a 2D binary grid.',
    hints: ['DFS/BFS from each unvisited land cell', 'Mark visited cells to avoid reprocessing'],
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2' },
      { input: 'grid = [["1","1","1"],["0","1","0"],["1","1","1"]]', output: '1' },
    ],
    leetcodeNumber: 200,
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    patterns: ['dfs', 'bfs'],
    tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'],
    description: 'Determine if you can finish all courses given prerequisites (detect cycle in directed graph).',
    hints: ['Build adjacency list', 'Topological sort — if possible then no cycle'],
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1, 0]]', output: 'true', explanation: 'Take course 0 first, then course 1.' },
      { input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]', output: 'false', explanation: 'Circular dependency: cannot finish.' },
    ],
    leetcodeNumber: 207,
  },
  // Dynamic Programming
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    patterns: ['dynamic-programming'],
    tags: ['Math', 'DP', 'Memoization'],
    description: 'Count distinct ways to climb n stairs (1 or 2 steps at a time).',
    hints: ['dp[n] = dp[n-1] + dp[n-2]', 'Same as Fibonacci'],
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
    ],
    leetcodeNumber: 70,
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    patterns: ['dynamic-programming'],
    tags: ['Array', 'DP', 'BFS'],
    description: 'Find the minimum number of coins that make up an amount.',
    hints: ['dp[i] = min coins to make amount i', 'dp[0] = 0, rest Infinity, then fill up'],
    examples: [
      { input: 'coins = [1, 5, 11], amount = 15', output: '3', explanation: '5 + 5 + 5 = 15 using 3 coins.' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make 3 with only coin of denomination 2.' },
    ],
    leetcodeNumber: 322,
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    patterns: ['dynamic-programming', 'binary-search'],
    tags: ['Array', 'DP', 'Binary Search'],
    description: 'Find the length of the longest strictly increasing subsequence.',
    hints: ['O(n²) DP or O(n log n) with patience sorting + binary search'],
    examples: [
      { input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', output: '4', explanation: '[2, 3, 7, 101] is the longest increasing subsequence.' },
      { input: 'nums = [0, 1, 0, 3, 2, 3]', output: '4' },
    ],
    leetcodeNumber: 300,
  },
  // Backtracking
  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    patterns: ['backtracking'],
    tags: ['Array', 'Backtracking', 'Bit Manipulation'],
    description: 'Return all possible subsets of a set of distinct integers.',
    hints: ['At each step choose to include or skip the current element'],
    examples: [
      { input: 'nums = [1, 2, 3]', output: '[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]' },
      { input: 'nums = [0]', output: '[[], [0]]' },
    ],
    leetcodeNumber: 78,
  },
  {
    id: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    patterns: ['backtracking'],
    tags: ['Array', 'Backtracking'],
    description: 'Find all combinations of candidates that sum to a target (reuse allowed).',
    hints: ['Sort candidates', 'Prune when running sum exceeds target', 'Pass index to avoid duplicates'],
    examples: [
      { input: 'candidates = [2, 3, 6, 7], target = 7', output: '[[2, 2, 3], [7]]' },
      { input: 'candidates = [2, 3, 5], target = 8', output: '[[2, 2, 2, 2], [2, 3, 3], [3, 5]]' },
    ],
    leetcodeNumber: 39,
  },
  // Merge Intervals
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    patterns: ['merge-intervals'],
    tags: ['Array', 'Sorting'],
    description: 'Merge all overlapping intervals and return the non-overlapping result.',
    hints: ['Sort by start time', 'Merge if current start ≤ last end'],
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap → merged to [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: '[1,4] and [4,5] share endpoint → merged.' },
    ],
    leetcodeNumber: 56,
  },
  {
    id: 'meeting-rooms-ii',
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    patterns: ['merge-intervals', 'top-k-elements'],
    tags: ['Array', 'Sorting', 'Heap', 'Greedy'],
    description: 'Find the minimum number of conference rooms required.',
    hints: ['Sort by start', 'Min-heap of end times — if top ≤ current start, reuse room'],
    examples: [
      { input: 'intervals = [[0,30],[5,10],[15,20]]', output: '2', explanation: 'Meeting [0,30] overlaps with [5,10] and [15,20], but [5,10] and [15,20] can share a room.' },
      { input: 'intervals = [[7,10],[2,4]]', output: '1', explanation: 'No overlap between meetings.' },
    ],
    leetcodeNumber: 253,
  },
  // Top K Elements
  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    patterns: ['top-k-elements'],
    tags: ['Array', 'Divide and Conquer', 'Heap', 'Quickselect'],
    description: 'Find the kth largest element in an unsorted array.',
    hints: ['Min-heap of size k', 'Or use Quickselect for O(n) average'],
    examples: [
      { input: 'nums = [3, 2, 1, 5, 6, 4], k = 2', output: '5', explanation: '5 is the 2nd largest element.' },
      { input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4', output: '4' },
    ],
    leetcodeNumber: 215,
  },
  {
    id: 'top-k-frequent',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    patterns: ['top-k-elements'],
    tags: ['Array', 'Hash Table', 'Bucket Sort', 'Heap'],
    description: 'Return the k most frequent elements in an array.',
    hints: ['Count frequencies with a map', 'Use min-heap or bucket sort'],
    examples: [
      { input: 'nums = [1, 1, 1, 2, 2, 3], k = 2', output: '[1, 2]' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    leetcodeNumber: 347,
  },
  // Monotonic Stack
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    patterns: ['monotonic-stack'],
    tags: ['Array', 'Stack', 'Monotonic Stack'],
    description: 'For each day, find how many days until a warmer temperature.',
    hints: ['Monotonic decreasing stack of indices', 'When current day is warmer, pop and record distance'],
    examples: [
      { input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]', output: '[1, 1, 4, 2, 1, 1, 0, 0]' },
      { input: 'temperatures = [30, 40, 50, 60]', output: '[1, 1, 1, 0]' },
    ],
    leetcodeNumber: 739,
  },
  {
    id: 'largest-rectangle-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    patterns: ['monotonic-stack'],
    tags: ['Array', 'Stack', 'Monotonic Stack'],
    description: 'Find the area of the largest rectangle in a histogram.',
    hints: ['Monotonic increasing stack', 'Pop when shorter bar found, compute area with popped bar as height'],
    examples: [
      { input: 'heights = [2, 1, 5, 6, 2, 3]', output: '10', explanation: 'Largest rectangle has area 10 (bars of height 5 and 6).' },
      { input: 'heights = [2, 4]', output: '4' },
    ],
    leetcodeNumber: 84,
  },
  // Trie
  {
    id: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    patterns: ['trie'],
    tags: ['Hash Table', 'String', 'Design', 'Trie'],
    description: 'Implement a Trie with insert, search, and startsWith operations.',
    hints: ['Each TrieNode has a children map and an isEnd flag'],
    examples: [
      { input: 'insert("apple"), search("apple")', output: 'true' },
      { input: 'search("app")', output: 'false', explanation: '"app" was not inserted.' },
      { input: 'startsWith("app")', output: 'true', explanation: '"apple" starts with "app".' },
    ],
    leetcodeNumber: 208,
  },
  {
    id: 'word-search-ii',
    title: 'Word Search II',
    difficulty: 'Hard',
    patterns: ['trie', 'backtracking', 'dfs'],
    tags: ['Array', 'String', 'DFS', 'Backtracking', 'Trie', 'Matrix'],
    description: 'Find all words from a dictionary that exist in a 2D character board.',
    hints: ['Build a Trie from all words', 'DFS on board — follow Trie to prune invalid paths'],
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat", "oath"]' },
      { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]', explanation: '"abcb" requires revisiting a cell.' },
    ],
    leetcodeNumber: 212,
  },

  // ── PayPay Interview Questions ────────────────────────────────────────────

  {
    id: 'paypay-denomination-breakdown',
    title: 'Song Denomination Breakdown (PayPay)',
    difficulty: 'Medium',
    patterns: ['dynamic-programming'],
    tags: ['Greedy', 'DP', 'Hash Map', 'Interview'],
    description:
      'You are given named coin denominations: A=100, B=150, C=250, D=170. ' +
      'Given an array of target amounts, find the FIRST target amount that can be ' +
      'formed using those denominations (i.e. is reachable), and return the ' +
      'denomination breakdown showing how many of each coin is used.\n\n' +
      'Approach:\n' +
      '1. For each target in the array, run a greedy largest-first pass over ' +
      'denominations sorted descending.\n' +
      '2. The first target for which the greedy covers the total exactly is your answer.\n' +
      '3. Return the count per denomination, e.g. A:1, B:0, C:0, D:0 for target 100.',
    hints: [
      'Sort denominations descending: C=250, D=170, B=150, A=100',
      'For each target, greedily subtract the largest denomination that fits',
      'If remainder reaches 0 the target is reachable — stop and return counts',
      'If no denomination fits and remainder > 0 the target is not reachable — try next',
      'Edge: denominations may not cleanly divide every target (e.g. 30 is not reachable with only these coins)',
    ],
    examples: [
      {
        input: 'denominations = {A:100, B:150, C:250, D:170}, targets = [100, 30, 10]',
        output: '100 → A:1, B:0, C:0, D:0',
        explanation: '100 is the first reachable target. 30 and 10 cannot be formed.',
      },
      {
        input: 'denominations = {A:100, B:150, C:250, D:170}, targets = [420, 100]',
        output: '420 → A:0, B:0, C:1, D:1',
        explanation: '420 = 250 + 170. The breakdown is C:1, D:1.',
      },
    ],
  },

  {
    id: 'paypay-rotting-trees',
    title: 'Rotting Trees — Count After N Days (PayPay)',
    difficulty: 'Medium',
    patterns: ['bfs'],
    tags: ['BFS', 'Matrix', 'Multi-source BFS', 'Interview'],
    description:
      'You are given a grid of trees where each cell is 0 (empty), 1 (fresh), or 2 (rotten). ' +
      'Every day, each rotten tree spreads rot to its 4-directional neighbours. ' +
      'Given the number of days D, return the total count of rotten trees after exactly D days.\n\n' +
      'Note: Unlike the classic LeetCode 994 ("minimum days to rot all"), here you are ' +
      'given a fixed number of days D and must report how many trees are rotten at that ' +
      'point — fresh trees that were never reached remain fresh.\n\n' +
      'Approach:\n' +
      '1. Multi-source BFS: seed queue with all initially-rotten cells (value 2).\n' +
      '2. Run BFS level by level; each level = 1 day.\n' +
      '3. Stop after D levels and count all rotten cells.',
    hints: [
      'Seed the BFS queue with every cell that starts as 2 (rotten)',
      'Process level-by-level — each level represents one day passing',
      'Stop expanding after D levels, even if fresh trees remain',
      'Count all cells with value 2 after simulation completes',
      'Use a visited / in-queue marker to avoid re-adding cells',
    ],
    examples: [
      {
        input: 'grid = [[2,1,1],[1,1,0],[0,1,1]], days = 2',
        output: '5',
        explanation:
          'Day 0: rotten={[0,0]}. Day 1: [0,1],[1,0] rot → 3 rotten. Day 2: [0,2],[1,1] rot → 5 rotten.',
      },
      {
        input: 'grid = [[2,1,1],[1,1,0],[0,1,1]], days = 4',
        output: '7',
        explanation: 'All reachable fresh trees (7 total) are rotten after 4 days.',
      },
      {
        input: 'grid = [[0,2]], days = 3',
        output: '1',
        explanation: 'Only one tree and it is already rotten at day 0.',
      },
    ],
    leetcodeNumber: 994,
  },

  {
    id: 'paypay-expression-validator',
    title: 'Expression Validator: a sign b = c (PayPay)',
    difficulty: 'Easy',
    patterns: ['two-pointers'],
    tags: ['Math', 'String Parsing', 'Interview'],
    description:
      'Given four inputs — two integers a and b, an operator sign (+, -, *, /), and a ' +
      'result c — determine whether the expression "a sign b = c" holds true.\n\n' +
      'Rules:\n' +
      '- sign is one of: +, -, *, /\n' +
      '- For division (/), use integer division (truncate toward zero), same as Java / Python int division\n' +
      '- If sign is / and b = 0, return false (division by zero is invalid)\n' +
      '- All values a, b, c are integers\n\n' +
      'Return true if a sign b equals c, false otherwise.',
    hints: [
      'Parse the sign character and apply the corresponding operation',
      'For division, truncate toward zero: Math.trunc(a / b) in JavaScript',
      'Guard against division by zero before evaluating',
      'Direct comparison: compute result and check === c',
    ],
    examples: [
      {
        input: 'a = 10, sign = "+", b = 5, c = 15',
        output: 'true',
        explanation: '10 + 5 = 15 ✓',
      },
      {
        input: 'a = 10, sign = "-", b = 3, c = 8',
        output: 'false',
        explanation: '10 - 3 = 7, not 8.',
      },
      {
        input: 'a = 7, sign = "/", b = 2, c = 3',
        output: 'true',
        explanation: 'Integer division: 7 / 2 = 3 (truncated) ✓',
      },
      {
        input: 'a = 5, sign = "/", b = 0, c = 0',
        output: 'false',
        explanation: 'Division by zero is invalid.',
      },
    ],
  },
];
