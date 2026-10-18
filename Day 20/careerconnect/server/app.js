import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(helmet());
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check (used by hosting platforms and smoke tests)
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', uptime: process.uptime() })
);

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
