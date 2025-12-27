import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { QuizRepository } from '../../../ports/QuizRepository';
import { CardRepository } from '../../../ports/CardRepository';
import { Clock } from '../../../ports/Clock';
import { ReviewSession } from '../../../domain/ReviewSession';
import { UserId } from '../../../domain/UserId';
import { AnswerCard } from '../../../application/AnswerCard';

export class QuizController {
    constructor(
        private readonly quizRepository: QuizRepository,
        private readonly cardRepository: CardRepository,
        private readonly answerCard: AnswerCard,
        private readonly clock: Clock
    ) { }

    private getUserId(_req: Request): UserId {
        // TODO: Extract from token or context
        return UserId.create('demo-user');
    }

    async getDailyStatus(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const now = this.clock.now();
            const session = await this.quizRepository.findByUserAndDate(userId, now);
            const dueCards = await this.cardRepository.findDueCards(now);

            const available = !session || !session.isCompleted();
            // Basic logic: if completed session found for today, not available. 
            // If active session, available to continue? Or strictly "start new"?
            // Swagger says "available" boolean.

            return res.json({
                available: available && (dueCards.length > 0 || (session && !session.isCompleted())),
                lastQuizDate: session && session.isCompleted() ? session.getDate().toISOString().split('T')[0] : null,
                cardsCount: dueCards.length
            });
        } catch (error) {
            return res.status(500).json({ error: { message: 'Internal Server Error' } });
        }
    }

    async startQuiz(req: Request, res: Response) {
        try {
            const userId = this.getUserId(req);
            const now = this.clock.now();
            let session = await this.quizRepository.findByUserAndDate(userId, now);

            if (session && session.isCompleted()) {
                return res.status(400).json({ error: { message: 'Un quiz a déjà été effectué aujourd\'hui' } });
            }

            if (!session) {
                const dueCards = await this.cardRepository.findDueCards(now);
                if (dueCards.length === 0) {
                    // Swagger doesn't explicitly handle "no cards due" in Start except maybe returning empty list?
                    // Or maybe we create empty session?
                }
                session = ReviewSession.create(
                    randomUUID(),
                    userId,
                    now,
                    dueCards.map(c => c.getCardId())
                );
                await this.quizRepository.save(session);
            }

            const cardIds = session.getCardIds();
            // Fetch card details
            const cards = [];
            for (const id of cardIds) {
                const card = await this.cardRepository.findById(id);
                if (card) {
                    cards.push({
                        id: card.getCardId(),
                        question: card.getQuestion(),
                        category: card.getCategory().getValue(),
                        tags: card.getTags().map(t => t.getValue())
                    });
                }
            }

            return res.json({
                quizId: session.getSessionId(),
                cards: cards,
                totalCards: cards.length
            });

        } catch (error) {
            return res.status(500).json({ error: { message: 'Internal Server Error' } });
        }
    }

    async answer(req: Request, res: Response) {
        try {
            const { quizId: _quizId } = req.params;
            const { cardId, userAnswer } = req.body;

            const result = await this.answerCard.execute({ cardId, userAnswer });

            const userId = this.getUserId(req);
            const now = this.clock.now();
            const session = await this.quizRepository.findByUserAndDate(userId, now);
            if (session) {
                session.recordAnswer(cardId, result.isCorrect);
            }

            return res.json({
                correct: result.isCorrect,
                expectedAnswer: result.correctAnswer,
                userAnswer,
                newCategory: result.newCategory,
                cardId
            });

        } catch (error: any) {
            if (error.message && error.message.includes('Card not found')) {
                return res.status(404).json({ error: { message: error.message } });
            }
            return res.status(500).json({ error: { message: 'Internal Server Error' } });
        }
    }

    async complete(req: Request, res: Response) {
        const userId = this.getUserId(req);
        const now = this.clock.now();
        const session = await this.quizRepository.findByUserAndDate(userId, now);

        if (!session) {
            return res.status(404).json({ error: { message: 'Quiz non trouvé' } });
        }

        session.complete();
        const stats = session.getStats();

        return res.json({
            quizId: session.getSessionId(),
            completedAt: now.toISOString(),
            totalCards: stats.total,
            correctAnswers: stats.correct,
            incorrectAnswers: stats.incorrect,
            successRate: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
        });
    }
}
