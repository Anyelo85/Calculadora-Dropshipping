import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import { calculatorRouter } from './modules/calculator.routes';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/calculator', calculatorRouter);

  return app;
}
