"use client"

import { AppearanceCard } from "@/components/settings/appearance/appearance-card"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useState } from "react"

const AppearanceSettingsPage = () => {


    const { theme, setTheme } = useTheme()
    const [currentTheme, setCurrentTheme] = useState<string | undefined>(theme);

    const toggleTheme = (theme: string) => {
        setCurrentTheme(theme)
        setTheme(theme)
    }


    return (
        <div className="w-full h-full">
            <h1 className="font-semibold text-xl">Appearance</h1>
            <h1 className="text-muted-foreground text-sm mt-1 font-light">Customize the appearance of the app. Automatically switch between day and night themes.</h1>
            <hr className="w-full mt-6 b-[1px] bg-muted-foreground transition duration-300"/>

            <div className="mt-6 font-semibold">Theme</div>
            <h1 className="text-muted-foreground text-sm mt-1 font-light">Set the default theme you want to use in the app.</h1>

            <div className="flex items-center gap-10 mt-4">
                <AppearanceCard 
                    type="light"
                    onClick={() => toggleTheme('light')}
                    isSelected={theme === "light"}
                />
                <AppearanceCard 
                    type="dark"
                    onClick={() => toggleTheme('dark')}
                    isSelected={theme === "dark"}
                />
            </div>

            <Button className="mt-10">
                Save changes
            </Button>
        </div>
    )
}
export default AppearanceSettingsPage