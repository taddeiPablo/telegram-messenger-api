
export class UserPassword {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    public ensureIsValid(): void {
        if (this.value.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
    }
}