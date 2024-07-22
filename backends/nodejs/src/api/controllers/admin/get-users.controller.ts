import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AdminService } from '../../services/admin/admin.service';
import { AdminRepository } from '../../services/admin/admin.repository';
import { UserService } from '../../services/auth/user/user.service';
import { UserRepository } from '../../services/auth/user/user.repository';
import { PasswordHasher } from '../../../utils/password';
import { ResponseFormatter } from '../../../utils/response-formatter';
import { JwtService } from '../../services/auth/jwt/jwt.service';

const jwtService = new JwtService();
const passwordHasher = new PasswordHasher();
const userRepository = new UserRepository();
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const userService = new UserService(userRepository, passwordHasher);


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        
        const userId = res.locals.userId;
        console.log(userId)

        if (!userId) return ResponseFormatter.error(res, 404, 'User not found');

        const existingUser = await userService.getUserById(userId);
        if (!existingUser) return ResponseFormatter.error(res, 404, 'User not found');
        if (existingUser.role !== 'ADMIN') return ResponseFormatter.error(res, 403, 'Forbidden');

        const page = parseInt(req.query.page as string) || 1; 
        const pageSize = parseInt(req.query.pageSize as string);

        const { users, total } = await adminService.getUsers(userId, page, pageSize);

        return ResponseFormatter.success(res, 'Users fetched', { users, total });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};