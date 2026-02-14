import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class SplitExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const arrayField = (config.arrayField as string) || 'items';
    const arr = (input as any)[arrayField];

    if (!Array.isArray(arr)) {
      return { output: { ...input, splitItems: [] } };
    }

    return {
      output: {
        ...input,
        splitItems: arr,
        splitCount: arr.length,
      },
    };
  }
}
