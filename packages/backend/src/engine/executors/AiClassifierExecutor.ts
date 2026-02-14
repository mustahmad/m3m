import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class AiClassifierExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const provider = (config.provider as string) || 'openai';
    const model = (config.model as string) || 'gpt-4o-mini';
    const apiKey = (config.apiKey as string) || '';
    const inputField = (config.inputField as string) || 'text';
    const categories = (config.categories as string) || 'positive, negative, neutral';
    const text = String((input as any)[inputField] || '');

    if (!apiKey) {
      return { output: { ...input, category: null, error: 'No API key provided' } };
    }

    const prompt = `Classify the following text into exactly one of these categories: ${categories}.\n\nText: "${text}"\n\nRespond with ONLY the category name, nothing else.`;

    try {
      let category: string;

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
            max_tokens: 50,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await res.json() as any;
        category = (data.content?.[0]?.text || '').trim();
      } else {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0,
            max_tokens: 50,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await res.json() as any;
        category = (data.choices?.[0]?.message?.content || '').trim();
      }

      return { output: { ...input, category, provider, model } };
    } catch (err: any) {
      return { output: { ...input, category: null, error: err.message } };
    }
  }
}
