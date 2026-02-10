
import { Request, Response, NextFunction } from 'express';
import { ServiceContainer } from 'src/lib/shared/ServiceContainer';
import { ExceptionUserErrorNotFound } from '../../domain/errors/ExceptionUserErrorNotFound';

export class ExpressUserController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password } = req.body as { name: string, email: string, password: string };
            const newUser = await ServiceContainer.user.register.run(name, email, password);
            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            if (error instanceof ExceptionUserErrorNotFound) {
                return next(error);
            }
            next(error);
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body as { email: string, password: string };
            const user = await ServiceContainer.user.login.run(email, password);
            res.status(200).json({ message: "Login successful", user });     
        } catch (error) {
            if (error instanceof ExceptionUserErrorNotFound) {
                return next(error);
            }
            next(error);
        }
    }
}