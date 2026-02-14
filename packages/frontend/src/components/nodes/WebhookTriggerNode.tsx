import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function WebhookTriggerNode(props: NodeProps) {
  const config = (props.data as any).config || {};
  return (
    <BaseNode {...props} inputHandles={[]} outputHandles={[{ id: 'output', position: Position.Right }]}>
      <div className="m3m-node-summary">{config.method} {config.path}</div>
    </BaseNode>
  );
}
