import { Navbar } from "@/components/navbar/navbar";
import { getCurrentUser } from "@/lib/get-current-user";
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster"

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const currentUser = await getCurrentUser();

    return (
        <html lang="en">
            <body className="h-screen w-full transition-colors duration-300">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                >
                    <ModalProvider/>
                    <Toaster />
                    <Navbar user={currentUser}/>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}