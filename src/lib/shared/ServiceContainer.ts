import { InMemoryDataBase } from '../users/infrastructure/inMemoryDataBase';
import { JwtTokenService } from '../users/infrastructure/Api/security/JwtTokenService';
import { LoginUser } from '../users/application/use-cases/LoginUser';
import { RegisterUser } from '../users/application/use-cases/RegisterUser';

const UserRepository = new InMemoryDataBase();
const tokenService = new JwtTokenService();

export const ServiceContainer = {
    user: {
        register: new RegisterUser(UserRepository),
        login: new LoginUser(UserRepository, tokenService)
    }
}