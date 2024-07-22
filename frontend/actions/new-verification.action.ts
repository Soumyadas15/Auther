"use server"

import axios from "axios";

import { ErrorHandler } from "@/errors/Errorhandler";


export const newVerification = async (values: any) => {

    const { code } = values;

    if(!code) return { error: "Missing token" };

    const apiUrl = `${process.env.API_URL}/auth/new-verification`;

    try {
        const response = await axios.post(apiUrl, values);

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