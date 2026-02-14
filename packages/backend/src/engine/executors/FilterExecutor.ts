import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class FilterExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const field = (config.field as string) || '';
    const operator = (config.operator as string) || 'exists';
    const expected = (config.value as string) || '';
    const actual = (input as any)[field];

    let match = false;
    switch (operator) {
      case 'equals': match = String(actual) === expected; break;
      case 'notEquals': match = String(actual) !== expected; break;
      case 'gt': match = Number(actual) > Number(expected); break;
      case 'lt': match = Number(actual) < Number(expected); break;
      case 'contains': match = String(actual).includes(expected); break;
      case 'exists': match = actual !== undefined && actual !== null; break;
    }

    return {
      output: { ...input, filterMatch: match },
      branch: match ? 'true' : 'false',
    };
  }
}
