export interface ITokenService {
    generateVerificationToken(email: string): Promise<any>;
    getVerificationTokenByToken(token: string): Promise<any>;
    
    getTwoFactorTokenByEmail(email: string): Promise<any>;
    
    generatePasswordResetToken(email: string): Promise<any>;
    getPasswordResetTokenByToken(token: string): Promise<any>;

    generateTwoFactorToken(email: string): Promise<any>;
    
}