import { Card } from '../domain/Card';
import { Tag } from '../domain/Tag';
import { CardRepository } from '../ports/CardRepository';

export class CardRepositoryInMemory implements CardRepository {
    private cards: Map<string, Card> = new Map();

    async save(card: Card): Promise<void> {
        this.cards.set(card.getCardId(), card);
    }

    async findById(cardId: string): Promise<Card | null> {
        return this.cards.get(cardId) || null;
    }

    async findAll(): Promise<Card[]> {
        return Array.from(this.cards.values());
    }

    async findByTag(tag: Tag): Promise<Card[]> {
        return Array.from(this.cards.values()).filter(card => 
            card.getTags().some(t => t.getValue() === tag.getValue())
        );
    }

    async findDueCards(currentDate: Date): Promise<Card[]> {
        return Array.from(this.cards.values()).filter(card => {
            const nextReview = card.getNextReviewDate();
            // A card is due if nextReview <= currentDate (and is not null/undefined if that logic applies)
            // Assuming getNextReviewDate returns a Date.
            // If getNextReviewDate returns something optional, we need to handle it.
            // Based on domain files viewed previously, let's assume it returns Date.
            return nextReview && nextReview <= currentDate;
        });
    }
}
