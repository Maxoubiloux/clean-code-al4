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
        return Array.from(this.cards.values()).filter(card => card.isDue(currentDate));
    }
}
