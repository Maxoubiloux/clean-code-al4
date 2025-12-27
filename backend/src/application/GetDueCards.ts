import { CardRepository } from '../ports/CardRepository';
import { Clock } from '../ports/Clock';

export interface GetDueCardsRequest {}

export interface GetDueCardsResponse {
    cardIds: string[];
}

export class GetDueCards {
    constructor(
        private readonly cardRepository: CardRepository,
        private readonly clock: Clock
    ) {}

    async execute(_: GetDueCardsRequest = {} as GetDueCardsRequest): Promise<GetDueCardsResponse> {
        const now = this.clock.now();
        const cards = await this.cardRepository.findDueCards(now);
        return { cardIds: cards.map(c => c.getCardId()) };
    }
}
