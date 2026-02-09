//import * as express from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './lib/users/infrastructure/swagger';

import { ExpressUserRouter } from './lib/users/infrastructure/routers/ExpressUserRouter';


const app = express();
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use(express.json());

//ROUTES for users
app.use('/user', ExpressUserRouter);

// Servir la documentación en la ruta /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('Docs available on http://localhost:3000/api-docs');
});
