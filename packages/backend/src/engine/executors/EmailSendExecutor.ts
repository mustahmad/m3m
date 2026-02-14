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

export class EmailSendExecutor implements NodeExecutor {
  async execute(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    _ctx: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const to = interpolate((config.to as string) || '', input);
    const subject = interpolate((config.subject as string) || '', input);
    const body = interpolate((config.body as string) || '', input);

    // In a real implementation, this would use nodemailer or similar.
    // For now, we log and return success simulation.
    console.log(`[EmailSend] To: ${to}, Subject: ${subject}`);

    return {
      output: {
        ...input,
        emailSent: true,
        emailTo: to,
        emailSubject: subject,
        emailBody: body,
        sentAt: new Date().toISOString(),
      },
    };
  }
}
