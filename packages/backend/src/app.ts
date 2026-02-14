import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import workflowRoutes from './routes/workflows.js';
import executionRoutes from './routes/executions.js';
import webhookRoutes from './routes/webhooks.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api/workflows', workflowRoutes);
  app.use('/api/executions', executionRoutes);
  app.use('/webhooks', webhookRoutes);

  app.use(errorHandler);

  return app;
}
