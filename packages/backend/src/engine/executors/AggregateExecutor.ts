import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class AggregateExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const outputField = (config.outputField as string) || 'items';

    // Collect all array-like values from input into one aggregated array
    const aggregated: unknown[] = [];
    for (const val of Object.values(input)) {
      if (Array.isArray(val)) {
        aggregated.push(...val);
      } else {
        aggregated.push(val);
      }
    }

    return {
      output: { [outputField]: aggregated, count: aggregated.length },
    };
  }
}
