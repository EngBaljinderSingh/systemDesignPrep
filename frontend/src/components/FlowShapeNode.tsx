import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';

export type FlowShapeType = 'PROCESS' | 'DECISION' | 'TERMINAL' | 'IO' | 'SUBPROCESS' | 'NOTE';

const DEFAULT_COLORS: Record<FlowShapeType, string> = {
  PROCESS:    '#60a5fa',
  DECISION:   '#fbbf24',
  TERMINAL:   '#34d399',
  IO:         '#a78bfa',
  SUBPROCESS: '#38bdf8',
  NOTE:       '#9ca3af',
};

const MIN_SIZE: Record<FlowShapeType, { width: number; height: number }> = {
  PROCESS:    { width: 120, height: 60 },
  DECISION:   { width: 130, height: 100 },
  TERMINAL:   { width: 120, height: 60 },
  IO:         { width: 130, height: 60 },
  SUBPROCESS: { width: 120, height: 60 },
  NOTE:       { width: 120, height: 80 },
};

// ── SVG shape backgrounds ─────────────────────────────────────
function ShapeSVG({ shapeType, color }: { shapeType: FlowShapeType; color: string }) {
  const fill = `${color}20`;
  const vef  = 'non-scaling-stroke' as const;

  const svgStyle: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  };

  switch (shapeType) {
    case 'PROCESS':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svgStyle}>
          <rect x="1" y="1" width="98" height="98" rx="2" ry="2"
            fill={fill} stroke={color} strokeWidth={2} vectorEffect={vef} />
        </svg>
      );

    case 'DECISION':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svgStyle}>
          <polygon points="50,1 99,50 50,99 1,50"
            fill={fill} stroke={color} strokeWidth={2} vectorEffect={vef} />
        </svg>
      );

    case 'TERMINAL':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svgStyle}>
          <rect x="1" y="1" width="98" height="98" rx="50" ry="50"
            fill={fill} stroke={color} strokeWidth={2} vectorEffect={vef} />
        </svg>
      );

    case 'IO':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svgStyle}>
          <polygon points="15,1 99,1 85,99 1,99"
            fill={fill} stroke={color} strokeWidth={2} vectorEffect={vef} />
        </svg>
      );

    case 'SUBPROCESS':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svgStyle}>
          <rect x="1" y="1" width="98" height="98" rx="2" ry="2"
            fill={fill} stroke={color} strokeWidth={2} vectorEffect={vef} />
          <line x1="9"  y1="1"  x2="9"  y2="99" stroke={color} strokeWidth={1.5} vectorEffect={vef} />
          <line x1="91" y1="1"  x2="91" y2="99" stroke={color} strokeWidth={1.5} vectorEffect={vef} />
        </svg>
      );

    case 'NOTE':
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svgStyle}>
          <polygon points="1,1 84,1 99,16 99,99 1,99"
            fill={fill} stroke={color} strokeWidth={2} strokeDasharray="5 2" vectorEffect={vef} />
          <polyline points="84,1 84,16 99,16"
            fill="none" stroke={color} strokeWidth={2} vectorEffect={vef} />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svgStyle}>
          <rect x="1" y="1" width="98" height="98" rx="2" ry="2"
            fill={fill} stroke={color} strokeWidth={2} vectorEffect={vef} />
        </svg>
      );
  }
}

const HANDLES = (
  <>
    <Handle type="source" position={Position.Top}    id="top"    style={{ background: '#9ca3af' }} />
    <Handle type="source" position={Position.Left}   id="left"   style={{ background: '#9ca3af' }} />
    <Handle type="source" position={Position.Right}  id="right"  style={{ background: '#9ca3af' }} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#9ca3af' }} />
  </>
);

// ── Main export ───────────────────────────────────────────────
export function FlowShapeNode({ data, selected }: NodeProps) {
  const shapeType = (data.shapeType as FlowShapeType) ?? 'PROCESS';
  const label     = (data.label     as string)        ?? 'Step';
  const color     = (data.color     as string)        ?? DEFAULT_COLORS[shapeType] ?? '#60a5fa';
  const min       = MIN_SIZE[shapeType] ?? { width: 120, height: 60 };

  // Inset padding for label — diamond needs more to stay inside the shape
  const labelPadding = shapeType === 'DECISION' ? '28% 22%' : '8px';

  return (
    <div style={{ width: '100%', height: '100%', minWidth: min.width, minHeight: min.height, position: 'relative' }}>
      <NodeResizer
        isVisible={selected}
        minWidth={min.width}
        minHeight={min.height}
        lineStyle={{ borderColor: color }}
        handleStyle={{ borderColor: color, backgroundColor: '#1e1e2e' }}
      />
      {HANDLES}

      {/* SVG shape */}
      <ShapeSVG shapeType={shapeType} color={color} />

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: labelPadding,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span className="text-sm font-semibold text-white leading-tight">{label}</span>
      </div>
    </div>
  );
}
