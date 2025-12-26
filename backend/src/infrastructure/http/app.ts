import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { swaggerRouter } from './swagger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', router);
app.use('/', swaggerRouter);

// Error Handling
app.use(errorHandler);

export { app };
