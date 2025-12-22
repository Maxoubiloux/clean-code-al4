import { AnswerCard } from './AnswerCard';
import { CardRepository } from '../ports/CardRepository';
import { FakeClock } from '../ports/Clock';
import { Card } from '../domain/Card';
import { Tag } from '../domain/Tag';

class MockCardRepository implements CardRepository {
    private cards: Map<string, Card> = new Map();

    async save(card: Card): Promise<void> {
        this.cards.set(card.getCardId(), card);
    }

    async findById(cardId: string): Promise<Card | null> {
        return this.cards.get(cardId) || null;
    }

    async findAll(): Promise<Card[]> {
        return Array.from(this.cards.values());
    }

    async findByTag(tag: Tag): Promise<Card[]> {
        return Array.from(this.cards.values()).filter(card => card.hasTag(tag));
    }

    async findDueCards(currentDate: Date): Promise<Card[]> {
        return Array.from(this.cards.values()).filter(
            card => !card.isGraduated() && card.isDue(currentDate)
        );
    }

    addCard(card: Card): void {
        this.cards.set(card.getCardId(), card);
    }
}

describe('AnswerCard', () => {
    let useCase: AnswerCard;
    let repository: MockCardRepository;
    let clock: FakeClock;

    beforeEach(() => {
        repository = new MockCardRepository();
        clock = new FakeClock(new Date('2024-01-10'));
        useCase = new AnswerCard(repository, clock);
    });

    it('should mark answer as correct when it matches', async () => {
        const card = Card.create('card-1', 'What is 2+2?', '4');
        repository.addCard(card);

        const response = await useCase.execute({
            cardId: 'card-1',
            userAnswer: '4',
        });

        expect(response.isCorrect).toBe(true);
        expect(response.newCategory).toBe(2);
    });

    it('should mark answer as incorrect when it does not match', async () => {
        const card = Card.create('card-1', 'What is 2+2?', '4');
        repository.addCard(card);

        const response = await useCase.execute({
            cardId: 'card-1',
            userAnswer: '5',
        });

        expect(response.isCorrect).toBe(false);
        expect(response.newCategory).toBe(1);
    });

    it('should be case-insensitive', async () => {
        const card = Card.create('card-1', 'Capital of France?', 'Paris');
        repository.addCard(card);

        const response1 = await useCase.execute({
            cardId: 'card-1',
            userAnswer: 'paris',
        });
        expect(response1.isCorrect).toBe(true);

        const card2 = Card.create('card-2', 'Capital of France?', 'Paris');
        repository.addCard(card2);

        const response2 = await useCase.execute({
            cardId: 'card-2',
            userAnswer: 'PARIS',
        });
        expect(response2.isCorrect).toBe(true);
    });

    it('should trim whitespace from answers', async () => {
        const card = Card.create('card-1', 'What is 2+2?', '4');
        repository.addCard(card);

        const response = await useCase.execute({
            cardId: 'card-1',
            userAnswer: '  4  ',
        });

        expect(response.isCorrect).toBe(true);
    });

    it('should promote card to next category on correct answer', async () => {
        const card = Card.reconstitute(
            'card-1',
            'Question?',
            'Answer',
            3,
            [],
            new Date('2024-01-01'),
            new Date('2023-01-01')
        );
        repository.addCard(card);

        const response = await useCase.execute({
            cardId: 'card-1',
            userAnswer: 'Answer',
        });

        expect(response.isCorrect).toBe(true);
        expect(response.newCategory).toBe(4);
    });

    it('should demote card to category 1 on incorrect answer', async () => {
        const card = Card.reconstitute(
            'card-1',
            'Question?',
            'Answer',
            5,
            [],
            new Date('2024-01-01'),
            new Date('2023-01-01')
        );
        repository.addCard(card);

        const response = await useCase.execute({
            cardId: 'card-1',
            userAnswer: 'Wrong',
        });

        expect(response.isCorrect).toBe(false);
        expect(response.newCategory).toBe(1);
    });

    it('should update last review date', async () => {
        const card = Card.create('card-1', 'Question?', 'Answer');
        repository.addCard(card);

        await useCase.execute({
            cardId: 'card-1',
            userAnswer: 'Answer',
        });

        const updatedCard = await repository.findById('card-1');
        expect(updatedCard!.getLastReviewDate()).toEqual(clock.now());
    });

    it('should throw error if card not found', async () => {
        await expect(
            useCase.execute({
                cardId: 'non-existent',
                userAnswer: 'Answer',
            })
        ).rejects.toThrow('Card not found: non-existent');
    });

    it('should return correct answer in response', async () => {
        const card = Card.create('card-1', 'What is 2+2?', '4');
        repository.addCard(card);

        const response = await useCase.execute({
            cardId: 'card-1',
            userAnswer: '5',
        });

        expect(response.correctAnswer).toBe('4');
    });
});
