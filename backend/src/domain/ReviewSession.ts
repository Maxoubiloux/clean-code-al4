import { UserId } from './UserId';

export class ReviewSession {
    private cardIds: string[];
    private completed: boolean;

    private answers: Map<string, boolean> = new Map();

    private constructor(
        private readonly sessionId: string,
        private readonly userId: UserId,
        private readonly date: Date,
        cardIds: string[],
        completed: boolean
    ) {
        this.cardIds = [...cardIds];
        this.completed = completed;
    }

    static create(
        sessionId: string,
        userId: UserId,
        date: Date,
        cardIds: string[] = []
    ): ReviewSession {
        if (!sessionId || sessionId.trim().length === 0) {
            throw new Error('Session ID cannot be empty');
        }
        return new ReviewSession(sessionId, userId, date, cardIds, false);
    }

    static reconstitute(
        sessionId: string,
        userId: UserId,
        date: Date,
        cardIds: string[],
        completed: boolean
    ): ReviewSession {
        return new ReviewSession(sessionId, userId, date, cardIds, completed);
    }

    addCard(cardId: string): void {
        if (!this.cardIds.includes(cardId)) {
            this.cardIds.push(cardId);
        }
    }

    recordAnswer(cardId: string, correct: boolean): void {
        this.answers.set(cardId, correct);
    }

    getStats() {
        let correct = 0;
        let incorrect = 0;
        for (const isCorrect of this.answers.values()) {
            if (isCorrect) correct++;
            else incorrect++;
        }
        return { correct, incorrect, total: this.answers.size };
    }

    complete(): void {
        this.completed = true;
    }

    isForDate(date: Date): boolean {
        return (
            this.date.getFullYear() === date.getFullYear() &&
            this.date.getMonth() === date.getMonth() &&
            this.date.getDate() === date.getDate()
        );
    }

    getSessionId(): string {
        return this.sessionId;
    }

    getUserId(): UserId {
        return this.userId;
    }

    getDate(): Date {
        return this.date;
    }

    getCardIds(): string[] {
        return [...this.cardIds];
    }

    isCompleted(): boolean {
        return this.completed;
    }
}
