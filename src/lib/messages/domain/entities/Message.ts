
export class Message{
    public id: string;
    public content: string;
    public senderId: string;
    public receiverId: string;
    public direction: 'INBOUND' | 'OUTBOUND';
    public createdAt: Date;
    public telegramChatId?: string;

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