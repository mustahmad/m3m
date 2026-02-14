import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function MergeNode(props: NodeProps) {
  const config = (props.data as any).config || {};
  return (
    <BaseNode
      {...props}
      inputHandles={[
        { id: 'input1', position: Position.Left },
        { id: 'input2', position: Position.Left },
      ]}
      outputHandles={[{ id: 'output', position: Position.Right }]}
    >
      <div className="m3m-node-summary">Mode: {config.mode || 'append'}</div>
    </BaseNode>
  );
}
