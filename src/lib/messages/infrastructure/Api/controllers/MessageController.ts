import { Request, Response } from 'express';
import { ServiceContainer } from '../../../../shared/ServiceContainer';

export class MessageController {
    async updateConfig(req: Request, res: Response) {
        try {
            const { autoReply } = req.body as { autoReply: string };
            await ServiceContainer.messages.updateConfig.run(autoReply);
            
            res.status(200).json({ 
                message: "Configuración actualizada correctamente",
                newAutoReply: autoReply 
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    async getHistory(req: Request, res: Response) {
        const messages = await ServiceContainer.messages.repository.findAll();
        res.status(200).json(messages);
    }
    async sendManualMessage(req: Request, res: Response) {
        try {
            const { chatId, text } = req.body as { chatId: string, text: string };
            await ServiceContainer.messages.sendMessage.run(chatId, text);
            
            res.status(200).json({ 
                status: "success", 
                message: "Mensaje enviado correctamente a Telegram" 
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}