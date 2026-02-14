import { WebhookTriggerNode } from './WebhookTriggerNode';
import { HttpRequestNode } from './HttpRequestNode';
import { CodeFunctionNode } from './CodeFunctionNode';
import { IfConditionNode } from './IfConditionNode';
import { SetDataNode } from './SetDataNode';
import { MergeNode } from './MergeNode';

export const nodeTypes = {
  webhookTrigger: WebhookTriggerNode,
  httpRequest: HttpRequestNode,
  codeFunction: CodeFunctionNode,
  ifCondition: IfConditionNode,
  setData: SetDataNode,
  merge: MergeNode,
};
