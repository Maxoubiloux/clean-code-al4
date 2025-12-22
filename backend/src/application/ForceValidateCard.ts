import { ReviewResult } from '../domain/ReviewResult';
import { CardRepository } from '../ports/CardRepository';
import { Clock } from '../ports/Clock';

export interface ForceValidateCardRequest {
    cardId: string;
}

export interface ForceValidateCardResponse {
    cardId: string;
    newCategory: number;
}

export class ForceValidateCard {
    constructor(
        private readonly cardRepository: CardRepository,
        private readonly clock: Clock
    ) { }

    async execute(request: ForceValidateCardRequest): Promise<ForceValidateCardResponse> {
        const card = await this.cardRepository.findById(request.cardId);
        if (!card) {
            throw new Error(`Card not found: ${request.cardId}`);
        }

        card.review(ReviewResult.forcedCorrect(), this.clock.now());

        await this.cardRepository.save(card);

        return {
            cardId: card.getCardId(),
            newCategory: card.getCategory().getValue(),
        };
    }
}
