export class ExceptionMessageErrorNotFound extends Error {
    public readonly statusCode: number = 404;
    public readonly message: string;

    constructor(message: string = "Message not found") {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, ExceptionMessageErrorNotFound.prototype);
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    public getMessage(): string {
        return this.message;
    }
}