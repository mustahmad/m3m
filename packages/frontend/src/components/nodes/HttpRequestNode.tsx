import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function HttpRequestNode(props: NodeProps) {
  const config = (props.data as any).config || {};
  return (
    <BaseNode {...props} inputHandles={[{ id: 'input', position: Position.Left }]} outputHandles={[{ id: 'output', position: Position.Right }]}>
      <div className="m3m-node-summary">{config.method} {config.url || '...'}</div>
    </BaseNode>
  );
}
