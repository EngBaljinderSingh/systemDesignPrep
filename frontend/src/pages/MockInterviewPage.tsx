import { useState, useEffect, useRef, useCallback } from 'react';
import { interviewQuestions, type Technology, type InterviewQuestion } from '../data/interviewQuestions';
import { interviewApi } from '../api/interviewApi';

const TOPICS: Technology[] = [
  'Java',
  'Spring Boot',
  'JavaScript',
  'TypeScript',
  'React',
  'Angular',
  'JPA',
  'Data Structures',
  'Java 8',
  'Multithreading',
  'Frameworks & Patterns',
  'Coding',
  'System Design',
];

const TOPIC_COLOR: Partial<Record<Technology, string>> = {
  Java:                   'border-orange-500/40 bg-orange-500/10 text-orange-300',
  'Spring Boot':          'border-green-500/40 bg-green-500/10 text-green-300',
  JavaScript:             'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  TypeScript:             'border-blue-400/40 bg-blue-400/10 text-blue-300',
  React:                  'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  Angular:                'border-red-500/40 bg-red-500/10 text-red-300',
  JPA:                    'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
  'Data Structures':      'border-teal-500/40 bg-teal-500/10 text-teal-300',
  'Java 8':               'border-amber-500/40 bg-amber-500/10 text-amber-300',
  Multithreading:         'border-rose-500/40 bg-rose-500/10 text-rose-300',
  'Frameworks & Patterns':'border-pink-500/40 bg-pink-500/10 text-pink-300',
  Coding:                 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  'System Design':        'border-pink-500/40 bg-pink-500/10 text-pink-300',
};

type Phase = 'setup' | 'interview' | 'result';

interface QuestionResult {
  question: InterviewQuestion;
  userAnswer: string;
  aiFeedback: string | null;
  score: number | null; // 0-10
  loading: boolean;
}

function useTimer(running: boolean, initialSeconds: number, onExpire: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const ref = useRef(initialSeconds);
  ref.current = seconds;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { onExpire(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onExpire]);

  return seconds;
}

