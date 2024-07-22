"use server"

import { ErrorHandler } from "@/errors/Errorhandler";
import { NewPasswordSchema } from "@/schemas/auth";
import axios from "axios";
import * as z from "zod";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null,
) => {

    if(!token) return { error: "Missing token!" }

    console.log(token)

    const validatedFields = NewPasswordSchema.safeParse(values);
    if(!validatedFields.success) return { error: "Invalid fields!" }

    const { password, confirmPassword } = validatedFields.data;
    if(password !== confirmPassword) return { error: "Passwords mismatch" }

    const data = { password };
    const apiUrl = `${process.env.API_URL}/auth/new-password?token=${token}`

    try {
        const response = await axios.post(apiUrl, data);
        if (response.data.status === 'success') {
            return {
                success: response.data.message,
                redirect: true
            };
        }
    } catch (error) {
        const { error: errorMessage, statusCode } = ErrorHandler.handleError(error);
        return {
            error: errorMessage,
            statusCode,
        };
    }
}
