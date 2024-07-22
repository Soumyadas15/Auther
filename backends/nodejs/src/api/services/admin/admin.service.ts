import { User } from "@prisma/client";
import { IAdminRepository } from "./IAdminRepository";

export class AdminService {
    constructor(
        private adminRepository: IAdminRepository,
    ) {}

    async getUsers(userId: string, page: number, pageSize?: number): Promise<{ users: Pick<User, 'name' | 'email' | 'role'>[], total: number }> {
        const users = await this.adminRepository.getUsers(userId, page, pageSize);
        return users;
    }
}