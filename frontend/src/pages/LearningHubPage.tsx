import { useState, useCallback, useEffect } from 'react';
import {
  learningTopics,
  type LearningTopic,
  type LearningSubtopic,
  type LearningConcept,
  type TopicCategory,
} from '../data/learningTopics';

// ─── Progress hook ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'sdp-learned-concepts';

function useProgress() {
  const [learned, setLearned] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback((id: string) => {
    setLearned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { learned, toggle };
}

// ─── Category config ───────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<TopicCategory, string> = {
  Language:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Framework:    'bg-green-500/20 text-green-300 border-green-500/30',
  Cloud:        'bg-orange-500/20 text-orange-300 border-orange-500/30',
  DevOps:       'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Database:     'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Architecture: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

const LEVEL_COLORS = {
  Beginner:     'text-green-400 bg-green-900/20 border-green-700/30',
  Intermediate: 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30',
  Advanced:     'text-red-400 bg-red-900/20 border-red-700/30',
};

// ─── Quiz component ────────────────────────────────────────────────────────
function QuizBlock({ concept }: { concept: LearningConcept }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { quiz } = concept;
  if (!quiz) return null;

  const answered   = selected !== null;
  const isCorrect  = selected === quiz.answer;

  return (
    <div className="mt-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-4 space-y-3">
      <p className="text-sm font-semibold text-indigo-300">🎯 Quick Quiz</p>
      <p className="text-sm text-gray-300">{quiz.question}</p>
      <div className="space-y-1.5">
        {quiz.options.map((opt, i) => {
          let cls = 'w-full text-left text-sm px-3 py-2 rounded border transition-colors ';
          if (!answered) {
            cls += 'border-gray-700 text-gray-400 hover:border-primary/50 hover:text-white hover:bg-white/5';
          } else if (i === quiz.answer) {
            cls += 'border-green-600/50 bg-green-900/30 text-green-300';
          } else if (i === selected) {
            cls += 'border-red-600/50 bg-red-900/30 text-red-300';
          } else {
            cls += 'border-gray-800 text-gray-600';
          }
          return (
            <button key={i} disabled={answered} onClick={() => setSelected(i)} className={cls}>
              <span className="font-mono mr-2 text-xs">
                {answered && i === quiz.answer ? '✓' : answered && i === selected ? '✗' : String.fromCharCode(65 + i) + '.'}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`text-sm p-3 rounded border ${isCorrect ? 'bg-green-900/30 border-green-700/30 text-green-300' : 'bg-red-900/30 border-red-700/30 text-red-300'}`}>
          {isCorrect ? '🎉 Correct! ' : '💡 Not quite. '}
          <span className="text-gray-300">{quiz.explanation}</span>
        </div>
      )}
    </div>
  );
}

// ─── Concept card ──────────────────────────────────────────────────────────
function ConceptCard({
  concept,
  isLearned,
  onToggleLearned,
}: {
  concept: LearningConcept;
  isLearned: boolean;
  onToggleLearned: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-lg transition-all ${
        isLearned ? 'border-green-700/40 bg-green-900/10' : 'border-gray-700 bg-white/3'
      }`}
    >
      {/* Header row */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-lg"
        onClick={() => setExpanded((v) => !v)}
      >
        <button
          className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 text-xs transition-colors ${
            isLearned ? 'bg-green-600 border-green-600 text-white' : 'border-gray-600 hover:border-green-500'
          }`}
          onClick={(e) => { e.stopPropagation(); onToggleLearned(concept.id); }}
          title={isLearned ? 'Mark as not learned' : 'Mark as learned'}
        >
          {isLearned && '✓'}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{concept.name}</span>
            <span className="text-gray-500 text-sm ml-2 shrink-0">{expanded ? '▲' : '▼'}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{concept.summary}</p>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-700/50 pt-4">
          {concept.codeExample && (
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Code Example</p>
              <pre className="bg-gray-900 rounded p-3 text-xs text-gray-300 overflow-x-auto leading-relaxed border border-gray-800 whitespace-pre-wrap">
                {concept.codeExample}
              </pre>
            </div>
          )}

          {concept.funFact && (
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-3">
              <p className="text-xs text-yellow-300 leading-relaxed">{concept.funFact}</p>
            </div>
          )}

          {concept.quiz && <QuizBlock concept={concept} />}
        </div>
      )}
    </div>
  );
}

