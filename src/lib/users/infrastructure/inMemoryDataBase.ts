import { User } from "../domain/entities/User";
import { ExceptionUserErrorNotFound } from "../domain/errors/ExceptionUserErrorNotFound";
import { UserRepository } from "../domain/interfaces/UserRepository";

export class InMemoryDataBase implements UserRepository {
    private users: User[] = [];

    async register(user: User): Promise<User> {
        try{
            if (this.userExist(user.email.value)) {
                throw new ExceptionUserErrorNotFound("Este Email ya está registrado");
            }
            this.users.push(user);
        }catch(error){
            if (error instanceof ExceptionUserErrorNotFound) {
                throw error;
            }
            throw new Error("Unexpected Error");
        }
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
                throw new ExceptionUserErrorNotFound("Email o Password incorrectos");
            }
            return user;
        } catch (error) {
            if (error instanceof ExceptionUserErrorNotFound) {
                throw error;
            }
            throw new Error("Unexpected Error");
        }
    }

    private userExist(email: string): boolean {
        return this.users.some(u => String(u.email.value).trim().toLowerCase() === email);
    }

}