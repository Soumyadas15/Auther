import {
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_LOGOUT_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
    rootRoute
} from '@/routes'
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";
import { isJwtExpired } from './lib/jwt';


 
//@ts-ignore
export function middleware(request: NextRequest){

    const { nextUrl } = request;
    const isRootRoute = rootRoute.includes(nextUrl.pathname);

    const cookieMaster = cookies();

    let user = cookieMaster.get('currentUserToken')?.value ?? "";
    let token = cookieMaster.get('jwtToken')?.value ?? "";

    


    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    let isLoggedIn = false;

    if (user && token) {
        isLoggedIn = true;
    }

    if(isJwtExpired(token)){
        isLoggedIn = false;
    }

    if(isAuthRoute){
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if(!isLoggedIn){
        return Response.redirect(new URL(DEFAULT_LOGOUT_REDIRECT, nextUrl));
    }

    if (nextUrl.pathname === '/settings'){
        return Response.redirect(new URL('/settings/account', nextUrl));
    }

    if (nextUrl.pathname === '/'){
        return Response.redirect(new URL('/home', nextUrl));
    }

}
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}