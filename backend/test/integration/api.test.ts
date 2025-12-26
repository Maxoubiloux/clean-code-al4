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

    it('POST /api/cards/:id/answer should return correct result', async () => {
        // Seed
        const card = Card.create('c-integration-1', 'Question?', 'Answer');
        await cardRepository.save(card);

        // Act
        const response = await request(app)
            .post('/api/cards/c-integration-1/answer')
            .send({ userAnswer: 'Answer' });

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            cardId: 'c-integration-1',
            isCorrect: true,
            correctAnswer: 'Answer'
        });
    });

    it('POST /api/cards/:id/answer should return incorrect result', async () => {
        // Seed
        const card = Card.create('c-integration-2', 'Question?', 'Answer');
        await cardRepository.save(card);

        // Act
        const response = await request(app)
            .post('/api/cards/c-integration-2/answer')
            .send({ userAnswer: 'Wrong' });

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.isCorrect).toBe(false);
    });

    it('POST /api/cards/:id/answer should return 404 for unknown card', async () => {
        // Act
        const response = await request(app)
            .post('/api/cards/unknown-card/answer')
            .send({ userAnswer: 'Any' });

        // Assert
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Card not found: unknown-card' });
    });

    it('POST /api/cards/:id/answer should return 400 for missing body', async () => {
        const response = await request(app)
            .post('/api/cards/c-integration-1/answer')
            .send({});

        expect(response.status).toBe(400);
    });
});
