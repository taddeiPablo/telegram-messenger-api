
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";

export class LoginUser {
    constructor(private userRepository: UserRepository) {}

    async run(email: string, password: string): Promise<User> {
        return await this.userRepository.login(email, password);
    }
}