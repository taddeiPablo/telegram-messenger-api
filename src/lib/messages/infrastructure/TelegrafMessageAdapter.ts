import { Telegraf } from 'telegraf';
import { MessageSender } from '../../messages/domain/interfaces/MessageSender';
import { Config } from '../../../lib/shared/Config';

export class TelegrafMessageAdapter implements MessageSender {
    private bot: Telegraf;

    constructor() {
        this.bot = new Telegraf(Config.telegram.botToken);
        // Iniciamos el bot para que pueda enviar mensajes
        this.bot.launch(); 
    }

    async sendMessage(chatId: string, text: string): Promise<void> {
        await this.bot.telegram.sendMessage(chatId, text);
    }
}