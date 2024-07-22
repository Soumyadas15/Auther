import { z } from 'zod';

const otpSchema = z.object({
    code: z.string().email({
        message: "Code must be 6-digits long"
    }),
});

export const validateOtp = (data: any) => {
    const result = otpSchema.safeParse(data);

    if (!result.success) {
        const errorMessages = result.error.errors.map(err => err.message);
        throw new Error(errorMessages.join(', '));
    }
    return result.data;
};