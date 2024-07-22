"use client";


import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    InputOTPSlot,
    InputOTPSeparator
 } from "../ui/input-otp";
import { OtpSchema } from "@/schemas/auth";
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "./card-wraper";
import { newVerification } from "@/actions/new-verification.action";


export const VerificationForm = () => {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with a different provider" : "";

    const [value, setValue] = useState<string>("");

    const router = useRouter();

    const form = useForm<z.infer<typeof OtpSchema>> ({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            code: "",
        }
    })

    const onSubmit = (value: z.infer<typeof OtpSchema>) => {
        startTransition(() => {
            newVerification(value)
                .then((data) => {
                    setError(data?.error!)
                    setSuccess(data?.success!)
                    if (data?.redirect){
                        router.push('/auth/login')
                    }
                })
        })
    }

    // useEffect(() => {
    //     if(value.length === 6){
    //         form.handleSubmit(onSubmit)
    //     }
    // }, [value])



    return (
        <CardWrapper
            headerLabel="Enter the verification sent to your email"
            backButtonLabel=""
            backButtonHref=""
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification code</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center">
                                            <InputOTP 
                                                maxLength={6}
                                                disabled={isPending}
                                                {...field}
                                                // onChange={(value) => setValue(value)}
                                                
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
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button
                        disabled={isPending} 
                        className="w-full"
                        type="submit"
                    >
                        Verify
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}