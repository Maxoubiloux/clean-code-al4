export class UserId {
    private constructor(private readonly id: string) { }

    static create(id: string): UserId {
        if (!id || id.trim().length === 0) {
            throw new Error('UserId cannot be empty');
        }
        return new UserId(id);
    }

    getValue(): string {
        return this.id;
    }

    equals(other: UserId): boolean {
        return this.id === other.id;
    }
}
