import { useState } from 'react';
import DesignCanvas from '../components/DesignCanvas';

export default function CanvasPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [inputId, setInputId] = useState('');

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Sub-header */}
      <div className="flex items-center gap-3 px-6 py-2 bg-surface-light border-b border-gray-700">
        <span className="text-sm text-gray-400">
          Paste a session ID from <code className="text-xs bg-white/10 px-1 rounded">POST /api/v1/sessions</code> to connect the AI canvas.
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Session ID"
            className="px-3 py-1 text-sm bg-surface border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary w-64"
          />
          <button
            onClick={() => setSessionId(inputId || null)}
            className="px-3 py-1 text-sm bg-primary rounded font-medium hover:bg-primary-dark"
          >
            Connect
          </button>
          {sessionId && <span className="text-xs text-green-400">● Connected</span>}
        </div>
      </div>

      <div className="flex-1">
        <DesignCanvas sessionId={sessionId} />
      </div>
    </div>
  );
}
