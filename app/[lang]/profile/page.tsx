"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileCard, { Profile } from "./components/ProfileCard";
import AccountCard, { Account } from "./components/AccountCard";
import TransactionsTable, { Transaction } from "./components/TransactionsTable";
import ChangePasswordModal from "./components/ChangePasswordDialog";
import Wallet from "./components/Wallet";
import ActiveTokens from "./components/ActiveTokens";
import Link from "next/link";
import { Rubik } from "next/font/google";
import DatePicker, { DateObject, Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Locale } from "@/i18n.config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const rubik = Rubik({ subsets: ["arabic"] });

const dictionaries_user = {
    en: () => import("@/locales/en/user.json").then((module) => module.default),
    fa: () => import("@/locales/fa/user.json").then((module) => module.default),
    kur: () =>
        import("@/locales/kur/user.json").then((module) => module.default),
};

const getDictionary_user = (locale: Locale) => dictionaries_user[locale]();

export default function ProfilePage({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const [dict, setDict] = useState<any>();

    getDictionary_user(lang).then((res) => {
        setDict(res);
    });

    const [date1, setDate1] = useState<Value>();
    const [date2, setDate2] = useState<Value>();
    const [wallet_is_enable, setWallet_is_enable] = useState(false);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<Transaction[] | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    async function verifyToken(token: string | null) {
        if (token == null) {
            toast("Invalid token, redirecting to login.");
            Cookies.remove("access"); // Optionally clear token
            router.push("/");
            return;
        }
        const data = {
            token: token,
        };
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/verify_token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            },
        );

        try {
            // If response status is not 202, redirect to home
            if (response.status !== 202) {
                toast("Invalid token, redirecting to login.");
                Cookies.remove("access"); // Optionally clear token
                router.push("/");
                return;
            }

            // Optionally handle valid token response here
        } catch (error) {
            console.error("Error verifying token:", error);
            toast("Error verifying token, redirecting to login.");
            Cookies.remove("access"); // Optionally clear token
            router.push("/");
        }
    }

    const handleChangeTime = () => {
        let startTime = null;
        let endTime = null;

        if (date1 && date2) {
            startTime = date1.toString();
            endTime = date2.toString();
        }

        const fetchProfile = async () => {
            const token = Cookies.get("access");
            await verifyToken(token);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL2}/profile`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            token: Cookies.get("access"),
                            date1: startTime,
                            date2: endTime,
                        }),
                    },
                );
                let res = await response.json();
                if (!response.ok) {
                    toast("somthing went wrong!");
                    return;
                }
                setProfile(res.user_profile);
                setAccount(res.user_profile);

                setTransactions(res.transactions);
                setLoading(false);
            } catch (error) {
                toast("error fetching profile");
                console.error(error);
                setLoading(false);
            }
        };

        fetchProfile();
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get("access");
                await verifyToken(token);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL2}/profile`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: Cookies.get("access") }),
                    },
                );
                let res = await response.json();
                if (!response.ok) {
                    toast("somthing went wrong!");
                    return;
                }
                setProfile(res.user_profile);
                setAccount(res.user_profile);

                setTransactions(res.transactions);
                setLoading(false);
            } catch (error) {
                toast("error fetching profile");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="w-full text-center text-xl">Loading...</div>;
    }

    return (
        <>
            <nav
                className="fixed h-14 w-full top-0 left-0 z-20 shadow-lg   backdrop-filter backdrop-blur-md"
                style={{ direction: lang === "en" ? "ltr" : "rtl" }}
            >
                <div className="flex h-full justify-between w-full items-center px-4">
                    <div className="object-right pr-4 lg:pr-8 flex">
                        <Link
                            href={`/${lang}/user`}
                            className="w-full text-center flex font-normal items-center justify-center"
                        >
                            {dict.profile.home}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                            </svg>
                        </Link>
                        <div className="mx-3 flex gap-2">
                            <ChangePasswordModal dict={dict} />
                            <ActiveTokens dict={dict} />
                        </div>
                    </div>
                </div>
            </nav>

            <div
                style={{ direction: lang === "en" ? "ltr" : "rtl" }}
                className={`${rubik.className} w-full p-4 min-h-screen pt-20 font-Sahel`}
            >
                <div className="px-4 w-full items-center flex gap-2 justify-center mb-2 relative">
                    <div className="flex flex-col">
                        <div className="flex w-full justify-center items-center">
                            <label
                                htmlFor=""
                                className="mx-2"
                                style={{ width: "40px" }}
                            >
                                {dict.profile.from}:{" "}
                            </label>
                            <DatePicker
                                value={date1}
                                format="YYYY/MM/DD-HH:mm:ss"
                                locale={
                                    lang == "en" ? gregorian_en : persian_fa
                                }
                                calendar={lang == "en" ? gregorian : persian}
                                plugins={[
                                    <TimePicker
                                        position="bottom"
                                        hStep={2}
                                        mStep={3}
                                        sStep={4}
                                    />,
                                ]}
                                onChange={setDate1}
                                style={{
                                    padding: "8px 12px",
                                    height: "30px",
                                    width: "180px",
                                }}
                            />
                        </div>
                        <div className="flex w-full justify-center items-center">
                            <label
                                htmlFor=""
                                className="mx-2"
                                style={{ width: "40px" }}
                            >
                                {dict.profile.to}:{" "}
                            </label>
                            <DatePicker
                                value={date2}
                                format="YYYY/MM/DD-HH:mm:ss"
                                locale={
                                    lang == "en" ? gregorian_en : persian_fa
                                }
                                calendar={lang == "en" ? gregorian : persian}
                                plugins={[
                                    <TimePicker
                                        position="bottom"
                                        hStep={2}
                                        mStep={3}
                                        sStep={4}
                                    />,
                                ]}
                                onChange={setDate2}
                                style={{
                                    padding: "8px 12px",
                                    height: "30px",
                                    width: "180px",
                                }}
                            />
                        </div>
                    </div>
                    <button
                        className="mr-4 border rounded-md px-2"
                        style={{ height: "60px", width: "40px" }}
                        onClick={handleChangeTime}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex w-full flex-wrap gap-y-2">
                    <div className="w-full sm:w-1/2 flex gap-2 flex-col">
                        {profile && (
                            <ProfileCard profile={profile} dict={dict} />
                        )}
                    </div>
                    <div className="w-full sm:w-1/2 flex gap-2 flex-col">
                        {account && (
                            <AccountCard account={account} dict={dict} />
                        )}
                    </div>

                    <div className="w-full  gap-y-3">
                        {transactions && (
                            <TransactionsTable
                                transactions={transactions}
                                dict={dict}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
