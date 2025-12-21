export enum ReviewResultType {
    CORRECT = 'CORRECT',
    INCORRECT = 'INCORRECT',
    FORCED_CORRECT = 'FORCED_CORRECT',
}

export class ReviewResult {
    private constructor(private readonly type: ReviewResultType) { }

    static create(type: string): ReviewResult {
        const upperType = type.toUpperCase();
        if (!Object.values(ReviewResultType).includes(upperType as ReviewResultType)) {
            throw new Error(`Invalid review result type: ${type}`);
        }
        return new ReviewResult(upperType as ReviewResultType);
    }

    static correct(): ReviewResult {
        return new ReviewResult(ReviewResultType.CORRECT);
    }

    static incorrect(): ReviewResult {
        return new ReviewResult(ReviewResultType.INCORRECT);
    }

    static forcedCorrect(): ReviewResult {
        return new ReviewResult(ReviewResultType.FORCED_CORRECT);
    }

    isCorrect(): boolean {
        return this.type === ReviewResultType.CORRECT || this.type === ReviewResultType.FORCED_CORRECT;
    }

    isIncorrect(): boolean {
        return this.type === ReviewResultType.INCORRECT;
    }

    getType(): ReviewResultType {
        return this.type;
    }
}
