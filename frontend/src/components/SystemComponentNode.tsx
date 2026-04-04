import { Handle, Position, type NodeProps } from '@xyflow/react';

export function SystemComponentNode({ data }: NodeProps) {
  const color = (data.color as string) ?? '#6366f1';
  const label = (data.label as string) ?? 'Component';
  const componentType = (data.componentType as string) ?? '';
  const technology = (data.technology as string) ?? '';
  const description = (data.description as string) ?? '';

  return (
    <div
      className="rounded-lg shadow-md border-2 px-3 py-2 min-w-[130px] max-w-[200px] text-center cursor-pointer select-none"
      style={{ borderColor: color, backgroundColor: `${color}20` }}
      title="Double-click to edit"
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="text-sm font-semibold text-white leading-tight">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{componentType}</div>
      {technology && (
        <div className="text-xs mt-1 px-1.5 py-0.5 rounded bg-black/30 text-gray-300 truncate" title={technology}>
          {technology}
        </div>
      )}
      {description && (
        <div className="text-xs mt-1 text-gray-500 italic line-clamp-2" title={description}>
          {description}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}
