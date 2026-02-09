
import { Request, Response, NextFunction } from 'express';
import { ServiceContainer } from 'src/lib/shared/ServiceContainer';

export class ExpressUserController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password } = req.body as { name: string, email: string, password: string };
            //console.log("1");
            const newUser = await ServiceContainer.user.register.run(name, email, password);
            //console.log(newUser);
            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body as { email: string, password: string };
            const user = await ServiceContainer.user.login.run(email, password);
            res.status(200).json({ message: "Login successful", user });     
        } catch (error) {
            next(error);
        }
    }
}