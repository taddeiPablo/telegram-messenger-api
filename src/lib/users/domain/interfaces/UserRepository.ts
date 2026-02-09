import { User } from '../entities/User';

export interface UserRepository {
    register(user: User): Promise<User>;
    login(email: string, password: string): Promise<User>;
}