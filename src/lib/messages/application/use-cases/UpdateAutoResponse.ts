import { ReceiveAndReplyMessage } from "./ReceiveAndReplyMessage";

export class UpdateAutoResponse {
    async run(newText: string): Promise<void> {
        if (!newText || newText.trim().length === 0) {
            throw new Error("El mensaje no puede estar vacío");
        }
        
        // Actualizamos el mensaje en el caso de uso que maneja las respuestas
        ReceiveAndReplyMessage.setAutoReply(newText);
        console.log(`[Config] Mensaje de respuesta actualizado a: ${newText}`);
    }
}