import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/interfaces/UserRepository";

export class InMemoryDataBase implements UserRepository {
    private users: User[] = [];

    async register(user: User): Promise<User> {
        this.users.push(user);
        return user;    
    }

    async login(email: string, password: string): Promise<User> {
        const user = this.users.find(u => { 
            const emailStr = String(u.email.value).trim().toLowerCase();
            const userPassStr = String(u.password.value).trim();
            return emailStr === email && userPassStr === password;
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}