
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { TokenService } from "../../domain/interfaces/TokenService";

export class LoginUser {
    constructor(private userRepository: UserRepository, private tokenService: TokenService) {}

    async run(email: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.login(email, password);
        const token = this.tokenService.generate({ id: user.get_id.value, email });
        return { user, token };
    }
}