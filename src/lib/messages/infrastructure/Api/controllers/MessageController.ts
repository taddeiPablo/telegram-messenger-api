import { Request, Response } from 'express';
import { ServiceContainer } from '../../../../shared/ServiceContainer';

export class MessageController {
    async updateConfig(req: Request, res: Response) {
        try {
            const { autoReply } = req.body as { autoReply: string };
            
            // Llamamos al nuevo caso de uso
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
        // Aprovechamos para crear un endpoint que liste los mensajes guardados
        const messages = await ServiceContainer.messages.repository.findAll();
        res.status(200).json(messages);
    }
}