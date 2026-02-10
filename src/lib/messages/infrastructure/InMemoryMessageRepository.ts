import { Message } from "../../messages/domain/entities/Message";
import { MessageRepository } from "../../messages/domain/interfaces/MessageRepository";

export class InMemoryMessageRepository implements MessageRepository {
    private messages: Message[] = [];

    async save(message: Message): Promise<void> {
        this.messages.push(message);
        console.log(`[Repo] Mensaje guardado: ${message.direction} - ${message.content}`);
    }

    async findAll(): Promise<Message[]> {
        // Devolvemos una copia para proteger la integridad del array original
        return [...this.messages];
    }

    // Método extra útil para filtrar por chat si lo necesitas en la API
    async findByChatId(chatId: string): Promise<Message[]> {
        return this.messages.filter(m => m.telegramChatId === chatId);
    }
}