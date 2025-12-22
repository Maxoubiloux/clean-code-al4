import { ReviewResult } from '../domain/ReviewResult';
import { CardRepository } from '../ports/CardRepository';
import { Clock } from '../ports/Clock';

export interface AnswerCardRequest {
    cardId: string;
    userAnswer: string;
}

export interface AnswerCardResponse {
    cardId: string;
    isCorrect: boolean;
    newCategory: number;
    correctAnswer: string;
}

export class AnswerCard {
    constructor(
        private readonly cardRepository: CardRepository,
        private readonly clock: Clock
    ) { }

    async execute(request: AnswerCardRequest): Promise<AnswerCardResponse> {
        const card = await this.cardRepository.findById(request.cardId);
        if (!card) {
            throw new Error(`Card not found: ${request.cardId}`);
        }

        const userAnswer = request.userAnswer.trim().toLowerCase();
        const correctAnswer = card.getAnswer().trim().toLowerCase();
        const isCorrect = userAnswer === correctAnswer;

        const result = isCorrect ? ReviewResult.correct() : ReviewResult.incorrect();
        card.review(result, this.clock.now());

        await this.cardRepository.save(card);

        return {
            cardId: card.getCardId(),
            isCorrect,
            newCategory: card.getCategory().getValue(),
            correctAnswer: card.getAnswer(),
        };
    }
}
