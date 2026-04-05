import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  ConnectionMode,
  type Node,
  type Edge,
  type OnConnect,
  type NodeTypes,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { ComponentType } from '../types/interview';
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
  { type: 'STORAGE', label: 'Storage', color: '#a3e635' },
  { type: 'CUSTOM', label: 'Custom', color: '#e879f9' },
];

interface EditForm {
  label: string;
  description: string;
  technology: string;
  scalingStrategy: string;
  notes: string;
}

export default function DesignCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [editingNode, setEditingNode] = useState<{ id: string; form: EditForm } | null>(null);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } } as Edge, eds));
    },
    [setEdges],
  );

  const addComponent = useCallback(
    (componentType: ComponentType, label: string, color: string) => {
      const id = `${componentType.toLowerCase()}-${Date.now()}`;
      const newNode: Node = {
        id,
        type: 'systemComponent',
        position: { x: 120 + Math.random() * 400, y: 100 + Math.random() * 280 },
        data: { label, componentType, color, description: '', technology: '', scalingStrategy: '', notes: '' },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes],
  );

  const onNodeDoubleClick: NodeMouseHandler = useCallback((_event, node) => {
    setEditingNode({
      id: node.id,
      form: {
        label: (node.data.label as string) ?? '',
        description: (node.data.description as string) ?? '',
        technology: (node.data.technology as string) ?? '',
        scalingStrategy: (node.data.scalingStrategy as string) ?? '',
        notes: (node.data.notes as string) ?? '',
      },
    });
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === editingNode.id
          ? { ...n, data: { ...n.data, ...editingNode.form } }
          : n,
      ),
    );
    setEditingNode(null);
  }, [editingNode, setNodes]);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (editingNode?.id === nodeId) setEditingNode(null);
    },
    [setNodes, setEdges, editingNode],
  );

  const clearCanvas = useCallback(() => {
    if (window.confirm('Clear the entire canvas?')) {
      setNodes([]);
      setEdges([]);
      setEditingNode(null);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="h-full w-full bg-surface flex">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          deleteKeyCode="Delete"
          className="bg-surface"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#374151" />
          <Controls className="!bg-surface-light !border-gray-700" />

          <Panel position="top-left">
            <div className="bg-surface-light rounded-lg p-3 shadow-lg border border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Add Component</h3>
              <div className="flex flex-wrap gap-1.5 max-w-xs">
                {COMPONENT_PALETTE.map(({ type, label, color }) => (
                  <button
                    key={type}
                    onClick={() => addComponent(type, label, color)}
                    className="px-2 py-1 text-xs rounded font-medium text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: color + 'cc' }}
                  >
                    + {label}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          <Panel position="top-right">
            <div className="bg-surface-light rounded-lg p-3 shadow-lg border border-gray-700 space-y-2 min-w-[160px]">
              <p className="text-xs text-gray-400 text-center">
                {nodes.length} components · {edges.length} connections
              </p>
              <p className="text-xs text-gray-500 text-center">Double-click to edit · Del to delete</p>
              <button
                onClick={clearCanvas}
                className="w-full px-3 py-1.5 bg-red-900/40 text-red-300 text-xs rounded border border-red-700/40 hover:bg-red-800/40"
              >
                🗑 Clear Canvas
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {editingNode && (
        <div className="w-72 flex-shrink-0 border-l border-gray-700 bg-surface-light flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-white">Edit Component</h3>
            <div className="flex gap-2">
              <button
                onClick={() => deleteNode(editingNode.id)}
                className="text-xs px-2 py-1 bg-red-900/40 text-red-300 rounded border border-red-700/40 hover:bg-red-800/40"
              >
                🗑 Delete
              </button>
              <button
                onClick={() => setEditingNode(null)}
                className="text-gray-500 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(
              [
                { key: 'label', label: 'Label', placeholder: 'e.g. User Service' },
                { key: 'technology', label: 'Technology', placeholder: 'e.g. Redis 7, PostgreSQL, Kafka' },
                { key: 'description', label: 'Description', placeholder: 'What does this component do?' },
                { key: 'scalingStrategy', label: 'Scaling Strategy', placeholder: 'e.g. Horizontal, Read replicas' },
                { key: 'notes', label: 'Notes', placeholder: 'Any additional context…' },
              ] as { key: keyof EditForm; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                {key === 'notes' || key === 'description' ? (
                  <textarea
                    rows={3}
                    value={editingNode.form[key]}
                    onChange={(e) =>
                      setEditingNode((prev) =>
                        prev ? { ...prev, form: { ...prev.form, [key]: e.target.value } } : prev,
                      )
                    }
                    placeholder={placeholder}
                    className="w-full px-2 py-1.5 text-sm bg-surface border border-gray-600 rounded text-white resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <input
                    type="text"
                    value={editingNode.form[key]}
                    onChange={(e) =>
                      setEditingNode((prev) =>
                        prev ? { ...prev, form: { ...prev.form, [key]: e.target.value } } : prev,
                      )
                    }
                    placeholder={placeholder}
                    className="w-full px-2 py-1.5 text-sm bg-surface border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={saveEdit}
              className="w-full px-4 py-2 bg-primary text-white text-sm rounded font-medium hover:bg-primary-dark"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
