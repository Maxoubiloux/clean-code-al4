import { AddTag } from './AddTag';
import { CardRepository } from '../ports/CardRepository';
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
        return Array.from(this.cards.values()).filter(c => c.hasTag(tag));
    }

    async findDueCards(currentDate: Date): Promise<Card[]> {
        return Array.from(this.cards.values()).filter(
            c => !c.isGraduated() && c.isDue(currentDate)
        );
    }

    addCard(card: Card): void { this.cards.set(card.getCardId(), card); }
}

describe('AddTag', () => {
    let repo: MockCardRepository;

    beforeEach(() => {
        repo = new MockCardRepository();
    });

    it('should add a tag to a card', async () => {
        const card = Card.create('c1', 'Q', 'A');
        repo.addCard(card);
        const useCase = new AddTag(repo);

        const res = await useCase.execute({ cardId: 'c1', tagName: 'math' });

        expect(res.cardId).toBe('c1');
        expect(res.tags).toEqual(['math']);
    });

    it('should not duplicate an existing tag', async () => {
        const card = Card.create('c1', 'Q', 'A', [Tag.create('math')]);
        repo.addCard(card);
        const useCase = new AddTag(repo);

        const res = await useCase.execute({ cardId: 'c1', tagName: 'math' });

        expect(res.tags).toEqual(['math']);
    });

    it('should throw when card not found', async () => {
        const useCase = new AddTag(repo);
        await expect(
            useCase.execute({ cardId: 'unknown', tagName: 't' })
        ).rejects.toThrow('Card not found: unknown');
    });
});
