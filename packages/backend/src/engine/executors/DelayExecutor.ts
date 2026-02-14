import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class DelayExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const duration = (config.duration as number) || 1000;
    const unit = (config.unit as string) || 'ms';

    let ms = duration;
    if (unit === 's') ms = duration * 1000;
    else if (unit === 'm') ms = duration * 60 * 1000;

    // Cap at 30 seconds for safety
    ms = Math.min(ms, 30000);

    await new Promise((resolve) => setTimeout(resolve, ms));

    return { output: { ...input, delayed: true, delayMs: ms } };
  }
}
