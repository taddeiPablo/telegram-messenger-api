export interface TokenService {
    generate(payload: { id: string; email: string }): string;
}