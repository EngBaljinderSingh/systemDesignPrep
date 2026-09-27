import { useState, useEffect, useRef } from 'react';
import {
  Shield, Zap, Brain, Target, Crown,
  Lock, CheckCircle, AlertTriangle,
  RefreshCw, X, Terminal, Heart, Star, Award,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { campaignApi } from '../api/campaignApi';
import type { ChallengeResponse, SubmitAnswerResponse } from '../api/campaignApi';

// ── Types ─────────────────────────────────────────────────────────────────────
type GamePhase = 'MAP' | 'LOADING' | 'CHALLENGE' | 'RESULT' | 'GAMEOVER';
type FlashEffect = 'none' | 'success' | 'warning' | 'danger';

interface RegionConfig {
  id: number;
  name: string;
  shortName: string;
  bossName: string;
  Icon: LucideIcon;
  textColor: string;
  borderColor: string;
  bgColor: string;
  glowHex: string;
  description: string;
  skills: string[];
  unlockSkill: string;
  emoji: string;
}

// ── Region definitions ────────────────────────────────────────────────────────
const REGIONS: RegionConfig[] = [
  {
    id: 1,
    name: 'The Pre-Screen Gateway',
    shortName: 'Gateway',
    bossName: 'Kael the Recruiter Golem',
    Icon: Shield,
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-950/50',
    glowHex: '#3b82f6',
    description: 'Relocation · Compensation · Canada / UK / Japan',
    skills: ['Compensation Negotiation', 'Relocation Protocols', 'Market Positioning'],
    unlockSkill: 'Negotiation Mastery',
    emoji: '🛡️',
  },
  {
    id: 2,
    name: 'The Concurrency Labyrinth',
    shortName: 'Labyrinth',
    bossName: 'Baron Von Deadlock',
    Icon: Zap,
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-950/50',
    glowHex: '#a855f7',
    description: 'Virtual Threads · CompletableFuture · Memory Model',
    skills: ['Virtual Threads (Loom)', 'Lock-Free Algorithms', 'Memory Model'],
    unlockSkill: 'Thread Weaving',
    emoji: '⚡',
  },
  {
    id: 3,
    name: 'Citadel of Distributed Scale',
    shortName: 'Citadel',
    bossName: 'The Partition Daemon',
    Icon: Brain,
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-950/50',
    glowHex: '#f97316',
    description: 'Kafka · Saga Pattern · Redis · CAP Theorem',
    skills: ['Distributed Sagas', 'Kafka Streams', 'Redis Write-Through'],
    unlockSkill: "Architect's Sight",
    emoji: '🗼',
  },
  {
    id: 4,
    name: 'The Agentic AI Rift',
    shortName: 'AI Rift',
    bossName: 'The Hallucination Hydra',
    Icon: Target,
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    bgColor: 'bg-cyan-950/50',
    glowHex: '#06b6d4',
    description: 'RAG Pipelines · MCP Protocol · Prompt Hardening',
    skills: ['RAG Architecture', 'MCP Servers', 'Prompt Injection Defence'],
    unlockSkill: 'AI Warden',
    emoji: '🤖',
  },
  {
    id: 5,
    name: 'The Council of Captains',
    shortName: 'Council',
    bossName: 'The Five Warlords',
    Icon: Crown,
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-950/50',
    glowHex: '#eab308',
    description: 'STAR Method · Incident Command · Executive Vision',
    skills: ['Outage Triage', 'Executive Storytelling', 'Team Vision'],
    unlockSkill: "Captain's Authority",
    emoji: '👑',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function InterviewCampaignMap() {
  // Game state
  const [currentRegion, setCurrentRegion] = useState(1);
  const [confidenceScore, setConfidenceScore] = useState(100);
  const [unlockedRegions, setUnlockedRegions] = useState<Set<number>>(new Set([1]));
  const [completedRegions, setCompletedRegions] = useState<Set<number>>(new Set());
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);

  // UI / flow state
  const [phase, setPhase] = useState<GamePhase>('MAP');
  const [activeRegion, setActiveRegion] = useState<RegionConfig | null>(null);
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<SubmitAnswerResponse | null>(null);
  const [typedScenario, setTypedScenario] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<FlashEffect>('none');

  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Typewriter effect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!challenge) return;
    setTypedScenario('');
    let i = 0;
    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      i++;
      setTypedScenario(challenge.scenario.slice(0, i));
      if (i >= challenge.scenario.length && typingRef.current) {
        clearInterval(typingRef.current);
      }
    }, 10);
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [challenge]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRegionClick = async (regionId: number) => {
    if (!unlockedRegions.has(regionId)) return;
    const region = REGIONS.find(r => r.id === regionId)!;
    setActiveRegion(region);
    setSelectedOption(null);
    setError(null);
    setChallenge(null);
    setTypedScenario('');
    setPhase('LOADING');
    try {
      const res = await campaignApi.getChallenge(regionId);
      setChallenge(res.data);
      setPhase('CHALLENGE');
    } catch {
      setError('Failed to load challenge. Please try again.');
      setPhase('MAP');
    }
  };

  const handleSubmit = async () => {
    if (!challenge || selectedOption === null) return;
    setPhase('LOADING');
    try {
      const res = await campaignApi.submitAnswer(challenge.challengeId, challenge.regionId, selectedOption);
      const result = res.data;
      setLastResult(result);

      // Update confidence (capped 0–130)
      const newScore = Math.max(0, Math.min(130, confidenceScore + result.scoreImpact));
      setConfidenceScore(newScore);

      // Unlock progression on LEAD
      if (result.unlockedNextRegion) {
        const nextId = challenge.regionId + 1;
        setUnlockedRegions(prev => new Set([...prev, nextId]));
        setCompletedRegions(prev => new Set([...prev, challenge.regionId]));
        setCurrentRegion(nextId);
        const r = REGIONS.find(x => x.id === challenge.regionId);
        if (r) setUnlockedSkills(prev => [...prev, `${r.emoji} ${r.unlockSkill}`]);
      }

      // Flash feedback
      const effect: FlashEffect = result.gameOver ? 'danger' : result.unlockedNextRegion ? 'success' : 'warning';
      setFlash(effect);
      setTimeout(() => setFlash('none'), 700);

      if (result.gameOver) {
        setTimeout(() => setPhase('GAMEOVER'), 500);
      } else {
        setPhase('RESULT');
      }
    } catch {
      setError('Submission failed. Please try again.');
      setPhase('CHALLENGE');
    }
  };

  const handleReset = () => {
    setCurrentRegion(1);
    setConfidenceScore(100);
    setUnlockedRegions(new Set([1]));
    setCompletedRegions(new Set());
    setUnlockedSkills([]);
    setPhase('MAP');
    setActiveRegion(null);
    setChallenge(null);
    setSelectedOption(null);
    setLastResult(null);
    setError(null);
    setFlash('none');
  };

  // ── Derived UI values ──────────────────────────────────────────────────────
  const hpPercent = Math.min(100, Math.round((confidenceScore / 100) * 100));
  const hpColor =
    confidenceScore >= 60 ? 'bg-green-500' :
    confidenceScore >= 30 ? 'bg-yellow-500' : 'bg-red-500';

  const obj = REGIONS.find(r => r.id === currentRegion)!;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-full bg-gray-950 text-white select-none overflow-hidden">

      {/* Flash overlay */}
      {flash !== 'none' && (
        <div className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-700 ${
          flash === 'success' ? 'bg-green-500/15' :
          flash === 'warning' ? 'bg-yellow-500/15' :
          'bg-red-600/25'
        }`} />
      )}

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-5 py-2.5">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-base font-black tracking-widest text-primary uppercase leading-none">
              ⚔️ Interview Loop Odyssey
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Lead Engineer Campaign · Defeat 5 bosses · Claim the offer
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* HP bar */}
            <div className="flex items-center gap-2">
              <Heart size={13} className="text-red-400 shrink-0" />
              <div className="w-28">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-500">Confidence</span>
                  <span className={`font-bold ${confidenceScore >= 60 ? 'text-green-400' : confidenceScore >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {confidenceScore}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${hpColor}`}
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Region stars */}
            <div className="flex items-center gap-0.5">
              {REGIONS.map(r => (
                <Star
                  key={r.id}
                  size={13}
                  className={completedRegions.has(r.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}
                />
              ))}
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800"
            >
              <RefreshCw size={11} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-5 py-6 flex gap-5">

        {/* Sidebar */}
        <aside className="w-48 shrink-0 space-y-4">
          {/* Skills */}
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-3.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Award size={11} /> Skills Unlocked
            </p>
            {unlockedSkills.length === 0 ? (
              <p className="text-xs text-gray-600 italic">Defeat bosses to unlock skills…</p>
            ) : (
              <ul className="space-y-1.5">
                {unlockedSkills.map(skill => (
                  <li
                    key={skill}
                    className="text-xs text-green-400 flex items-start gap-1.5 bg-green-950/30 rounded px-2 py-1.5 border border-green-900/50"
                  >
                    <CheckCircle size={9} className="shrink-0 mt-0.5" /> {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Objective */}
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-3.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Objective</p>
            <p className={`text-sm font-bold ${obj.textColor}`}>{obj.emoji} {obj.shortName}</p>
            <p className="text-xs text-gray-500 mt-1 leading-snug">{obj.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {obj.skills.map(s => (
                <span key={s} className="text-xs bg-gray-800 rounded px-1.5 py-0.5 text-gray-400">{s}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Quest map */}
        <main className="flex-1">
          {/* Region nodes + path */}
          <div className="flex items-center px-2 py-12">
            {REGIONS.map((region, idx) => {
              const unlocked = unlockedRegions.has(region.id);
              const completed = completedRegions.has(region.id);
              const active = currentRegion === region.id && !completed;
              const locked = !unlocked;
              const Icon = region.Icon;

              return (
                <div key={region.id} className="flex items-center flex-1 last:flex-none">
                  {/* Node */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleRegionClick(region.id)}
                      disabled={locked}
                      title={locked ? 'Complete previous region to unlock' : region.bossName}
                      style={active ? { boxShadow: `0 0 22px ${region.glowHex}88` } : undefined}
                      className={[
                        'relative w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                        completed
                          ? `${region.bgColor} ${region.borderColor} opacity-70`
                          : active
                          ? `${region.bgColor} ${region.borderColor} scale-110 ring-2 ring-primary/50 ring-offset-2 ring-offset-gray-950`
                          : unlocked
                          ? `${region.bgColor} ${region.borderColor} hover:scale-105 cursor-pointer`
                          : 'bg-gray-900/30 border-gray-700 cursor-not-allowed opacity-35',
                      ].join(' ')}
                    >
                      {locked
                        ? <Lock size={22} className="text-gray-600" />
                        : completed
                        ? <CheckCircle size={22} className={region.textColor} />
                        : <Icon size={22} className={region.textColor} />
                      }
                      {/* Active pulse dot */}
                      {active && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full animate-pulse" />
                      )}
                    </button>

                    {/* Label */}
                    <div className="mt-2.5 text-center w-24">
                      <p className={`text-xs font-bold leading-tight ${locked ? 'text-gray-600' : region.textColor}`}>
                        {region.shortName}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-tight text-center">
                        vs {region.bossName.split(' ').slice(0, 2).join(' ')}
                      </p>
                      {completed && (
                        <span className="inline-block mt-1 text-xs bg-green-950/60 text-green-400 border border-green-800/50 rounded px-1.5 py-0.5">
                          ✓ Cleared
                        </span>
                      )}
                      {active && (
                        <span className="inline-block mt-1 text-xs bg-primary/20 text-primary border border-primary/40 rounded px-1.5 py-0.5">
                          ▶ Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Path connector */}
                  {idx < REGIONS.length - 1 && (
                    <div className="flex-1 mx-2 -mt-10">
                      <div
                        className={`h-0.5 w-full transition-colors duration-700 ${
                          completedRegions.has(region.id) ? 'bg-primary/60' : 'bg-gray-800'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Region detail cards */}
          <div className="grid grid-cols-5 gap-2 mt-1">
            {REGIONS.map(region => {
              const unlocked = unlockedRegions.has(region.id);
              return (
                <div
                  key={region.id}
                  className={`rounded-lg border p-2.5 transition-opacity ${
                    unlocked ? `${region.bgColor} ${region.borderColor}` : 'bg-gray-900/20 border-gray-800 opacity-40'
                  }`}
                >
                  <p className={`text-xs font-bold truncate ${region.textColor}`}>
                    {region.emoji} Region {region.id}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{region.description.split('·')[0].trim()}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ── CHALLENGE / LOADING OVERLAY ─────────────────────────────────── */}
      {(phase === 'LOADING' || phase === 'CHALLENGE') && activeRegion && (
        <div className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl rounded-2xl border ${activeRegion.borderColor} ${activeRegion.bgColor} backdrop-blur overflow-hidden shadow-2xl`}
            style={{ boxShadow: `0 0 40px ${activeRegion.glowHex}33` }}
          >
            {/* Terminal title bar */}
            <div className={`flex items-center justify-between px-5 py-2.5 border-b border-gray-700/50 bg-black/40`}>
              <div className="flex items-center gap-2">
                <Terminal size={14} className={activeRegion.textColor} />
                <span className={`text-sm font-bold ${activeRegion.textColor} tracking-wider uppercase`}>
                  Boss Encounter — {activeRegion.bossName}
                </span>
              </div>
              <button onClick={() => setPhase('MAP')} className="text-gray-500 hover:text-white transition-colors p-0.5">
                <X size={14} />
              </button>
            </div>

            {/* Loading spinner */}
            {phase === 'LOADING' && (
              <div className="p-12 flex flex-col items-center gap-3">
                <div className={`w-9 h-9 border-2 ${activeRegion.borderColor} border-t-transparent rounded-full animate-spin`} />
                <p className="text-sm text-gray-400">Generating challenge via AI…</p>
              </div>
            )}

            {/* Challenge content */}
            {phase === 'CHALLENGE' && challenge && (
              <div className="p-5 space-y-4">
                {/* Scenario */}
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-200 leading-relaxed min-h-20 border border-gray-800">
                  <span className={`font-bold ${activeRegion.textColor}`}>▶ SCENARIO &nbsp;</span>
                  {typedScenario}
                  {typedScenario.length < challenge.scenario.length && (
                    <span className="animate-pulse ml-0.5">▌</span>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {challenge.options.map((opt, idx) => (
                    <button
                      key={opt.index}
                      onClick={() => setSelectedOption(opt.index)}
                      className={[
                        'w-full text-left rounded-lg border px-4 py-3 text-sm transition-all duration-150',
                        selectedOption === opt.index
                          ? `${activeRegion.borderColor} ${activeRegion.bgColor} ${activeRegion.textColor}`
                          : 'border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-600 hover:bg-gray-900',
                      ].join(' ')}
                    >
                      <span className={`font-bold mr-2 ${selectedOption === opt.index ? activeRegion.textColor : 'text-gray-500'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt.text}
                    </button>
                  ))}
                </div>

                {error && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle size={11} /> {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className={[
                    'w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-150',
                    selectedOption !== null
                      ? `${activeRegion.bgColor} border ${activeRegion.borderColor} ${activeRegion.textColor} hover:brightness-125`
                      : 'bg-gray-800 border border-gray-700 text-gray-600 cursor-not-allowed',
                  ].join(' ')}
                >
                  ⚔️ Submit Answer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RESULT OVERLAY ──────────────────────────────────────────────── */}
      {phase === 'RESULT' && lastResult && (
        <div className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl border-2 p-7 text-center shadow-2xl ${
              lastResult.choiceType === 'LEAD'
                ? 'border-green-500 bg-green-950/60'
                : 'border-yellow-500 bg-yellow-950/60'
            }`}
          >
            <div className="text-5xl mb-3">
              {lastResult.choiceType === 'LEAD' ? '🎯' : '⚠️'}
            </div>
            <h3 className={`text-xl font-black mb-1 ${
              lastResult.choiceType === 'LEAD' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {lastResult.choiceType === 'LEAD' ? 'Senior-Level Response!' : 'Mid-Level Response'}
            </h3>
            <p className={`text-xs font-semibold mb-3 ${lastResult.scoreImpact > 0 ? 'text-green-300' : 'text-red-300'}`}>
              Confidence {lastResult.scoreImpact > 0 ? `+${lastResult.scoreImpact}` : lastResult.scoreImpact}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">{lastResult.feedback}</p>
            {lastResult.unlockedNextRegion && (
              <p className="text-xs text-green-400 bg-green-950/50 rounded px-3 py-2 mb-4 border border-green-800">
                ✨ New region unlocked — advance when ready
              </p>
            )}
            <button
              onClick={() => setPhase('MAP')}
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors"
            >
              Continue Campaign →
            </button>
          </div>
        </div>
      )}

      {/* ── GAME OVER ───────────────────────────────────────────────────── */}
      {phase === 'GAMEOVER' && (
        <div className="fixed inset-0 z-40 bg-black/97 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border-2 border-red-700 bg-red-950/40 p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-black text-red-400 tracking-widest uppercase mb-2">
              Production Outage
            </h2>
            <p className="text-sm text-red-300 mb-5">
              {lastResult?.feedback ?? 'Your decision triggered a critical incident. The team is paged.'}
            </p>
            <div className="bg-black/60 rounded-lg p-3 font-mono text-xs text-red-400 text-left mb-6 border border-red-900/60 space-y-0.5">
              <p>[CRITICAL] PagerDuty P0: incident bridge open</p>
              <p>[CRITICAL] Confidence drained to: {confidenceScore}</p>
              <p>[INFO] &nbsp;&nbsp;&nbsp;Regions cleared: {completedRegions.size} / 5</p>
              <p>[ACTION] Post-mortem required before re-entry</p>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={13} /> Restart Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
