"use client";
import { SignupFormDemo } from "@/components/aceternity/signupform";
import { LoginFormDemo } from "@/components/aceternity/loginform";
import { useAppContext } from "@/context";
import { Quote } from "lucide-react";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientLocaleSwitcher from "@/components/ClientLocaleSwitcher2";
import ReCAPTCHA from "react-google-recaptcha";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import Cookies from "js-cookie";

const ClientSideSignup = ({ dict, lang }: { dict: any; lang: string }) => {
    const { user } = useAppContext();
    const params = useSearchParams();
    const l = params.get("signup");
    const [login, setLogin] = useState<boolean>(!Boolean(l));
    const [registartion, setregistartion] = useState<boolean>(false);

    const fetchConf = async () => {
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
            const res = response.data;
            if (res.status === 200) {
                return;
            }
            setregistartion(res.registration);
        } catch (error) {
            console.error(error);
        }
    };

    const router = useRouter();
    useEffect(() => {
        if (user) {
            // Redirect to the main page if user is not null
            router.push(`/${lang}/user`); // Change '/' to your main page path
        }
    }, [user, router, lang]);

    useEffect(() => {
        fetchConf();
    }, []);

    const handleFormChange = () => {
        setLogin(!login);
    };

    return (
        <div
            dir={lang === "en" ? "ltr" : "rtl"}
            className="flex flex-row w-full h-full relative"
        >
            {/* <div
                className={`z-0 absolute sm:relative bg-[url("/signupLight.jpg")] dark:bg-[url("/signupDark.jpg")]
                w-full h-screen pb-10 flex flex-col items-start justify-end bg-cover sm:bg-cover bg-no-repeat`}
            >
                <div className={`${!user && "hidden sm:block"} flex m-4`}>
                    <h1 className="max-w-96 text-lg leading-relaxed">
                        <Quote className="w-3 h-3 inline mb-2 rotate-180" />
                        {dict.quote}
                        <Quote className="w-3 h-3 inline mb-2" />
                    </h1>
                </div>
                <p className={`${!user && "hidden sm:block"} mx-4`}>
                    - {dict.writer} <small>{dict.book}</small>
                </p>
            </div> */}
            <div className="z-10 w-full h-screen flex flex-col sm:flex-row items-center justify-center">
                <div
                    className={` ${lang === "en" ? "right-6" : "left-6"} bg-white dark:bg-black border border-neutral-300 drop-shadow-lg`}
                >
                    <ClientLocaleSwitcher dict={dict} />
                </div>
                <div className="mx-2 py-1 w-full max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col items-center ">
                    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                        {/* نمایش فرم‌ها بر اساس وضعیت login */}
                        {login ? (
                            <LoginFormDemo dict={dict} lang={lang} />
                        ) : (
                            <SignupFormDemo dict={dict} lang={lang} />
                        )}
                        {!user && (
                            <div className="mt-4 w-full flex items-center justify-center">
                                <button
                                    onClick={handleFormChange}
                                    className=" text-blue-500 px-6 py-2 rounded-md hover:text-blue-600 transition"
                                >
                                    {login ? dict.signup.btn2 : dict.login.btn2}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Wrap the ClientSideSignup component in a Suspense boundary
const ClientSideSignupWithSuspense = (props: any) => (
    <Suspense fallback={<div>Loading...</div>}>
        <ClientSideSignup {...props} />
    </Suspense>
);

export default ClientSideSignupWithSuspense;
