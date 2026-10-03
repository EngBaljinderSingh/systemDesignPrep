import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Palette, Award, Coffee } from 'lucide-react';
import ProMonetizationModal from '../components/ProMonetizationModal';

export default function HomePage() {
  const [isProOpen, setIsProOpen] = useState(false);
  const [demoDau, setDemoDau] = useState<number>(100); // 100 Million
  const [demoWorkload, setDemoWorkload] = useState<'whatsapp' | 'ratelimit' | 'booking'>('whatsapp');

  // Mini simulator calculations for hero preview
  const demoMetrics = (() => {
    if (demoWorkload === 'whatsapp') {
      const dailyMsgs = demoDau * 50; // million msgs
      const peakConns = (demoDau * 0.2).toFixed(1); // 20%
      const nodesNeeded = Math.ceil((demoDau * 0.2) / 3.0); // 3M sockets/node
      return {
        metric1: `${dailyMsgs >= 1000 ? (dailyMsgs / 1000).toFixed(1) + 'B' : dailyMsgs + 'M'} Msgs/Day`,
        metric2: `${peakConns}M Peak Conns`,
        bottleneck: 'Network / OS Sockets',
        bottleneckColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
        bottleneckReason: 'Linux kernel TCP buffer & socket cap at 3M sockets per 64GB box.',
        instances: `${nodesNeeded} × 64GB Nodes`,
      };
    } else if (demoWorkload === 'ratelimit') {
      const qps = Math.round((demoDau * 50 * 1000000) / 86400);
      const peakQps = qps * 2;
      const nodesNeeded = Math.ceil(peakQps / 5600); // 5,600 QPS on 8-core CPU
      return {
        metric1: `${(peakQps / 1000).toFixed(0)}K Peak QPS`,
        metric2: `6.4 GB Redis RAM`,
        bottleneck: 'CPU Core Execution',
        bottleneckColor: 'text-red-400 border-red-500/30 bg-red-500/10',
        bottleneckReason: 'Lua script serialization and crypto hash verification saturate CPU cores before RAM is 15% used.',
        instances: `${nodesNeeded} × 8-Core Nodes`,
      };
    } else {
      const peakQps = Math.round(((demoDau * 10 * 1000000) / 86400) * 3);
      const nodesNeeded = Math.ceil(peakQps / 4480);
      return {
        metric1: `${(peakQps / 1000).toFixed(0)}K Flash QPS`,
        metric2: `256 MB Lock State`,
        bottleneck: 'Distributed Lock CPU',
        bottleneckColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
        bottleneckReason: 'Redis SETNX verification and DB row transaction preparation take 2.5ms CPU time per seat.',
        instances: `${nodesNeeded} × 16-Core Nodes`,
      };
    }
  })();

  return (
    <div className="min-h-full pb-20 space-y-16">
      {/* ── Top Announcement Banner ── */}
      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-primary/20 py-2.5 px-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
          <span className="font-bold uppercase tracking-wider text-[11px] bg-primary/20 px-2 py-0.5 rounded-full">
            Featured
          </span>
          <span>New: Interactive Capacity Math & Bottleneck Simulators for FAANG HLD Rounds</span>
          <Link to="/hld-case-studies" className="underline underline-offset-2 hover:text-white transition-colors">
            Try Now →
          </Link>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-6 pt-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-light border border-gray-700/80 text-xs font-medium text-gray-300 shadow-inner">
          <Sparkles size={14} className="text-yellow-400" />
          <span>The Definitive High-Level Design (HLD) & System Architecture Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Crack the System Design Interview with{' '}
          <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Real Math & Bottleneck Analysis
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Stop memorizing architecture diagrams blindly. Understand the exact storage calculations, memory vs CPU bottlenecks, and Linux OS socket caps expected by Principal Engineers at Meta, Google & Uber.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/hld-case-studies"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-primary/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <span>Explore HLD Case Studies</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/canvas"
            className="px-6 py-3 rounded-xl bg-surface-light hover:bg-white/10 text-white font-semibold text-sm border border-gray-700/80 transition-all flex items-center gap-2"
          >
            <Palette size={16} className="text-primary" />
            <span>Launch Design Canvas</span>
          </Link>

          <button
            onClick={() => setIsProOpen(true)}
            className="px-5 py-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-semibold text-sm border border-yellow-500/30 transition-all flex items-center gap-1.5"
          >
            <Award size={16} />
            <span>Go Pro ($29)</span>
          </button>
        </div>

        {/* Value Proof Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-400" />
            <span>5 FAANG Architecture Blueprints</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-400" />
            <span>Interactive Real-Time Sizing Simulator</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-400" />
            <span>Zero Fluff · Production-Grade Formulas</span>
          </div>
        </div>
      </section>

      {/* ── Interactive Live Hero Preview Widget ── */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-b from-surface-light/90 to-surface/90 border border-gray-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎛️</span>
              <div>
                <h3 className="text-sm font-bold text-white">Live Bottleneck Radar Preview</h3>
                <p className="text-[11px] text-gray-400">See how scaling traffic shifts the system bottleneck</p>
              </div>
            </div>

            {/* Workload selector pills */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-gray-800 self-start sm:self-auto text-xs">
              <button
                onClick={() => setDemoWorkload('whatsapp')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  demoWorkload === 'whatsapp' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                💬 WhatsApp
              </button>
              <button
                onClick={() => setDemoWorkload('ratelimit')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  demoWorkload === 'ratelimit' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                🚦 Rate Limiter
              </button>
              <button
                onClick={() => setDemoWorkload('booking')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  demoWorkload === 'booking' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                🎬 BookMyShow
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-medium">Scale Traffic (Daily Active Users):</span>
              <span className="font-mono text-primary font-bold text-sm">{demoDau} Million Users</span>
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={10}
              value={demoDau}
              onChange={(e) => setDemoDau(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Live Output Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-black/30 border border-gray-800 rounded-xl p-3">
              <div className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Load & Throughput</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">{demoMetrics.metric1}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{demoMetrics.metric2}</div>
            </div>

            <div className="bg-black/30 border border-gray-800 rounded-xl p-3">
              <div className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Detected Bottleneck</div>
              <div className="mt-1">
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${demoMetrics.bottleneckColor}`}>
                  {demoMetrics.bottleneck}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">{demoMetrics.bottleneckReason}</div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-3">
              <div className="text-[11px] text-primary uppercase tracking-wider font-semibold">Hardware Sizing</div>
              <div className="text-base font-black text-white font-mono mt-0.5">{demoMetrics.instances}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Sized with 70% safety headroom</div>
            </div>
          </div>

          <div className="text-center pt-1">
            <Link
              to="/hld-case-studies"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
            >
              Open Full Interactive Case Studies & Calculation Blueprints <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 Main Pillars Section ── */}
      <section className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Complete Preparation Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Structured systematically from high-level system trade-offs to coding algorithm patterns and mock interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: HLD & Architecture */}
          <div className="bg-gradient-to-b from-blue-950/20 to-surface-light border border-blue-500/30 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-400/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl">
                📐
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Flagship Feature
                </span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-blue-300 transition-colors">
                  High-Level Design & Bottleneck Math
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Deep-dive architectures (WhatsApp, Rate Limiter, Ticketmaster, TinyURL, Video Streaming) with live capacity sliders, memory/CPU constraint analysis, and Staff Q&A.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> 5 Production-grade architecture blueprints
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> QPS, Storage & Bandwidth formulas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> Linux 3M socket limit & hardware sizing
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/hld-case-studies"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>Launch HLD Lab</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: System Design & Canvas */}
          <div className="bg-gradient-to-b from-purple-950/20 to-surface-light border border-purple-500/30 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-400/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl">
                🏗️
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Architecture Patterns
                </span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-purple-300 transition-colors">
                  Distributed Patterns & Canvas
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Interactive architecture whiteboard powered by ReactFlow. Master Sharding, Caching strategies, Circuit Breakers, Event-Driven, and CQRS patterns.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> 11 Distributed system patterns
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Freeform node-based architecture canvas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Visual animations & state transitions
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/system-design"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-600/20"
              >
                <span>Explore Patterns</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3: Coding & Interview Prep */}
          <div className="bg-gradient-to-b from-emerald-950/20 to-surface-light border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-400/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  DSA & Interview Prep
                </span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-emerald-300 transition-colors">
                  Algo Patterns & Mock Practice
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  12 core algorithm patterns, problem bank with hints, 100+ real interview Q&A flashcards, in-browser code editor, and resume builder.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Sliding Window, Two Pointers, BFS/DFS, DP
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 100+ Staff-level behavioral & tech Q&A
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Monaco Code Editor with multi-language support
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/algorithms"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <span>Practice Algo Patterns</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Most Candidates Fail HLD (Comparison) ── */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="border border-gray-700/80 rounded-2xl bg-surface-light overflow-hidden">
          <div className="p-6 border-b border-gray-800 text-center space-y-1">
            <h3 className="text-xl font-bold text-white">Why 85% of Candidates Fail System Design</h3>
            <p className="text-xs text-gray-400 max-w-lg mx-auto">
              Interviewers at Tier-1 tech companies immediately spot candidates reciting generic buzzwords vs candidates who calculate real system bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
            {/* The Old Way */}
            <div className="p-6 space-y-3 bg-red-950/10">
              <div className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                ❌ Traditional Hand-Waving Prep
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>"Just add a Redis cache in front of PostgreSQL" without calculating key sizes or eviction policies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>Assuming adding more RAM will hold 20M WebSocket connections, ignoring Linux OS TCP socket file descriptor caps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>Drawing boxes with no idea if the bottleneck is CPU time, memory thread stacks, or network bandwidth egress.</span>
                </li>
              </ul>
            </div>

            {/* The SDP Way */}
            <div className="p-6 space-y-3 bg-green-950/10">
              <div className="text-xs font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                ✅ System Design Prep (SDP) Framework
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>Exact capacity equations: calculate 6.4 GB Redis memory for 100M keys and 116K QPS CPU core constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>Hardware heuristics: 70% safe resource rule, 86,400s shortcut, and Linux 3M socket boundary per node.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>Staff engineer trade-offs: Redis Lua atomicity vs optimistic locks; WebSocket vs SSE; fail-open vs fail-closed.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community & Support Section ── */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/40 border border-primary/40 rounded-2xl p-8 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} /> 100% Free & Open Tech Education
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Master Large-Scale Distributed Systems
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            All 5 comprehensive HLD blueprints, Staff engineer interview follow-ups, capacity estimation calculators, and interactive architecture visualizers are completely free for everyone.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/hld-case-studies"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] inline-flex items-center gap-2"
            >
              <span>Explore HLD Playbook</span>
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={() => setIsProOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all hover:scale-[1.02] inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Coffee size={16} />
              <span>Buy Me a Coffee</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-400">
            Created with ❤️ to help software engineers crack Senior & Staff system design interviews.
          </p>
        </div>
      </section>

      {/* Pro Modal */}
      <ProMonetizationModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
    </div>
  );
}
