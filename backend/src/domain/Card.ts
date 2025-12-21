import { Category } from './Category';
import { Tag } from './Tag';
import { ReviewResult } from './ReviewResult';

export class Card {
    private category: Category;
    private tags: Tag[];
    private lastReviewDate: Date | null;
    private readonly createdAt: Date;

    private constructor(
        private readonly cardId: string,
        private readonly question: string,
        private readonly answer: string,
        category: Category,
        tags: Tag[],
        lastReviewDate: Date | null,
        createdAt: Date
    ) {
        this.category = category;
        this.tags = [...tags];
        this.lastReviewDate = lastReviewDate;
        this.createdAt = createdAt;
    }

    static create(
        cardId: string,
        question: string,
        answer: string,
        tags: Tag[] = [],
        createdAt: Date = new Date()
    ): Card {
        if (!cardId || cardId.trim().length === 0) {
            throw new Error('Card ID cannot be empty');
        }
        if (!question || question.trim().length === 0) {
            throw new Error('Question cannot be empty');
        }
        if (!answer || answer.trim().length === 0) {
            throw new Error('Answer cannot be empty');
        }

        return new Card(
            cardId,
            question.trim(),
            answer.trim(),
            Category.create(1),
            tags,
            null,
            createdAt
        );
    }

    static reconstitute(
        cardId: string,
        question: string,
        answer: string,
        categoryValue: number,
        tags: Tag[],
        lastReviewDate: Date | null,
        createdAt: Date
    ): Card {
        return new Card(
            cardId,
            question,
            answer,
            Category.create(categoryValue),
            tags,
            lastReviewDate,
            createdAt
        );
    }

    review(result: ReviewResult, reviewDate: Date): void {
        if (result.isCorrect()) {
            this.category = this.category.next();
        } else {
            this.category = Category.create(1);
        }
        this.lastReviewDate = reviewDate;
    }

    addTag(tag: Tag): void {
        if (!this.tags.some(t => t.equals(tag))) {
            this.tags.push(tag);
        }
    }

    isDue(currentDate: Date): boolean {
        if (this.lastReviewDate === null) {
            return true;
        }

        if (this.isGraduated()) {
            return false;
        }

        const daysBetweenReviews = this.category.getDaysBetweenReviews();
        const nextReviewDate = new Date(this.lastReviewDate);
        nextReviewDate.setDate(nextReviewDate.getDate() + daysBetweenReviews);

        return currentDate >= nextReviewDate;
    }

    isGraduated(): boolean {
        return this.category.isGraduated();
    }

    hasTag(tag: Tag): boolean {
        return this.tags.some(t => t.equals(tag));
    }

    getCardId(): string {
        return this.cardId;
    }

    getQuestion(): string {
        return this.question;
    }

    getAnswer(): string {
        return this.answer;
    }

    getCategory(): Category {
        return this.category;
    }

    getTags(): Tag[] {
        return [...this.tags];
    }

    getLastReviewDate(): Date | null {
        return this.lastReviewDate;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }
}
