import { Category } from './Category';

describe('Category', () => {
    describe('create', () => {
        it('should create a valid category from 1 to 7', () => {
            for (let i = 1; i <= 7; i++) {
                const category = Category.create(i);
                expect(category.getValue()).toBe(i);
            }
        });

        it('should throw error for category less than 1', () => {
            expect(() => Category.create(0)).toThrow('Category must be between 1 and 7');
            expect(() => Category.create(-1)).toThrow('Category must be between 1 and 7');
        });

        it('should throw error for category greater than 7', () => {
            expect(() => Category.create(8)).toThrow('Category must be between 1 and 7');
            expect(() => Category.create(10)).toThrow('Category must be between 1 and 7');
        });

        it('should throw error for non-integer values', () => {
            expect(() => Category.create(1.5)).toThrow('Category must be an integer');
            expect(() => Category.create(3.14)).toThrow('Category must be an integer');
        });
    });

    describe('next', () => {
        it('should return next category for categories 1-6', () => {
            expect(Category.create(1).next().getValue()).toBe(2);
            expect(Category.create(2).next().getValue()).toBe(3);
            expect(Category.create(3).next().getValue()).toBe(4);
            expect(Category.create(4).next().getValue()).toBe(5);
            expect(Category.create(5).next().getValue()).toBe(6);
            expect(Category.create(6).next().getValue()).toBe(7);
        });

        it('should stay at category 7 when already at max', () => {
            const category = Category.create(7);
            expect(category.next().getValue()).toBe(7);
        });
    });

    describe('isGraduated', () => {
        it('should return true only for category 7', () => {
            expect(Category.create(1).isGraduated()).toBe(false);
            expect(Category.create(2).isGraduated()).toBe(false);
            expect(Category.create(3).isGraduated()).toBe(false);
            expect(Category.create(4).isGraduated()).toBe(false);
            expect(Category.create(5).isGraduated()).toBe(false);
            expect(Category.create(6).isGraduated()).toBe(false);
            expect(Category.create(7).isGraduated()).toBe(true);
        });
    });

    describe('getDaysBetweenReviews', () => {
        it('should return correct frequency for each category', () => {
            expect(Category.create(1).getDaysBetweenReviews()).toBe(1);
            expect(Category.create(2).getDaysBetweenReviews()).toBe(2);
            expect(Category.create(3).getDaysBetweenReviews()).toBe(4);
            expect(Category.create(4).getDaysBetweenReviews()).toBe(8);
            expect(Category.create(5).getDaysBetweenReviews()).toBe(16);
            expect(Category.create(6).getDaysBetweenReviews()).toBe(32);
            expect(Category.create(7).getDaysBetweenReviews()).toBe(64);
        });
    });

    describe('equals', () => {
        it('should return true for categories with same value', () => {
            const cat1 = Category.create(3);
            const cat2 = Category.create(3);
            expect(cat1.equals(cat2)).toBe(true);
        });

        it('should return false for categories with different values', () => {
            const cat1 = Category.create(3);
            const cat2 = Category.create(5);
            expect(cat1.equals(cat2)).toBe(false);
        });
    });
});
