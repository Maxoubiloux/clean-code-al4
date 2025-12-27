import { CardRepository } from '../ports/CardRepository';
import { QuizRepository } from '../ports/QuizRepository';
import { Clock } from '../ports/Clock';
import { ReviewSession } from '../domain/ReviewSession';
import { UserId } from '../domain/UserId';

export interface StartDailyQuizRequest {
    userId: string;
}

export interface StartDailyQuizResponse {
    sessionId: string;
    cardIds: string[];
}

function dateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
}

export class StartDailyQuiz {
    constructor(
        private readonly cardRepository: CardRepository,
        private readonly quizRepository: QuizRepository,
        private readonly clock: Clock
    ) {}

    async execute(request: StartDailyQuizRequest): Promise<StartDailyQuizResponse> {
        const user = UserId.create(request.userId);
        const today = this.clock.now();

        const existing = await this.quizRepository.findByUserAndDate(user, today);
        if (existing) {
            return { sessionId: existing.getSessionId(), cardIds: existing.getCardIds() };
        }

        const dueCards = await this.cardRepository.findDueCards(today);
        const ids = dueCards.map(c => c.getCardId());

        const sessionId = `${user.getValue()}-${dateKey(today)}`;
        const session = ReviewSession.create(sessionId, user, today, ids);
        await this.quizRepository.save(session);
        return { sessionId: session.getSessionId(), cardIds: session.getCardIds() };
    }
}
