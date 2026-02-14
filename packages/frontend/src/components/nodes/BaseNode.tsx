import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';
import { useWorkflowStore } from '../../stores/workflowStore';
import * as Icons from 'lucide-react';
import type { ReactNode } from 'react';

interface HandleDef {
  id: string;
  position: Position;
  label?: string;
}

interface BaseNodeProps extends NodeProps {
  children?: ReactNode;
  inputHandles?: HandleDef[];
  outputHandles?: HandleDef[];
}

export function BaseNode({
  id,
  data,
  type,
  selected,
  children,
  inputHandles = [{ id: 'input', position: Position.Left }],
  outputHandles = [{ id: 'output', position: Position.Right }],
}: BaseNodeProps) {
  const def = NODE_DEFINITIONS[type as NodeType];
  const executionStatus = useWorkflowStore((s) => s.nodeStatuses[id]);

  const IconComponent = def ? (Icons as any)[def.icon] : null;

  const statusClass = executionStatus ? `status-${executionStatus}` : '';

  return (
    <div
      className={`m3m-node ${selected ? 'selected' : ''} ${statusClass}`}
      style={{ borderLeftColor: def?.color, borderLeftWidth: 3 }}
    >
      {inputHandles.map((h, i) => (
        <Handle
          key={h.id}
          type="target"
          position={h.position}
          id={h.id}
          style={
            inputHandles.length > 1
              ? { top: `${((i + 1) / (inputHandles.length + 1)) * 100}%` }
              : undefined
          }
        />
      ))}

      <div className="m3m-node-header">
        <span className="m3m-node-icon" style={{ color: def?.color }}>
          {IconComponent && <IconComponent size={16} />}
        </span>
        <span className="m3m-node-label">{(data as any).label}</span>
      </div>

      {children && <div className="m3m-node-body">{children}</div>}

      {outputHandles.map((h, i) => (
        <Handle
          key={h.id}
          type="source"
          position={h.position}
          id={h.id}
          style={
            outputHandles.length > 1
              ? { top: `${((i + 1) / (outputHandles.length + 1)) * 100}%` }
              : undefined
          }
        />
      ))}

      {outputHandles.length > 1 && outputHandles.map((h, i) =>
        h.label ? (
          <span
            key={`label-${h.id}`}
            className={`handle-label handle-label-${h.id}`}
            style={{ top: `${((i + 1) / (outputHandles.length + 1)) * 100}%`, right: -30, position: 'absolute', transform: 'translateY(-50%)' }}
          >
            {h.label}
          </span>
        ) : null,
      )}
    </div>
  );
}
