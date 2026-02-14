import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{([\w.]+)\}\}/g, (_, path) => {
    const parts = path.split('.');
    let val: any = data;
    for (const p of parts) {
      val = val?.[p];
    }
    return val !== undefined ? String(val) : `{{${path}}}`;
  });
}

export class AiLlmExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const provider = (config.provider as string) || 'openai';
    const model = (config.model as string) || 'gpt-4o';
    const apiKey = (config.apiKey as string) || '';
    const systemPrompt = interpolate((config.systemPrompt as string) || '', input);
    const userPrompt = interpolate((config.userPrompt as string) || '', input);
    const temperature = (config.temperature as number) ?? 0.7;
    const maxTokens = (config.maxTokens as number) || 1024;

    if (!apiKey) {
      return { output: { ...input, error: 'No API key provided', response: null } };
    }

    try {
      let response: string;

      if (provider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            system: systemPrompt || undefined,
            messages: [{ role: 'user', content: userPrompt }],
          }),
        });
        const data = await res.json() as any;
        response = data.content?.[0]?.text || JSON.stringify(data);
      } else {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature,
            max_tokens: maxTokens,
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              { role: 'user', content: userPrompt },
            ],
          }),
        });
        const data = await res.json() as any;
        response = data.choices?.[0]?.message?.content || JSON.stringify(data);
      }

      return { output: { ...input, response, provider, model } };
    } catch (err: any) {
      return { output: { ...input, error: err.message, response: null } };
    }
  }
}
