import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function SetDataNode(props: NodeProps) {
  const config = (props.data as any).config || {};
  const count = Array.isArray(config.assignments) ? config.assignments.length : 0;
  return (
    <BaseNode {...props} inputHandles={[{ id: 'input', position: Position.Left }]} outputHandles={[{ id: 'output', position: Position.Right }]}>
      <div className="m3m-node-summary">{count} field(s) · {config.mode || 'set'}</div>
    </BaseNode>
  );
}
