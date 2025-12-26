import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', router);

// Error Handling
app.use(errorHandler);

export { app };
