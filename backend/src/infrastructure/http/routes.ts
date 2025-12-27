import { Router } from 'express';
import { CardRepositoryInMemory } from '../CardRepositoryInMemory';
import { QuizRepositoryInMemory } from '../QuizRepositoryInMemory';
import { UserRepositoryInMemory } from '../UserRepositoryInMemory';
import { SystemClock } from '../SystemClock';
import { AnswerCard } from '../../application/AnswerCard';
import { AuthController } from './controllers/AuthController';
import { CardController } from './controllers/CardController';
import { QuizController } from './controllers/QuizController';

const router = Router();

// Singletons
export const cardRepository = new CardRepositoryInMemory();
export const quizRepository = new QuizRepositoryInMemory();
export const userRepository = new UserRepositoryInMemory();
export const clock = new SystemClock();

// Services
const answerCard = new AnswerCard(cardRepository, clock);

// Controllers
const authController = new AuthController(userRepository, clock);
const cardController = new CardController(cardRepository, clock);
const quizController = new QuizController(quizRepository, cardRepository, answerCard, clock);

// Auth Routes
router.post('/auth/login', (req, res) => authController.handleLogin(req, res));
router.post('/auth/register', (req, res) => authController.handleRegister(req, res));

// Card Routes
router.get('/cards', (req, res) => cardController.list(req, res));
router.post('/cards', (req, res) => cardController.create(req, res));
router.get('/cards/:cardId', (req, res) => cardController.get(req, res));
router.put('/cards/:cardId', (req, res) => cardController.update(req, res));
router.delete('/cards/:cardId', (req, res) => cardController.delete(req, res));

// Quiz Routes
router.get('/quiz/daily', (req, res) => quizController.getDailyStatus(req, res));
router.post('/quiz/start', (req, res) => quizController.startQuiz(req, res));
router.post('/quiz/:quizId/answer', (req, res) => quizController.answer(req, res));
router.post('/quiz/:quizId/complete', (req, res) => quizController.complete(req, res));

// Tags Routes
router.get('/tags/:tagName/cards', (req, res) => {
    req.query.tag = req.params.tagName;
    return cardController.list(req, res);
});

router.get('/tags', async (req, res) => {
    try {
        const cards = await cardRepository.findAll();
        const tags = new Map<string, number>();
        cards.forEach(c => {
            c.getTags().forEach(t => {
                const val = t.getValue();
                tags.set(val, (tags.get(val) || 0) + 1);
            });
        });
        const result = Array.from(tags.entries()).map(([name, count]) => ({ name, cardsCount: count }));
        res.json({ tags: result });
    } catch (e) {
        res.status(500).json({ error: { message: 'Internal Server Error' } });
    }
});

// Notifications & Stats (Mock)
router.get('/notifications/settings', (req, res) => res.json({ enabled: false, time: '09:00', updatedAt: new Date().toISOString() }));
router.put('/notifications/settings', (req, res) => res.json({ enabled: req.body.enabled, time: req.body.time, updatedAt: new Date().toISOString() }));

router.get('/stats', (req, res) => res.json({
    totalCards: 0,
    learnedCards: 0,
    cardsByCategory: {
        category1: 0, category2: 0, category3: 0, category4: 0, category5: 0, category6: 0, category7: 0
    },
    averageSuccessRate: 0,
    totalQuizzes: 0
}));

export { router };
