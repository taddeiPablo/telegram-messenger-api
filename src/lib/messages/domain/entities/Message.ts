
export class Message{
    public id: string;
    public content: string;
    public senderId: string;   // ID de tu usuario interno o "system"
    public receiverId: string; // Chat ID de Telegram
    public direction: 'INBOUND' | 'OUTBOUND'; // ¿Viene o va?
    public createdAt: Date;
    public telegramChatId?: string; // Opcional, para facilitar búsquedas por chat

    constructor(
        id: string,
        content: string,
        senderId: string,
        receiverId: string,
        direction: 'INBOUND' | 'OUTBOUND',
        createdAt: Date
    ) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.direction = direction;
        this.createdAt = createdAt;
    }
}