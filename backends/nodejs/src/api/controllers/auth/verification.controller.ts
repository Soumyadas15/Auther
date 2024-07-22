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

export const newVerification = async (req: Request, res: Response) => {
    try {

        const { code } = req.body;
        if(!code) return ResponseFormatter.error(res, 404, "Missing verification code")

        await userService.verifiyUser(code);
        return ResponseFormatter.success(res, "Successfully verified")

    } catch (err) {
        if (err instanceof AppError) {
            if (err.message === "Invalid token") {
                return ResponseFormatter.error(res, 400, err.message)
            }
            if (err.message === "Token has expired") {
                return ResponseFormatter.error(res, 410, err.message)
            }
            if (err.message === "User does not exist") {
                return ResponseFormatter.error(res, 404, err.message)
            }
            return ResponseFormatter.error(res, 409, err.message)
        }
        return ResponseFormatter.error(res, 500, "An unknown error occuredd")
    }
};