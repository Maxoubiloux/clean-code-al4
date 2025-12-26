import { ReviewSession } from '../domain/ReviewSession';
import { UserId } from '../domain/UserId';
import { QuizRepository } from '../ports/QuizRepository';

export class QuizRepositoryInMemory implements QuizRepository {
    private sessions: Map<string, ReviewSession> = new Map();

    async save(session: ReviewSession): Promise<void> {
        // We use a composite key of UserID + Date because findByUserAndDate implies lookup by those.
        // However, a simple map key might not be enough if we have multiple sessions.
        // But ReviewSession usually has an ID.
        // Let's assume for this mock we just store them and filter.
        // Or better, let's assume we can generate a unique ID for the session if it had one.
        // Since the interface passes the full object, let's use a simple list or map by an arbitrary ID if ReviewSession doesn't expose one easily visible in previous file view.
        // Actually, let's just store in a list for simplicity or map by some internal ID.
        // But wait, to update we need to know which one.
        // The domain logic likely manages uniqueness.
        // For now, let's use a key derived from user and date for simple retrieval, OR just scan everything.
        // Scanning is fine for In-Memory.
        const key = `${session.getUserId().getValue()}-${session.getDate().toISOString()}`;
        // This key strategy assumes one session per user per exact timestamp, which might be fragile but OK for "repo in memory" unless we have a SessionId.
        this.sessions.set(key, session);
    }

    async findByUserAndDate(userId: UserId, date: Date): Promise<ReviewSession | null> {
        // This is tricky with exact date match. The interface likely implies "find the session FOR that day" or similar?
        // Let's look at the port signature again: `findByUserAndDate(userId: UserId, date: Date): Promise<ReviewSession | null>;`
        // In the domain, it might be looking for a session *started* at that date.
        // For in-memory, let's loop and find a matching user and simplified date check if necessary, or exact match.
        // Let's assume exact match for now as per clean code strictness, unless we see domain logic otherwise.
        for (const session of this.sessions.values()) {
            if (session.getUserId().getValue() === userId.getValue() &&
                session.getDate().getTime() === date.getTime()) {
                return session;
            }
        }
        return null;
    }
}
