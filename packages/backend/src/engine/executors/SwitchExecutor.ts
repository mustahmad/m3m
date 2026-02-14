import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class SwitchExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const field = (config.field as string) || '';
    const cases = (config.cases as Array<{ value: string; output: number }>) || [];
    const value = String((input as any)[field] ?? '');

    const matchedCase = cases.findIndex((c) => c.value === value);

    return {
      output: {
        ...input,
        switchField: field,
        switchValue: value,
        matchedCase: matchedCase >= 0 ? matchedCase : 'default',
      },
      branch: matchedCase >= 0 ? String(matchedCase) as any : 'false',
    };
  }
}
