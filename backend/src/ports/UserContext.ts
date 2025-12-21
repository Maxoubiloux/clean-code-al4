import { UserId } from '../domain/UserId';

export interface UserContext {
    getCurrentUserId(): UserId;
}

export class AnonymousUserContext implements UserContext {
    private static readonly ANONYMOUS_USER_ID = 'anonymous';

    getCurrentUserId(): UserId {
        return UserId.create(AnonymousUserContext.ANONYMOUS_USER_ID);
    }
}
