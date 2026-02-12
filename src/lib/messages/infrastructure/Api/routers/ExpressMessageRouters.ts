import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { isAuthenticated } from '../../../../users/infrastructure/Api/middlewares/IsAuthenticated';

const ExpressMessageRouter = Router();
const controller = new MessageController();

/**
 * @swagger
 * /messages/history:
 *   get:
 *     summary: Obtiene el historial completo de mensajes
 *     description: Retorna una lista de todos los mensajes enviados y recibidos registrados en el sistema.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensajes recuperada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1707662400000"
 *                   content:
 *                     type: string
 *                     example: "Hola, ¿cómo estás?"
 *                   telegramChatId:
 *                     type: string
 *                     example: "55443322"
 *                   direction:
 *                     type: string
 *                     enum: [IN, OUT]
 *                     example: "IN"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-02-11T16:40:00.000Z"
 *       401:
 *         description: No autorizado.
 */
ExpressMessageRouter.get('/history', isAuthenticated, controller.getHistory);
/**
 * @swagger
 * /messages/config:
 *   post:
 *     summary: Actualizar la configuración de respuesta automática.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - autoReply
 *             properties:
 *               autoReply:
 *                 type: string
 *                 example: "¡Hola! Gracias por escribirnos."
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newAutoReply:
 *                   type: string
 */
ExpressMessageRouter.post('/config', isAuthenticated, controller.updateConfig);
/**
 * @swagger
 * /messages/send:
 *   post:
 *     summary: Envía un mensaje manual a un usuario de Telegram
 *     description: Permite al administrador enviar un mensaje de texto a un chatId específico a través del bot.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - text
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: El ID del chat de Telegram del destinatario.
 *                 example: "123456789"
 *               text:
 *                 type: string
 *                 description: Contenido del mensaje a enviar.
 *                 example: "Hola, este es un mensaje enviado desde la API."
 *     responses:
 *       200:
 *         description: Mensaje enviado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Mensaje enviado correctamente a Telegram"
 *       400:
 *         description: Error en la solicitud (faltan campos obligatorios).
 *       401:
 *         description: No autorizado.
 */
ExpressMessageRouter.post('/send', isAuthenticated, controller.sendManualMessage);

export { ExpressMessageRouter };