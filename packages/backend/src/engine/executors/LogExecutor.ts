import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class LogExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const template = (config.message as string) || '{{input}}';
    const message = template.replace(/\{\{([\w.]+)\}\}/g, (_, path) => {
      if (path === 'input') return JSON.stringify(input);
      const parts = path.split('.');
      let val: any = input;
      for (const p of parts) {
        val = val?.[p];
      }
      return val !== undefined ? String(val) : `{{${path}}}`;
    });

    console.log(`[Log Node] ${message}`);

    return {
      output: { ...input, logged: true, logMessage: message, loggedAt: new Date().toISOString() },
    };
  }
}
