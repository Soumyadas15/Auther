"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "@/actions/logout.action";
import { useTransition } from "react";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { UserMenu } from "@/components/navbar/user-menu";
import { ThemeToggle } from "../theme-toggle";
import { useModal } from "@/hooks/use-modal-store";

interface NavbarProps{
    user: any;
}
export const Navbar = ({
    user,
} : NavbarProps) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { onOpen } = useModal();

    return (
        <nav className="
            fixed h-16 w-full 
            px-4 md:px-14 flex
            items-center justify-between
            bg-background
            transition
            duration-300
        ">
            <h1 
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => router.push('/home')}
            >
                Auther
            </h1>
            <div className="flex items-center gap-4">
                <Button 
                    onClick={() => onOpen('createStudentModal')}
                >
                    Add Student
                </Button>
                <ThemeToggle/>
                {user && (
                    <UserMenu user={user}/>
                )}
            </div>
        </nav>
    )
}