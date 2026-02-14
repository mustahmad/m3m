import type { NodeExecutor, NodeExecutionResult } from '../NodeExecutor.js';

export class HttpRequestExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
  ): Promise<NodeExecutionResult> {
    const method = (config.method as string) || 'GET';
    const url = this.interpolate((config.url as string) || '', input);
    const headersRaw = config.headers as string | Record<string, string>;
    const body = this.interpolate((config.body as string) || '', input);

    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof headersRaw === 'string') {
      try { headers = { ...headers, ...JSON.parse(headersRaw) }; } catch {}
    } else if (typeof headersRaw === 'object') {
      headers = { ...headers, ...headersRaw };
    }

    const fetchOptions: RequestInit = { method, headers };
    if (method !== 'GET' && method !== 'HEAD' && body) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    let responseData: unknown;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      output: {
        statusCode: response.status,
        body: responseData,
        ...input,
      },
    };
  }

  private interpolate(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{\{(.+?)\}\}/g, (_, path) => {
      const keys = path.trim().split('.');
      let value: any = data;
      for (const key of keys) {
        value = value?.[key];
      }
      return value !== undefined ? String(value) : '';
    });
  }
}
