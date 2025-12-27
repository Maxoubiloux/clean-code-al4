import { User } from '../domain/User';
import { UserRepository } from '../ports/UserRepository';

export class UserRepositoryInMemory implements UserRepository {
    private users: Map<string, User> = new Map();

    async save(user: User): Promise<void> {
        this.users.set(user.getId().getValue(), user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return Array.from(this.users.values()).find(u => u.getEmail() === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }
}
