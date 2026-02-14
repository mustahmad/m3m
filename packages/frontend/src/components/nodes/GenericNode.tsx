import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NODE_DEFINITIONS, type NodeType } from '@m3m/shared';

export function createGenericNode(nodeType: NodeType) {
  const def = NODE_DEFINITIONS[nodeType];
  if (!def) return null;

  function GenericNode(props: NodeProps) {
    const config = (props.data as any).config || {};

    const inputHandles = [];
    for (let i = 0; i < def.inputs; i++) {
      inputHandles.push({
        id: def.inputs === 1 ? 'input' : `input${i + 1}`,
        position: Position.Left,
      });
    }

    const outputHandles = [];
    if (nodeType === 'switch') {
      const cases = (config.cases as any[]) || [];
      for (let i = 0; i < cases.length; i++) {
        outputHandles.push({ id: `case${i}`, position: Position.Right, label: cases[i]?.value || `Case ${i}` });
      }
      outputHandles.push({ id: 'fallback', position: Position.Right, label: 'Default' });
    } else if (nodeType === 'filter') {
      outputHandles.push({ id: 'true', position: Position.Right, label: 'Match' });
      outputHandles.push({ id: 'false', position: Position.Right, label: 'No Match' });
    } else {
      for (let i = 0; i < def.outputs; i++) {
        outputHandles.push({
          id: def.outputs === 1 ? 'output' : `output${i}`,
          position: Position.Right,
        });
      }
    }

    let summary = '';
    switch (nodeType) {
      case 'scheduleTrigger': summary = config.cron as string || ''; break;
      case 'delay': summary = `${config.duration}${config.unit}`; break;
      case 'switch': summary = `${config.field}`; break;
      case 'loop': summary = `over ${config.arrayField}`; break;
      case 'filter': summary = `${config.field} ${config.operator}`; break;
      case 'sort': summary = `${config.field} ${config.direction}`; break;
      case 'split': summary = `from ${config.arrayField}`; break;
      case 'aggregate': summary = `→ ${config.outputField}`; break;
      case 'aiLlm': summary = `${config.provider}/${config.model}`; break;
      case 'aiClassifier': summary = `${config.categories}`; break;
      case 'aiSummarize': summary = `max ${config.maxLength} chars`; break;
      case 'emailSend': summary = config.to as string || ''; break;
      case 'log': summary = 'pass-through'; break;
      case 'errorTrigger': summary = 'on error'; break;
    }

    return (
      <BaseNode {...props} inputHandles={inputHandles} outputHandles={outputHandles}>
        {summary && <div className="m3m-node-summary">{summary}</div>}
      </BaseNode>
    );
  }

  GenericNode.displayName = `${nodeType}Node`;
  return GenericNode;
}