function TimerBar({ seconds, total }: { seconds: number; total: number }) {
  const pct = Math.max(0, (seconds / total) * 100);
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-mono font-bold tabular-nums ${pct <= 20 ? 'text-red-400' : 'text-gray-300'}`}>
        {mm}:{ss}
      </span>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 8 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <span className={`text-2xl font-bold ${color}`}>{score}<span className="text-sm text-gray-500">/10</span></span>
  );
}

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedTopic, setSelectedTopic] = useState<Technology | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timeLimitSecs, setTimeLimitSecs] = useState(120); // per question
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const handleTimeExpire = useCallback(() => {
    if (phase === 'interview') submitAnswer(true);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const secondsLeft = useTimer(timerRunning, timeLimitSecs, handleTimeExpire);

  function startInterview() {
    if (!selectedTopic) return;
    const pool = interviewQuestions.filter((q) => q.technology === selectedTopic);
    if (pool.length === 0) return;
    // shuffle + take N
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    setQuestions(shuffled);
    setResults([]);
    setCurrentIdx(0);
    setCurrentAnswer('');
    setSkipped(false);
    setPhase('interview');
    setTimerRunning(true);
  }

  async function submitAnswer(expired = false) {
    setTimerRunning(false);
    const q = questions[currentIdx];
    const answer = expired && !currentAnswer ? '(time expired — no answer)' : currentAnswer;

    const placeholder: QuestionResult = {
      question: q,
      userAnswer: answer,
      aiFeedback: null,
      score: null,
      loading: true,
    };
    const updatedResults = [...results, placeholder];
    setResults(updatedResults);

    // Call AI for feedback
    let feedback = '';
    let score: number | null = null;
    try {
      const prompt = `You are a technical interviewer. The question was:\n"${q.question}"\n\nThe ideal answer is:\n"${q.answer}"\n\nThe candidate answered:\n"${answer}"\n\nProvide concise feedback (2-3 sentences) and give a score from 0-10. Format your response as:\nSCORE: <number>\nFEEDBACK: <your feedback>`;
      const resp = await interviewApi.sendMessage('mock-interview', prompt);
      const text = resp.data.response || '';
      const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
      const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]*)/i);
      score = scoreMatch ? Math.min(10, Math.max(0, parseInt(scoreMatch[1]))) : null;
      feedback = feedbackMatch ? feedbackMatch[1].trim() : text;
    } catch {
      feedback = 'AI feedback unavailable. Compare your answer with the model answer below.';
      score = null;
    }

    const finalResults = updatedResults.map((r, i) =>
      i === updatedResults.length - 1 ? { ...r, aiFeedback: feedback, score, loading: false } : r
    );
    setResults(finalResults);

    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      setPhase('result');
    } else {
      setCurrentIdx(nextIdx);
      setCurrentAnswer('');
      setSkipped(false);
      setTimerRunning(true);
    }
  }

  function reset() {
    setPhase('setup');
    setSelectedTopic(null);
    setResults([]);
    setCurrentAnswer('');
    setTimerRunning(false);
  }

  // ── SETUP SCREEN ────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Mock Interview</h1>
          <p className="text-sm text-gray-400">
            Pick a topic, set a time limit, and answer questions. AI will assess your answers instantly.
          </p>
        </div>

        {/* Topic selection */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Select Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors ${
                  selectedTopic === t
                    ? (TOPIC_COLOR[t] ?? 'border-primary bg-primary/20 text-white')
                    : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                {t}
                <span className="block text-xs opacity-50 mt-0.5">
                  {interviewQuestions.filter((q) => q.technology === t).length} questions
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Number of Questions
            </label>
            <select
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 bg-surface border border-gray-600 rounded text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {[3, 5, 7, 10].map((n) => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Time Per Question
            </label>
            <select
              value={timeLimitSecs}
              onChange={(e) => setTimeLimitSecs(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 bg-surface border border-gray-600 rounded text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
        </div>

        <button
          onClick={startInterview}
          disabled={!selectedTopic}
          className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          {selectedTopic ? `Start ${selectedTopic} Interview →` : 'Select a topic to start'}
        </button>
      </div>
    );
  }

  // ── INTERVIEW SCREEN ────────────────────────────────────────────────────
  if (phase === 'interview') {
    const q = questions[currentIdx];
    const progress = ((currentIdx) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Question <span className="text-white font-bold">{currentIdx + 1}</span> of {questions.length}
            <span className="ml-3 text-xs text-gray-600">· {selectedTopic}</span>
          </div>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-300">✕ Quit</button>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-gray-700 overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Timer */}
        <TimerBar seconds={secondsLeft} total={timeLimitSecs} />

        {/* Question */}
        <div className="rounded-xl border border-gray-700 bg-surface-light p-5">
          <p className="text-sm text-gray-400 mb-2">
            {q.experience.join(' / ')} · {q.tags.join(', ')}
          </p>
          <p className="text-base font-semibold text-white leading-relaxed">{q.question}</p>
        </div>

        {/* Answer */}
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here…"
          className="w-full h-40 px-4 py-3 text-sm bg-surface border border-gray-600 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => { setSkipped(true); submitAnswer(false); }}
            className="flex-1 py-2.5 rounded-lg border border-gray-700 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => submitAnswer(false)}
            disabled={!currentAnswer.trim()}
            className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            Submit Answer →
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────────────────
  const answered = results.filter((r) => r.userAnswer !== '(time expired — no answer)' && r.userAnswer !== '');
  const scored = results.filter((r) => r.score !== null);
  const avgScore = scored.length > 0 ? Math.round(scored.reduce((s, r) => s + (r.score ?? 0), 0) / scored.length) : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Summary */}
      <div className="rounded-xl border border-gray-700 bg-surface-light p-6">
        <h1 className="text-xl font-bold text-white mb-4">{selectedTopic} — Interview Complete</h1>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{answered.length}<span className="text-sm text-gray-500">/{questions.length}</span></div>
            <div className="text-xs text-gray-500 mt-1">Answered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{questions.length - answered.length}</div>
            <div className="text-xs text-gray-500 mt-1">Skipped / Expired</div>
          </div>
          <div>
            {avgScore !== null ? <ScoreCircle score={avgScore} /> : <span className="text-2xl font-bold text-gray-600">—</span>}
            <div className="text-xs text-gray-500 mt-1">Avg Score</div>
          </div>
        </div>
      </div>

      {/* Per-question results */}
      <div className="space-y-4">
        {results.map((r, i) => (
          <QuestionResultCard key={i} result={r} index={i} />
        ))}
      </div>

      <button
        onClick={reset}
        className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        ← New Interview
      </button>
    </div>
  );
}

function QuestionResultCard({ result, index }: { result: QuestionResult; index: number }) {
  const [showModel, setShowModel] = useState(false);

  return (
    <div className="border border-gray-700 rounded-xl bg-surface-light overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Q{index + 1}</p>
          <p className="text-sm font-medium text-white leading-snug">{result.question.question}</p>
        </div>
        {result.score !== null && <ScoreCircle score={result.score} />}
        {result.loading && (
          <span className="text-xs text-gray-500 animate-pulse">Assessing…</span>
        )}
      </div>

      {/* User answer */}
      <div className="px-5 pb-3 border-t border-gray-700/50 pt-3">
        <p className="text-xs text-gray-500 mb-1">Your answer</p>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          {result.userAnswer || <span className="text-gray-600 italic">No answer given</span>}
        </p>
      </div>

      {/* AI Feedback */}
      {result.aiFeedback && (
        <div className="px-5 pb-3 border-t border-gray-700/50 pt-3 bg-primary/5">
          <p className="text-xs text-primary font-semibold mb-1">AI Feedback</p>
          <p className="text-sm text-gray-300 leading-relaxed">{result.aiFeedback}</p>
        </div>
      )}

      {/* Model answer toggle */}
      <div className="px-5 pb-3 pt-1">
        <button
          onClick={() => setShowModel((v) => !v)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {showModel ? '▲ Hide model answer' : '▼ Show model answer'}
        </button>
        {showModel && (
          <div className="mt-2 rounded bg-black/30 border border-gray-700 px-3 py-2.5 text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {result.question.answer}
          </div>
        )}
      </div>
    </div>
  );
}
