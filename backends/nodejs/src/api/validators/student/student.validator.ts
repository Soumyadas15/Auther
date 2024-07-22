import { z } from 'zod';

const studentSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    classId: z.string().min(1, {
        message: "Id is required"
    }),
    course: z.string().min(1, {
        message: "Course is required"
    }),
    phone: z.string().min(1, {
        message: "Phone number is required"
    }),
});

export const validateStudent = (userData: any) => {
    const result = studentSchema.safeParse(userData);

    if (!result.success) {
        const errorMessages = result.error.errors.map(err => err.message);
        throw new Error(errorMessages.join(', '));
    }
    return result.data;
};