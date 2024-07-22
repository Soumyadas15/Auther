"use server"

import * as z from "zod";
import axios from "axios";
import { LoginSchema } from "@/schemas/auth";
import { ErrorHandler } from "@/errors/Errorhandler";
import { cookies } from "next/headers";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const data = validatedFields.data;
    const cookieMaster = cookies();

    console.log(data);
    
    const apiUrl = `${process.env.API_URL}/auth/login`;
    
    try {
        const response = await axios.post(apiUrl, data, {
            withCredentials: true,
        });

        if (response.data.status === 'success') {
            if(response.data.data.twofactor === true){
                return {
                    success: response.data.message,
                    twofactor: true
                };
            }
            else {
                const user = response.data.data.user;
                const token = response.data.data.token;

                cookieMaster.set("currentUserToken", JSON.stringify(user), {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60,
                    sameSite: "strict"
                });

                cookieMaster.set("jwtToken", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60,
                    sameSite: "strict"
                });

                return {
                    success: response.data.message,
                    loginSuccess: true
                }
            }
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
