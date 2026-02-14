import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class SortExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const field = (config.field as string) || '';
    const direction = (config.direction as string) || 'asc';

    // If input has an array, sort it
    const data = { ...input };
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) {
        data[key] = [...(data[key] as any[])].sort((a, b) => {
          const va = a?.[field] ?? a;
          const vb = b?.[field] ?? b;
          const cmp = va < vb ? -1 : va > vb ? 1 : 0;
          return direction === 'desc' ? -cmp : cmp;
        });
      }
    }

    return { output: data };
  }
}
