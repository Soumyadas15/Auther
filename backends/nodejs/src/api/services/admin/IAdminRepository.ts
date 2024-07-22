import { User } from "@prisma/client";

export interface IAdminRepository{
    getUsers(userId: string, page: number, pageSize?: number): Promise<{ users: Pick<User, 'name' | 'email' | 'role'>[], total: number }>
}