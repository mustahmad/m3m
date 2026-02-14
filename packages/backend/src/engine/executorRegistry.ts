import type { NodeExecutor } from './NodeExecutor.js';
import { WebhookTriggerExecutor } from './executors/WebhookTriggerExecutor.js';
import { HttpRequestExecutor } from './executors/HttpRequestExecutor.js';
import { CodeFunctionExecutor } from './executors/CodeFunctionExecutor.js';
import { IfConditionExecutor } from './executors/IfConditionExecutor.js';
import { SetDataExecutor } from './executors/SetDataExecutor.js';
import { MergeExecutor } from './executors/MergeExecutor.js';
import { ScheduleTriggerExecutor } from './executors/ScheduleTriggerExecutor.js';
import { DelayExecutor } from './executors/DelayExecutor.js';
import { SwitchExecutor } from './executors/SwitchExecutor.js';
import { LoopExecutor } from './executors/LoopExecutor.js';
import { FilterExecutor } from './executors/FilterExecutor.js';
import { SortExecutor } from './executors/SortExecutor.js';
import { SplitExecutor } from './executors/SplitExecutor.js';
import { AggregateExecutor } from './executors/AggregateExecutor.js';
import { AiLlmExecutor } from './executors/AiLlmExecutor.js';
import { AiClassifierExecutor } from './executors/AiClassifierExecutor.js';
import { AiSummarizeExecutor } from './executors/AiSummarizeExecutor.js';
import { EmailSendExecutor } from './executors/EmailSendExecutor.js';
import { LogExecutor } from './executors/LogExecutor.js';
import { ErrorTriggerExecutor } from './executors/ErrorTriggerExecutor.js';

const registry = new Map<string, NodeExecutor>();

registry.set('webhookTrigger', new WebhookTriggerExecutor());
registry.set('httpRequest', new HttpRequestExecutor());
registry.set('codeFunction', new CodeFunctionExecutor());
registry.set('ifCondition', new IfConditionExecutor());
registry.set('setData', new SetDataExecutor());
registry.set('merge', new MergeExecutor());
registry.set('scheduleTrigger', new ScheduleTriggerExecutor());
registry.set('delay', new DelayExecutor());
registry.set('switch', new SwitchExecutor());
registry.set('loop', new LoopExecutor());
registry.set('filter', new FilterExecutor());
registry.set('sort', new SortExecutor());
registry.set('split', new SplitExecutor());
registry.set('aggregate', new AggregateExecutor());
registry.set('aiLlm', new AiLlmExecutor());
registry.set('aiClassifier', new AiClassifierExecutor());
registry.set('aiSummarize', new AiSummarizeExecutor());
registry.set('emailSend', new EmailSendExecutor());
registry.set('log', new LogExecutor());
registry.set('errorTrigger', new ErrorTriggerExecutor());

export const executorRegistry = {
  get(type: string): NodeExecutor | undefined {
    return registry.get(type);
  },
};
