import { broadcastToExecution } from './wsServer.js';

export function broadcast(executionId: string, event: Record<string, unknown>) {
  broadcastToExecution(executionId, {
    ...event,
    executionId,
    timestamp: new Date().toISOString(),
  });
}
