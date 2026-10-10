import { useState } from 'react';

export interface DatacenterState {
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  load: number;
  healthy: boolean;
}

export interface SimLog {
  id: string;
  command: string;
  output: string;
  isError: boolean;
  explanation?: string;
}

const EARTH_RADIUS_KM = 6371;

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const la1 = toRad(lat1);
  const la2 = toRad(lat2);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c);
}

export default function StripeSimulator() {
  const [datacenters, setDatacenters] = useState<DatacenterState[]>([
    { name: 'us-west', lat: 38, lon: -122, capacity: 2, load: 0, healthy: true },
    { name: 'us-east', lat: 41, lon: -74, capacity: 100, load: 0, healthy: true },
    { name: 'eu-central', lat: 50, lon: 8, capacity: 50, load: 0, healthy: true },
  ]);

  const [inputCmd, setInputCmd] = useState('');
  const [logs, setLogs] = useState<SimLog[]>([
    {
      id: 'init-1',
      command: '# Initial Datacenter Registry',
      output: 'Loaded 3 seed datacenters (us-west cap:2, us-east cap:100, eu-central cap:50)',
      isError: false,
    },
  ]);

  const runCommand = (raw: string, currentDcs = datacenters): { newDcs: DatacenterState[]; log: SimLog } => {
    const trimmed = raw.trim();
    if (!trimmed) {
      return {
        newDcs: currentDcs,
        log: { id: Math.random().toString(), command: raw, output: 'ERROR: Empty command', isError: true },
      };
    }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toUpperCase();

    if (cmd === 'REGISTER') {
      if (parts.length !== 5) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true, explanation: 'Syntax: REGISTER <name> <lat> <lon> <capacity>' },
        };
      }
      const name = parts[1];
      const lat = parseInt(parts[2], 10);
      const lon = parseInt(parts[3], 10);
      const cap = parseInt(parts[4], 10);

      if (
        isNaN(lat) ||
        isNaN(lon) ||
        isNaN(cap) ||
        currentDcs.some((d) => d.name === name) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180 ||
        cap <= 0
      ) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true, explanation: 'Validation failed (coordinate bounds, capacity <= 0, or duplicate name)' },
        };
      }

      const updated = [...currentDcs, { name, lat, lon, capacity: cap, load: 0, healthy: true }];
      return {
        newDcs: updated,
        log: { id: Math.random().toString(), command: raw, output: 'OK', isError: false, explanation: `Registered ${name} at (${lat}, ${lon}) with capacity ${cap}` },
      };
    }

    if (cmd === 'SET_HEALTHY') {
      if (parts.length !== 3) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true },
        };
      }
      const name = parts[1];
      const healthyVal = parts[2].toLowerCase() === 'true';
      const exists = currentDcs.some((d) => d.name === name);
      if (!exists) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true, explanation: `Datacenter ${name} not found` },
        };
      }
      const updated = currentDcs.map((d) => (d.name === name ? { ...d, healthy: healthyVal } : d));
      return {
        newDcs: updated,
        log: { id: Math.random().toString(), command: raw, output: 'OK', isError: false, explanation: `Set ${name} healthy=${healthyVal}` },
      };
    }

    if (cmd === 'DISTANCE') {
      if (parts.length !== 5) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true },
        };
      }
      const lat1 = parseInt(parts[1], 10);
      const lon1 = parseInt(parts[2], 10);
      const lat2 = parseInt(parts[3], 10);
      const lon2 = parseInt(parts[4], 10);
      if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true },
        };
      }
      const dist = haversineDistance(lat1, lon1, lat2, lon2);
      return {
        newDcs: currentDcs,
        log: { id: Math.random().toString(), command: raw, output: `${dist}`, isError: false, explanation: `Haversine distance = ${dist} km` },
      };
    }

    if (cmd === 'ROUTE') {
      if (parts.length !== 3) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true },
        };
      }
      const lat = parseInt(parts[1], 10);
      const lon = parseInt(parts[2], 10);
      if (isNaN(lat) || isNaN(lon)) {
        return {
          newDcs: currentDcs,
          log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true },
        };
      }

      // Collect healthy DCs and sort by distance, then name
      const healthyDcs = currentDcs.filter((d) => d.healthy);
      const sorted = [...healthyDcs].sort((a, b) => {
        const da = haversineDistance(lat, lon, a.lat, a.lon);
        const db = haversineDistance(lat, lon, b.lat, b.lon);
        if (da !== db) return da - db;
        return a.name.localeCompare(b.name);
      });

      const orderStr = sorted.map((d) => d.name).join(',');
      const selected = sorted.find((d) => d.load < d.capacity);

      if (!selected) {
        return {
          newDcs: currentDcs,
          log: {
            id: Math.random().toString(),
            command: raw,
            output: `NONE ${orderStr}`,
            isError: false,
            explanation: `All healthy datacenters (${orderStr}) have reached full capacity!`,
          },
        };
      }

      const dist = haversineDistance(lat, lon, selected.lat, selected.lon);
      const updated = currentDcs.map((d) => (d.name === selected.name ? { ...d, load: d.load + 1 } : d));

      return {
        newDcs: updated,
        log: {
          id: Math.random().toString(),
          command: raw,
          output: `${selected.name} ${dist} ${orderStr}`,
          isError: false,
          explanation: `Routed request to ${selected.name} (${dist} km). New load: ${selected.load + 1}/${selected.capacity}`,
        },
      };
    }

    return {
      newDcs: currentDcs,
      log: { id: Math.random().toString(), command: raw, output: 'ERROR', isError: true, explanation: `Unknown command "${cmd}"` },
    };
  };

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCmd.trim()) return;
    const { newDcs, log } = runCommand(inputCmd);
    setDatacenters(newDcs);
    setLogs((prev) => [log, ...prev]);
    setInputCmd('');
  };

  const runScript = (commands: string[]) => {
    let current = datacenters;
    const newLogs: SimLog[] = [];
    for (const c of commands) {
      const res = runCommand(c, current);
      current = res.newDcs;
      newLogs.unshift(res.log);
    }
    setDatacenters(current);
    setLogs((prev) => [...newLogs, ...prev]);
  };

  const resetAll = () => {
    setDatacenters([
      { name: 'us-west', lat: 38, lon: -122, capacity: 2, load: 0, healthy: true },
      { name: 'us-east', lat: 41, lon: -74, capacity: 100, load: 0, healthy: true },
      { name: 'eu-central', lat: 50, lon: 8, capacity: 50, load: 0, healthy: true },
    ]);
    setLogs([
      {
        id: Math.random().toString(),
        command: '# Reset State',
        output: 'Datacenter registry and loads reset to default',
        isError: false,
      },
    ]);
  };

  const toggleHealth = (name: string) => {
    const target = datacenters.find((d) => d.name === name);
    if (!target) return;
    const nextState = !target.healthy;
    runCommand(`SET_HEALTHY ${name} ${nextState}`);
    const updated = datacenters.map((d) => (d.name === name ? { ...d, healthy: nextState } : d));
    setDatacenters(updated);
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        command: `SET_HEALTHY ${name} ${nextState}`,
        output: 'OK',
        isError: false,
        explanation: `Manually toggled ${name} healthy=${nextState}`,
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-5">
      {/* Stripe Interactive Header */}
      <div className="rounded-xl border border-[#635BFF]/30 bg-gradient-to-r from-[#635BFF]/10 via-[#0A2540]/30 to-purple-900/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#635BFF] text-white font-bold shadow-lg shadow-[#635BFF]/30 text-base">
              S
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Live Payment Router Simulator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#635BFF]/20 text-[#a594fd] border border-[#635BFF]/40 font-mono font-medium">
                  Stripe Engine v1.0
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Execute live HackerRank commands, observe Haversine calculations, and inspect automatic datacenter failover.
              </p>
            </div>
          </div>
          <button
            onClick={resetAll}
            className="text-xs px-3 py-1.5 rounded-md border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1.5"
          >
            🔄 Reset State
          </button>
        </div>
      </div>

      {/* Datacenter Status Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <span>🌐</span> Registered Datacenters ({datacenters.length})
          </h4>
          <span className="text-[11px] text-gray-500">Click health badge to simulate server outages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {datacenters.map((dc) => {
            const isFull = dc.load >= dc.capacity;
            const pct = Math.min(100, Math.round((dc.load / dc.capacity) * 100));

            return (
              <div
                key={dc.name}
                className={`rounded-lg border p-3.5 transition-all ${
                  !dc.healthy
                    ? 'border-red-900/50 bg-red-950/20 opacity-70'
                    : isFull
                    ? 'border-amber-600/50 bg-amber-950/15'
                    : 'border-gray-700 bg-surface-dark/90'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{dc.name}</span>
                    <button
                      onClick={() => toggleHealth(dc.name)}
                      title="Click to toggle health"
                      className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        dc.healthy
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                      }`}
                    >
                      {dc.healthy ? '● HEALTHY' : '○ UNHEALTHY'}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 font-mono mb-2">
                  Lat: {dc.lat}°, Lon: {dc.lon}°
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Load</span>
                    <span className={`font-mono font-bold ${isFull ? 'text-amber-400' : 'text-gray-200'}`}>
                      {dc.load} / {dc.capacity} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        !dc.healthy
                          ? 'bg-red-500'
                          : isFull
                          ? 'bg-amber-500'
                          : pct > 75
                          ? 'bg-yellow-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Test Scenarios */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>⚡</span> Quick Interview Test Scenarios
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              runScript(['ROUTE 38 -122', 'ROUTE 38 -122', 'ROUTE 38 -122'])
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary-200 transition-colors flex items-center gap-1.5 font-medium"
          >
            <span>🎯</span> Test Capacity Spillover (Route 3x to us-west)
          </button>
          <button
            onClick={() =>
              runScript([
                'SET_HEALTHY us-west false',
                'ROUTE 38 -122',
                'SET_HEALTHY us-west true',
              ])
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 transition-colors flex items-center gap-1.5 font-medium"
          >
            <span>🛡️</span> Test Outage & Failover to us-east
          </button>
          <button
            onClick={() =>
              runScript([
                'DISTANCE 38 -122 41 -74',
                'DISTANCE 0 0 10 0',
                'DISTANCE 36 140 -33 -71',
              ])
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 transition-colors flex items-center gap-1.5 font-medium"
          >
            <span>📐</span> Test Haversine Distances
          </button>
          <button
            onClick={() =>
              runScript([
                'REGISTER invalid 91 0 100',
                'REGISTER invalid2 0 0 0',
                'REGISTER us-west 38 -122 50',
              ])
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-200 transition-colors flex items-center gap-1.5 font-medium"
          >
            <span>🚨</span> Test Validation Errors
          </button>
        </div>
      </div>

      {/* CLI Command Line Input */}
      <form onSubmit={handleExecute} className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
          Run Custom Command
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 font-mono text-xs text-primary font-bold">›</span>
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder="e.g. ROUTE 38 -122  or  REGISTER ap-south 19 72 80  or  DISTANCE 38 -122 41 -74"
              className="w-full rounded-lg bg-black/60 border border-gray-700 pl-7 pr-3 py-2 text-xs font-mono text-gray-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            Execute
          </button>
        </div>
        <p className="text-[11px] text-gray-500">
          Supported commands: <code className="text-primary font-mono">REGISTER &lt;name&gt; &lt;lat&gt; &lt;lon&gt; &lt;cap&gt;</code>,{' '}
          <code className="text-primary font-mono">SET_HEALTHY &lt;name&gt; &lt;bool&gt;</code>,{' '}
          <code className="text-primary font-mono">DISTANCE &lt;lat1&gt; &lt;lon1&gt; &lt;lat2&gt; &lt;lon2&gt;</code>,{' '}
          <code className="text-primary font-mono">ROUTE &lt;lat&gt; &lt;lon&gt;</code>
        </p>
      </form>

      {/* Execution Console Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>💻</span> Execution Terminal & Trace
          </h4>
          <button
            onClick={() => setLogs([])}
            className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            Clear Terminal
          </button>
        </div>

        <div className="rounded-lg border border-gray-800 bg-black/80 p-3 max-h-72 overflow-y-auto space-y-2 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-gray-600 text-center py-4">Terminal is clear. Execute a command above.</div>
          ) : (
            logs.map((item) => (
              <div key={item.id} className="border-b border-gray-900 pb-2 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">›</span>
                  <span className="text-gray-300 font-bold">{item.command}</span>
                </div>
                <div className="pl-4 flex items-center gap-2 mt-0.5">
                  <span className="text-gray-600">↳</span>
                  <span
                    className={`font-semibold ${
                      item.isError
                        ? 'text-red-400'
                        : item.output.startsWith('NONE')
                        ? 'text-amber-400'
                        : 'text-green-400'
                    }`}
                  >
                    {item.output}
                  </span>
                  {item.explanation && (
                    <span className="text-[11px] text-gray-500 font-sans italic">({item.explanation})</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
