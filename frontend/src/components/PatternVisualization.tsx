import { useState } from 'react';

// ─── Shared style tokens ──────────────────────────────────────────────────────
const CB = 'w-10 h-10 flex items-center justify-center rounded border text-sm font-mono font-semibold transition-all duration-200';
const C_NORMAL  = 'bg-gray-800 border-gray-600 text-gray-300';
const C_WINDOW  = 'bg-blue-500/25 border-blue-400 text-blue-200';
const C_LEFT    = 'bg-green-500/25 border-green-400 text-green-200';
const C_RIGHT   = 'bg-red-500/25 border-red-400 text-red-200';
const C_MID     = 'bg-yellow-500/25 border-yellow-400 text-yellow-200';
const C_FOUND   = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
const C_ACTIVE  = 'bg-purple-500/25 border-purple-400 text-purple-200';
const C_FILLED  = 'bg-indigo-500/25 border-indigo-400 text-indigo-200';
const C_FADED   = 'bg-gray-800/40 border-gray-700/40 text-gray-600';
const C_DONE    = 'bg-gray-700/50 border-gray-600/50 text-gray-500';

// ─── Shared helper components ─────────────────────────────────────────────────

interface Cell {
  value: string | number;
  style?: string;
  label?: string;
}

function ArrayRow({ cells }: { cells: Cell[] }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {cells.map((cell, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className={`${CB} ${cell.style ?? C_NORMAL}`}>{cell.value}</div>
          {cell.label && <span className="text-[10px] font-medium text-gray-400 leading-none">{cell.label}</span>}
        </div>
      ))}
    </div>
  );
}

function StackViz({ stack }: { stack: (string | number)[] }) {
  return (
    <div className="flex flex-col-reverse gap-1 items-center w-20">
      {stack.length === 0
        ? <span className="text-xs text-gray-600 italic py-1">empty</span>
        : stack.map((v, i) => (
            <div key={i} className={`w-full h-8 flex items-center justify-center rounded border text-xs font-mono font-medium ${i === stack.length - 1 ? C_ACTIVE : C_NORMAL}`}>{v}</div>
          ))}
      <span className="text-[10px] text-gray-600 mt-0.5">↑ top</span>
    </div>
  );
}

function Badge({ label, value, color = 'text-gray-300' }: { label: string; value: string | number; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gray-800 border border-gray-700 px-2 py-0.5 rounded">
      <span className="text-gray-500">{label}:</span>
      <span className={`font-mono font-medium ${color}`}>{value}</span>
    </span>
  );
}

function IntervalBar({ start, end, total, color }: { start: number; end: number; total: number; color: string }) {
  const leftPct = (start / total) * 100;
  const widthPct = ((end - start) / total) * 100;
  return (
    <div className="relative h-7 w-full">
      <div
        className={`absolute h-full rounded flex items-center justify-center text-[10px] font-mono border ${color}`}
        style={{ left: `${leftPct}%`, width: `${widthPct}%`, minWidth: '2rem' }}
      >
        [{start},{end}]
      </div>
    </div>
  );
}

// ─── Step navigator ───────────────────────────────────────────────────────────

function StepNavigator({ steps }: { steps: { label: string; content: React.ReactNode }[] }) {
  const [step, setStep] = useState(0);
  const s = steps[step];
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/40">
      <div className="px-4 py-4 min-h-[180px]">{s.content}</div>
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/60 border-t border-gray-700">
        <button
          onClick={() => setStep(c => Math.max(0, c - 1))}
          disabled={step === 0}
          className="text-xs px-3 py-1 border border-gray-600 rounded disabled:opacity-30 hover:border-gray-400 text-gray-300 transition-colors"
        >◀ Prev</button>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-300 text-center max-w-xs">{s.label}</span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-primary' : 'bg-gray-600 hover:bg-gray-500'}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-600">{step + 1} / {steps.length}</span>
        </div>
        <button
          onClick={() => setStep(c => Math.min(steps.length - 1, c + 1))}
          disabled={step === steps.length - 1}
          className="text-xs px-3 py-1 border border-gray-600 rounded disabled:opacity-30 hover:border-gray-400 text-gray-300 transition-colors"
        >Next ▶</button>
      </div>
    </div>
  );
}

