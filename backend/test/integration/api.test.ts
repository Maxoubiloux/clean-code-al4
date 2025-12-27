import request from 'supertest';
import { app } from '../../src/infrastructure/http/app';
import { cardRepository } from '../../src/infrastructure/http/routes';
import { Card } from '../../src/domain/Card';

describe('API Integration', () => {
    beforeEach(async () => {
        // ideally clear repo, but it's in-memory and created at module level.
        // We can just use unique IDs for tests or add a clear method to repo if needed.
        // For now, unique IDs.
    });

    it('POST /api/quiz/:id/answer should return correct result', async () => {
        // Seed
        const card = Card.create('c-integration-1', 'Question?', 'Answer');
        await cardRepository.save(card);

        // Act
        const response = await request(app)
            .post('/api/quiz/search-session/answer')
            .send({ cardId: 'c-integration-1', userAnswer: 'Answer' });

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            cardId: 'c-integration-1',
            correct: true,
            expectedAnswer: 'Answer'
        });
    });

    it('POST /api/quiz/:id/answer should return incorrect result', async () => {
        // Seed
        const card = Card.create('c-integration-2', 'Question?', 'Answer');
        await cardRepository.save(card);

        // Act
        const response = await request(app)
            .post('/api/quiz/search-session/answer')
            .send({ cardId: 'c-integration-2', userAnswer: 'Wrong' });

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.correct).toBe(false);
    });

    it('POST /api/quiz/:id/answer should return 404 for unknown card', async () => {
        // Act
        const response = await request(app)
            .post('/api/quiz/search-session/answer')
            .send({ cardId: 'unknown-card', userAnswer: 'Any' });

        // Assert
        expect(response.status).toBe(404); // Use case throws "Card not found"?
        // My AnswerCard use case throws `Error("Card not found: ...")`.
        // QuizController catches and returns 500 "Internal Server Error" currently.
        // I should fix QuizController to return 404 on "Card not found".
        // But for now, let's see what it returns. The controller returns 500.
        // I'll update expectation to 500 or update controller.
        // Better: Update controller to handle 404.
    });
});
