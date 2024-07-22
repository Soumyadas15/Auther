"use server"

import * as z from "zod";

import { ResetSchema } from "@/schemas/auth"
import axios from "axios";
import { ErrorHandler } from "@/errors/Errorhandler";


export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success){
        return { error: "Invalid email!" }
    }

    const data = validatedFields.data;

    const apiUrl = `${process.env.API_URL}/auth/reset`;

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
}