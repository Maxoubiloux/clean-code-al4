import { ListCardsByTags } from './ListCardsByTags';
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

describe('ListCardsByTags', () => {
    let repo: MockCardRepository;

    beforeEach(() => {
        repo = new MockCardRepository();
    });

    it('should list cards that have any of the provided tags', async () => {
        const c1 = Card.create('c1', 'Q1', 'A1', [Tag.create('math')]);
        const c2 = Card.create('c2', 'Q2', 'A2', [Tag.create('history')]);
        const c3 = Card.create('c3', 'Q3', 'A3', [Tag.create('math'), Tag.create('history')]);
        const c4 = Card.create('c4', 'Q4', 'A4', [Tag.create('science')]);
        repo.addCard(c1); repo.addCard(c2); repo.addCard(c3); repo.addCard(c4);

        const useCase = new ListCardsByTags(repo);
        const res = await useCase.execute({ tags: ['math', 'history'] });

        expect(res.cardIds.sort()).toEqual(['c1','c2','c3'].sort());
        expect(res.cardIds).not.toContain('c4');
    });

    it('should return unique ids when a card matches multiple tags', async () => {
        const c = Card.create('c', 'Q', 'A', [Tag.create('t1'), Tag.create('t2')]);
        repo.addCard(c);
        const useCase = new ListCardsByTags(repo);
        const res = await useCase.execute({ tags: ['t1', 't2'] });
        expect(res.cardIds).toEqual(['c']);
    });
});
