import { User } from "@prisma/client";

import { prisma } from '../../../utils/prisma'
import { IAdminRepository } from "./IAdminRepository";
import { AppError } from "../auth/user/AppError";
import { UserService } from "../auth/user/user.service";
import { UserRepository } from "../auth/user/user.repository";
import { PasswordHasher } from "../../../utils/password";

const userRepository = new UserRepository();
const passwordHasher = new PasswordHasher();
const userService = new UserService(userRepository, passwordHasher);

export class AdminRepository implements IAdminRepository {

    public async getUsers(userId: string, page: number, pageSize?: number): Promise<{ users: Pick<User, 'name' | 'email' | 'role'>[], total: number }> {

        const existingUser = await userService.getUserById(userId);
        if(!existingUser) throw new AppError('User not found')
        if(existingUser.role !== 'ADMIN') throw new AppError('You not authorized')

        const limit = pageSize && pageSize > 0 ? Math.min(pageSize, 2) : 2;
        const skip = (page - 1) * limit;
        const total = await prisma.user.count();

        const users = await prisma.user.findMany({
            skip,
            take: limit,
            select: {
                name: true,
                email: true,
                role: true,
            },
        });

        return { users, total };
    }
}