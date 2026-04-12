import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
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

const CODE_LANGUAGES = [
  { id: 'java',       label: 'Java',       monaco: 'java' },
  { id: 'python',     label: 'Python',     monaco: 'python' },
  { id: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { id: 'typescript', label: 'TypeScript', monaco: 'typescript' },
];

type Phase = 'setup' | 'interview' | 'result';

interface QuestionResult {
  question: InterviewQuestion;
  userAnswer: string;
  aiFeedback: string | null;
  score: number | null;
  loading: boolean;
}

// Timer hook â€” resets seconds to initialSeconds whenever `running` flips to true.
// Uses a ref for onExpire so the callback is always current without restarting the interval.
function useTimer(running: boolean, initialSeconds: number, onExpire: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset the counter each time the timer is (re)started
  useEffect(() => {
    if (running) setSeconds(initialSeconds);
  }, [running, initialSeconds]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { onExpireRef.current(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return seconds;
}

// Returns the appropriate time in seconds for a question based on its complexity.
function getQuestionTime(q: InterviewQuestion, baseSecs: number): number {
  let m = 1.0;
  if (q.technology === 'Coding' || q.technology === 'System Design') m = 2.5;
  else if (q.technology === 'Data Structures' || q.technology === 'Multithreading') m = 2.0;
  else if (q.technology === 'Java 8' || q.technology === 'Frameworks & Patterns') m = 1.5;
  if (q.experience && q.experience.length === 1 && q.experience[0] === 'Senior') m *= 1.3;
  return Math.max(60, Math.round(baseSecs * m));
}

function TimerBar({ seconds, total }: { seconds: number; total: number }) {
  const pct = Math.max(0, (seconds / total) * 100);
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
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
  const [timeLimitBase, setTimeLimitBase] = useState(120);  // user-selected base time
  const [timeLimitSecs, setTimeLimitSecs] = useState(120);  // effective time for current question
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('java');

  // Refs that always hold the latest values â€” used inside stable callbacks
  // to avoid stale closures when the timer fires.
  const questionsRef = useRef<InterviewQuestion[]>([]);
  const currentIdxRef = useRef(0);
  const resultsRef = useRef<QuestionResult[]>([]);
  const currentAnswerRef = useRef('');
  const submittingRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const timeLimitBaseRef = useRef(120);

  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);
  useEffect(() => { resultsRef.current = results; }, [results]);
  useEffect(() => { currentAnswerRef.current = currentAnswer; }, [currentAnswer]);
  useEffect(() => { submittingRef.current = submitting; }, [submitting]);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { timeLimitBaseRef.current = timeLimitBase; }, [timeLimitBase]);

  // Stable submit â€” reads all state via refs to avoid stale closure problems
  const submitAnswer = useCallback(async (expired = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setTimerRunning(false);

    const qs = questionsRef.current;
    const idx = currentIdxRef.current;
    const answer = (expired && !currentAnswerRef.current) ? '(time expired – no answer)' : currentAnswerRef.current;
    const prev = resultsRef.current;
    const sid = sessionIdRef.current;

    if (!qs[idx]) { submittingRef.current = false; setSubmitting(false); return; }
    const q = qs[idx];

    const placeholder: QuestionResult = { question: q, userAnswer: answer, aiFeedback: null, score: null, loading: true };
    const updatedResults = [...prev, placeholder];
    setResults(updatedResults);
    resultsRef.current = updatedResults;

    let feedback = 'AI feedback unavailable. Compare your answer with the model answer below.';
    let score: number | null = null;

    try {
      if (sid) {
        const prompt = `You are a technical interviewer. The question was:\n"${q.question}"\n\nIdeal answer:\n"${q.answer}"\n\nCandidate answered:\n"${answer}"\n\nProvide feedback (2-3 sentences) and a score 0-10. Reply ONLY in this format:\nSCORE: <number>\nFEEDBACK: <text>`;
        const resp = await interviewApi.sendMessage(sid, prompt);
        const text = resp.data.response || '';
        const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
        const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]*)/i);
        score = scoreMatch ? Math.min(10, Math.max(0, parseInt(scoreMatch[1]))) : null;
        feedback = feedbackMatch ? feedbackMatch[1].trim() : text;
      }
    } catch {
      // feedback stays as default
    }

    const finalResults = updatedResults.map((r, i) =>
      i === updatedResults.length - 1 ? { ...r, aiFeedback: feedback, score, loading: false } : r
    );
    setResults(finalResults);
    resultsRef.current = finalResults;

    const nextIdx = idx + 1;
    submittingRef.current = false;
    setSubmitting(false);

    if (nextIdx >= qs.length) {
      setTimerRunning(false);
      setPhase('result');
    } else {
      const nextTime = getQuestionTime(qs[nextIdx], timeLimitBaseRef.current);
      currentIdxRef.current = nextIdx;
      setCurrentIdx(nextIdx);
      currentAnswerRef.current = '';
      setCurrentAnswer('');
      setTimeLimitSecs(nextTime);
      setTimerRunning(true);
    }
  }, []); // stable â€” never recreated

  // onExpire is stable because submitAnswer is stable
  const handleTimeExpire = useCallback(() => {
    submitAnswer(true);
  }, [submitAnswer]);

  const secondsLeft = useTimer(timerRunning, timeLimitSecs, handleTimeExpire);

  async function startInterview() {
    if (!selectedTopic) return;
    const pool = interviewQuestions.filter((q) => q.technology === selectedTopic);
    if (pool.length === 0) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, totalQuestions);

    // Create a real session to get a valid UUID for AI feedback
    setStarting(true);
    let sid: string | null = null;
    try {
      const resp = await interviewApi.start(
        crypto.randomUUID(),
        `Mock Interview: ${selectedTopic}`,
        `Topic-based mock interview covering ${selectedTopic} questions at various experience levels.`,
        'MID',
      );
      sid = resp.data.id;
    } catch {
      // AI feedback will be skipped if session fails
    }
    setStarting(false);

    const firstTime = getQuestionTime(shuffled[0], timeLimitBase);

    questionsRef.current = shuffled;
    currentIdxRef.current = 0;
    resultsRef.current = [];
    currentAnswerRef.current = '';
    submittingRef.current = false;
    sessionIdRef.current = sid;
    timeLimitBaseRef.current = timeLimitBase;

    setQuestions(shuffled);
    setResults([]);
    setCurrentIdx(0);
    setCurrentAnswer('');
    setSessionId(sid);
    setSubmitting(false);
    setTimeLimitSecs(firstTime);
    setPhase('interview');
    setTimerRunning(true);
  }

  function reset() {
    setPhase('setup');
    setSelectedTopic(null);
    setResults([]);
    setCurrentAnswer('');
    setTimerRunning(false);
    setSubmitting(false);
    setStarting(false);
    setSessionId(null);
  }

  // â”€â”€ SETUP SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Mock Interview</h1>
          <p className="text-sm text-gray-400">
            Pick a topic, set a time limit, and answer questions. AI will assess your answers instantly.
          </p>
        </div>

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
              value={timeLimitBase}
              onChange={(e) => setTimeLimitBase(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 bg-surface border border-gray-600 rounded text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">Coding & System Design questions get up to 2.5× more time.</p>
          </div>
        </div>

        {selectedTopic === 'Coding' && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Code Language
            </label>
            <div className="flex gap-2 flex-wrap">
              {CODE_LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setCodeLanguage(l.id)}
                  className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
                    codeLanguage === l.id
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={startInterview}
          disabled={!selectedTopic || starting}
          className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          {starting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Preparing interview…
            </>
          ) : selectedTopic ? `Start ${selectedTopic} Interview →` : 'Select a topic to start'}
        </button>
      </div>
    );
  }

  // â”€â”€ INTERVIEW SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (phase === 'interview') {
    const q = questions[currentIdx];
    const progress = (currentIdx / questions.length) * 100;
    const isCoding = q?.technology === 'Coding';
    const monacoLang = CODE_LANGUAGES.find((l) => l.id === codeLanguage)?.monaco ?? 'java';

    return (
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Question <span className="text-white font-bold">{currentIdx + 1}</span> of {questions.length}
            <span className="ml-3 text-xs text-gray-600">· {selectedTopic}</span>
            {isCoding && <span className="ml-2 text-xs text-violet-400">· Code Editor</span>}
          </div>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-300">✕ Quit</button>
        </div>

        <div className="h-1 rounded-full bg-gray-700 overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <TimerBar seconds={secondsLeft} total={timeLimitSecs} />

        <div className="rounded-xl border border-gray-700 bg-surface-light p-5">
          <p className="text-sm text-gray-400 mb-2">
            {q?.experience?.join(' / ')} · {q?.tags?.join(', ')}
          </p>
          <p className="text-base font-semibold text-white leading-relaxed">{q?.question}</p>
        </div>

        {isCoding ? (
          <div className="rounded-xl overflow-hidden border border-gray-700">
            {/* Language selector */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-700">
              <span className="text-xs text-gray-500">Language:</span>
              {CODE_LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setCodeLanguage(l.id)}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                    codeLanguage === l.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Editor
              height="300px"
              language={monacoLang}
              theme="vs-dark"
              value={currentAnswer}
              onChange={(v) => {
                const val = v ?? '';
                setCurrentAnswer(val);
                currentAnswerRef.current = val;
              }}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                folding: false,
                padding: { top: 8 },
              }}
            />
          </div>
        ) : (
          <textarea
            value={currentAnswer}
            onChange={(e) => {
              setCurrentAnswer(e.target.value);
              currentAnswerRef.current = e.target.value;
            }}
            placeholder="Type your answer here…"
            className="w-full h-40 px-4 py-3 text-sm bg-surface border border-gray-600 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={() => submitAnswer(false)}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-lg border border-gray-700 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-40"
          >
            Skip
          </button>
          <button
            onClick={() => submitAnswer(false)}
            disabled={submitting || !currentAnswer.trim()}
            className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            {submitting ? 'Assessing…' : 'Submit Answer →'}
          </button>
        </div>
        {submitting && (
          <p className="text-xs text-center text-gray-500 animate-pulse">AI is assessing your answer…</p>
        )}
      </div>
    );
  }

  // â”€â”€ RESULTS SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const answered = results.filter((r) => r.userAnswer && r.userAnswer !== '(time expired – no answer)');
  const scored = results.filter((r) => r.score !== null);
  const avgScore = scored.length > 0 ? Math.round(scored.reduce((s, r) => s + (r.score ?? 0), 0) / scored.length) : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <div className="rounded-xl border border-gray-700 bg-surface-light p-6">
        <h1 className="text-xl font-bold text-white mb-4">{selectedTopic} – Interview Complete</h1>
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
  const isCode = result.question.technology === 'Coding';

  return (
    <div className="border border-gray-700 rounded-xl bg-surface-light overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Q{index + 1}</p>
          <p className="text-sm font-medium text-white leading-snug">{result.question.question}</p>
        </div>
        {result.score !== null && <ScoreCircle score={result.score} />}
        {result.loading && <span className="text-xs text-gray-500 animate-pulse">Assessing…</span>}
      </div>

      <div className="px-5 pb-3 border-t border-gray-700/50 pt-3">
        <p className="text-xs text-gray-500 mb-1">Your answer</p>
        {isCode ? (
          <pre className="rounded bg-black/40 border border-gray-700 px-3 py-2 text-xs text-gray-200 font-mono overflow-x-auto whitespace-pre leading-relaxed max-h-48">
            {result.userAnswer || <span className="text-gray-600 italic">No code submitted</span>}
          </pre>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {result.userAnswer || <span className="text-gray-600 italic">No answer given</span>}
          </p>
        )}
      </div>

      {result.aiFeedback && (
        <div className="px-5 pb-3 border-t border-gray-700/50 pt-3 bg-primary/5">
          <p className="text-xs text-primary font-semibold mb-1">AI Feedback</p>
          <p className="text-sm text-gray-300 leading-relaxed">{result.aiFeedback}</p>
        </div>
      )}

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
