import { GetDueCards } from './GetDueCards';
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

    addCard(card: Card): void { this.cards.set(card.getCardId(), card); }
}

describe('GetDueCards', () => {
    let repo: MockCardRepository;
    let clock: FakeClock;

    beforeEach(() => {
        repo = new MockCardRepository();
        clock = new FakeClock(new Date('2024-01-10'));
    });

    it('should return ids of cards due on current date', async () => {
        // never reviewed => due
        const c1 = Card.create('c1', 'Q1', 'A1');
        // reviewed yesterday in early category => not due if spacing > 1 day
        const c2 = Card.reconstitute('c2', 'Q2', 'A2', 2, [], new Date('2024-01-09'), new Date('2024-01-01'));
        // reviewed a week ago, category 2 (2 days spacing) => due
        const c3 = Card.reconstitute('c3', 'Q3', 'A3', 2, [], new Date('2024-01-02'), new Date('2024-01-01'));

        repo.addCard(c1);
        repo.addCard(c2);
        repo.addCard(c3);

        const useCase = new GetDueCards(repo, clock);
        const res = await useCase.execute({});

        expect(res.cardIds).toContain('c1');
        expect(res.cardIds).toContain('c3');
        expect(res.cardIds).not.toContain('c2');
    });
});
