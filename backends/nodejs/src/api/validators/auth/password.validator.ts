import { z } from 'zod';

const passwordSchema = z.object({
    password: z.string().min(6, {
        message: "Password should be minimum 6 characters long"
    }),
});

export const validatePassword = (userData: any) => {
    const result = passwordSchema.safeParse(userData);

    if (!result.success) {
        const errorMessages = result.error.errors.map(err => err.message);
        throw new Error(errorMessages.join(', '));
    }
    return result.data;
};