import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';

export class MergeExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
  ): Promise<NodeExecutionResult> {
    const mode = (config.mode as string) || 'append';
    const mergeKey = config.mergeKey as string;
    const mergeInputs = (input as any).__mergeInputs as Record<string, unknown> | undefined;

    if (!mergeInputs) {
      return { output: input };
    }

    const inputValues = Object.values(mergeInputs) as Record<string, unknown>[];

    switch (mode) {
      case 'append':
        return { output: { items: inputValues } };

      case 'mergeByIndex': {
        const merged = Object.assign({}, ...inputValues);
        return { output: merged };
      }

      case 'mergeByKey': {
        const result: Record<string, unknown> = {};
        for (const item of inputValues) {
          const keyVal = String((item as any)?.[mergeKey] ?? '');
          result[keyVal] = { ...(result[keyVal] as any ?? {}), ...item };
        }
        return { output: result };
      }

      default:
        return { output: { items: inputValues } };
    }
  }
}
