"use client"

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar"
import { 
    DropdownMenu, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings, Users } from "lucide-react";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "@/actions/logout.action";
import { UserAvatar } from "./user-avatar";
import { User } from "@/types";


interface UserMenuProps{
    user: User;
}
export const UserMenu = ({
    user,
} : UserMenuProps) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSignOut = async () => {
        startTransition(() => {
            signOut()
                .then((data : any) => {
                    if(data.redirect){
                        router.push(`${DEFAULT_LOGOUT_REDIRECT}`)
                    }
                })
                .catch((error: any) => {
                    toast.error("Unexpected error encountered")
                })
        })
    }


    return (

        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={user}/>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                className="
                    w-42 
                    mt-2 
                    bg-white
                    dark:bg-neutral-900 
                    border-[1px] 
                    border-neutral-200 
                    dark:border-neutral-800
                    rounded-md p-1
                " 
                align="end"
            >
                {/* {user.role === 'ADMIN'  && (
                    <DropdownMenuItem 
                        className="cursor-pointer flex items-center gap-2 p-2 pr-5" 
                        onClick={() => {router.push('/users')}}
                    >
                        <Users size={20}/>
                        <p>Manage users</p>
                    </DropdownMenuItem>
                )} */}
                <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2 p-2 pr-5" 
                    onClick={() => {router.push('/settings')}}
                >
                    <Settings size={20}/>
                    <p>Settings</p>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem 
                    className="cursor-pointer text-primary flex items-center gap-2 p-2 pr-5" 
                    onClick={handleSignOut}
                >
                    <LogOut size={20}/>
                    <p>Logout</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}