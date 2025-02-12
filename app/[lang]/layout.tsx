import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AppWrapper } from "@/context";
import { Inter, Rubik, Vazirmatn } from "next/font/google";
import { Locale, i18n } from "@/i18n.config";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "../../redux/reduxProvider";

const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["arabic"] });
const vazir = Vazirmatn({ subsets: ["arabic"] });

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_TITLE,
    description: process.env.NEXT_PUBLIC_DISCRIPTION,
};

export default function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: { lang: Locale };
}>) {
    return (
        <html lang={params.lang} suppressHydrationWarning>
            <body
                className={`${params.lang === "fa" ? rubik.className : params.lang === "kur" ? vazir.className : inter.className} antialiased`}
            >
                <ReduxProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <header lang={params.lang} />
                        <AppWrapper>{children}</AppWrapper>
                        <Toaster />
                    </ThemeProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
