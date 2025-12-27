import { Card } from '../domain/Card';
import { Tag } from '../domain/Tag';
import { CardRepository } from '../ports/CardRepository';
import { Clock } from '../ports/Clock';

export interface CreateCardRequest {
    cardId: string;
    question: string;
    answer: string;
    tags?: string[];
}

export interface CreateCardResponse {
    cardId: string;
    category: number;
}

export class CreateCard {
    constructor(
        private readonly cardRepository: CardRepository,
        private readonly clock: Clock
    ) { }

    async execute(request: CreateCardRequest): Promise<CreateCardResponse> {
        const tags = (request.tags ?? []).map(Tag.create);
        const createdAt = this.clock.now();
        const card = Card.create(
            request.cardId,
            request.question,
            request.answer,
            tags,
            createdAt
        );

        await this.cardRepository.save(card);

        return {
            cardId: card.getCardId(),
            category: card.getCategory().getValue(),
        };
    }
}
