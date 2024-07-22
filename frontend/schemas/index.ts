import * as z from "zod";

export const StudentSchema = z.object({
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
})