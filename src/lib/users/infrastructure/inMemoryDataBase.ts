import { User } from "../domain/entities/User";
import { ExceptionUserErrorNotFound } from "../domain/errors/ExceptionUserErrorNotFound";
import { UserRepository } from "../domain/interfaces/UserRepository";

export class InMemoryDataBase implements UserRepository {
    private users: User[] = [];

    async register(user: User): Promise<User> {
        this.users.push(user);
        return user;    
    }

    async login(email: string, password: string): Promise<User> {
        try {
            const user = this.users.find(u => { 
                const emailStr = String(u.email.value).trim().toLowerCase();
                const userPassStr = String(u.password.value).trim();
                return emailStr === email && userPassStr === password;
            });
            if (!user) {
                throw new ExceptionUserErrorNotFound("Invalid email or password");
            }
            return user;
        } catch (error) {
            if (error instanceof ExceptionUserErrorNotFound) {
                throw error;
            }
            throw new Error("Unexpected Error");
        }
    }
}