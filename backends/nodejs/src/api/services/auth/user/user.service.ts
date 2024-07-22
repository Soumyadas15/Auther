import { PasswordResetToken, TwoFactorConfirmation, User } from "@prisma/client";


import { validateRegister } from "../../../validators/auth/register.validator";
import { PasswordHasher } from "../../../../utils/password";
import { IUserRepository } from "./IUserRepository";
import { AppError } from "./AppError";
import { ILoginResponse } from "./ILoginResponse";


export class UserService {
    constructor(
        private userRepository: IUserRepository,
        private passwordHasher: PasswordHasher,
    ) {}

    async createUser(userData: any): Promise<User> {
        const validatedUser = validateRegister(userData);
        const { name, email, password } = validatedUser;

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new AppError("Email already in use", 409);
        }

        const hashedPassword = await this.passwordHasher.hash(password);

        const user = await prisma.user.create({
            data: {
                name: name,
                password: hashedPassword,
                email: email,
                provider: 'credentials'
            }
        })
        
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        
        return user;
    }

    async getUserById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })
        
        return user;
    }

    async verifiyUser(id: string): Promise<void> {
        return await this.userRepository.verifyUser(id);
    }

    async getTwoFactorConfirmationByUserId(userId: string): Promise<TwoFactorConfirmation | null>{
        return await this.userRepository.getTwoFactorConfirmationByUserId(userId);
    }

    async userCredentialsLogin(email: string, password: string): Promise<ILoginResponse | void>{
        const user = await this.userRepository.credentialsLogin(email, password);
        return user
    }

    async oAuthLogin(provider: string, profile: any, refreshToken?: string, accessToken?: string): Promise<ILoginResponse | void>{
        const newUser = await this.userRepository.oAuthLogin(
                            provider, profile, 
                            refreshToken, accessToken
                        );

        return newUser
    }

    async resetUserPassword(token: PasswordResetToken, password: string): Promise<void>{
        return await this.userRepository.resetPassword(token, password)
    }
}
