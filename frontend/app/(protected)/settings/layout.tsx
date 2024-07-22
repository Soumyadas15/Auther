import { Sidebar } from "@/components/settings/sidebar/sidebar";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="w-full flex flex-col h-screen bg-background pt-[6rem] px-4 md:px-14 transition duration-300">
            <div className="flex h-[15%] w-full items-start flex-col gap-2">
                <h1 className="text-foreground font-semibold text-4xl transition duration-100">Settings</h1>
                <p className="text-muted-foreground transition duration-300">Manage your account settings and set e-mail preferences.</p>
                <hr className="w-full mt-2 b-[1px] bg-muted-foreground transition duration-300"/>
            </div>
            <div className="w-full h-[85%] flex">
                <div className="w-[20%] pt-4">
                    <Sidebar/>
                </div>
                <div className="w-[80%] h-full pt-4 pl-12">
                    {children}
                </div>
            </div>
        </div>
    )
}