import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class ErrorTriggerExecutor implements NodeExecutor {
  async execute(
    _config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    // This node is activated by the engine when an error occurs.
    // It simply passes through the error information.
    return {
      output: {
        ...input,
        isErrorHandler: true,
        handledAt: new Date().toISOString(),
      },
    };
  }
}
