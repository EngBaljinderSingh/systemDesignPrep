import { useState, useMemo } from 'react';
import {
  interviewQuestions,
  type Technology,
  type ExperienceLevel,
} from '../data/interviewQuestions';

const TECHNOLOGIES: Technology[] = [
  'Java',
  'Spring Boot',
  'JavaScript',
  'TypeScript',
  'React',
  'Angular',
  'CSS',
  'Database',
  'JPA',
  'Data Structures',
  'Java 8',
  'Multithreading',
  'Frameworks & Patterns',
  'Puzzles',
  'Coding',
  'System Design',
];

const EXPERIENCES: ExperienceLevel[] = ['Junior', 'Mid', 'Senior'];

const TECH_COLOR: Record<Technology, string> = {
  Java:                   'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Spring Boot':          'bg-green-500/15 text-green-300 border-green-500/30',
  JavaScript:             'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  TypeScript:             'bg-blue-400/15 text-blue-300 border-blue-400/30',
  React:                  'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  Angular:                'bg-red-500/15 text-red-300 border-red-500/30',
  CSS:                    'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Database:               'bg-purple-500/15 text-purple-300 border-purple-500/30',
  JPA:                    'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'Data Structures':      'bg-teal-500/15 text-teal-300 border-teal-500/30',
  'Java 8':               'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Multithreading:         'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'Frameworks & Patterns':'bg-pink-500/15 text-pink-300 border-pink-500/30',
  Puzzles:                'bg-lime-500/15 text-lime-300 border-lime-500/30',
  Coding:                 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'System Design':        'bg-pink-500/15 text-pink-300 border-pink-500/30',
};

const EXP_COLOR: Record<ExperienceLevel, string> = {
  Junior: 'bg-green-500/10 text-green-300 border-green-500/30',
  Mid:    'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  Senior: 'bg-red-500/10 text-red-300 border-red-500/30',
};

export default function InterviewQuestionsPage() {
  const [techFilter, setTechFilter] = useState<Technology | 'All'>('All');
  const [expFilter, setExpFilter] = useState<ExperienceLevel | 'All'>('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return interviewQuestions.filter((q) => {
      const matchTech = techFilter === 'All' || q.technology === techFilter;
      const matchExp  = expFilter === 'All'  || q.experience.includes(expFilter as ExperienceLevel);
      const matchSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
                          q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchTech && matchExp && matchSearch;
    });
  }, [techFilter, expFilter, search]);

  const countByTech = useMemo(() => {
    const map: Partial<Record<Technology, number>> = {};
    interviewQuestions.forEach((q) => {
      map[q.technology] = (map[q.technology] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Interview Questions</h1>
        <p className="text-sm text-gray-400">
          {interviewQuestions.length} questions · Filter by technology and experience level
        </p>
      </div>

      {/* Tech summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TECHNOLOGIES.map((t) => (
          <span
            key={t}
            className={`px-2.5 py-1 rounded border text-xs font-medium ${TECH_COLOR[t]}`}
          >
            {t} <span className="opacity-60">{countByTech[t] ?? 0}</span>
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <input
          type="text"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm bg-surface border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary flex-1 min-w-48"
        />

        {/* Experience filter */}
        <div className="flex gap-1 items-center">
          <span className="text-xs text-gray-500 mr-1">Level:</span>
          {(['All', ...EXPERIENCES] as const).map((e) => (
            <button
              key={e}
              onClick={() => setExpFilter(e)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                expFilter === e
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Technology filter */}
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value as Technology | 'All')}
          className="text-xs px-3 py-1.5 bg-surface border border-gray-600 rounded text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Technologies</option>
          {TECHNOLOGIES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500 mb-3">
        Showing {filtered.length} of {interviewQuestions.length} questions
      </p>

      {/* Question list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No questions match your filters.</div>
        )}
        {filtered.map((q, idx) => (
          <div
            key={q.id}
            className="border border-gray-700 rounded-lg overflow-hidden bg-surface-light"
          >
            {/* Row header */}
            <button
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-xs text-gray-600 w-6 flex-shrink-0 mt-0.5">{idx + 1}</span>

              <span className="flex-1 text-sm font-medium text-white leading-snug">{q.question}</span>

              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                {/* Tech badge */}
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${TECH_COLOR[q.technology]}`}>
                  {q.technology}
                </span>

                {/* Experience badges */}
                <div className="flex gap-1">
                  {q.experience.map((e) => (
                    <span key={e} className={`text-xs px-1.5 py-0.5 rounded border ${EXP_COLOR[e]}`}>
                      {e}
                    </span>
                  ))}
                </div>

                <span className="text-gray-600 text-xs">{expanded === q.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Answer */}
            {expanded === q.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-700/50">
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {q.answer}
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {q.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
