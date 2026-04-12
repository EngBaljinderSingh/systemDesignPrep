import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';

export function GroupNode({ data, selected }: NodeProps) {
  const label = (data.label as string) ?? 'Group';
  const color = (data.color as string) ?? '#6366f1';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minWidth: 220,
        minHeight: 160,
        position: 'relative',
        borderRadius: '10px',
        border: `2px dashed ${color}`,
        background: `${color}0d`,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={220}
        minHeight={160}
        lineStyle={{ borderColor: color }}
        handleStyle={{ borderColor: color, backgroundColor: '#1e1e2e' }}
      />

      {/* Connection handles */}
      <Handle type="source" position={Position.Top}    id="top"    style={{ background: '#9ca3af' }} />
      <Handle type="source" position={Position.Left}   id="left"   style={{ background: '#9ca3af' }} />
      <Handle type="source" position={Position.Right}  id="right"  style={{ background: '#9ca3af' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#9ca3af' }} />

      {/* Label badge at top-left */}
      <div
        style={{
          position: 'absolute',
          top: '-1px',
          left: '12px',
          background: `${color}22`,
          border: `1px solid ${color}55`,
          borderRadius: '0 0 6px 6px',
          padding: '2px 10px',
          color: color,
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </div>
  );
}
