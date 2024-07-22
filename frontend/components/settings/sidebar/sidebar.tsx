import { SidebarItem } from "./sidebar-item"

export const Sidebar = () => {
    return (
        <div className="w-full h-full flex flex-col items-start">
            <SidebarItem
                label="Account"
                route="account"
            />
            <SidebarItem
                label="Apppearance"
                route="appearance"
            />
        </div>
    )
}