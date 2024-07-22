"use client"


import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useTransition } from "react";
import { oauthLogin } from "@/actions/oauth.login";

export const Social = () => {

    const [pending, startTransition] = useTransition();

    const onClick = async (provider: 'google' | 'github' | 'facebook') => {
        await oauthLogin(provider);
    }

    return (
        <div className="
            flex items-center w-full gap-x-2
        ">
            <Button
                size={'lg'}
                className="w-full"
                variant={'outline'}
                onClick={() => oauthLogin('google')}
            >
                <FcGoogle className="h-5 w-5"/>
            </Button>

            <Button
                size={'lg'}
                className="w-full"
                variant={'outline'}
                onClick={() => oauthLogin('github')}
            >
                <FaGithub className="h-5 w-5"/>
            </Button>

            <Button
                size={'lg'}
                className="w-full"
                variant={'outline'}
                onClick={() => onClick("facebook")}
            >
                <FaFacebook className="h-5 w-5 text-blue-600"/>
            </Button>

        </div>
    )
}