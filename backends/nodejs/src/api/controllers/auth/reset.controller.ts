import { Request, Response } from 'express';

import { validateReset } from '../..//validators/auth/reset.validator';
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

export const resetEmail = async (req: Request, res: Response) => {
    try {
        const validatedFields = validateReset(req.body);
        const { email } = validatedFields;

        const existingUser = await userService.getUserByEmail(email);
        if(!existingUser) return ResponseFormatter.error(res, 404, "User does not exist");

        if(existingUser.provider !== 'credentials') return ResponseFormatter.error(res, 409, "User is registered with a different provider");

        const passwordResetToken = await tokenService.generatePasswordResetToken(existingUser.email);
        if(!passwordResetToken) return ResponseFormatter.error(res, 400, "Failed to generate token");
        
        await emailService.sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token
        )

        return ResponseFormatter.success(res, "Reset email sent successfully");

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};