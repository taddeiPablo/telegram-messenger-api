export interface MessageSender {
    sendMessage(chatId: string, text: string): Promise<void>;
}