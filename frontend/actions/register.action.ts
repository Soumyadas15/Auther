"use server"

import * as z from "zod";
import axios from "axios";
import { RegisterSchema } from "@/schemas/auth";
import { ErrorHandler } from "@/errors/Errorhandler";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const data = validatedFields.data;
    const apiUrl = `${process.env.API_URL}/auth/register`;

    try {
        const response = await axios.post(apiUrl, data);

        if (response.data.status === 'success') {
            return {
                success: response.data.message,
                redirect: true
            };
        }

        return { error: "Something went wrong" };
    } catch (error) {
        const { error: errorMessage, statusCode } = ErrorHandler.handleError(error);
        return {
            error: errorMessage,
            statusCode,
        };
    }
};
