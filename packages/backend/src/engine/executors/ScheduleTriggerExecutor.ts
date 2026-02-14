import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class ScheduleTriggerExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    return {
      output: {
        ...input,
        trigger: 'schedule',
        cron: config.cron || '* * * * *',
        timezone: config.timezone || 'UTC',
        triggeredAt: new Date().toISOString(),
      },
    };
  }
}
