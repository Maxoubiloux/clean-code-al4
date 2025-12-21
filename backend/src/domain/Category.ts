export class Category {
    private static readonly MIN_CATEGORY = 1;
    private static readonly MAX_CATEGORY = 7;
    private static readonly FREQUENCY_MAP: Record<number, number> = {
        1: 1,
        2: 2,
        3: 4,
        4: 8,
        5: 16,
        6: 32,
        7: 64,
    };

    private constructor(private readonly value: number) { }

    static create(value: number): Category {
        if (!Number.isInteger(value)) {
            throw new Error('Category must be an integer');
        }
        if (value < Category.MIN_CATEGORY || value > Category.MAX_CATEGORY) {
            throw new Error(`Category must be between ${Category.MIN_CATEGORY} and ${Category.MAX_CATEGORY}`);
        }
        return new Category(value);
    }

    getValue(): number {
        return this.value;
    }

    next(): Category {
        if (this.value >= Category.MAX_CATEGORY) {
            return this;
        }
        return new Category(this.value + 1);
    }

    isGraduated(): boolean {
        return this.value === Category.MAX_CATEGORY;
    }

    getDaysBetweenReviews(): number {
        return Category.FREQUENCY_MAP[this.value];
    }

    equals(other: Category): boolean {
        return this.value === other.value;
    }
}
