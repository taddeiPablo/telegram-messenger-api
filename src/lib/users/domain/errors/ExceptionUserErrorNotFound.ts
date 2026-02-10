export class ExceptionUserErrorNotFound extends Error {
    public readonly statusCode: number = 404;
    public readonly message: string;

    constructor(message: string = "User not found") {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, ExceptionUserErrorNotFound.prototype);
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    public getMessage(): string {
        return this.message;
    }
}