// ─── Tree node (used for BFS / DFS) ─────────────────────────────────────────
type NodeState = 'unvisited' | 'queued' | 'active' | 'done';

function TreeNode({ id, state }: { id: number; state: NodeState }) {
  const style =
    state === 'done'     ? C_FOUND :
    state === 'active'   ? C_ACTIVE :
    state === 'queued'   ? C_WINDOW :
    C_NORMAL;
  return <div className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-mono font-semibold ${style}`}>{id}</div>;
}

function BinaryTree({ nodes }: { nodes: Record<number, NodeState> }) {
  const levels = [[1], [2, 3], [4, 5, 6, 7]];
  return (
    <div className="space-y-3">
      {levels.map((level, li) => (
        <div key={li} className="flex justify-center gap-4">
          {level.map(n => <TreeNode key={n} id={n} state={nodes[n] ?? 'unvisited'} />)}
        </div>
      ))}
    </div>
  );
}

// ─── Pattern Visualizations ────────────────────────────────────────────────────

function SlidingWindowViz() {
  const arr = [2, 1, 5, 1, 3, 2];
  const steps = [
    { l: 0, r: 2, sum: 8,  max: 8,  label: 'Window [0..2] → sum=8' },
    { l: 1, r: 3, sum: 7,  max: 8,  label: 'Slide right → sum=7, max stays 8' },
    { l: 2, r: 4, sum: 9,  max: 9,  label: 'Slide right → sum=9, new max!' },
    { l: 3, r: 5, sum: 6,  max: 9,  label: 'Slide right → sum=6, max stays 9' },
  ].map(s => ({
    label: s.label,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Array: find max sum subarray of size k=3</p>
        <ArrayRow cells={arr.map((v, i) => ({
          value: v,
          style: i >= s.l && i <= s.r ? C_WINDOW : C_FADED,
          label: i === s.l ? 'L' : i === s.r ? 'R' : undefined,
        }))} />
        <div className="flex gap-2 flex-wrap mt-1">
          <Badge label="window sum" value={s.sum} color="text-blue-300" />
          <Badge label="max sum" value={s.max} color={s.max === 9 ? 'text-emerald-300' : 'text-gray-300'} />
        </div>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function TwoPointersViz() {
  const arr = [-4, -1, -1, 0, 1, 2];
  const steps = [
    { l: 0, r: 5, note: '-4+2 = -2 < 0  →  move L right', found: false },
    { l: 1, r: 5, note: '-1+2 = 1 > 0   →  move R left',  found: false },
    { l: 1, r: 4, note: '-1+1 = 0 = target  ✓  Pair found!', found: true },
  ].map(s => ({
    label: `L=${arr[s.l]}, R=${arr[s.r]}`,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Sorted array · find pair that sums to 0</p>
        <ArrayRow cells={arr.map((v, i) => ({
          value: v,
          style: i === s.l ? C_LEFT : i === s.r ? C_RIGHT : i > s.l && i < s.r ? C_NORMAL : C_FADED,
          label: i === s.l ? 'L' : i === s.r ? 'R' : undefined,
        }))} />
        <p className={`text-sm font-mono ${s.found ? 'text-emerald-400' : 'text-gray-400'}`}>{s.note}</p>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function FastSlowViz() {
  const nodes = [1, 2, 3, 4, 5];
  const steps = [
    { slow: 0, fast: 0, met: false, note: 'Both start at head (node 1)' },
    { slow: 1, fast: 2, met: false, note: 'slow→2  fast→3  (fast takes 2 steps)' },
    { slow: 2, fast: 4, met: false, note: 'slow→3  fast→5' },
    { slow: 3, fast: 3, met: true,  note: 'slow→4  fast→4  MEET! Cycle detected ✓' },
  ].map(s => ({
    label: s.note,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Linked list with cycle: 1→2→3→4→5→↩3</p>
        <div className="flex items-center gap-1 flex-wrap">
          {nodes.map((v, i) => {
            const isSlow = i === s.slow;
            const isFast = i === s.fast;
            const both = isSlow && isFast;
            return (
              <div key={i} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex gap-1 text-[10px] h-4 items-center">
                    {isSlow && <span className="text-green-400 font-bold">S</span>}
                    {isFast && <span className="text-yellow-400 font-bold">F</span>}
                    {!isSlow && !isFast && <span className="opacity-0">·</span>}
                  </div>
                  <div className={`${CB} ${both ? C_FOUND : isSlow ? C_LEFT : isFast ? C_MID : C_NORMAL}`}>{v}</div>
                </div>
                {i < nodes.length - 1 && <span className="text-gray-600 text-sm">→</span>}
              </div>
            );
          })}
          <span className="text-[10px] text-gray-500 ml-1">↩ back to 3</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge label="slow" value={nodes[s.slow]} color="text-green-300" />
          <Badge label="fast" value={nodes[s.fast]} color="text-yellow-300" />
        </div>
        {s.met && <p className="text-sm text-emerald-400 font-mono">{s.note}</p>}
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function BinarySearchViz() {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const steps = [
    { lo: 0, hi: 9, mid: 4, note: 'arr[4]=9 < 11  →  lo = mid+1 = 5', found: false },
    { lo: 5, hi: 9, mid: 7, note: 'arr[7]=15 > 11  →  hi = mid-1 = 6', found: false },
    { lo: 5, hi: 6, mid: 5, note: 'arr[5]=11 = target  ✓  Found at index 5!', found: true },
  ].map(s => ({
    label: `lo=${s.lo}, mid=${s.mid}, hi=${s.hi}`,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Sorted array · target = 11</p>
        <ArrayRow cells={arr.map((v, i) => ({
          value: v,
          style: i < s.lo || i > s.hi ? C_FADED
            : i === s.mid ? (s.found ? C_FOUND : C_MID)
            : C_WINDOW,
          label: i === s.lo ? 'lo' : i === s.mid ? 'mid' : i === s.hi ? 'hi' : undefined,
        }))} />
        <p className={`text-sm font-mono ${s.found ? 'text-emerald-400' : 'text-gray-400'}`}>{s.note}</p>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function BfsViz() {
  type BfsStep = { nodes: Record<number, NodeState>; queue: number[]; label: string };
  const rawSteps: BfsStep[] = [
    {
      nodes: { 1: 'queued' as NodeState, 2: 'unvisited' as NodeState, 3: 'unvisited' as NodeState, 4: 'unvisited' as NodeState, 5: 'unvisited' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      queue: [1], label: 'Enqueue root [1]',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'queued' as NodeState, 3: 'queued' as NodeState, 4: 'unvisited' as NodeState, 5: 'unvisited' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      queue: [2, 3], label: 'Dequeue 1 → visit, enqueue children [2, 3]',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'done' as NodeState, 3: 'queued' as NodeState, 4: 'queued' as NodeState, 5: 'queued' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      queue: [3, 4, 5], label: 'Dequeue 2 → visit, enqueue children [4, 5]',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'done' as NodeState, 3: 'done' as NodeState, 4: 'queued' as NodeState, 5: 'queued' as NodeState, 6: 'queued' as NodeState, 7: 'queued' as NodeState },
      queue: [4, 5, 6, 7], label: 'Dequeue 3 → visit, enqueue children [6, 7]',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'done' as NodeState, 3: 'done' as NodeState, 4: 'done' as NodeState, 5: 'done' as NodeState, 6: 'done' as NodeState, 7: 'done' as NodeState },
      queue: [], label: 'Dequeue all leaves → BFS complete ✓',
    },
  ];
  const steps = rawSteps.map(s => ({
    label: s.label,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">BFS explores level-by-level using a queue</p>
        <BinaryTree nodes={s.nodes} />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Queue:</span>
          {s.queue.length === 0
            ? <span className="text-xs text-gray-600 italic">empty</span>
            : s.queue.map((n, i) => (
                <span key={i} className="text-xs font-mono px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded text-blue-300">{n}</span>
              ))}
        </div>
        <div className="flex gap-3 text-[10px] text-gray-500">
          <span><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />queued</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />visited</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-gray-600 mr-1" />unvisited</span>
        </div>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function DfsViz() {
  type DfsStep = { nodes: Record<number, NodeState>; stack: number[]; label: string };
  const rawSteps: DfsStep[] = [
    {
      nodes: { 1: 'active' as NodeState, 2: 'unvisited' as NodeState, 3: 'unvisited' as NodeState, 4: 'unvisited' as NodeState, 5: 'unvisited' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      stack: [1], label: 'Visit 1 → push children [3, 2]',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'active' as NodeState, 3: 'unvisited' as NodeState, 4: 'unvisited' as NodeState, 5: 'unvisited' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      stack: [3, 2], label: 'Visit 2 → push children [5, 4]',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'done' as NodeState, 3: 'unvisited' as NodeState, 4: 'active' as NodeState, 5: 'unvisited' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      stack: [3, 5, 4], label: 'Visit 4 (leaf) → backtrack',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'done' as NodeState, 3: 'unvisited' as NodeState, 4: 'done' as NodeState, 5: 'active' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      stack: [3, 5], label: 'Visit 5 (leaf) → backtrack to 3',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'done' as NodeState, 3: 'active' as NodeState, 4: 'done' as NodeState, 5: 'done' as NodeState, 6: 'unvisited' as NodeState, 7: 'unvisited' as NodeState },
      stack: [3], label: 'Visit 3 → push children [7, 6]',
    },
    {
      nodes: { 1: 'done' as NodeState, 2: 'done' as NodeState, 3: 'done' as NodeState, 4: 'done' as NodeState, 5: 'done' as NodeState, 6: 'done' as NodeState, 7: 'done' as NodeState },
      stack: [], label: 'Visit 6, 7 → DFS complete ✓',
    },
  ];
  const steps = rawSteps.map(s => ({
    label: s.label,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">DFS goes as deep as possible before backtracking</p>
        <BinaryTree nodes={s.nodes} />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Stack:</span>
          {s.stack.length === 0
            ? <span className="text-xs text-gray-600 italic">empty</span>
            : [...s.stack].reverse().map((n, i) => (
                <span key={i} className="text-xs font-mono px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300">{n}</span>
              ))}
        </div>
        <div className="flex gap-3 text-[10px] text-gray-500">
          <span><span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1" />active</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />done</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-gray-600 mr-1" />unvisited</span>
        </div>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function DpViz() {
  const dp = [1, 1, 2, 3, 5, 8];
  const steps = [
    { filled: 2, note: 'Base cases: dp[1]=1, dp[2]=1' },
    { filled: 3, note: 'dp[3] = dp[2]+dp[1] = 1+1 = 2' },
    { filled: 4, note: 'dp[4] = dp[3]+dp[2] = 2+1 = 3' },
    { filled: 5, note: 'dp[5] = dp[4]+dp[3] = 3+2 = 5' },
    { filled: 6, note: 'dp[6] = dp[5]+dp[4] = 5+3 = 8  ✓  Answer!' },
  ].map((s, si) => ({
    label: s.note,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Climbing Stairs · ways to reach step n · dp[i] = dp[i−1] + dp[i−2]</p>
        <div className="flex gap-1.5 flex-wrap">
          {dp.map((v, i) => {
            const idx = i + 1;
            const isFilled = idx < s.filled;
            const isNew = idx === s.filled - 1 && si > 0;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-gray-500">n={idx}</span>
                <div className={`${CB} ${!isFilled ? C_NORMAL : isNew ? C_FILLED : C_FOUND}`}>
                  {isFilled ? v : '?'}
                </div>
              </div>
            );
          })}
        </div>
        <p className={`text-sm font-mono ${s.note.includes('✓') ? 'text-emerald-400' : 'text-gray-400'}`}>{s.note}</p>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function BacktrackingViz() {
  const steps = [
    { path: [] as number[],  found: [] as number[][],  note: 'Start: empty path, explore choices for [1,2,3]' },
    { path: [1],             found: [[]],              note: 'Record [], choose 1 → path=[1]' },
    { path: [1, 2],          found: [[], [1]],         note: 'Record [1], choose 2 → path=[1,2]' },
    { path: [1, 2, 3],       found: [[], [1], [1,2]],  note: 'Record [1,2], choose 3 → record [1,2,3], backtrack' },
    { path: [1, 3],          found: [[], [1], [1,2], [1,2,3], [1,2]], note: 'Skip 3, record [1,2] → try [1,3]' },
    { path: [2],             found: [[], [1], [1,2], [1,2,3], [1,2], [1,3], [1]], note: 'Backtrack to root, choose 2' },
    { path: [],              found: [[], [1], [1,2], [1,2,3], [1,2], [1,3], [1], [2], [2,3], [3]], note: 'Continue exploring → 8 subsets total' },
    { path: [],              found: [[], [1], [1,2], [1,2,3], [1,2], [1,3], [1], [2], [2,3], [3]], note: 'Done!  All 2³=8 subsets generated ✓' },
  ].map(s => ({
    label: s.note,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Generate all subsets of [1,2,3] · choose or skip each element</p>
        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-[10px] text-gray-500 mb-1">Current path:</p>
            <div className="flex gap-1 min-h-[40px] items-center">
              {s.path.length === 0
                ? <span className="text-xs text-gray-600 italic font-mono">[ ]</span>
                : s.path.map((v, i) => <div key={i} className={`${CB} ${C_ACTIVE} w-9 h-9`}>{v}</div>)}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-1">Recorded ({s.found.length}/8):</p>
            <div className="flex flex-wrap gap-1 max-w-xs">
              {s.found.map((sub, i) => (
                <span key={i} className="text-xs font-mono px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-300">
                  [{sub.join(',')}]
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function MergeIntervalsViz() {
  const allIntervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
  const total = 20;
  const barColors = [C_WINDOW, C_WINDOW, C_NORMAL, C_NORMAL];
  const steps = [
    { highlight: -1, merged: [] as number[][], note: 'Input sorted by start time' },
    { highlight: 1,  merged: [[1, 6]],         note: '[1,3] and [2,6] overlap (2 ≤ 3)  →  merge to [1,6]' },
    { highlight: 2,  merged: [[1, 6], [8, 10]],note: '[1,6] and [8,10] no overlap (8 > 6)  →  add separately' },
    { highlight: 3,  merged: [[1, 6], [8, 10], [15, 18]], note: 'Result: [1,6], [8,10], [15,18]  ✓' },
  ].map(s => ({
    label: s.note,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Sort by start time, then merge overlapping pairs</p>
        <div className="space-y-1.5">
          <p className="text-[10px] text-gray-500">Input intervals:</p>
          {allIntervals.map((iv, i) => (
            <IntervalBar key={i} start={iv[0]} end={iv[1]} total={total}
              color={s.highlight === i
                ? 'bg-yellow-500/30 border-yellow-500/50 text-yellow-200'
                : `${barColors[i]} border-gray-600 text-gray-300`} />
          ))}
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] text-gray-500">Merged result:</p>
          {s.merged.length === 0
            ? <div className="text-xs text-gray-600 italic py-1">(none yet)</div>
            : s.merged.map((iv, i) => (
                <IntervalBar key={i} start={iv[0]} end={iv[1]} total={total}
                  color="bg-emerald-500/25 border-emerald-500/40 text-emerald-200" />
              ))}
        </div>
        <p className={`text-sm font-mono ${s.note.includes('✓') ? 'text-emerald-400' : 'text-gray-400'}`}>{s.note}</p>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function TopKViz() {
  const stream = [3, 1, 5, 12, 2, 11];
  const heapStates = [
    { heap: [3],        accepted: true,  note: 'size(1) < k=3, add freely' },
    { heap: [1, 3],     accepted: true,  note: 'size(2) < k=3, add freely' },
    { heap: [1, 3, 5],  accepted: true,  note: 'size(3) = k, heap full' },
    { heap: [3, 5, 12], accepted: true,  note: '12 > min(1)  →  evict 1, insert 12' },
    { heap: [3, 5, 12], accepted: false, note: '2 < min(3)  →  rejected, heap unchanged' },
    { heap: [5, 11, 12],accepted: true,  note: '11 > min(3)  →  evict 3, insert 11  ✓  Done!' },
  ];
  const steps = stream.map((val, i) => {
    const s = heapStates[i];
    const sorted = [...s.heap].sort((a, b) => a - b);
    return {
      label: `Process ${val}: ${s.note}`,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Find top k=3 elements · maintain a min-heap of size k</p>
          <div className="flex gap-1.5 flex-wrap">
            {stream.map((v, j) => (
              <div key={j} className={`${CB} w-9 h-9 text-sm ${j < i ? C_DONE : j === i ? C_MID : C_NORMAL}`}>{v}</div>
            ))}
          </div>
          <div className="flex gap-6 items-start">
            <div>
              <p className="text-[10px] text-gray-500 mb-2">Min-Heap (root = min):</p>
              <div className="space-y-1.5">
                <div className="flex justify-center">
                  <div className={`${CB} w-9 h-9 ${sorted[0] !== undefined ? C_LEFT : C_FADED}`}>{sorted[0] ?? '·'}</div>
                </div>
                <div className="flex justify-center gap-3">
                  {[1, 2].map(k => (
                    <div key={k} className={`${CB} w-9 h-9 ${sorted[k] !== undefined ? C_WINDOW : C_FADED}`}>{sorted[k] ?? '·'}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-1 space-y-2">
              <span className={`inline-block text-xs font-mono px-2 py-1 rounded border ${s.accepted ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-red-500/20 border-red-500/30 text-red-300'}`}>
                {s.accepted ? '✓ accepted' : '✗ rejected'}
              </span>
              <p className="text-sm text-gray-400 font-mono max-w-[180px]">{s.note}</p>
            </div>
          </div>
        </div>
      ),
    };
  });
  return <StepNavigator steps={steps} />;
}

