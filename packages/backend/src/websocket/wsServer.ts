import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

let wss: WebSocketServer;
const subscriptions = new Map<string, Set<WebSocket>>();

export function initWebSocket(server: Server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'subscribe' && msg.executionId) {
          if (!subscriptions.has(msg.executionId)) {
            subscriptions.set(msg.executionId, new Set());
          }
          subscriptions.get(msg.executionId)!.add(ws);
        }
      } catch {}
    });

    ws.on('close', () => {
      for (const [, clients] of subscriptions) {
        clients.delete(ws);
      }
    });
  });
}

export function broadcastToExecution(executionId: string, data: unknown) {
  const clients = subscriptions.get(executionId);
  if (!clients) return;

  const msg = JSON.stringify(data);
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}