// ─── Topic card (grid) ─────────────────────────────────────────────────────
function TopicCard({
  topic,
  isSelected,
  learnedCount,
  totalCount,
  onClick,
}: {
  topic: LearningTopic;
  isSelected: boolean;
  learnedCount: number;
  totalCount: number;
  onClick: () => void;
}) {
  const pct = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-100 ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
          : 'border-gray-700 bg-white/3 hover:border-gray-500'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{topic.icon}</span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{topic.name}</h3>
          <span className={`text-xs px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[topic.category]}`}>
            {topic.category}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{topic.tagline}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{learnedCount}/{totalCount} concepts</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all bg-gradient-to-r ${topic.gradient}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function LearningHubPage() {
  const { learned, toggle } = useProgress();
  const [selectedTopic, setSelectedTopic]       = useState<LearningTopic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<LearningSubtopic | null>(null);
  const [categoryFilter, setCategoryFilter]     = useState<TopicCategory | 'All'>('All');
  const [search, setSearch]                     = useState('');
  const [isSidebarOpen, setIsSidebarOpen]       = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));

  // Count concepts per topic
  function countConcepts(topic: LearningTopic) {
    return topic.subtopics.flatMap((s) => s.concepts).length;
  }
  function countLearned(topic: LearningTopic) {
    return topic.subtopics.flatMap((s) => s.concepts).filter((c) => learned.has(c.id)).length;
  }

  // Reset subtopic when topic changes
  useEffect(() => {
    if (selectedTopic) setSelectedSubtopic(selectedTopic.subtopics[0] ?? null);
  }, [selectedTopic]);

  const categories: Array<TopicCategory | 'All'> = [
    'All', 'Language', 'Framework', 'Cloud', 'DevOps', 'Database', 'Architecture',
  ];

  const filteredTopics = learningTopics.filter((t) => {
    const matchesCat    = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch = search === '' || t.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalAll   = learningTopics.reduce((sum, t) => sum + countConcepts(t), 0);
  const learnedAll = learningTopics.reduce((sum, t) => sum + countLearned(t), 0);

  return (
    <div className="flex h-full min-h-[calc(100vh-3rem)] relative overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Left panel: topic selector ──────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 bg-surface flex flex-col w-80 max-w-[85vw] border-r border-gray-700 transition-transform duration-200 ease-in-out shadow-2xl md:shadow-none
          md:static md:z-auto
          ${isSidebarOpen
            ? 'translate-x-0 md:w-80 md:flex'
            : '-translate-x-full md:w-0 md:hidden md:border-none'
          }
        `}
      >
        {/* Header + overall progress */}
        <div className="p-4 border-b border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-white">Learning Hub</h1>
              <p className="text-xs text-gray-500">{learnedAll}/{totalAll} concepts learned</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close panel"
            >
              <span className="text-xs font-mono">✕</span>
            </button>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all"
              style={{ width: `${totalAll === 0 ? 0 : Math.round((learnedAll / totalAll) * 100)}%` }}
            />
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search topics…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary"
          />

          {/* Category filter */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topic grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-1 gap-2">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isSelected={selectedTopic?.id === topic.id}
                learnedCount={countLearned(topic)}
                totalCount={countConcepts(topic)}
                onClick={() => {
                  setSelectedTopic(topic);
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
              />
            ))}
            {filteredTopics.length === 0 && (
              <p className="text-center text-gray-600 text-sm py-8">No topics found</p>
            )}
          </div>
        </div>
      </aside>

      {/* ── Right area: subtopics + concepts ────────────────────────────── */}
      {selectedTopic ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-w-0">
          {/* Subtopic sidebar: horizontal scrollable on mobile, column on desktop */}
          <div className="w-full md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col bg-surface/40">
            {/* Top Toolbar in Topic Header */}
            <div className={`p-3 sm:p-4 bg-gradient-to-br ${selectedTopic.gradient} bg-opacity-10`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-2xl shrink-0">{selectedTopic.icon}</span>
                  <span className="text-sm sm:text-base font-bold text-white truncate">{selectedTopic.name}</span>
                </div>
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="shrink-0 px-2 py-1 text-[11px] font-semibold rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                    title="Change topic"
                  >
                    🎓 Topics
                  </button>
                )}
              </div>
              <p className="text-xs text-white/70 line-clamp-1">{selectedTopic.tagline}</p>
            </div>

            {/* Subtopic list: horizontal scroll on mobile, vertical list on desktop */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto py-2 px-2 md:px-0 gap-1 md:gap-0 shrink-0">
              {selectedTopic.subtopics.map((sub) => {
                const subLearned = sub.concepts.filter((c) => learned.has(c.id)).length;
                const isActive   = selectedSubtopic?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubtopic(sub)}
                    className={`whitespace-nowrap md:whitespace-normal shrink-0 md:shrink md:w-full text-left px-3 py-2 md:py-2.5 rounded-lg md:rounded-none transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary/20 md:bg-primary/15 md:border-r-2 md:border-primary text-white border border-primary/30 md:border-none'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="text-xs font-medium leading-tight">{sub.name}</div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border ${LEVEL_COLORS[sub.level]}`}>
                        {sub.level}
                      </span>
                      <span className="text-[10px] text-gray-500">{subLearned}/{sub.concepts.length}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concepts detail panel */}
          <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-5 space-y-4 bg-surface-dark">
            {/* Top Toolbar to toggle sidebar */}
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-gray-800/80">
              <div className="flex items-center gap-2">
                {!isSidebarOpen ? (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 transition-colors shadow-sm cursor-pointer"
                    title="Show topics list"
                  >
                    <span>🎓</span>
                    <span>All Topics ({filteredTopics.length})</span>
                    <span className="text-[10px]">▶</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-gray-700 transition-colors cursor-pointer"
                    title="Collapse sidebar panel"
                  >
                    <span>◀</span>
                    <span>Collapse Topics</span>
                  </button>
                )}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-surface border border-gray-700 text-gray-200 hover:text-white"
                >
                  <span>🎓</span> Change Topic
                </button>
              </div>
              {selectedSubtopic && (
                <div className="text-xs text-gray-400 truncate">
                  <span className="text-gray-500 hidden sm:inline">Module: </span>
                  <span className="font-semibold text-white">{selectedSubtopic.name}</span>
                </div>
              )}
            </div>

            {selectedSubtopic ? (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-white">{selectedSubtopic.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded border ${LEVEL_COLORS[selectedSubtopic.level]}`}>
                      {selectedSubtopic.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{selectedSubtopic.description}</p>
                </div>

                <div className="space-y-3">
                  {selectedSubtopic.concepts.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      isLearned={learned.has(concept.id)}
                      onToggleLearned={toggle}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                Select a subtopic
              </div>
            )}
          </main>
        </div>
      ) : (
        /* Welcome screen */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm space-y-4 p-8">
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="text-xl font-bold text-white">Learning Hub</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Structured learning paths for Java, Spring Boot, React, Angular, Python, AWS, GCP,
              Terraform, Docker, Kubernetes, TypeScript, SQL, Microservices, and Security.
            </p>
            <p className="text-gray-600 text-xs">
              Select a topic on the left to get started. Mark concepts as learned to track progress.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {learningTopics.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="text-center p-3 rounded-lg bg-white/5 border border-gray-700 cursor-pointer hover:border-gray-500 transition-colors"
                  onClick={() => setSelectedTopic(t)}
                >
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="text-xs text-gray-400">{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
