import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';

export class WebhookTriggerExecutor implements NodeExecutor {
  async execute(
    _config: Record<string, unknown>,
    input: Record<string, unknown>,
  ): Promise<NodeExecutionResult> {
    return { output: input };
  }
}
