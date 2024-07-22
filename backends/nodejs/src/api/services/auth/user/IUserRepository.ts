import { PasswordResetToken, TwoFactorConfirmation, User } from "@prisma/client";
import { ILoginResponse } from "./ILoginResponse";


export interface IUserRepository {
    create(user: User, password: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    verifyUser(token: string): Promise<void>;
    credentialsLogin(email: string, password: string): Promise<ILoginResponse | null>;
    oAuthLogin(provider: string, profile: any, refreshToken?: string, accessToken?: string): Promise<ILoginResponse | null>;
    getTwoFactorConfirmationByUserId(userId: string): Promise<TwoFactorConfirmation | null>;
    resetPassword(token: PasswordResetToken, password: string): Promise<void>;
}