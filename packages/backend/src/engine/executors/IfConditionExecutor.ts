import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';

export class IfConditionExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
  ): Promise<NodeExecutionResult> {
    const field = config.field as string;
    const operator = config.operator as string;
    const value = config.value as string;

    const fieldValue = this.resolveField(input, field);
    const conditionMet = this.evaluate(fieldValue, operator, value);

    return {
      output: input,
      branch: conditionMet ? 'true' : 'false',
    };
  }

  private resolveField(data: Record<string, unknown>, path: string): unknown {
    const keys = path.split('.');
    let current: any = data;
    for (const key of keys) {
      current = current?.[key];
    }
    return current;
  }

  private evaluate(fieldValue: unknown, operator: string, compareValue: string): boolean {
    switch (operator) {
      case 'equals': return String(fieldValue) === compareValue;
      case 'notEquals': return String(fieldValue) !== compareValue;
      case 'gt': return Number(fieldValue) > Number(compareValue);
      case 'lt': return Number(fieldValue) < Number(compareValue);
      case 'contains': return String(fieldValue).includes(compareValue);
      case 'exists': return fieldValue !== undefined && fieldValue !== null;
      default: return false;
    }
  }
}
