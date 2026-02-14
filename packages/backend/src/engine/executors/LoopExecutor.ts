import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class LoopExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const arrayField = (config.arrayField as string) || 'items';
    const batchSize = (config.batchSize as number) || 1;
    const arr = (input as any)[arrayField];

    if (!Array.isArray(arr)) {
      return { output: { ...input, loopItems: [], batchCount: 0 } };
    }

    const batches: unknown[][] = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      batches.push(arr.slice(i, i + batchSize));
    }

    return {
      output: {
        ...input,
        loopItems: arr,
        batches,
        batchCount: batches.length,
        totalItems: arr.length,
      },
    };
  }
}
