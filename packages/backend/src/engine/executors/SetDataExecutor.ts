import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';

export class SetDataExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
  ): Promise<NodeExecutionResult> {
    const assignments = (config.assignments as Array<{ field: string; value: string }>) || [];
    const mode = (config.mode as string) || 'set';

    let output: Record<string, unknown>;
    if (mode === 'replace') {
      output = {};
    } else {
      output = { ...input };
    }

    for (const { field, value } of assignments) {
      if (!field) continue;
      const resolvedValue = value.startsWith('{{')
        ? this.resolveTemplate(value, input)
        : this.parseValue(value);
      this.setNestedField(output, field, resolvedValue);
    }

    return { output };
  }

  private setNestedField(obj: Record<string, unknown>, path: string, value: unknown) {
    const keys = path.split('.');
    let current: any = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  private resolveTemplate(template: string, data: Record<string, unknown>): unknown {
    const match = template.match(/^\{\{(.+?)\}\}$/);
    if (!match) return template;
    const keys = match[1].trim().split('.');
    let value: any = data;
    for (const key of keys) value = value?.[key];
    return value;
  }

  private parseValue(value: string): unknown {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') return num;
    return value;
  }
}
