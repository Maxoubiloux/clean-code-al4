import { Router } from 'express';
import { AnswerCardController } from './controllers/AnswerCardController';
import { CardRepositoryInMemory } from '../CardRepositoryInMemory';
import { SystemClock } from '../SystemClock';
import { AnswerCard } from '../../application/AnswerCard';

// Composition Root for Routes
// In a larger app, this dependency injection setup might be in a separate container/file.
const router = Router();

// Dependencies
// Note: We need singletons for repositories to persist data in-memory across requests.
// Ensure these instance are reused if we want state to persist.
// Exporting them or creating a container file would be better usually.
// For now, let's instantiate here, but be aware that if this file is re-imported or Express handles it weirdly, state might reset.
// Actually, 'import' caches modules, so top-level variables are singletons per process.
export const cardRepository = new CardRepositoryInMemory();
export const clock = new SystemClock();

const answerCard = new AnswerCard(cardRepository, clock);
const answerCardController = new AnswerCardController(answerCard);

router.post('/cards/:cardId/answer', (req, res, next) => answerCardController.handle(req, res, next));

export { router };
