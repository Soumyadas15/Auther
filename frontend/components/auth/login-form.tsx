"use client";


import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { 
    InputOTP, 
    InputOTPGroup,
    InputOTPSeparator, 
    InputOTPSlot 
} from "@/components/ui/input-otp";
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import Link from "next/link";
import { LoginSchema } from "@/schemas/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { CardWrapper } from "./card-wraper";
import { login } from "@/actions/login.action";


const errorMessages: Record<string, string> = {
    "OAuthAccountNotLinked": "Email already in use with a different provider",
    "EmailNotLinked": "Failed to fetch email, try a different provider",
};

export const LoginForm = () => {

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const searchParams = useSearchParams();
    const router = useRouter();

    const urlError = errorMessages[searchParams.get("error") ?? ""] || "";

    const form = useForm<z.infer<typeof LoginSchema>> ({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(() => {
            login(values)
                .then((data : any) => {
                    setError(data?.error!)
                    setSuccess(data?.success!)

                    if(data?.loginSuccess){
                        router.push('/home')
                    }
                    if(data?.twofactor){
                        setShowTwoFactor(true);
                    }
                })
        })
    }
    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two factor code code</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center justify-center">
                                                <InputOTP 
                                                    maxLength={6}
                                                    disabled={isPending}
                                                    {...field}
                                                    
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot className="w-[3.7rem]" index={0} />
                                                        <InputOTPSlot className="w-12" index={1} />
                                                        <InputOTPSlot className="w-12" index={2} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot className="w-12" index={3} />
                                                        <InputOTPSlot className="w-12" index={4} />
                                                        <InputOTPSlot className="w-[3.7rem]" index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    disabled={isPending}
                                                    {...field}
                                                    placeholder="john.doe@example.com"
                                                    type="email"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    disabled={isPending}
                                                    {...field}
                                                    placeholder="********"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <Button
                                                size={"sm"}
                                                variant={"link"}
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href={"/auth/reset"}>
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button
                        disabled={isPending} 
                        className="w-full"
                        type="submit"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}