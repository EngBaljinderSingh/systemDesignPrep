import { useState } from 'react';
import { hldCaseStudies, capacityRules, type HLDCaseStudy } from '../data/systemDesignCaseStudies';

// ── Capacity Rules Panel ──────────────────────────────────────────────────
function CapacityRulesPanel() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Capacity Planning — Rules of Thumb</h2>
        <p className="text-sm text-gray-400">
          Universal formulas applied across all system design case studies below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capacityRules.map((rule, i) => (
          <div
            key={i}
            className="bg-surface-light border border-gray-700 rounded-xl p-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-primary font-bold text-lg leading-none mt-0.5">{i + 1}</span>
              <h3 className="font-semibold text-white text-sm">{rule.title}</h3>
            </div>
            <div className="mb-3 ml-6 font-mono text-xs bg-black/30 border border-gray-700 rounded px-3 py-2 text-green-300">
              {rule.formula}
            </div>
            <p className="text-xs text-gray-400 ml-6 leading-relaxed">{rule.description}</p>
          </div>
        ))}
      </div>

      {/* Bottleneck summary table */}
      <div className="mt-6 border border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-white/5 px-4 py-2 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white">Bottleneck Quick Reference</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-700 bg-black/20">
              <th className="text-left px-4 py-2 text-gray-400 font-medium">Bottleneck Type</th>
              <th className="text-left px-4 py-2 text-gray-400 font-medium">When It Happens</th>
              <th className="text-left px-4 py-2 text-gray-400 font-medium">Fix</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: '🧠 Memory', when: 'Thread stacks, large key payloads', fix: 'Scale up RAM or reduce per-thread cost' },
              { type: '⚡ CPU', when: 'High compute per request (locks, hashing)', fix: 'Scale up cores or optimize hot path' },
              { type: '🌐 Network/OS', when: 'High concurrent TCP connections (>3M/server)', fix: 'Scale out — more server nodes' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-gray-700/50 hover:bg-white/3">
                <td className="px-4 py-3 text-white font-medium">{row.type}</td>
                <td className="px-4 py-3 text-gray-400">{row.when}</td>
                <td className="px-4 py-3 text-green-300">{row.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Case Study Detail Panel ───────────────────────────────────────────────
function CaseStudyDetail({ cs }: { cs: HLDCaseStudy }) {
  return (
    <div className="space-y-6">

      {/* Hero header */}
      <div className="flex items-start gap-4">
        <span className="text-4xl">{cs.icon}</span>
        <div>
          <h2 className="text-2xl font-bold text-white">{cs.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{cs.tagline}</p>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="border border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-white/5 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
          <span className="text-sm font-semibold text-white">🏗️ Architecture Diagram</span>
          <span className="text-xs text-gray-500">— from System Design PPT</span>
        </div>
        <img
          src={cs.diagramImage}
          alt={`${cs.title} HLD Architecture Diagram`}
          className="w-full object-contain bg-black"
        />
      </div>

      {/* Scale metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cs.scaleMetrics.map((m, i) => (
          <div key={i} className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
            <div className="text-sm font-bold text-primary">{m.value}</div>
          </div>
        ))}
      </div>

      {/* FRs + NFRs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-light border border-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Functional Requirements
          </h3>
          <ul className="space-y-1.5">
            {cs.functionalReqs.map((r, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-blue-400 mt-0.5 shrink-0">✓</span>{r}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface-light border border-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Non-Functional Requirements
          </h3>
          <ul className="space-y-1.5">
            {cs.nonFunctionalReqs.map((r, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-orange-400 mt-0.5 shrink-0">◈</span>{r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* HLD Components */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">🏗️ HLD Key Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cs.components.map((c, i) => (
            <div key={i} className="bg-surface-light border border-gray-700 rounded-xl p-4 hover:border-yellow-500/40 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 text-base">⚙</span>
                <span className="text-sm font-semibold text-white">{c.name}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Calculations */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">💾 Storage Calculations</h3>
        <div className="bg-black/40 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-white/5 border-b border-gray-700 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-2 text-xs text-gray-500 font-mono">capacity_calc.js</span>
          </div>
          <div className="p-4 font-mono text-xs space-y-3">
            {cs.storageCalcs.map((step, i) => (
              <div key={i}>
                <div className="text-gray-500">// {step.label}</div>
                <div className="text-blue-300">{step.formula}</div>
                <div className="text-green-300 font-semibold">→ {step.result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instance Sizing */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">🖥️ Instance Sizing Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cs.instanceOptions.map((opt, i) => (
            <div
              key={i}
              className={`border rounded-xl p-4 ${i === 1 ? 'border-green-500/40 bg-green-900/10' : 'border-gray-700 bg-surface-light'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-white text-sm">{opt.spec}</span>
                {i === 1 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                    Recommended
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-gray-500">Memory: </span>
                  <span className="text-blue-300">{opt.memoryBound}</span>
                </div>
                <div>
                  <span className="text-gray-500">CPU:    </span>
                  <span className="text-purple-300">{opt.cpuBound}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <span className="text-gray-500">Bottleneck: </span>
                  <span className="text-red-300 font-bold">{opt.bottleneck}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-400">Instances Required</span>
                <span className={`text-lg font-bold ${i === 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {opt.instancesRequired}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Takeaway */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-primary text-lg">💡</span>
          <h3 className="text-sm font-semibold text-primary">Key Takeaway</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{cs.takeaway}</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function HLDCaseStudiesPage() {
  const [selected, setSelected] = useState<string>('rules');

  const sidebarItems = [
    { id: 'rules', label: 'Capacity Rules', icon: '📐', subtitle: 'Universal formulas' },
    ...hldCaseStudies.map(cs => ({
      id: cs.id,
      label: cs.title,
      icon: cs.icon,
      subtitle: 'HLD + Capacity Math',
    })),
  ];

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-gray-700 flex flex-col bg-surface">
        <div className="p-3 border-b border-gray-700">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Studies</p>
          <p className="text-xs text-gray-600 mt-0.5">from PPT + capacity math</p>
        </div>
        <ul className="overflow-y-auto flex-1 py-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setSelected(item.id)}
                className={`w-full text-left px-3 py-3 border-b border-gray-800 transition-all ${
                  selected === item.id
                    ? 'bg-primary/10 border-l-2 border-l-primary'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <div className={`text-sm font-medium ${selected === item.id ? 'text-white' : 'text-gray-400'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-600">{item.subtitle}</div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {selected === 'rules' ? (
          <CapacityRulesPanel />
        ) : (
          <CaseStudyDetail cs={hldCaseStudies.find(cs => cs.id === selected)!} />
        )}
      </main>
    </div>
  );
}
