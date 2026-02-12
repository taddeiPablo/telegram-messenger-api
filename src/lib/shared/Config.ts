import dotenv from 'dotenv';
// cargando las variables de entorno
dotenv.config();

export const Config = {
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'default_secret_fallback'
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || ''
    }
};