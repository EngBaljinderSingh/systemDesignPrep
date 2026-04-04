import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  type Node,
  type Edge,
  type OnConnect,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { interviewApi } from '../api/interviewApi';
import type { CanvasState, ComponentType } from '../types/interview';
import { SystemComponentNode } from './SystemComponentNode';

const nodeTypes: NodeTypes = {
  systemComponent: SystemComponentNode,
};

const COMPONENT_PALETTE: { type: ComponentType; label: string; color: string }[] = [
  { type: 'CLIENT', label: 'Client', color: '#60a5fa' },
  { type: 'LOAD_BALANCER', label: 'Load Balancer', color: '#f59e0b' },
  { type: 'API_GATEWAY', label: 'API Gateway', color: '#a78bfa' },
  { type: 'SERVICE', label: 'Service', color: '#34d399' },
  { type: 'DATABASE', label: 'Database', color: '#f87171' },
  { type: 'CACHE', label: 'Cache', color: '#fbbf24' },
  { type: 'MESSAGE_QUEUE', label: 'Message Queue', color: '#fb923c' },
  { type: 'CDN', label: 'CDN', color: '#38bdf8' },
];

interface DesignCanvasProps {
  sessionId: string | null;
}

export default function DesignCanvas({ sessionId }: DesignCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } } as Edge, eds));
    },
    [setEdges],
  );

  // ── Convert React Flow state → backend CanvasState JSON ──
  const buildCanvasState = useCallback((): CanvasState => {
    const components = nodes.map((node) => ({
      id: node.id,
      type: (node.data.componentType as ComponentType) ?? 'CUSTOM',
      label: (node.data.label as string) ?? '',
      description: (node.data.description as string) ?? '',
      position: { x: node.position.x, y: node.position.y },
      properties: {
        technology: (node.data.technology as string) ?? '',
        scalingStrategy: (node.data.scalingStrategy as string) ?? '',
        notes: (node.data.notes as string) ?? '',
      },
    }));

    const connections = edges.map((edge) => ({
      id: edge.id,
      sourceComponentId: edge.source,
      targetComponentId: edge.target,
      label: (edge.label as string) ?? '',
      type: 'SYNCHRONOUS' as const,
      protocol: '',
    }));

    return { components, connections };
  }, [nodes, edges]);

  // ── Debounced sync to backend (300ms) ──
  const syncToBackend = useCallback(() => {
    if (!sessionId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const state = buildCanvasState();
      interviewApi.updateCanvas(sessionId, state).catch(console.error);
    }, 300);
  }, [sessionId, buildCanvasState]);

  // ── Add a new component node ──
  const addComponent = useCallback(
    (componentType: ComponentType, label: string, color: string) => {
      const id = `${componentType.toLowerCase()}-${Date.now()}`;
      const newNode: Node = {
        id,
        type: 'systemComponent',
        position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
        data: { label, componentType, color, description: '', technology: '', scalingStrategy: '', notes: '' },
      };
      setNodes((nds) => [...nds, newNode]);
      syncToBackend();
    },
    [setNodes, syncToBackend],
  );

  // ── Request AI critique ──
  const requestAnalysis = useCallback(async () => {
    if (!sessionId) return;
    try {
      const { data } = await interviewApi.analyzeCanvas(sessionId);
      alert(`AI Feedback (${data.length} items):\n\n${data.map((f) => f.content).join('\n\n')}`);
    } catch (err) {
      console.error('Analysis failed', err);
    }
  }, [sessionId]);

  return (
    <div className="h-screen w-full bg-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          syncToBackend();
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          syncToBackend();
        }}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-surface"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#374151" />
        <Controls className="bg-surface-light" />

        {/* ── Component Palette ── */}
        <Panel position="top-left">
          <div className="bg-surface-light rounded-lg p-3 shadow-lg border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Components</h3>
            <div className="flex flex-wrap gap-2">
              {COMPONENT_PALETTE.map(({ type, label, color }) => (
                <button
                  key={type}
                  onClick={() => addComponent(type, label, color)}
                  className="px-3 py-1.5 text-xs rounded-md font-medium text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        {/* ── Actions Panel ── */}
        <Panel position="top-right">
          <div className="bg-surface-light rounded-lg p-3 shadow-lg border border-gray-700 space-y-2">
            <button
              onClick={requestAnalysis}
              disabled={!sessionId}
              className="w-full px-4 py-2 bg-primary text-white text-sm rounded-md font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze Design
            </button>
            <p className="text-xs text-gray-400 text-center">
              {nodes.length} components · {edges.length} connections
            </p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
