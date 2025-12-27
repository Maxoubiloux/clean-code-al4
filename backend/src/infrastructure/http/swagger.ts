import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../api/swagger.json';
import { Router } from 'express';

const router = Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

export { router as swaggerRouter };
