import { WebhookTriggerNode } from './WebhookTriggerNode';
import { HttpRequestNode } from './HttpRequestNode';
import { CodeFunctionNode } from './CodeFunctionNode';
import { IfConditionNode } from './IfConditionNode';
import { SetDataNode } from './SetDataNode';
import { MergeNode } from './MergeNode';
import { createGenericNode } from './GenericNode';

export const nodeTypes = {
  // Original 6
  webhookTrigger: WebhookTriggerNode,
  httpRequest: HttpRequestNode,
  codeFunction: CodeFunctionNode,
  ifCondition: IfConditionNode,
  setData: SetDataNode,
  merge: MergeNode,
  // New 14
  scheduleTrigger: createGenericNode('scheduleTrigger')!,
  delay: createGenericNode('delay')!,
  switch: createGenericNode('switch')!,
  loop: createGenericNode('loop')!,
  filter: createGenericNode('filter')!,
  sort: createGenericNode('sort')!,
  split: createGenericNode('split')!,
  aggregate: createGenericNode('aggregate')!,
  aiLlm: createGenericNode('aiLlm')!,
  aiClassifier: createGenericNode('aiClassifier')!,
  aiSummarize: createGenericNode('aiSummarize')!,
  emailSend: createGenericNode('emailSend')!,
  log: createGenericNode('log')!,
  errorTrigger: createGenericNode('errorTrigger')!,
};
