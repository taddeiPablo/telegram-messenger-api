import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Config } from '../../../../shared/Config';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token!, Config.auth.jwtSecret);
        (req as any).user = decoded; // Guardamos los datos del user en la request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};