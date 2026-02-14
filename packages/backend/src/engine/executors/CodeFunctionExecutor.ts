import vm from 'node:vm';
import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';

export class CodeFunctionExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
  ): Promise<NodeExecutionResult> {
    const code = (config.code as string) || 'return input;';

    const sandbox = {
      input: structuredClone(input),
      console: { log: () => {}, warn: () => {}, error: () => {} },
      result: undefined as unknown,
    };

    const wrappedCode = `result = (function() { ${code} })();`;
    const context = vm.createContext(sandbox);
    const script = new vm.Script(wrappedCode);
    script.runInContext(context, { timeout: 5000 });

    const output =
      typeof sandbox.result === 'object' && sandbox.result !== null
        ? (sandbox.result as Record<string, unknown>)
        : { value: sandbox.result };

    return { output };
  }
}
