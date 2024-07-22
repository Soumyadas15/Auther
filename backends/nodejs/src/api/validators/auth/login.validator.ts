import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email({
        message: "Invalid email"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.string().optional(),
});

export const validateLogin = (userData: any) => {
    const result = loginSchema.safeParse(userData);

    if (!result.success) {
        const errorMessages = result.error.errors.map(err => err.message);
        throw new Error(errorMessages.join(', '));
    }
    return result.data;
};