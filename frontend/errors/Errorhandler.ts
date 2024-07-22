import axios from "axios";
import { AuthError } from "./AuthError";


export class ErrorHandler {
    static handleError(error: unknown) {
        if (error instanceof AuthError) {
            console.error(error.message);
            return {
                error: error.message,
                statusCode: error.statusCode,
            };
        }

        if (axios.isAxiosError(error) && error.response) {
            const message = (error.response.data as { message: string }).message;
            console.error(message);
            return {
                error: message || "Something went wrong",
                statusCode: error.response.status,
            };
        }

        const message = (error as Error).message;
        console.error(message);
        return {
            error: message || "Something went wrong",
            statusCode: 500,
        };
    }
}
