import type { NodeExecutor } from './NodeExecutor.js';
import { WebhookTriggerExecutor } from './executors/WebhookTriggerExecutor.js';
import { HttpRequestExecutor } from './executors/HttpRequestExecutor.js';
import { CodeFunctionExecutor } from './executors/CodeFunctionExecutor.js';
import { IfConditionExecutor } from './executors/IfConditionExecutor.js';
import { SetDataExecutor } from './executors/SetDataExecutor.js';
import { MergeExecutor } from './executors/MergeExecutor.js';

const registry = new Map<string, NodeExecutor>();

registry.set('webhookTrigger', new WebhookTriggerExecutor());
registry.set('httpRequest', new HttpRequestExecutor());
registry.set('codeFunction', new CodeFunctionExecutor());
registry.set('ifCondition', new IfConditionExecutor());
registry.set('setData', new SetDataExecutor());
registry.set('merge', new MergeExecutor());

export const executorRegistry = {
  get(type: string): NodeExecutor | undefined {
    return registry.get(type);
  },
};
