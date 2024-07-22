export interface IJwtService {
    generateToken(userId: string): string;
    verifyToken(token: string): Promise<any>;
}