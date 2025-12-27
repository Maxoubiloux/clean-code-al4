import { CardRepository } from '../ports/CardRepository';
import { Tag } from '../domain/Tag';

export interface AddTagRequest {
    cardId: string;
    tagName: string;
}

export interface AddTagResponse {
    cardId: string;
    tags: string[];
}

export class AddTag {
    constructor(private readonly cardRepository: CardRepository) {}

    async execute(request: AddTagRequest): Promise<AddTagResponse> {
        const card = await this.cardRepository.findById(request.cardId);
        if (!card) {
            throw new Error(`Card not found: ${request.cardId}`);
        }

        const tag = Tag.create(request.tagName);
        card.addTag(tag);
        await this.cardRepository.save(card);

        return {
            cardId: card.getCardId(),
            tags: card.getTags().map(t => t.getValue()),
        };
    }
}
