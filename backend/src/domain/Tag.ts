export class Tag {
    private constructor(private readonly name: string) { }

    static create(name: string): Tag {
        const trimmedName = name.trim();
        if (trimmedName.length === 0) {
            throw new Error('Tag name cannot be empty');
        }
        return new Tag(trimmedName);
    }

    getValue(): string {
        return this.name;
    }

    equals(other: Tag): boolean {
        return this.name === other.name;
    }
}
