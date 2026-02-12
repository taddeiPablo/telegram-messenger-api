import { Message } from "../../domain/entities/Message";
import { MessageSender } from "../../domain/interfaces/MessageSender";
import { MessageRepository } from "../../domain/interfaces/MessageRepository";
import { ExceptionMessageErrorNotFound } from "../../domain/errors/ExceptionMessageErrorNotFound";

export class SendMessageToUser {
    constructor(
        private messageSender: MessageSender,
        private messageRepository: MessageRepository
    ) {}

    async run(chatId: string, text: string): Promise<void> {
        if (!chatId || !text) {
            throw new ExceptionMessageErrorNotFound("ChatId y el texto son obligatorios");
        }

        // 1. Enviamos el mensaje a través de Telegram (Adaptador)
        await this.messageSender.sendMessage(chatId, text);
        // Generamos un ID único para el mensaje
        const messageId = crypto.randomUUID();
        // 2. Registramos el mensaje saliente en nuestro historial
        const outboundMsg = new Message(
            messageId,
            text,
            Date.now().toString(),
            chatId,
            'OUTBOUND', // Dirección de salida
            new Date()
        );
        
        await this.messageRepository.save(outboundMsg);
    }
}