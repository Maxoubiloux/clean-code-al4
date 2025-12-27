import { CardRepository } from '../ports/CardRepository';
import { Tag } from '../domain/Tag';

export interface ListCardsByTagsRequest {
    tags: string[];
}

export interface ListCardsByTagsResponse {
    cardIds: string[];
}

export class ListCardsByTags {
    constructor(private readonly cardRepository: CardRepository) {}

    async execute(request: ListCardsByTagsRequest): Promise<ListCardsByTagsResponse> {
        const tags = request.tags.map(Tag.create);
        const uniqueIds = new Set<string>();
        for (const tag of tags) {
            const byTag = await this.cardRepository.findByTag(tag);
            for (const c of byTag) uniqueIds.add(c.getCardId());
        }
        return { cardIds: Array.from(uniqueIds) };
    }
}
