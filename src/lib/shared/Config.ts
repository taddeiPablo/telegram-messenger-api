import dotenv from 'dotenv';
// Cargamos las variables
dotenv.config();

export const Config = {
    server: {
        port: process.env.PORT || 3000
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'default_secret_fallback'
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || ''
    }
};