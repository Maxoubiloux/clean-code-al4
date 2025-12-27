import { CreateCard } from './CreateCard';
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
        return Array.from(this.cards.values()).filter(c => c.hasTag(tag));
    }

    async findDueCards(currentDate: Date): Promise<Card[]> {
        return Array.from(this.cards.values()).filter(
            c => !c.isGraduated() && c.isDue(currentDate)
        );
    }
}

describe('CreateCard', () => {
    let repo: MockCardRepository;
    let clock: FakeClock;

    beforeEach(() => {
        repo = new MockCardRepository();
        clock = new FakeClock(new Date('2024-02-01'));
    });

    it('should create and persist a new card with default category 1', async () => {
        const useCase = new CreateCard(repo, clock);

        const res = await useCase.execute({
            cardId: 'c1',
            question: 'Q?',
            answer: 'A',
            tags: ['math', 'algebra']
        });

        expect(res.cardId).toBe('c1');
        expect(res.category).toBe(1);

        const stored = await repo.findById('c1');
        expect(stored).not.toBeNull();
        expect(stored!.getTags().map(t => t.getValue())).toEqual(['math', 'algebra']);
        expect(stored!.getCreatedAt()).toEqual(clock.now());
    });

    it('should trim inputs and validate', async () => {
        const useCase = new CreateCard(repo, clock);
        const res = await useCase.execute({
            cardId: ' c2 ',
            question: '  What?  ',
            answer: '  Ans  ',
            tags: ['  tag  ']
        } as any);
        expect(res.category).toBe(1);
        const stored = await repo.findById(' c2 ');
        expect(stored!.getQuestion()).toBe('What?');
        expect(stored!.getAnswer()).toBe('Ans');
        expect(stored!.getTags()[0].getValue()).toBe('tag');
    });
});
