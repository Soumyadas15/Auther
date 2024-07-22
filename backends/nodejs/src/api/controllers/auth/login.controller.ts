import { Request, Response } from 'express';

import { validateLogin } from '../..//validators/auth/login.validator';
import { UserService } from '../../services/auth/user/user.service';
import { UserRepository } from '../../services/auth/user/user.repository';
import { TokenService } from '../../services/auth/token/token.service';
import { PasswordHasher } from '../../../utils/password';
import { AuthError } from '../../services/auth/user/AuthError';
import { ResponseFormatter } from '../../../utils/response-formatter';
import { EmailService } from '../../services/auth/email/mail.service';


const passwordHasher = new PasswordHasher();
const tokenService = new TokenService();
const emailService = new EmailService();

const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordHasher);

export const loginUser = async (req: Request, res: Response) => {
    try {
        const validatedFields = validateLogin(req.body);
        const { email, password, code } = validatedFields;

        const existingUser = await userService.getUserByEmail(email);

        if(!existingUser){
            return ResponseFormatter.error(res, 404, "User does not exist");
        } 

        if(existingUser.provider !== 'credentials'){
            return ResponseFormatter.error(res, 409, "Email is in use with another provider");
        }
        
            
        const passwordMatch = await passwordHasher.verify(existingUser.password, password)
        if(!passwordMatch){
            return ResponseFormatter.error(res, 401, "Incorrect password");
        } 

        if(!existingUser.emailVerified){
            await tokenService.generateVerificationToken(existingUser.email);
            return ResponseFormatter.error(res, 200, "Verification code sent again");
        }

        if(existingUser.isTwoFactorEnabled && existingUser.email){
            if(code){
                const twoFactorToken = await tokenService.getTwoFactorTokenByEmail(existingUser.email);

                if(!twoFactorToken) return ResponseFormatter.error(res, 404, "Invalid token");

                if(twoFactorToken.token !== code) return ResponseFormatter.error(res, 400, "Invalid token");

                const hasExpired = new Date(twoFactorToken.expires) < new Date();

                if(hasExpired) return ResponseFormatter.error(res, 401, "Token has expired");

                await prisma.twoFactorToken.delete({
                    where: {
                        id: twoFactorToken.id,
                    }
                })

                const existingConfirmation = await userService.getTwoFactorConfirmationByUserId(existingUser.id);

                if(existingConfirmation){
                    await prisma.twoFactorConfirmation.delete({
                        where: {
                            id: existingConfirmation.id
                        }
                    })
                }
                await prisma.twoFactorConfirmation.create({
                    data: {
                        userId: existingUser.id
                    }
                });

            } else {
                const twoFactorToken = await tokenService.generateTwoFactorToken(existingUser.email);
                await emailService.sendTwoFactorEmail(
                    twoFactorToken.email,
                    twoFactorToken.token
                )

                return ResponseFormatter.success(res, "Two factor email sent", { twofactor : true });
            }
        }

        try {
            const user = await userService.userCredentialsLogin(email, password);
            if (!user) return ResponseFormatter.error(res, 401, "Invalid credentials");

            return ResponseFormatter.success(res, "Success", user );

        } catch (error){
            if(error instanceof AuthError){
                switch (error.type){
                    case "CredentialsSignin":
                        return ResponseFormatter.error(res, 401, "Invalid credential");
                    default:
                        return ResponseFormatter.error(res, 500, "Something went wrong");
                }
            }
            throw error;
        }

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};