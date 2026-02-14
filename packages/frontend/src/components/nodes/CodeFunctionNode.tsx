import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function CodeFunctionNode(props: NodeProps) {
  return (
    <BaseNode {...props} inputHandles={[{ id: 'input', position: Position.Left }]} outputHandles={[{ id: 'output', position: Position.Right }]}>
      <div className="m3m-node-summary">JavaScript</div>
    </BaseNode>
  );
}
