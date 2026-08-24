import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ai-campaign-agent-backend'
  });
});

app.use('/api', apiRoutes);

// Error handling must be last
app.use(errorMiddleware);

export default app;
