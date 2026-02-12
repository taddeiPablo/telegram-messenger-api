import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './lib/users/infrastructure/swagger';

import { ExpressUserRouter } from './lib/users/infrastructure/Api/routers/ExpressUserRouter';
import { ExpressMessageRouter } from './lib/messages/infrastructure/Api/routers/ExpressMessageRouters';
import { ExceptionUserErrorNotFound } from './lib/users/domain/errors/ExceptionUserErrorNotFound';
import { ExceptionMessageErrorNotFound } from './lib/messages/domain/errors/ExceptionMessageErrorNotFound';

const app = express();
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use(express.json());

//ROUTES for users
app.use('/user', ExpressUserRouter);
//ROUTES for messages
app.use('/message', ExpressMessageRouter);

//Manejo de errores
app.use((err: unknown, _req: Request, _res: Response, _next: NextFunction) => {
    if (err instanceof ExceptionUserErrorNotFound) {
        return _res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }
    if (err instanceof ExceptionMessageErrorNotFound) {
        return _res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }
    if (err instanceof Error) {
        console.error(err.stack);
        return _res.status(500).json({ message: err.message });
    }
    console.error('Unknown error:', err);
    return _res.status(500).json({ message: 'An unexpected error occurred' });
});


// Servir la documentación en la ruta /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Docs available on http://localhost:${port}/api-docs`);
});
