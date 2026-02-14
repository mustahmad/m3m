import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function IfConditionNode(props: NodeProps) {
  const config = (props.data as any).config || {};
  return (
    <BaseNode
      {...props}
      inputHandles={[{ id: 'input', position: Position.Left }]}
      outputHandles={[
        { id: 'true', position: Position.Right, label: 'True' },
        { id: 'false', position: Position.Right, label: 'False' },
      ]}
    >
      <div className="m3m-node-summary">
        {config.field} {config.operator} {config.value}
      </div>
    </BaseNode>
  );
}
