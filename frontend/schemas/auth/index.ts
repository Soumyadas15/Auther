import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Name is required"
    }),
    code: z.optional(z.string()),
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    })
})

export const OtpSchema = z.object({
    code: z.string().min(6, {
        message: "Code must be 6-digits long"
    })
})

export const TaskSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    }),
    priority: z.string().min(1, {
        message: "Priority is required"
    }),
    dueDate: z.date()
})