import { Request, Response, NextFunction } from 'express';

import { JwtService } from '../../services/auth/jwt/jwt.service';
import { UserService } from '../../services/auth/user/user.service';
import { UserRepository } from '../../services/auth/user/user.repository';
import { PasswordHasher } from '../../../utils/password';
import IRequestWithUser from "../../services/auth/user/IRequestWithUser"


const passwordHasher = new PasswordHasher();
const jwtTokenService = new JwtService();

const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordHasher);


export const authenticateJWT = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.sendStatus(403);
    }

    try {
        const verificationResponse = await jwtTokenService.verifyToken(token);
        const id = verificationResponse.id;
        res.locals.userId = id;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};
