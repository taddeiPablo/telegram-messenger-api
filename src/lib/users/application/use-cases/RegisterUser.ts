import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { UserEmail } from "../../domain/values-objects/UserEmail";
import { UserId } from "../../domain/values-objects/UserId";
import { UserName } from "../../domain/values-objects/UserName";
import { UserPassword } from "../../domain/values-objects/UserPassword";

export class RegisterUser {
    constructor(private userRepository: UserRepository) {}
    
    async run(name: string, email: string, password: string): Promise<User> {
        const user = new User(new UserName(name), new UserEmail(email), new UserPassword(password));
        await this.userRepository.register(user);
        return user;
    }
}