import { Card } from './Card';
import { Tag } from './Tag';
import { ReviewResult } from './ReviewResult';

describe('Card', () => {
    describe('create', () => {
        it('should create a new card with valid data', () => {
            const card = Card.create('card-1', 'What is 2+2?', '4');

            expect(card.getCardId()).toBe('card-1');
            expect(card.getQuestion()).toBe('What is 2+2?');
            expect(card.getAnswer()).toBe('4');
            expect(card.getCategory().getValue()).toBe(1);
            expect(card.getTags()).toEqual([]);
            expect(card.getLastReviewDate()).toBeNull();
        });

        it('should create a card with tags', () => {
            const tags = [Tag.create('math'), Tag.create('easy')];
            const card = Card.create('card-1', 'What is 2+2?', '4', tags);

            expect(card.getTags()).toHaveLength(2);
            expect(card.hasTag(Tag.create('math'))).toBe(true);
            expect(card.hasTag(Tag.create('easy'))).toBe(true);
        });

        it('should trim question and answer', () => {
            const card = Card.create('card-1', '  What is 2+2?  ', '  4  ');

            expect(card.getQuestion()).toBe('What is 2+2?');
            expect(card.getAnswer()).toBe('4');
        });

        it('should throw error for empty card ID', () => {
            expect(() => Card.create('', 'Question?', 'Answer')).toThrow('Card ID cannot be empty');
            expect(() => Card.create('   ', 'Question?', 'Answer')).toThrow('Card ID cannot be empty');
        });

        it('should throw error for empty question', () => {
            expect(() => Card.create('card-1', '', 'Answer')).toThrow('Question cannot be empty');
            expect(() => Card.create('card-1', '   ', 'Answer')).toThrow('Question cannot be empty');
        });

        it('should throw error for empty answer', () => {
            expect(() => Card.create('card-1', 'Question?', '')).toThrow('Answer cannot be empty');
            expect(() => Card.create('card-1', 'Question?', '   ')).toThrow('Answer cannot be empty');
        });
    });

    describe('review - Leitner Rules', () => {
        it('should move to next category on correct answer', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');
            const reviewDate = new Date('2024-01-01');

            card.review(ReviewResult.correct(), reviewDate);
            expect(card.getCategory().getValue()).toBe(2);
            expect(card.getLastReviewDate()).toEqual(reviewDate);
            card.review(ReviewResult.correct(), new Date('2024-01-03'));
            expect(card.getCategory().getValue()).toBe(3);
        });

        it('should progress through all categories with correct answers', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');
            let reviewDate = new Date('2024-01-01');

            for (let expectedCategory = 2; expectedCategory <= 7; expectedCategory++) {
                card.review(ReviewResult.correct(), reviewDate);
                expect(card.getCategory().getValue()).toBe(expectedCategory);
                reviewDate = new Date(reviewDate.getTime() + 86400000);
            }
        });

        it('should stay at category 7 when answering correctly', () => {
            const card = Card.reconstitute(
                'card-1',
                'Question?',
                'Answer',
                7,
                [],
                new Date('2024-01-01'),
                new Date('2023-01-01')
            );

            card.review(ReviewResult.correct(), new Date('2024-03-01'));
            expect(card.getCategory().getValue()).toBe(7);
        });

        it('should return to category 1 on incorrect answer from any category', () => {
            let card = Card.reconstitute(
                'card-1',
                'Question?',
                'Answer',
                3,
                [],
                new Date('2024-01-01'),
                new Date('2023-01-01')
            );
            card.review(ReviewResult.incorrect(), new Date('2024-01-05'));
            expect(card.getCategory().getValue()).toBe(1);

            card = Card.reconstitute(
                'card-2',
                'Question?',
                'Answer',
                7,
                [],
                new Date('2024-01-01'),
                new Date('2023-01-01')
            );
            card.review(ReviewResult.incorrect(), new Date('2024-03-01'));
            expect(card.getCategory().getValue()).toBe(1);
        });

        it('should treat forced correct same as correct', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');

            card.review(ReviewResult.forcedCorrect(), new Date('2024-01-01'));
            expect(card.getCategory().getValue()).toBe(2);

            card.review(ReviewResult.forcedCorrect(), new Date('2024-01-03'));
            expect(card.getCategory().getValue()).toBe(3);
        });
    });

    describe('isDue', () => {
        it('should return true for never-reviewed cards', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');
            expect(card.isDue(new Date())).toBe(true);
        });

        it('should return false for graduated cards', () => {
            const card = Card.reconstitute(
                'card-1',
                'Question?',
                'Answer',
                7,
                [],
                new Date('2024-01-01'),
                new Date('2023-01-01')
            );

            expect(card.isDue(new Date('2024-12-31'))).toBe(false);
        });

        it('should calculate due date based on category frequency - category 1 (1 day)', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');
            const reviewDate = new Date('2024-01-01T10:00:00');
            card.review(ReviewResult.incorrect(), reviewDate);

            expect(card.isDue(new Date('2024-01-01T15:00:00'))).toBe(false);
            expect(card.isDue(new Date('2024-01-02T10:00:00'))).toBe(true);
            expect(card.isDue(new Date('2024-01-03T10:00:00'))).toBe(true);
        });

        it('should calculate due date based on category frequency - category 2 (2 days)', () => {
            const card = Card.reconstitute(
                'card-1',
                'Question?',
                'Answer',
                2,
                [],
                new Date('2024-01-01'),
                new Date('2023-01-01')
            );

            expect(card.isDue(new Date('2024-01-02'))).toBe(false);
            expect(card.isDue(new Date('2024-01-03'))).toBe(true);
        });

        it('should calculate due date based on category frequency - category 3 (4 days)', () => {
            const card = Card.reconstitute(
                'card-1',
                'Question?',
                'Answer',
                3,
                [],
                new Date('2024-01-01'),
                new Date('2023-01-01')
            );

            expect(card.isDue(new Date('2024-01-04'))).toBe(false);
            expect(card.isDue(new Date('2024-01-05'))).toBe(true);
        });

        it('should calculate due date based on category frequency - category 7 (64 days)', () => {
            const card = Card.reconstitute(
                'card-1',
                'Question?',
                'Answer',
                6,
                [],
                new Date('2024-01-01'),
                new Date('2023-01-01')
            );

            expect(card.isDue(new Date('2024-01-32'))).toBe(false);
            expect(card.isDue(new Date('2024-02-02'))).toBe(true);
        });
    });

    describe('tag management', () => {
        it('should add a tag to the card', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');
            const tag = Tag.create('math');

            card.addTag(tag);
            expect(card.hasTag(tag)).toBe(true);
            expect(card.getTags()).toHaveLength(1);
        });

        it('should not add duplicate tags', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');
            const tag = Tag.create('math');

            card.addTag(tag);
            card.addTag(tag);
            card.addTag(Tag.create('math'));

            expect(card.getTags()).toHaveLength(1);
        });

        it('should add multiple different tags', () => {
            const card = Card.create('card-1', 'Question?', 'Answer');

            card.addTag(Tag.create('math'));
            card.addTag(Tag.create('algebra'));
            card.addTag(Tag.create('easy'));

            expect(card.getTags()).toHaveLength(3);
        });
    });

    describe('isGraduated', () => {
        it('should return false for non-graduated cards', () => {
            for (let i = 1; i <= 6; i++) {
                const card = Card.reconstitute(
                    'card-1',
                    'Question?',
                    'Answer',
                    i,
                    [],
                    new Date(),
                    new Date()
                );
                expect(card.isGraduated()).toBe(false);
            }
        });

        it('should return true for category 7 cards', () => {
            const card = Card.reconstitute(
                'card-1',
                'Question?',
                'Answer',
                7,
                [],
                new Date(),
                new Date()
            );
            expect(card.isGraduated()).toBe(true);
        });
    });
});
