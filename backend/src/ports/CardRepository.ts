import { Card } from '../domain/Card';
import { Tag } from '../domain/Tag';

export interface CardRepository {
    save(card: Card): Promise<void>;
    findById(cardId: string): Promise<Card | null>;
    findAll(): Promise<Card[]>;
    findByTag(tag: Tag): Promise<Card[]>;
    findDueCards(currentDate: Date): Promise<Card[]>;
}
