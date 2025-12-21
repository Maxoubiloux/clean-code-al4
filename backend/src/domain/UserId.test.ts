import { UserId } from './UserId';

describe('UserId', () => {
    describe('create', () => {
        it('should create a valid UserId', () => {
            const userId = UserId.create('user-123');
            expect(userId.getValue()).toBe('user-123');
        });

        it('should throw error for empty string', () => {
            expect(() => UserId.create('')).toThrow('UserId cannot be empty');
        });

        it('should throw error for whitespace-only string', () => {
            expect(() => UserId.create('   ')).toThrow('UserId cannot be empty');
        });

        it('should accept various ID formats', () => {
            const uuid = UserId.create('550e8400-e29b-41d4-a716-446655440000');
            const numeric = UserId.create('12345');
            const alphanumeric = UserId.create('user_abc_123');

            expect(uuid.getValue()).toBe('550e8400-e29b-41d4-a716-446655440000');
            expect(numeric.getValue()).toBe('12345');
            expect(alphanumeric.getValue()).toBe('user_abc_123');
        });
    });

    describe('equals', () => {
        it('should return true for UserIds with same value', () => {
            const userId1 = UserId.create('user-123');
            const userId2 = UserId.create('user-123');
            expect(userId1.equals(userId2)).toBe(true);
        });

        it('should return false for UserIds with different values', () => {
            const userId1 = UserId.create('user-123');
            const userId2 = UserId.create('user-456');
            expect(userId1.equals(userId2)).toBe(false);
        });
    });
});