function MonotonicStackViz() {
  const arr = [2, 1, 5, 3, 6];
  const steps = [
    { i: 0, stack: ['0(2)'],                result: ['?','?','?','?','?'], note: 'Push index 0 (val=2)' },
    { i: 1, stack: ['0(2)','1(1)'],         result: ['?','?','?','?','?'], note: '1 ≤ 2  →  push' },
    { i: 2, stack: ['2(5)'],                result: ['5','5','?','?','?'], note: '5>1: ans[1]=5; 5>2: ans[0]=5; push idx 2' },
    { i: 3, stack: ['2(5)','3(3)'],         result: ['5','5','?','?','?'], note: '3 ≤ 5  →  push' },
    { i: 4, stack: ['4(6)'],                result: ['5','5','6','6','?'], note: '6>3: ans[3]=6; 6>5: ans[2]=6; push idx 4' },
  ].map(s => ({
    label: s.note,
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Next Greater Element · maintaining a decreasing monotonic stack</p>
        <ArrayRow cells={arr.map((v, i) => ({
          value: v,
          style: i === s.i ? C_MID : s.stack.some(e => e.startsWith(`${i}(`)) ? C_WINDOW : i < s.i ? C_FADED : C_NORMAL,
          label: i === s.i ? '↑ cur' : undefined,
        }))} />
        <div className="flex gap-6 items-start">
          <div>
            <p className="text-[10px] text-gray-500 mb-1">Stack:</p>
            <StackViz stack={s.stack} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 mb-1">Result:</p>
            <ArrayRow cells={s.result.map((v) => ({
              value: v,
              style: v === '?' ? C_NORMAL : C_FOUND,
            }))} />
          </div>
        </div>
        <p className="text-sm font-mono text-gray-400">{s.note}</p>
      </div>
    ),
  }));
  return <StepNavigator steps={steps} />;
}

