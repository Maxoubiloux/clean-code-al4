import { UserId } from './UserId';

export class User {
    private constructor(
        private readonly id: UserId,
        private readonly email: string,
        private readonly name: string,
        private readonly passwordHash: string, // Not in swagger response, but needed for logic
        private readonly createdAt: Date
    ) { }

    static create(id: UserId, email: string, name: string, passwordHash: string, createdAt: Date): User {
        return new User(id, email, name, passwordHash, createdAt);
    }

    getId(): UserId {
        return this.id;
    }

    getEmail(): string {
        return this.email;
    }

    getName(): string {
        return this.name;
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    toSnapshot(): any {
        return {
            id: this.id.getValue(),
            email: this.email,
            name: this.name,
            createdAt: this.createdAt.toISOString()
        };
    }
}
