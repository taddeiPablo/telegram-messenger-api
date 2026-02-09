export class UserEmail {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public ensureSameEmail(): void {
        if (!this.validateEmail(this.value)) {
            throw new Error('Invalid email format');
        }
    }
}