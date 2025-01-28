import NavigationSmall from "@/components/NavigationSmall";
import { Locale } from "@/i18n.config";
import { getDictionary_payment } from "@/lib/dictionary";

import React from "react";
import ClientPayment from "./ClientPayment";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import Cookies from "js-cookie";

export default async function Payment({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    async function getSiteTitle() {
        try {
            const token = Cookies.get("access");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL2}/get-site-config`,
                {
                    headers: {
                        "Cache-Control": "no-cache",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const resData = response.data;
            return resData;
        } catch {
            return "Meta Copy";
        }
    }
    const appCongig: any = await getSiteTitle();

    const p = { lang };
    const dict: any = await getDictionary_payment(lang);

    return (
        <div
            className="flex items-center justify-items-center w-full
    min-h-screen p-4 pb-20 sm:p-6 bg-slate-200 dark:bg-slate-900"
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
            <ClientPayment dict={dict} />
        </div>
    );
}
