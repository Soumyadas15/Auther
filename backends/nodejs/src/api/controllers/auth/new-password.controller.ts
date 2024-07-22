import { Request, Response } from 'express';

import { validatePassword } from '../..//validators/auth/password.validator';
import { UserService } from '../../services/auth/user/user.service';
import { UserRepository } from '../../services/auth/user/user.repository';
import { TokenService } from '../../services/auth/token/token.service';
import { PasswordHasher } from '../../../utils/password';
import { ResponseFormatter } from '../../../utils/response-formatter';


const passwordHasher = new PasswordHasher();
const tokenService = new TokenService();

const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordHasher);

export const newPassword = async (req: Request, res: Response) => {
    try {
        const validatedFields = validatePassword(req.body);

        const { password } = validatedFields;
        if(!password) return ResponseFormatter.error(res, 422, "Password is missing");

        const { token } = req.query;
        if (!token) return ResponseFormatter.error(res, 422, "Token is missing or invalid");

        const existingToken = await tokenService.getPasswordResetTokenByToken(token as string);
        if(!existingToken) return ResponseFormatter.error(res, 401, "Invalid token");

        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired) return ResponseFormatter.error(res, 401, "Token has expired");
        
        await userService.resetUserPassword(existingToken, password);

        return ResponseFormatter.success(res, "Password changed successfully");

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};