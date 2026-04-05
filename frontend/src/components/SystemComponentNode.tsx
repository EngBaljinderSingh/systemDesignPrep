import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';

// Types that render as a 3-part cylinder
const CYLINDER_TYPES = new Set(['DATABASE', 'STORAGE']);

// ── Cylinder shape (DB / Storage) ─────────────────────────────
function CylinderBody({ color, children }: { color: string; children: React.ReactNode }) {
  const cap: React.CSSProperties = {
    height: '18px',
    borderRadius: '50%',
    border: `2px solid ${color}`,
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Top cap */}
      <div style={{ ...cap, background: `${color}55`, marginBottom: '-1px' }} />
      {/* Body */}
      <div style={{
        flex: 1,
        borderLeft: `2px solid ${color}`,
        borderRight: `2px solid ${color}`,
        background: `${color}18`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        overflow: 'hidden',
      }}>
        {children}
      </div>
      {/* Bottom cap */}
      <div style={{ ...cap, background: `${color}30`, marginTop: '-1px' }} />
    </div>
  );
}

// ── Border-radius per type ────────────────────────────────────
const BORDER_RADIUS: Record<string, string> = {
  CLIENT:        '12px',
  LOAD_BALANCER: '6px 20px 6px 20px', // chevron feel
  API_GATEWAY:   '20px',
  SERVICE:       '8px',
  DATABASE:      '4px',
  CACHE:         '40px',              // pill / capsule
  MESSAGE_QUEUE: '4px 12px 4px 4px',  // folded corner feel
  CDN:           '50%',               // circle
  STORAGE:       '4px',
  CUSTOM:        '8px',
};

// ── Handles (shared by all shapes) ───────────────────────────
const HANDLES = (
  <>
    <Handle type="source" position={Position.Top}    id="top"    style={{ background: '#9ca3af' }} />
    <Handle type="source" position={Position.Left}   id="left"   style={{ background: '#9ca3af' }} />
    <Handle type="source" position={Position.Right}  id="right"  style={{ background: '#9ca3af' }} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#9ca3af' }} />
  </>
);

// ── Main node component ───────────────────────────────────────
export function SystemComponentNode({ data, selected }: NodeProps) {
  const color        = (data.color         as string) ?? '#6366f1';
  const label        = (data.label         as string) ?? 'Component';
  const componentType= (data.componentType as string) ?? 'CUSTOM';
  const technology   = (data.technology    as string) ?? '';
  const description  = (data.description   as string) ?? '';

  const BR           = BORDER_RADIUS[componentType] ?? '8px';
  const isCylinder   = CYLINDER_TYPES.has(componentType);

  // ── Content (shared) ─────────────────────────────────────
  const content = (
    <>
      <div className="text-sm font-semibold text-white leading-tight">{label}</div>
      {technology && (
        <div
          className="text-xs mt-1 px-1.5 py-0.5 rounded bg-black/30 text-gray-300 truncate max-w-full"
          title={technology}
        >
          {technology}
        </div>
      )}
      {description && (
        <div className="text-xs mt-1 text-gray-400 italic line-clamp-2 text-center" title={description}>
          {description}
        </div>
      )}
    </>
  );

  // ── Cylinder nodes (DATABASE / STORAGE) ──────────────────
  if (isCylinder) {
    return (
      <div
        className="cursor-pointer select-none"
        style={{ width: '100%', height: '100%', minWidth: 130, minHeight: 80 }}
      >
        <NodeResizer
          isVisible={selected}
          minWidth={130}
          minHeight={80}
          lineStyle={{ borderColor: color }}
          handleStyle={{ borderColor: color, backgroundColor: '#1e1e2e' }}
        />
        {HANDLES}
        <CylinderBody color={color}>{content}</CylinderBody>
      </div>
    );
  }

  // ── All other nodes ───────────────────────────────────────
  return (
    <div
      className="shadow-md cursor-pointer select-none flex flex-col items-center justify-center px-3 py-2"
      style={{
        width: '100%',
        height: '100%',
        minWidth: 130,
        minHeight: 60,
        border: `2px solid ${color}`,
        borderRadius: BR,
        backgroundColor: `${color}20`,
        textAlign: 'center',
        overflow: 'hidden',
      }}
      title="Double-click to edit"
    >
      <NodeResizer
        isVisible={selected}
        minWidth={130}
        minHeight={60}
        lineStyle={{ borderColor: color }}
        handleStyle={{ borderColor: color, backgroundColor: '#1e1e2e' }}
      />
      {HANDLES}
      {content}
    </div>
  );
}
