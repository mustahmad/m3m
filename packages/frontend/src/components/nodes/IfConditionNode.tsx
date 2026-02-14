import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { useI18n } from '../../i18n/store';

export function IfConditionNode(props: NodeProps) {
  const config = (props.data as any).config || {};
  const { t } = useI18n();
  return (
    <BaseNode
      {...props}
      inputHandles={[{ id: 'input', position: Position.Left }]}
      outputHandles={[
        { id: 'true', position: Position.Right, label: t('nodeHandles.true') },
        { id: 'false', position: Position.Right, label: t('nodeHandles.false') },
      ]}
    >
      <div className="m3m-node-summary">
        {config.field} {config.operator} {config.value}
      </div>
    </BaseNode>
  );
}
