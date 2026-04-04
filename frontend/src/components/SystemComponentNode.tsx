import { Handle, Position, type NodeProps } from '@xyflow/react';

export function SystemComponentNode({ data }: NodeProps) {
  const color = (data.color as string) ?? '#6366f1';
  const label = (data.label as string) ?? 'Component';
  const componentType = (data.componentType as string) ?? '';

  return (
    <div
      className="rounded-lg shadow-md border-2 px-4 py-3 min-w-[120px] text-center"
      style={{ borderColor: color, backgroundColor: `${color}20` }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{componentType}</div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}
