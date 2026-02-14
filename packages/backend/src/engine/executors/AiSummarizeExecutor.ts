import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';
import type { ExecutionContext } from '../ExecutionContext.js';

export class AiSummarizeExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const provider = (config.provider as string) || 'openai';
    const model = (config.model as string) || 'gpt-4o-mini';
    const apiKey = (config.apiKey as string) || '';
    const inputField = (config.inputField as string) || 'text';
    const maxLength = (config.maxLength as number) || 200;
    const language = (config.language as string) || 'en';
    const text = String((input as any)[inputField] || '');

    if (!apiKey) {
      return { output: { ...input, summary: null, error: 'No API key provided' } };
    }

    const langMap: Record<string, string> = {
      en: 'English', ru: 'Russian', es: 'Spanish', fr: 'French',
      de: 'German', zh: 'Chinese', ja: 'Japanese',
    };
    const langName = langMap[language] || 'English';
    const prompt = `Summarize the following text in ${langName}, using at most ${maxLength} words:\n\n${text}`;

    try {
      let summary: string;

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
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await res.json() as any;
        summary = (data.content?.[0]?.text || '').trim();
      } else {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await res.json() as any;
        summary = (data.choices?.[0]?.message?.content || '').trim();
      }

      return { output: { ...input, summary, provider, model } };
    } catch (err: any) {
      return { output: { ...input, summary: null, error: err.message } };
    }
  }
}
