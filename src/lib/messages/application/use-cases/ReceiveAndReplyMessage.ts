import { Message } from '../../domain/entities/Message';
import { MessageSender } from '../../domain/interfaces/MessageSender';
import { MessageRepository } from '../../domain/interfaces/MessageRepository';

export class ReceiveAndReplyMessage {
    // Esto cumple con el requisito de "mensaje configurable"
    // Podría venir de una DB, pero por ahora lo dejamos en memoria
    private static autoReplyContent: string = "Hola, soy un bot con Arquitectura Hexagonal.";

    constructor(
        private messageSender: MessageSender,
        private messageRepository: MessageRepository
    ) {}

    public static setAutoReply(newText: string) {
        this.autoReplyContent = newText;
    }

    async run(chatId: string, textReceived: string) {
        // 1. Guardamos el mensaje recibido (IN)
        const inboundMsg = new Message(
            '0',
            Date.now().toString(), 
            textReceived, 
            chatId, 
            'INBOUND', 
            new Date(),
        );
        await this.messageRepository.save(inboundMsg);

        // 2. Enviamos la respuesta automática (OUT)
        await this.messageSender.sendMessage(chatId, ReceiveAndReplyMessage.autoReplyContent);

        // 3. Guardamos la respuesta enviada (OUT)
        const outboundMsg = new Message(
            '0',
            (Date.now() + 1).toString(), 
            ReceiveAndReplyMessage.autoReplyContent, 
            chatId, 
            'OUTBOUND', 
            new Date()
        );
        await this.messageRepository.save(outboundMsg);
    }
}