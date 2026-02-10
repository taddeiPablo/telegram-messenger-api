export class MessageContent {
    public content: string;

    constructor(content: string) {
        this.content = content;
        this.validateContent(content);
    }
    
    private validateContent(content: string): void {
        if (!content || content.trim() === '') {
            throw new Error('Message content cannot be empty');
        }
    }
}