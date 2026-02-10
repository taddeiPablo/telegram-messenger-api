import { Telegraf } from 'telegraf';
import { MessageSender } from '../../messages/domain/interfaces/MessageSender';
import { ReceiveAndReplyMessage } from '../../messages/application/use-cases/ReceiveAndReplyMessage';
import { Config } from '../../../lib/shared/Config';

export class TelegrafAdapter implements MessageSender {
    private bot: Telegraf;
    private receiveUseCase?: ReceiveAndReplyMessage; // Opcional al inicio

    constructor() {
        this.bot = new Telegraf(Config.telegram.botToken);
        this.setupPolling();
    }

    // Método para inyectar el caso de uso después de la creación
    public setReceiveUseCase(useCase: ReceiveAndReplyMessage) {
        this.receiveUseCase = useCase;
    }

    private setupPolling() {
        this.bot.on('text', async (ctx) => {
            const chatId = ctx.chat.id.toString();
            const text = ctx.message.text;

            if (this.receiveUseCase) {
                await this.receiveUseCase.run(chatId, text);
            } else {
                console.warn("⚠️ Caso de uso no configurado en TelegrafAdapter");
            }
        });

        this.bot.launch();
        console.log("🤖 Bot de Telegram escuchando...");
    }

    async sendMessage(chatId: string, text: string): Promise<void> {
        await this.bot.telegram.sendMessage(chatId, text);
    }
}