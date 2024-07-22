import { Request, Response } from 'express';


import { UserRepository } from '../../services/auth/user/user.repository';
import { PasswordHasher } from '../../../utils/password';
import { UserService } from '../../services/auth/user/user.service';
import { AppError } from '../../services/auth/user/AppError';
import { TokenService } from '../../services/auth/token/token.service';
import { ResponseFormatter } from '../../../utils/response-formatter';



const passwordHasher = new PasswordHasher();
const tokenService = new TokenService();

const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordHasher);


export const registerUser = async (req: Request, res: Response) => {
    try {

        const { email } = req.body;
        const existingUser = await userService.getUserByEmail(email);

        if (existingUser) {
            return ResponseFormatter.error(res, 409,  "Email already in use");
        }

        const user = await userService.createUser(req.body);
        await tokenService.generateVerificationToken(email);

        return ResponseFormatter.success(res, "Verification mail sent");

    } catch (err) {
        if (err instanceof AppError) {
            return ResponseFormatter.error(res, err.statusCode, err.message);
        }
        return ResponseFormatter.error(res, 500, err.message || "An unexpected error occurred");
    }
};