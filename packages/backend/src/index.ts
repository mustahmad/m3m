import { createApp } from './app.js';
import { initDb } from './db/connection.js';
import { runMigrations } from './db/migrate.js';
import { initWebSocket } from './websocket/wsServer.js';

const PORT = process.env.PORT ?? 3001;

async function main() {
  initDb();
  runMigrations();

  const app = createApp();

  const server = app.listen(PORT, () => {
    console.log(`m3m backend running on http://localhost:${PORT}`);
  });

  initWebSocket(server);
}

main().catch(console.error);
