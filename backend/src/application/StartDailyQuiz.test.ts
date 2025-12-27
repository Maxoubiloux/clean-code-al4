import { StartDailyQuiz } from './StartDailyQuiz';
import { CardRepository } from '../ports/CardRepository';
import { QuizRepository } from '../ports/QuizRepository';
import { FakeClock } from '../ports/Clock';
import { Card } from '../domain/Card';
import { Tag } from '../domain/Tag';
import { ReviewSession } from '../domain/ReviewSession';
import { UserId } from '../domain/UserId';

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

class InMemoryQuizRepository implements QuizRepository {
    private sessions: Map<string, ReviewSession> = new Map();

    async save(session: ReviewSession): Promise<void> {
        this.sessions.set(`${session.getUserId().getValue()}-${session.getDate().toDateString()}`, session);
    }

    async findByUserAndDate(userId: UserId, date: Date): Promise<ReviewSession | null> {
        return this.sessions.get(`${userId.getValue()}-${date.toDateString()}`) || null;
    }
}

describe('StartDailyQuiz', () => {
    let cardRepo: MockCardRepository;
    let quizRepo: InMemoryQuizRepository;
    let clock: FakeClock;

    beforeEach(() => {
        cardRepo = new MockCardRepository();
        quizRepo = new InMemoryQuizRepository();
        clock = new FakeClock(new Date('2024-01-10'));
    });

    it('should create a session with due cards for the day', async () => {
        const c1 = Card.create('c1', 'Q1', 'A1');
        const c2 = Card.create('c2', 'Q2', 'A2');
        cardRepo.addCard(c1); cardRepo.addCard(c2);

        const useCase = new StartDailyQuiz(cardRepo, quizRepo, clock);
        const res = await useCase.execute({ userId: 'u1' });

        expect(res.sessionId).toBe('u1-20240110');
        expect(res.cardIds.sort()).toEqual(['c1', 'c2'].sort());
    });

    it('should return existing session if already started today', async () => {
        const useCase = new StartDailyQuiz(cardRepo, quizRepo, clock);

        // seed existing session
        const user = UserId.create('u1');
        const session = ReviewSession.create('u1-20240110', user, clock.now(), ['c1']);
        await quizRepo.save(session);

        const res = await useCase.execute({ userId: 'u1' });
        expect(res.sessionId).toBe('u1-20240110');
        expect(res.cardIds).toEqual(['c1']);
    });
});
