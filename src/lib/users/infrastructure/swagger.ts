import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Telegram Messenger API',
      version: '1.0.0',
      description: 'Documentación de la API de Telegram Messenger',
    },
    components: {
      securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  // Busca comentarios @swagger en todos los archivos ts dentro de src
  apis: ['./src/**/*.ts'], 
};