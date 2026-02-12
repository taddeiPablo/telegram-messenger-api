export class MessageContent {
    public content: string;

    constructor(content: string) {
        this.content = content;
        this.validateContent(content);
    }
    
    private validateContent(content: string): void {
        if (!content || content.trim() === '') {
            throw new Error('El contenido del mensaje no puede estar vacío');
        }
    }
}