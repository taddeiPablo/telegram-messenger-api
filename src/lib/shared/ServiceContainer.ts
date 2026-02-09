import { InMemoryDataBase } from '../users/infrastructure/inMemoryDataBase';
import { LoginUser } from '../users/application/use-cases/LoginUser';
import { RegisterUser } from '../users/application/use-cases/RegisterUser';

const UserRepository = new InMemoryDataBase();

export const ServiceContainer = {
    user: {
        register: new RegisterUser(UserRepository),
        login: new LoginUser(UserRepository)
    }
}