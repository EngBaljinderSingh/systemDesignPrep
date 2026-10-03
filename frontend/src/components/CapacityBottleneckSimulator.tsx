import { useState, useMemo } from 'react';
import { type HLDCaseStudy } from '../data/systemDesignCaseStudies';
import { Cpu, HardDrive, Network, ShieldCheck, RefreshCw, Zap, Server } from 'lucide-react';

interface Props {
  cs: HLDCaseStudy;
}

export default function CapacityBottleneckSimulator({ cs }: Props) {
  const preset = cs.simulatorPreset;

  // State initialized with case study defaults
  const [dau, setDau] = useState<number>(preset.defaultDau);
  const [actionsPerUser, setActionsPerUser] = useState<number>(preset.defaultActionsPerUser);
  const [payloadBytes, setPayloadBytes] = useState<number>(preset.defaultPayloadBytes);
  const [peakMultiplier, setPeakMultiplier] = useState<number>(preset.defaultPeakMultiplier);
  const [cpuTimeMs, setCpuTimeMs] = useState<number>(preset.defaultCpuTimeMs);
  const [threadStackMB, setThreadStackMB] = useState<number>(preset.defaultThreadStackMB);
  const [serverRamGB, setServerRamGB] = useState<number>(64);
  const [serverCores, setServerCores] = useState<number>(16);

  const resetToDefaults = () => {
    setDau(preset.defaultDau);
    setActionsPerUser(preset.defaultActionsPerUser);
    setPayloadBytes(preset.defaultPayloadBytes);
    setPeakMultiplier(preset.defaultPeakMultiplier);
    setCpuTimeMs(preset.defaultCpuTimeMs);
    setThreadStackMB(preset.defaultThreadStackMB);
    setServerRamGB(64);
    setServerCores(16);
  };

  // Calculations
  const results = useMemo(() => {
    const totalDaily = dau * actionsPerUser;
    const avgQps = Math.round(totalDaily / 86400);
    const peakQps = Math.round(avgQps * peakMultiplier);

    // Storage
    const dailyBytes = totalDaily * payloadBytes;
    const dailyGB = (dailyBytes / (1024 * 1024 * 1024)).toFixed(2);
    const dailyTB = (dailyBytes / (1024 * 1024 * 1024 * 1024)).toFixed(3);
    const yearlyTB = ((dailyBytes * 365) / (1024 * 1024 * 1024 * 1024)).toFixed(2);
    const fiveYearPB = ((dailyBytes * 365 * 5) / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(3);

    // Bandwidth
    const peakIngressMBps = ((peakQps * payloadBytes) / (1024 * 1024)).toFixed(2);
    const peakIngressGbps = (((peakQps * payloadBytes * 8) / (1000 * 1000 * 1000))).toFixed(3);

    // Hardware Bounds with 70% rule
    const usableRamMB = serverRamGB * 1024 * 0.70;

    let memoryBoundLimit = 0;
    let cpuBoundLimit = 0;
    let networkOsLimit = 3000000; // Linux socket cap
    let primaryBottleneck: 'Memory' | 'CPU' | 'Network/OS Cap' = 'CPU';
    let bottleneckDetail = '';
    let instancesNeeded = 1;
    let safeCapacityPerNode = 1;

    if (preset.isConnectionWorkload) {
      // Connection heavy (e.g. WhatsApp WebSockets)
      // Memory determines max concurrent sockets based on per-socket memory
      const perSocketMB = Math.max(0.005, threadStackMB); // e.g. 10KB = 0.01MB
      memoryBoundLimit = Math.round(usableRamMB / perSocketMB);
      // Hard Linux OS cap
      networkOsLimit = 3000000;

      const peakConcurrentConnections = Math.round(dau * 0.20); // 20% peak concurrent

      if (memoryBoundLimit < networkOsLimit) {
        primaryBottleneck = 'Memory';
        safeCapacityPerNode = memoryBoundLimit;
        bottleneckDetail = `RAM exhausts at ${memoryBoundLimit.toLocaleString()} connections before hitting the Linux OS 3M TCP socket limit.`;
      } else {
        primaryBottleneck = 'Network/OS Cap';
        safeCapacityPerNode = networkOsLimit;
        bottleneckDetail = `RAM could hold ${memoryBoundLimit.toLocaleString()} connections, but Linux kernel file descriptors and TCP socket buffers cap out at ~3,000,000 sockets per node.`;
      }
      instancesNeeded = Math.max(1, Math.ceil(peakConcurrentConnections / safeCapacityPerNode));
    } else {
      // Throughput / Compute heavy (Rate Limiter, BookMyShow, TinyURL, Netflix API)
      const avgLatencySec = Math.max(0.005, (cpuTimeMs * 5) / 1000); // estimated end-to-end latency
      // Memory QPS = concurrent threads supported * thread turnover rate
      const maxConcurrentThreads = usableRamMB / Math.max(0.1, threadStackMB);
      memoryBoundLimit = Math.round(maxConcurrentThreads / avgLatencySec);

      // CPU QPS = (Cores * 0.70 * 1000ms) / cpuTimeMs
      cpuBoundLimit = Math.round((serverCores * 0.70 * 1000) / Math.max(0.05, cpuTimeMs));

      if (memoryBoundLimit < cpuBoundLimit) {
        primaryBottleneck = 'Memory';
        safeCapacityPerNode = memoryBoundLimit;
        bottleneckDetail = `Thread stack allocations (${threadStackMB}MB/req) consume all ${usableRamMB.toFixed(0)}MB of usable RAM at ${memoryBoundLimit.toLocaleString()} QPS while CPU cores remain underutilized.`;
      } else {
        primaryBottleneck = 'CPU';
        safeCapacityPerNode = cpuBoundLimit;
        bottleneckDetail = `Processing compute (${cpuTimeMs}ms/req) pins all ${serverCores} CPU cores at 70% threshold at ${cpuBoundLimit.toLocaleString()} QPS while ample RAM remains free.`;
      }
      instancesNeeded = Math.max(1, Math.ceil(peakQps / safeCapacityPerNode));
    }

    return {
      totalDaily,
      avgQps,
      peakQps,
      dailyGB,
      dailyTB,
      yearlyTB,
      fiveYearPB,
      peakIngressMBps,
      peakIngressGbps,
      memoryBoundLimit,
      cpuBoundLimit,
      networkOsLimit,
      primaryBottleneck,
      bottleneckDetail,
      instancesNeeded,
      safeCapacityPerNode,
    };
  }, [dau, actionsPerUser, payloadBytes, peakMultiplier, cpuTimeMs, threadStackMB, serverRamGB, serverCores, preset]);

  return (
    <div className="space-y-6">
      {/* Header with quick summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-surface-light p-4 rounded-2xl border border-gray-700/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎛️</span>
            <h3 className="text-base font-bold text-white">Live Capacity & Bottleneck Simulator</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium">
              Real-Time Math
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Tweak traffic, request sizes, and hardware specs below to instantly see which resource becomes the binding constraint.
          </p>
        </div>
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium border border-gray-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} /> Reset Defaults
        </button>
      </div>

      {/* Main Grid: Controls on Left, Live Engine on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-surface-light border border-gray-700/80 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Zap size={14} className="text-yellow-400" /> 1. Workload Parameters
          </h4>

          {/* DAU */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-medium">Daily Active Volume ({preset.dauUnit})</span>
              <span className="font-mono text-primary font-bold">{dau.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={500000000}
              step={1000000}
              value={dau}
              onChange={(e) => setDau(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Actions per user */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-medium">{preset.actionLabel}</span>
              <span className="font-mono text-blue-300 font-bold">{actionsPerUser}</span>
            </div>
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={actionsPerUser}
              onChange={(e) => setActionsPerUser(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Payload Bytes */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-medium">{preset.payloadLabel}</span>
              <span className="font-mono text-green-300 font-bold">
                {payloadBytes >= 1000000 ? `${(payloadBytes / 1000000).toFixed(1)} MB` : `${payloadBytes} Bytes`}
              </span>
            </div>
            <input
              type="range"
              min={32}
              max={preset.defaultPayloadBytes > 100000 ? 10000000 : 2000}
              step={preset.defaultPayloadBytes > 100000 ? 500000 : 16}
              value={payloadBytes}
              onChange={(e) => setPayloadBytes(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Peak Multiplier */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-medium">Peak Traffic Multiplier</span>
              <span className="font-mono text-orange-300 font-bold">{peakMultiplier}×</span>
            </div>
            <input
              type="range"
              min={1.5}
              max={5.0}
              step={0.5}
              value={peakMultiplier}
              onChange={(e) => setPeakMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="border-t border-gray-700/60 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Server size={14} className="text-primary" /> 2. Server Node Specs
            </h4>

            {/* RAM Spec */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Server RAM</label>
                <select
                  value={serverRamGB}
                  onChange={(e) => setServerRamGB(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-black/40 border border-gray-700 rounded-lg text-white font-mono focus:border-primary focus:outline-none"
                >
                  <option value={4}>4 GB RAM</option>
                  <option value={16}>16 GB RAM</option>
                  <option value={32}>32 GB RAM</option>
                  <option value={64}>64 GB RAM (Recommended)</option>
                  <option value={128}>128 GB RAM</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">CPU Cores</label>
                <select
                  value={serverCores}
                  onChange={(e) => setServerCores(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-black/40 border border-gray-700 rounded-lg text-white font-mono focus:border-primary focus:outline-none"
                >
                  <option value={2}>2 Cores</option>
                  <option value={4}>4 Cores</option>
                  <option value={8}>8 Cores</option>
                  <option value={16}>16 Cores</option>
                  <option value={32}>32 Cores</option>
                </select>
              </div>
            </div>

            {/* Thread Stack / Connection Memory */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">
                  {preset.isConnectionWorkload ? 'RAM per Socket Connection' : 'Thread Stack Memory'}
                </span>
                <span className="font-mono text-purple-300 font-bold">
                  {threadStackMB < 0.1 ? `${(threadStackMB * 1024).toFixed(0)} KB` : `${threadStackMB} MB`}
                </span>
              </div>
              <input
                type="range"
                min={preset.isConnectionWorkload ? 0.005 : 0.5}
                max={preset.isConnectionWorkload ? 0.05 : 4.0}
                step={preset.isConnectionWorkload ? 0.005 : 0.5}
                value={threadStackMB}
                onChange={(e) => setThreadStackMB(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* CPU execution time */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">CPU Compute Time / Request</span>
                <span className="font-mono text-red-300 font-bold">{cpuTimeMs} ms</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={10.0}
                step={0.1}
                value={cpuTimeMs}
                onChange={(e) => setCpuTimeMs(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Output Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Bottleneck Callout Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            results.primaryBottleneck === 'Memory'
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
              : results.primaryBottleneck === 'CPU'
                ? 'bg-red-950/40 border-red-500/50 text-red-200'
                : 'bg-blue-950/40 border-blue-500/50 text-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-black/40 text-2xl shrink-0">
                {results.primaryBottleneck === 'Memory' && '🧠'}
                {results.primaryBottleneck === 'CPU' && '⚡'}
                {results.primaryBottleneck === 'Network/OS Cap' && '🌐'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/50 border border-white/10">
                    Primary Bottleneck Detected
                  </span>
                  <span className="font-extrabold text-white text-sm">
                    {results.primaryBottleneck} Bound
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-300">
                  {results.bottleneckDetail}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-light border border-gray-700/80 rounded-xl p-3 text-center">
              <div className="text-[11px] text-gray-400">Daily Requests</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {results.totalDaily >= 1000000000
                  ? `${(results.totalDaily / 1000000000).toFixed(1)}B`
                  : `${(results.totalDaily / 1000000).toFixed(1)}M`}
              </div>
              <div className="text-[10px] text-gray-500">24hr volume</div>
            </div>

            <div className="bg-surface-light border border-gray-700/80 rounded-xl p-3 text-center">
              <div className="text-[11px] text-gray-400">Peak QPS</div>
              <div className="text-base font-bold text-orange-400 font-mono mt-0.5">
                {results.peakQps.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-500">{peakMultiplier}× avg ({results.avgQps.toLocaleString()})</div>
            </div>

            <div className="bg-surface-light border border-gray-700/80 rounded-xl p-3 text-center">
              <div className="text-[11px] text-gray-400">Safe QPS / Node</div>
              <div className="text-base font-bold text-green-400 font-mono mt-0.5">
                {results.safeCapacityPerNode.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-500">70% safe cap</div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
              <div className="text-[11px] text-primary font-medium">Servers Needed</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {results.instancesNeeded}
              </div>
              <div className="text-[10px] text-gray-400">
                ~${(results.instancesNeeded * (serverRamGB <= 16 ? 40 : 160)).toLocaleString()} / mo
              </div>
            </div>
          </div>

          {/* Resource Saturation Bar Comparison */}
          <div className="bg-surface-light border border-gray-700/80 rounded-xl p-4 space-y-3">
            <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-400" /> Per-Instance Resource Constraint Breakdown
            </h5>

            {/* Memory Capacity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <HardDrive size={13} className="text-purple-400" /> Memory Bound Limit
                </span>
                <span className="font-mono text-purple-300 font-bold">
                  {results.memoryBoundLimit.toLocaleString()} {preset.isConnectionWorkload ? 'Conns' : 'QPS'}
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    results.primaryBottleneck === 'Memory' ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                  style={{
                    width: results.primaryBottleneck === 'Memory' ? '100%' : '65%',
                  }}
                />
              </div>
            </div>

            {/* CPU Capacity */}
            {!preset.isConnectionWorkload && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <Cpu size={13} className="text-red-400" /> CPU Core Execution Limit
                  </span>
                  <span className="font-mono text-red-300 font-bold">
                    {results.cpuBoundLimit.toLocaleString()} QPS
                  </span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      results.primaryBottleneck === 'CPU' ? 'bg-red-500' : 'bg-red-400/60'
                    }`}
                    style={{
                      width: results.primaryBottleneck === 'CPU' ? '100%' : '50%',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Network / OS Socket Cap */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Network size={13} className="text-blue-400" /> Linux OS Socket & NIC Limit
                </span>
                <span className="font-mono text-blue-300 font-bold">
                  {results.networkOsLimit.toLocaleString()} Max Sockets
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    results.primaryBottleneck === 'Network/OS Cap' ? 'bg-red-500' : 'bg-blue-500/70'
                  }`}
                  style={{
                    width: results.primaryBottleneck === 'Network/OS Cap' ? '100%' : '40%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Storage & Bandwidth Card */}
          <div className="bg-black/30 border border-gray-700/80 rounded-xl p-4 text-xs font-mono space-y-2">
            <div className="text-gray-400 font-sans font-bold text-xs uppercase tracking-wider mb-2">
              📊 Storage & Bandwidth Math
            </div>
            <div className="flex justify-between py-1 border-b border-gray-800">
              <span className="text-gray-400">Daily Ingress:</span>
              <span className="text-green-300 font-bold">
                {Number(results.dailyGB) > 1024 ? `${results.dailyTB} TB / day` : `${results.dailyGB} GB / day`}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-800">
              <span className="text-gray-400">5-Year Retention:</span>
              <span className="text-blue-300 font-bold">
                {Number(results.yearlyTB) > 1000 ? `${results.fiveYearPB} Petabytes` : `${(Number(results.yearlyTB) * 5).toFixed(1)} Terabytes`}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Peak Network Egress/Ingress:</span>
              <span className="text-yellow-300 font-bold">
                {results.peakIngressMBps} MB/s ({results.peakIngressGbps} Gbps)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