function TrieViz() {
  const steps = [
    {
      words: [] as string[],
      label: 'Empty Trie · only root node exists',
      content: (
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-gray-500 bg-gray-700 flex items-center justify-center text-xs text-gray-400">root</div>
          <p className="text-xs text-gray-500">root has no children yet</p>
        </div>
      ),
    },
    {
      words: ['app'],
      label: 'Insert "app" → create path a→p→p (mark end)',
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Characters share a path from root</p>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-8 rounded border border-gray-500 bg-gray-700 flex items-center justify-center text-xs text-gray-400">root</div>
            <div className="w-px h-3 bg-gray-600" />
            {['a','p','p'].map((ch, i) => (
              <div key={i} className="flex flex-col items-center gap-0">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-mono font-bold ${i === 2 ? C_FOUND : C_WINDOW}`}>
                  {ch}{i === 2 ? '*' : ''}
                </div>
                {i < 2 && <div className="w-px h-2 bg-gray-600" />}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500">* = end of word</p>
        </div>
      ),
    },
    {
      words: ['app', 'apple'],
      label: 'Insert "apple" → extends existing path a→p→p→l→e',
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">"apple" reuses the "app" prefix</p>
          <div className="flex flex-col items-center gap-0">
            <div className="w-12 h-8 rounded border border-gray-500 bg-gray-700 flex items-center justify-center text-xs text-gray-400">root</div>
            <div className="w-px h-2 bg-gray-600" />
            {['a','p','p*','l','e'].map((ch, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${ch.includes('*') ? C_FOUND : i >= 3 ? C_FILLED : C_WINDOW}`}>
                  {ch}
                </div>
                {i < 4 && <div className={`w-px h-2 ${i >= 2 ? 'bg-indigo-500/50' : 'bg-gray-600'}`} />}
              </div>
            ))}
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${C_FOUND}`}>e*</div>
          </div>
        </div>
      ),
    },
    {
      words: ['app', 'apple', 'apt'],
      label: 'Insert "apt" → branches at second "p" in path',
      content: (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">"apt" shares "ap" prefix, then branches to "t"</p>
          <div className="flex flex-col items-center gap-0">
            <div className="w-12 h-8 rounded border border-gray-500 bg-gray-700 flex items-center justify-center text-xs text-gray-400">root</div>
            <div className="w-px h-2 bg-gray-600" />
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-mono font-bold ${C_WINDOW}`}>a</div>
            <div className="w-px h-2 bg-gray-600" />
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-mono font-bold ${C_WINDOW}`}>p</div>
            <div className="flex gap-6 pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-2 bg-gray-600" />
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${C_FOUND}`}>p*</div>
                <div className="w-px h-2 bg-gray-600" />
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-mono font-bold ${C_WINDOW}`}>l</div>
                <div className="w-px h-2 bg-gray-600" />
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${C_FOUND}`}>e*</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-2 bg-gray-600" />
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${C_FILLED}`}>t*</div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500">* = end of word  ·  3 words stored, no duplicate "ap" nodes</p>
        </div>
      ),
    },
  ];
  return <StepNavigator steps={steps.map(s => ({ label: s.label, content: s.content }))} />;
}

// ─── Map & export ─────────────────────────────────────────────────────────────

const VISUALIZATION_MAP: Record<string, () => React.ReactNode> = {
  'sliding-window':      () => <SlidingWindowViz />,
  'two-pointers':        () => <TwoPointersViz />,
  'fast-slow-pointers':  () => <FastSlowViz />,
  'binary-search':       () => <BinarySearchViz />,
  'bfs':                 () => <BfsViz />,
  'dfs':                 () => <DfsViz />,
  'dynamic-programming': () => <DpViz />,
  'backtracking':        () => <BacktrackingViz />,
  'merge-intervals':     () => <MergeIntervalsViz />,
  'top-k-elements':      () => <TopKViz />,
  'monotonic-stack':     () => <MonotonicStackViz />,
  'trie':                () => <TrieViz />,
};

export default function PatternVisualization({ patternId }: { patternId: string }) {
  const render = VISUALIZATION_MAP[patternId];
  if (!render) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-2">Visualization</h3>
      {render()}
    </div>
  );
}
