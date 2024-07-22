import { cookies } from "next/headers";
import { getCookie } from "./get-cookie";


export async function getCurrentUser() {
    const userToken = await getCookie("currentUserToken");
    if(userToken){
        return JSON.parse(userToken);
    }
    else{
        return null;
    }
}