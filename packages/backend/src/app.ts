import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import workflowRoutes from './routes/workflows.js';
import executionRoutes from './routes/executions.js';
import webhookRoutes from './routes/webhooks.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api/workflows', workflowRoutes);
  app.use('/api/executions', executionRoutes);
  app.use('/webhooks', webhookRoutes);

  // Serve built frontend in production
  const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res, next) => {
    if (_req.path.startsWith('/api') || _req.path.startsWith('/webhooks') || _req.path.startsWith('/ws')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });

  app.use(errorHandler);

  return app;
}
