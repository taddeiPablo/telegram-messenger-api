import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { isAuthenticated } from '../../../../users/infrastructure/Api/middlewares/IsAuthenticated';

const ExpressMessageRouter = Router();
const controller = new MessageController();

/**
 * @swagger
 * /messages/history:
 *   get:
 *     summary: Get message history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   timestamp:
 *                     type: string
 */
ExpressMessageRouter.get('/history', isAuthenticated, controller.getHistory.bind(controller));

/**
 * @swagger
 * /messages/config:
 *   post:
 *     summary: Update message configuration
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               setting:
 *                 type: string
 *               value:
 *                 type: string
 *             required:
 *               - setting
 *               - value
 *     responses:
 *       200:
 *         description: Message configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 config:
 *                   type: object
 */
ExpressMessageRouter.post('/config', isAuthenticated, controller.updateConfig.bind(controller));

export { ExpressMessageRouter };