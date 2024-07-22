import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    email: z.string().email({
        message: "Invalid email"
    }),
    password: z.string().min(6, {
        message: "Password should be minimum 6 characters long"
    }),
});

export const validateRegister = (userData: any) => {
    const result = registerSchema.safeParse(userData);

    if (!result.success) {
        const errorMessages = result.error.errors.map(err => err.message);
        throw new Error(errorMessages.join(', '));
    }
    return result.data;
};