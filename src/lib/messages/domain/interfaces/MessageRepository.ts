import { Message } from "../entities/Message";

export interface MessageRepository {
    save(message: Message): Promise<void>;
    findAll(): Promise<Message[]>;
}