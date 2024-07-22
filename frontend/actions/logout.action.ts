"use server"

import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { getCurrentToken } from "@/lib/get-current-token";

export const signOut = async () => {
    try{

        const cookieStore = cookies();

        const deletedUser = cookieStore.delete('currentUserToken');
        const deletedToken= cookieStore.delete('jwtToken');

        return {
            success: "success",
            redirect: true
        }
        
    } catch (error : any) {
        if (error.response) {
            console.error('Error:', error.response.data);
            return {
                error: error.response.data,
            };
        } else if (error.request) {
            console.error('Error:', error.request);
            return {
                error: "No response received from server.",
            };
        } else {
            console.error('Error:', error.message);
            return {
                error: "An error occurred while processing your request.",
            };
        }
    }
}