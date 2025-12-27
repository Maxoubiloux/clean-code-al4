import { ForceValidateCard } from './ForceValidateCard';
import { CardRepository } from '../ports/CardRepository';
import { FakeClock } from '../infrastructure/FakeClock';
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

    async delete(cardId: string): Promise<void> {
        this.cards.delete(cardId);
    }
}

describe('ForceValidateCard', () => {
    let useCase: ForceValidateCard;
    let repository: MockCardRepository;
    let clock: FakeClock;

    beforeEach(() => {
        repository = new MockCardRepository();
        clock = new FakeClock(new Date('2024-01-10'));
        useCase = new ForceValidateCard(repository, clock);
    });

    it('should promote card to next category', async () => {
        const card = Card.create('card-1', 'Question?', 'Answer');
        repository.addCard(card);

        const response = await useCase.execute({ cardId: 'card-1' });

        expect(response.newCategory).toBe(2);
    });

    it('should promote card from any category', async () => {
        const card = Card.reconstitute(
            'card-1',
            'Question?',
            'Answer',
            4,
            [],
            new Date('2024-01-01'),
            new Date('2023-01-01')
        );
        repository.addCard(card);

        const response = await useCase.execute({ cardId: 'card-1' });

        expect(response.newCategory).toBe(5);
    });

    it('should update last review date', async () => {
        const card = Card.create('card-1', 'Question?', 'Answer');
        repository.addCard(card);

        await useCase.execute({ cardId: 'card-1' });

        const updatedCard = await repository.findById('card-1');
        expect(updatedCard!.getLastReviewDate()).toEqual(clock.now());
    });

    it('should throw error if card not found', async () => {
        await expect(
            useCase.execute({ cardId: 'non-existent' })
        ).rejects.toThrow('Card not found: non-existent');
    });

    it('should stay at category 7 when already graduated', async () => {
        const card = Card.reconstitute(
            'card-1',
            'Question?',
            'Answer',
            7,
            [],
            new Date('2024-01-01'),
            new Date('2023-01-01')
        );
        repository.addCard(card);

        const response = await useCase.execute({ cardId: 'card-1' });

        expect(response.newCategory).toBe(7);
    });
});
