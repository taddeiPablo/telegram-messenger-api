export class MessageId {
    private readonly value: string; 
    
    constructor(value: string) {
        this.value = value;
        this.validateEmpty(value);
    }

    private validateEmpty(value: string): void {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            throw new Error('MessageId must be a non-empty string');
        }
    }
}