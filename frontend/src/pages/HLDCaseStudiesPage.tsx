import { useState } from 'react';
import { hldCaseStudies, capacityRules, type HLDCaseStudy } from '../data/systemDesignCaseStudies';
import CapacityBottleneckSimulator from '../components/CapacityBottleneckSimulator';
import ProMonetizationModal from '../components/ProMonetizationModal';
import {
  Sparkles,
  Layers,
  Calculator,
  Server,
  HelpCircle,
  GitBranch,
  Download,
  AlertCircle,
  Maximize2,
  Coffee
} from 'lucide-react';

// ── Capacity Rules Panel ──────────────────────────────────────────────────
function CapacityRulesPanel() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-950/40 border border-primary/30 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> The Universal Formula Cheat Sheet
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Capacity Planning & Bottleneck Heuristics
            </h2>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Master the mental math models used by Principal Engineers at Meta, Google, and Amazon to estimate QPS, storage, and cluster sizing under 3 minutes in an interview.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {capacityRules.map((rule, i) => (
          <div
            key={i}
            className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 hover:border-primary/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-mono font-bold text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-white text-sm">{rule.title}</h3>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">RULE 0{i + 1}</span>
              </div>
              <div className="mb-3 font-mono text-xs bg-black/40 border border-gray-700/80 rounded-xl px-3.5 py-2.5 text-green-300">
                {rule.formula}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{rule.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-primary/90 font-medium">
              💡 {rule.keyRule}
            </div>
          </div>
        ))}
      </div>

      {/* Bottleneck Reference Table */}
      <div className="border border-gray-700/80 rounded-2xl overflow-hidden bg-surface-light">
        <div className="bg-white/5 px-5 py-3 border-b border-gray-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🚨</span>
            <h3 className="text-sm font-bold text-white">System Bottleneck Quick Reference Matrix</h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">4 Core Hardware Dimensions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-black/20 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="text-left px-5 py-3">Bottleneck Type</th>
                <th className="text-left px-5 py-3">Trigger Condition</th>
                <th className="text-left px-5 py-3">Architectural Symptom</th>
                <th className="text-left px-5 py-3">Senior Engineering Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {[
                {
                  type: '🧠 Memory (RAM)',
                  condition: 'Large thread stacks (1-2MB/req) or large active cache keys (Redis)',
                  symptom: 'Out Of Memory (OOM) killer crashes before CPU reaches 40%',
                  fix: 'Migrate to Async Non-blocking I/O (Netty/Go) or scale RAM vertically',
                  color: 'text-purple-300',
                },
                {
                  type: '⚡ CPU Core Execution',
                  condition: 'Cryptographic hashing, distributed lock contention, complex JSON deserialization',
                  symptom: 'All cores peg at 100%, request queues surge, latency spikes to seconds',
                  fix: 'Scale out CPU cores, offload locks to Redis Lua, cache serialized responses',
                  color: 'text-red-300',
                },
                {
                  type: '🌐 Network / OS Socket Cap',
                  condition: 'High concurrent long-lived TCP/WebSocket connections (>2.5M/server)',
                  symptom: 'Linux kernel packet drops, file descriptor exhaustion (`EMFILE`), socket memory bloat',
                  fix: 'Scale out horizontally across 64GB nodes capped at ~2.5M to 3M connections each',
                  color: 'text-blue-300',
                },
                {
                  type: '💾 Storage IOPS & Disk I/O',
                  condition: 'Uncached random reads, synchronous write commits on relational databases',
                  symptom: 'High disk queue depth, thread blocking on `fsync`, database connection pool starvation',
                  fix: '80-20 Redis caching layer, LSM-tree NoSQL (Cassandra), write batching via Kafka',
                  color: 'text-yellow-300',
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/3 transition-colors">
                  <td className={`px-5 py-3.5 font-bold ${row.color}`}>{row.type}</td>
                  <td className="px-5 py-3.5 text-gray-300">{row.condition}</td>
                  <td className="px-5 py-3.5 text-gray-400">{row.symptom}</td>
                  <td className="px-5 py-3.5 text-green-300 font-medium">{row.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CaseStudyDetail({ cs }: { cs: HLDCaseStudy }) {
  const [activeTab, setActiveTab] = useState<'simulator' | 'math' | 'architecture' | 'sizing' | 'qa' | 'tradeoffs'>('simulator');
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Case Study Header Card */}
      <div className="bg-gradient-to-r from-surface-light via-surface to-surface-light border border-gray-700/80 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl p-3 bg-white/5 rounded-2xl border border-gray-700/50 shrink-0">
              {cs.icon}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                  {cs.category}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  cs.primaryBottleneck === 'Memory'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : cs.primaryBottleneck === 'CPU'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }`}>
                  🚨 Bottleneck: {cs.primaryBottleneck}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {cs.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
                {cs.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.open(cs.diagramImage, '_blank')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium text-xs border border-primary/40 bg-primary/15 hover:bg-primary/25 text-white transition-all shadow-sm cursor-pointer"
            >
              <Download size={14} className="text-primary" />
              <span>Download Architecture Blueprint</span>
            </button>
          </div>
        </div>

        {/* Scale Metrics Pill Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-800">
          {cs.scaleMetrics.map((m, i) => (
            <div key={i} className="bg-black/30 border border-gray-800 rounded-xl p-3">
              <div className="text-[11px] text-gray-400 truncate">{m.label}</div>
              <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">{m.value}</div>
              <div className="text-[10px] text-gray-500 truncate mt-0.5">{m.hint}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-700/80 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'simulator', label: 'Interactive Simulator', icon: <Calculator size={14} />, badge: 'Live Math' },
          { id: 'math', label: 'Calculation Blueprint', icon: <Layers size={14} /> },
          { id: 'architecture', label: 'Architecture & Components', icon: <GitBranch size={14} /> },
          { id: 'sizing', label: 'Instance Sizing Matrix', icon: <Server size={14} /> },
          { id: 'qa', label: 'Staff Interview Q&A', icon: <HelpCircle size={14} /> },
          { id: 'tradeoffs', label: 'System Trade-offs', icon: <GitBranch size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-primary/20 text-primary'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Interactive Capacity & Bottleneck Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <CapacityBottleneckSimulator cs={cs} />

          {/* Deep Dive Note */}
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle size={14} className="text-yellow-400" /> Deep Dive: Why Does This Bottleneck Happen?
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {cs.bottleneckWhy}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Calculation Blueprint */}
      {activeTab === 'math' && (
        <div className="space-y-6">
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator size={16} className="text-primary" /> Step-by-Step Storage & Bandwidth Math
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Exact mathematical derivation expected during high-level design interview rounds.
              </p>
            </div>

            <div className="space-y-4">
              {cs.storageCalcs.map((step, i) => (
                <div key={i} className="bg-black/30 border border-gray-800 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-mono text-[11px] flex items-center justify-center">
                        {i + 1}
                      </span>
                      {step.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      {step.result}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-blue-300 pl-7 py-1">
                    {step.formula}
                  </div>
                  <p className="text-[11px] text-gray-500 pl-7">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Takeaway Card */}
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5 flex items-start gap-3">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <h4 className="text-sm font-bold text-primary">Senior Engineer Interview Tip</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{cs.takeaway}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Architecture & Components */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Architecture Diagram with Expand */}
          <div className="border border-gray-700/80 rounded-2xl overflow-hidden bg-surface-light">
            <div className="bg-white/5 px-5 py-3 border-b border-gray-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">🏗️ High-Level Architecture Diagram</span>
                <span className="text-xs text-gray-500">— Verified System Blueprint</span>
              </div>
              <button
                onClick={() => setShowImageModal(true)}
                className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                <Maximize2 size={13} /> Full Screen
              </button>
            </div>
            <div
              className="relative cursor-pointer group bg-black/60 p-2 flex items-center justify-center"
              onClick={() => setShowImageModal(true)}
            >
              <img
                src={cs.diagramImage}
                alt={`${cs.title} HLD Diagram`}
                className="max-h-[460px] w-full object-contain rounded-lg transition-transform group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-2">
                <Maximize2 size={16} /> Click to enlarge diagram
              </div>
            </div>
          </div>

          {/* FRs and NFRs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Functional Requirements (FR)
              </h4>
              <ul className="space-y-2">
                {cs.functionalReqs.map((req, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span> Non-Functional Requirements (NFR)
              </h4>
              <ul className="space-y-2">
                {cs.nonFunctionalReqs.map((req, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-orange-400 font-bold shrink-0 mt-0.5">◈</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Components Grid */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Core Subsystems & Responsibilities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cs.components.map((comp, i) => (
                <div key={i} className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-2 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="text-primary text-base">⚙</span>
                      {comp.name}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-gray-800">
                      {comp.technology}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-primary">{comp.role}</div>
                  <p className="text-xs text-gray-400 leading-relaxed">{comp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Instance Sizing Matrix */}
      {activeTab === 'sizing' && (
        <div className="space-y-6">
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-2">Instance Sizing & Hardware Economics</h3>
            <p className="text-xs text-gray-400 mb-6">
              Comparing small multi-instance horizontal clusters vs high-density vertical compute nodes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cs.instanceOptions.map((opt, i) => (
                <div
                  key={i}
                  className={`border rounded-2xl p-5 space-y-4 ${
                    opt.isRecommended
                      ? 'border-green-500/50 bg-green-950/15 ring-1 ring-green-500/30'
                      : 'border-gray-700/80 bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{opt.spec}</h4>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {opt.ramGB} GB RAM · {opt.cores} Cores
                      </span>
                    </div>
                    {opt.isRecommended && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40 font-semibold">
                        Recommended Architecture
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs font-mono bg-black/30 rounded-xl p-3.5 border border-gray-800">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Memory Bound:</span>
                      <span className="text-purple-300 text-right">{opt.memoryBound}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">CPU Bound:</span>
                      <span className="text-red-300 text-right">{opt.cpuBound}</span>
                    </div>
                    <div className="border-t border-gray-800 pt-2 flex justify-between">
                      <span className="text-gray-400 font-sans font-bold">Binding Bottleneck:</span>
                      <span className="text-orange-300 font-bold">{opt.bottleneck}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {opt.bottleneckExplanation}
                  </p>

                  <div className="flex items-center justify-between bg-black/40 rounded-xl px-4 py-3 border border-gray-800">
                    <div>
                      <span className="text-xs text-gray-400 block">Instances Required</span>
                      <span className="text-[11px] text-gray-500">{opt.costEstimate}</span>
                    </div>
                    <span className={`text-2xl font-black font-mono ${
                      opt.isRecommended ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {opt.instancesRequired}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Staff Interview Q&A */}
      {activeTab === 'qa' && (
        <div className="space-y-4">
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle size={16} className="text-primary" /> Top Staff-Level Interview Follow-Ups
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              These are the exact high-friction questions Staff & Principal interviewers use to distinguish senior candidates.
            </p>
          </div>

          <div className="space-y-4">
            {cs.interviewQAs.map((qa, i) => (
              <div key={i} className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono font-bold text-xs shrink-0 mt-0.5">
                    Q{i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{qa.question}</h4>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      🎯 Interviewer test: {qa.interviewerIntent}
                    </span>
                  </div>
                </div>

                <div className="bg-black/30 border border-gray-800 rounded-xl p-4 text-xs text-gray-300 leading-relaxed pl-4 border-l-2 border-l-green-500">
                  <div className="text-green-400 font-bold text-[11px] uppercase tracking-wider mb-1">
                    Model Senior Engineer Answer:
                  </div>
                  {qa.recommendedAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Architectural Trade-offs */}
      {activeTab === 'tradeoffs' && (
        <div className="space-y-4">
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch size={16} className="text-primary" /> Architectural Decisions & Trade-Offs
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Senior engineering is all about trade-offs: there are no right answers, only right justifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cs.tradeoffs.map((t, i) => (
              <div key={i} className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-white text-sm">{t.decision}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300">
                    <span className="text-[10px] text-green-400 font-bold block uppercase">Selected</span>
                    {t.chosen}
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
                    <span className="text-[10px] text-red-400 font-bold block uppercase">Rejected</span>
                    {t.alternative}
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-800 pt-2">
                  <span className="text-gray-300 font-medium">Why:</span> {t.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Diagram */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={cs.diagramImage}
              alt={`${cs.title} HLD Architecture Diagram`}
              className="max-h-[85vh] w-auto object-contain rounded-xl border border-gray-700 shadow-2xl"
            />
            <p className="text-xs text-gray-400 mt-3">Click anywhere or press ESC to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────
export default function HLDCaseStudiesPage() {
  const [selected, setSelected] = useState<string>('rules');
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const sidebarItems = [
    { id: 'rules', label: 'Universal Formulas', icon: '📐', subtitle: 'Rules of Thumb & Math', category: 'General' },
    ...hldCaseStudies.map(cs => ({
      id: cs.id,
      label: cs.title,
      icon: cs.icon,
      subtitle: cs.category,
      category: 'Case Studies',
    })),
  ];

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Sidebar with categories */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-700/80 flex flex-col bg-surface select-none">
        <div className="p-4 border-b border-gray-700/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">HLD Architectures</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold font-mono">
              5 Studies
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">Real scale & bottleneck math</p>
        </div>

        <ul className="overflow-y-auto flex-1 py-2 space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setSelected(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  selected === item.id
                    ? 'bg-primary/15 text-white border border-primary/30 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div className="truncate">
                    <div className={`text-xs font-bold truncate ${selected === item.id ? 'text-white' : 'text-gray-300'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">{item.subtitle}</div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Pro Callout in Sidebar */}
        {/* Buy Me a Coffee Support Card */}
        <div className="p-3 border-t border-gray-800 bg-surface-light/40">
          <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white mb-1">
              <Coffee size={14} className="text-yellow-400" /> Free & Open Content
            </div>
            <p className="text-[11px] text-gray-400 mb-2.5 leading-relaxed">
              All 5 case studies & blueprints are 100% free. Like this prep platform?
            </p>
            <button
              onClick={() => setIsProModalOpen(true)}
              className="w-full py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Coffee size={13} />
              <span>Buy Me a Coffee</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {selected === 'rules' ? (
          <CapacityRulesPanel />
        ) : (
          <CaseStudyDetail
            cs={hldCaseStudies.find(cs => cs.id === selected)!}
          />
        )}
      </main>

      {/* Supporter / Buy Me a Coffee Modal */}
      <ProMonetizationModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
    </div>
  );
}
