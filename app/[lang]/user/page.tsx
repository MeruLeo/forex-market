import NavigationSmall from "@/components/NavigationSmall";
import { Locale } from "@/i18n.config";
import {
    getDictionary,
    getDictionary_user,
    getDictionary_message,
} from "@/lib/dictionary";
import ClientPage from "./ClientPage";
import axiosInstance from "@/utils/axiosInstance";

export default async function Home({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    async function getSiteTitle() {
        try {
            const response = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_API_URL2}/get-site-config/`,
                {
                    headers: {
                        "Cache-Control": "no-cache",
                    },
                },
            );

            return response.data;
        } catch {
            return "Meta Copy";
        }
    }

    const appCongig: any = await getSiteTitle();

    const p = { lang };

    const dict: any = await getDictionary_user(lang);
    const dict2: any = await getDictionary(lang);
    const dict_message: any = await getDictionary_message(lang);

    return (
        <div
            className="flex items-center justify-items-center w-full
    min-h-screen p-4 pb-20 sm:p-6 bg-slate-200 dark:bg-slate-900"
            suppressHydrationWarning
        >
            <NavigationSmall
                params={p}
                siteTitle={appCongig.appTitle}
                botUrl={appCongig.botUrl}
                callUrl={appCongig.callUrl}
                pwaUrl={appCongig.pwaUrl}
                reserveUrl={appCongig.reserveUrl}
                botIcon={appCongig.bot_icon}
                pwaIcon={appCongig.pwa_icon}
                callIcon={appCongig.call_icon}
                reserveIcon={appCongig.reserve_icon}
            />

            <ClientPage
                dict={dict}
                dict2={dict2}
                dict_message={dict_message}
                lang={lang}
            />
        </div>
    );
}
