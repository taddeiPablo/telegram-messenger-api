import jwt from 'jsonwebtoken';
import { TokenService } from '../../../../users/domain/interfaces/TokenService';
import { Config } from '../../../../shared/Config';

export class JwtTokenService implements TokenService {
    private readonly secret = Config.auth.jwtSecret;

    generate(payload: { id: string; email: string }): string {
        // Firmamos el token con una expiración de 2 horas
        return jwt.sign(payload, this.secret, { expiresIn: '2h' });
    }
}