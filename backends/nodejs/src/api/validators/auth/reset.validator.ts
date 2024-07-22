import { z } from 'zod';

const resetSchema = z.object({
    email: z.string().email({
        message: "Invalid email"
    }),
});

export const validateReset = (userData: any) => {
    const result = resetSchema.safeParse(userData);

    if (!result.success) {
        const errorMessages = result.error.errors.map(err => err.message);
        throw new Error(errorMessages.join(', '));
    }
    return result.data;
};