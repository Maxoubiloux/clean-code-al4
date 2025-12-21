import { Tag } from './Tag';

describe('Tag', () => {
    describe('create', () => {
        it('should create a valid tag with non-empty name', () => {
            const tag = Tag.create('mathematics');
            expect(tag.getValue()).toBe('mathematics');
        });

        it('should trim whitespace from tag name', () => {
            const tag = Tag.create('  history  ');
            expect(tag.getValue()).toBe('history');
        });

        it('should throw error for empty string', () => {
            expect(() => Tag.create('')).toThrow('Tag name cannot be empty');
        });

        it('should throw error for whitespace-only string', () => {
            expect(() => Tag.create('   ')).toThrow('Tag name cannot be empty');
            expect(() => Tag.create('\t\n')).toThrow('Tag name cannot be empty');
        });

        it('should accept tags with special characters', () => {
            const tag1 = Tag.create('C++');
            const tag2 = Tag.create('Node.js');
            const tag3 = Tag.create('français');

            expect(tag1.getValue()).toBe('C++');
            expect(tag2.getValue()).toBe('Node.js');
            expect(tag3.getValue()).toBe('français');
        });
    });

    describe('equals', () => {
        it('should return true for tags with same name', () => {
            const tag1 = Tag.create('science');
            const tag2 = Tag.create('science');
            expect(tag1.equals(tag2)).toBe(true);
        });

        it('should return false for tags with different names', () => {
            const tag1 = Tag.create('science');
            const tag2 = Tag.create('math');
            expect(tag1.equals(tag2)).toBe(false);
        });

        it('should be case-sensitive', () => {
            const tag1 = Tag.create('Science');
            const tag2 = Tag.create('science');
            expect(tag1.equals(tag2)).toBe(false);
        });
    });
});
