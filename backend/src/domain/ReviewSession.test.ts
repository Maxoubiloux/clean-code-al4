import { ReviewSession } from './ReviewSession';
import { UserId } from './UserId';

describe('ReviewSession', () => {
    describe('create', () => {
        it('should create a new session', () => {
            const userId = UserId.create('user-1');
            const date = new Date('2024-01-01');
            const session = ReviewSession.create('session-1', userId, date);

            expect(session.getSessionId()).toBe('session-1');
            expect(session.getUserId()).toEqual(userId);
            expect(session.getDate()).toEqual(date);
            expect(session.getCardIds()).toEqual([]);
            expect(session.isCompleted()).toBe(false);
        });

        it('should create a session with initial cards', () => {
            const userId = UserId.create('user-1');
            const date = new Date('2024-01-01');
            const cardIds = ['card-1', 'card-2', 'card-3'];
            const session = ReviewSession.create('session-1', userId, date, cardIds);

            expect(session.getCardIds()).toEqual(cardIds);
        });

        it('should throw error for empty session ID', () => {
            const userId = UserId.create('user-1');
            const date = new Date('2024-01-01');

            expect(() => ReviewSession.create('', userId, date)).toThrow('Session ID cannot be empty');
            expect(() => ReviewSession.create('   ', userId, date)).toThrow('Session ID cannot be empty');
        });
    });

    describe('addCard', () => {
        it('should add a card to the session', () => {
            const userId = UserId.create('user-1');
            const session = ReviewSession.create('session-1', userId, new Date());

            session.addCard('card-1');
            expect(session.getCardIds()).toEqual(['card-1']);

            session.addCard('card-2');
            expect(session.getCardIds()).toEqual(['card-1', 'card-2']);
        });

        it('should not add duplicate cards', () => {
            const userId = UserId.create('user-1');
            const session = ReviewSession.create('session-1', userId, new Date());

            session.addCard('card-1');
            session.addCard('card-1');
            session.addCard('card-1');

            expect(session.getCardIds()).toEqual(['card-1']);
        });
    });

    describe('complete', () => {
        it('should mark session as completed', () => {
            const userId = UserId.create('user-1');
            const session = ReviewSession.create('session-1', userId, new Date());

            expect(session.isCompleted()).toBe(false);

            session.complete();
            expect(session.isCompleted()).toBe(true);
        });
    });

    describe('isForDate', () => {
        it('should return true for same date', () => {
            const userId = UserId.create('user-1');
            const date = new Date('2024-01-15T10:30:00');
            const session = ReviewSession.create('session-1', userId, date);

            expect(session.isForDate(new Date('2024-01-15T14:00:00'))).toBe(true);
            expect(session.isForDate(new Date('2024-01-15T00:00:00'))).toBe(true);
            expect(session.isForDate(new Date('2024-01-15T23:59:59'))).toBe(true);
        });

        it('should return false for different dates', () => {
            const userId = UserId.create('user-1');
            const date = new Date('2024-01-15T10:30:00');
            const session = ReviewSession.create('session-1', userId, date);

            expect(session.isForDate(new Date('2024-01-14T23:59:59'))).toBe(false);
            expect(session.isForDate(new Date('2024-01-16T00:00:00'))).toBe(false);
            expect(session.isForDate(new Date('2024-02-15T10:30:00'))).toBe(false);
            expect(session.isForDate(new Date('2023-01-15T10:30:00'))).toBe(false);
        });
    });

    describe('reconstitute', () => {
        it('should reconstitute a session from stored data', () => {
            const userId = UserId.create('user-1');
            const date = new Date('2024-01-01');
            const cardIds = ['card-1', 'card-2'];

            const session = ReviewSession.reconstitute('session-1', userId, date, cardIds, true);

            expect(session.getSessionId()).toBe('session-1');
            expect(session.getUserId()).toEqual(userId);
            expect(session.getDate()).toEqual(date);
            expect(session.getCardIds()).toEqual(cardIds);
            expect(session.isCompleted()).toBe(true);
        });
    });
});
