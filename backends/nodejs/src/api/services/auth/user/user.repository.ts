import { PasswordResetToken, TwoFactorConfirmation, User } from "@prisma/client";

import { prisma } from "../../../../utils/prisma";
import { TokenService } from "../token/token.service";
import { AppError } from "./AppError";
import { AuthError } from "./AuthError";
import { IUserRepository } from "./IUserRepository";
import { ILoginResponse } from "./ILoginResponse";
import { PasswordHasher } from "../../../../utils/password";
import { JwtService } from "../jwt/jwt.service";
import { destructureGitHubUser } from "../../../../utils/destructure";


const passwordHasher = new PasswordHasher();
const tokenService = new TokenService();
const jwtService = new JwtService()


export class UserRepository implements IUserRepository {
    

    async create(user: User, password: string): Promise<User> {
        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: password,
            }
        });

        return newUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ 
            where: { email } 
        });

        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    }


    async verifyUser(token: string): Promise<void> {
        const existingToken = await tokenService.getVerificationTokenByToken(token);
        if(!existingToken) throw new AppError("Invalid token");

        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired) throw new AppError("Token has expired");

        const existingUser = await this.findByEmail(existingToken.email);
        if(!existingUser) throw new AppError("User does not exist");


        await prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                emailVerified: new Date(),
                email: existingUser.email,
            }
        })

        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    async getTwoFactorConfirmationByUserId(userId: string): Promise<TwoFactorConfirmation | null>{
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: {
                userId
            }
        })

        return twoFactorConfirmation;
    }

    async credentialsLogin(email: string, password: string): Promise<ILoginResponse | null> {
        const user = await this.findByEmail(email);
        if (!user) throw new AuthError("CredentialsSignin", "User not found");

        const passwordMatch = await passwordHasher.verify(user.password, password);
        if (!passwordMatch) throw new AuthError("CredentialsSignin", "Invalid password");

        const token = jwtService.generateToken(user.id);

        const { name, image, role, email: userEmail } = user;
        
        return {
            user: {
                name,
                image,
                role,
                email: userEmail
            },
            token
        };
    }


    async oAuthLogin(
        provider: string, profile: any, 
        refreshToken?: string, accessToken?: string
    ): Promise<ILoginResponse | null>{

        let email: string;
        let name: string;
        let image: string;
        let id: string;
        let type: string;

        switch(provider) {
            case 'github':
                ({ id, email, name, image, type } = destructureGitHubUser(profile));
                break;
            default:
                throw new AppError('Unsupported provider');
        }
        
        const existingUser = await this.findByEmail(email);

        if(existingUser.provider !== provider){
            throw new AppError('Email already in use with a different');
        }

        if(existingUser){

            const token = jwtService.generateToken(existingUser.id);

            return {
                user: {
                    email: existingUser.email,
                    name: existingUser.name,
                    role: existingUser.role,
                    image: existingUser.image
                },
                token: token
            };
        }

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                image: image,
                provider: provider,
                emailVerified: new Date(Date.now()),
                isTwoFactorEnabled: false,
            }
        })

        const account = await prisma.account.create({
            data: {
                provider: provider,
                providerAccountId: id,
                type: type,
                access_token: accessToken,
                userId: user.id
            }
        })

        const token = jwtService.generateToken(user.id);

        return {
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            },
            token: token
        };

    }


    async resetPassword(token: PasswordResetToken, password: string): Promise<void>{
        const existingToken = await tokenService.getPasswordResetTokenByToken(token.token);
        if(!existingToken) {
            throw new AuthError("Token not found");
        }

        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired) throw new AuthError("Token has exipred");

        const existingUser = await this.findByEmail(existingToken.email);
        if(!existingUser) throw new AuthError("User does not exist");

        if(existingUser.provider !== 'credentials'){
            throw new AuthError("User is registered with a different provider");
        }

        const hashedPassword = await passwordHasher.hash(password);

        await prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                password: hashedPassword
            }
        })

        await prisma.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            }
        })

    }
}