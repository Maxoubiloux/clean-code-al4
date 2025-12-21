import { ReviewSession } from '../domain/ReviewSession';
import { UserId } from '../domain/UserId';

export interface QuizRepository {
    save(session: ReviewSession): Promise<void>;
    findByUserAndDate(userId: UserId, date: Date): Promise<ReviewSession | null>;
}
