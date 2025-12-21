import { ReviewResult, ReviewResultType } from './ReviewResult';

describe('ReviewResult', () => {
    describe('create', () => {
        it('should create CORRECT result', () => {
            const result = ReviewResult.create('CORRECT');
            expect(result.getType()).toBe(ReviewResultType.CORRECT);
        });

        it('should create INCORRECT result', () => {
            const result = ReviewResult.create('INCORRECT');
            expect(result.getType()).toBe(ReviewResultType.INCORRECT);
        });

        it('should create FORCED_CORRECT result', () => {
            const result = ReviewResult.create('FORCED_CORRECT');
            expect(result.getType()).toBe(ReviewResultType.FORCED_CORRECT);
        });

        it('should be case-insensitive', () => {
            const result1 = ReviewResult.create('correct');
            const result2 = ReviewResult.create('Correct');
            const result3 = ReviewResult.create('CORRECT');

            expect(result1.getType()).toBe(ReviewResultType.CORRECT);
            expect(result2.getType()).toBe(ReviewResultType.CORRECT);
            expect(result3.getType()).toBe(ReviewResultType.CORRECT);
        });

        it('should throw error for invalid result type', () => {
            expect(() => ReviewResult.create('INVALID')).toThrow('Invalid review result type: INVALID');
            expect(() => ReviewResult.create('MAYBE')).toThrow('Invalid review result type: MAYBE');
        });
    });

    describe('factory methods', () => {
        it('should create correct result via factory', () => {
            const result = ReviewResult.correct();
            expect(result.getType()).toBe(ReviewResultType.CORRECT);
        });

        it('should create incorrect result via factory', () => {
            const result = ReviewResult.incorrect();
            expect(result.getType()).toBe(ReviewResultType.INCORRECT);
        });

        it('should create forced correct result via factory', () => {
            const result = ReviewResult.forcedCorrect();
            expect(result.getType()).toBe(ReviewResultType.FORCED_CORRECT);
        });
    });

    describe('isCorrect', () => {
        it('should return true for CORRECT', () => {
            expect(ReviewResult.correct().isCorrect()).toBe(true);
        });

        it('should return true for FORCED_CORRECT', () => {
            expect(ReviewResult.forcedCorrect().isCorrect()).toBe(true);
        });

        it('should return false for INCORRECT', () => {
            expect(ReviewResult.incorrect().isCorrect()).toBe(false);
        });
    });

    describe('isIncorrect', () => {
        it('should return true for INCORRECT', () => {
            expect(ReviewResult.incorrect().isIncorrect()).toBe(true);
        });

        it('should return false for CORRECT', () => {
            expect(ReviewResult.correct().isIncorrect()).toBe(false);
        });

        it('should return false for FORCED_CORRECT', () => {
            expect(ReviewResult.forcedCorrect().isIncorrect()).toBe(false);
        });
    });
});
