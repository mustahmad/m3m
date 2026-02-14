import type { ExecutionContext } from './ExecutionContext.js';

export interface NodeExecutionResult {
  output: Record<string, unknown>;
  branch?: 'true' | 'false';
}

export interface NodeExecutor {
  execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    ctx: ExecutionContext
  ): Promise<NodeExecutionResult>;
}
