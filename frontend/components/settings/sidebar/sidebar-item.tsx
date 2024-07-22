"use client"

import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps{
    label: string;
    route: string;
}

export const SidebarItem = ({
    label,
    route
} : SidebarItemProps) => {

    const router = useRouter();
    const pathname = usePathname();
    const isActive = `/settings/${route}` === pathname;

    return(
        <div 
            className={`px-4 p-3 w-full flex items-start gap-2 transition duration-300
                        ${isActive ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-transparent'}
                        cursor-pointer hover:underline rounded-md
            `}
            onClick={() => {router.push(`/settings/${route}`)}}
        >
            <p className="text-sm font-medium">{label}</p>
        </div>
    )
}