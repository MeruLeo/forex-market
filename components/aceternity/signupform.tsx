"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/aceternity/label";
import { Input } from "@/components/aceternity/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { getUserFromToken } from "@/lib/jwt";
import GetCode from "@/components/aceternity/GetCode";
import { useAppContext } from "@/context";
import { Checkbox } from "../shadcn/checkbox";
import { IoNavigate } from "react-icons/io5";
import { PiNavigationArrowFill } from "react-icons/pi";
import { Dialog, DialogContent } from "../shadcn/dialog";
import "./captcha.css";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { SignupProps, signupUser } from "@/redux/slices/registerSlice";

export function SignupFormDemo({ dict, lang }: { dict: any; lang: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const { error, loading, success } = useSelector((state: RootState) => {
        return state.register;
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const { user, setUser } = useAppContext();
    const [isLoading2, setIsLoading2] = useState<boolean>(false);
    const [captcha, setCaptcha] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [errorUser2, setErrorUser2] = useState<string | null>(null);
    const [errorreal_name, setErrorReal_name] = useState<string | null>(null);
    const [errorphone2, setErrorPhone2] = useState<string | null>(null);
    const [errorbank, setErrorBank] = useState<string | null>(null);
    const [errorp12, setErrorp12] = useState<string | null>(null);
    const [errorp22, setErrorp22] = useState<string | null>(null);
    const [error2, setError2] = useState<string | null>(null);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [needSmsVerify, setNeedSmsVerify] = useState<boolean>(true);
    const [validatePhone, setValidatePhone] = useState<boolean>(false);

    const [phone, setPhone] = useState<boolean>(false);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [values, setValues] = React.useState({
        textmask: "----",
    });
    const [referralCode, setReferralCode] = React.useState<
        string | string[] | null
    >(null);

    React.useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            setReferralCode(ref);
        } else {
            console.log(`No referral code found`);
        }
    }, [searchParams]);

    useEffect(() => {
        if (success) {
            // router.push(`${lang}/user`);
            const token = Cookies.get("access");
            setUser(token);
        }
    }, [success, setUser, user]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const handleCaptchaChange = (value: any) => {
        if (value) {
            setIsCaptchaVerified(true);
        }
    };

    useEffect(() => {
        const clearErrorsTimeout = setTimeout(() => {
            setErrorUser2(null);
            setErrorReal_name(null);
            setErrorPhone2(null);
            setErrorp12(null);
            setErrorp22(null);
            setError2(null);
        }, 5000);

        return () => clearTimeout(clearErrorsTimeout);
    }, [errorUser2, errorreal_name, errorphone2, errorp12, errorp22, error2]);

    useEffect(() => {
        fetchConf();
    }, []);
    const fetchConf = async () => {
        try {
            const response = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_API_URL2}/get-site-terms`,
            );

            const res = response.data;
            setNeedSmsVerify(res.sms_verification);
            setValidatePhone(res.validate_phone);
        } catch (error) {
            console.error(error);
        }
    };

    const openToast = () => {
        const user: any = getUserFromToken();
        toast("Your account created successfully", {
            action: {
                label: "Main page",
                //@ts-ignore
                // onClick: () => push(`/profile?id=${user.id}`),
                onClick: () => {
                    // Use Link to create a navigable link
                    <Link href={`/${lang}/user`} />;
                },
            },
        });
    };

    const handleSubmit2 = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const regex = /^09\d{9}$/;

        const getInputValue = (id: string): string =>
            (document.getElementById(id) as HTMLInputElement).value;

        const username = getInputValue("username2");
        const real_name = getInputValue("real_name");
        const phone_number = getInputValue("phone");
        const bank_number = getInputValue("bank_number");
        const password = getInputValue("password2");
        const password2 = getInputValue("password22");

        if (validatePhone && !regex.test(phone_number)) {
            setErrorPhone2(dict.signup.errors.phone_format);
            return;
        }
        if (username.length < 3) {
            setErrorUser2(dict.login.errors.small_username);
            return;
        }
        if (!captcha) {
            setError2(dict.login.errors.captcha);
            return;
        }
        if (!isChecked) {
            setError2(dict.signup.errors.not_checked);
            return;
        }
        if (password.length < 8) {
            setErrorp12(dict.signup.errors.password_length);
            return;
        }
        if (password !== password2) {
            setErrorp22(dict.signup.errors.password_repeat);
            return;
        }

        setIsLoading2(true);

        const data: SignupProps = {
            username,
            real_name,
            phone_number,
            bank_number,
            password,
        };

        if (referralCode) {
            data.referralCode = referralCode;
        }

        try {
            const response = await dispatch(signupUser(data)).unwrap();

            if (response.phone_number) {
                setPhone(response.phone_number);
                clearErrors();

                if (!needSmsVerify) {
                    console.log(response.code);
                    setOpenDialog(true);
                    toast(dict.signup.success);
                } else {
                    // await handleAutoLogin(response.phone_number, password);
                }
            }
        } catch (error: any) {
            console.error("Signup Error:", error);
            if (typeof error === "object" && error !== null) {
                Object.entries(error).forEach(([field, messages]) => {
                    switch (field) {
                        case "username":
                            setErrorUser2(
                                Array.isArray(messages)
                                    ? messages[0]
                                    : messages,
                            );
                            break;
                        case "real_name":
                            setErrorReal_name(
                                Array.isArray(messages)
                                    ? messages[0]
                                    : messages,
                            );
                            break;
                        case "phone_number":
                            setErrorPhone2(
                                Array.isArray(messages)
                                    ? messages[0]
                                    : messages,
                            );
                            break;
                        case "password":
                            setErrorp12(
                                Array.isArray(messages)
                                    ? messages[0]
                                    : messages,
                            );
                            break;
                        default:
                            setError2(
                                Array.isArray(messages)
                                    ? messages[0]
                                    : messages,
                            );
                    }
                });
            } else {
                setError2("An unexpected error occurred during signup.");
            }
            toast(dict.signup.error);
        } finally {
            setIsLoading2(false);
        }
    };

    const clearErrors = () => {
        setErrorUser2(null);
        setErrorReal_name(null);
        setErrorPhone2(null);
        setErrorp12(null);
        setErrorp22(null);
    };

    const handleSignupError = (errorData: any) => {
        Cookies.remove("access");
        setErrorUser2(errorData.username || null);
        setErrorPhone2(errorData.phone_number || null);
        toast(errorData.message || "Signup failed.");
    };

    const handleUnexpectedError = (action: "signup" | "login") => {
        Cookies.remove("access");
        const message = `An unexpected error occurred during ${action}.`;
        setError2(message);
        toast(message);
    };

    const handleAutoLogin = async (username: string, password: string) => {
        try {
            const loginResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/token/`,
                { username, password },
            );

            if (loginResponse.status === 200) {
                const token = loginResponse.data;
                setUser(token);
                Cookies.set("access", token);
                openToast();
                router.push(`${lang}/user`);
            } else {
                handleLoginError(loginResponse.data);
            }
        } catch (error) {
            console.error("Login Error:", error);
            handleUnexpectedError("login");
        }
    };

    const handleLoginError = (errorData: any) => {
        Cookies.remove("access");
        setErrorUser2(errorData.username || "Login failed.");
    };

    const handleTerms = () => {
        setIsChecked(!isChecked);
    };

    const handlePhoneVerification = async (e: any) => {
        e.preventDefault();
        if (!values.textmask) {
            setError2(dict.signup.errors.code_required);
            return;
        }
        const data = {
            phone_number: phone,
            code: values.textmask,
        };
        try {
            const response = await axiosInstance.post(`/account/verify`, data);

            if (response.status === 201) {
                console.log(response);
                setUser(response.data);
                Cookies.set("access", response.data.token);
                openToast();
                router.push(`${lang}/user`);
            } else {
                console.log("error in verify code");
                console.log(response);
            }
        } catch (error: any) {
            Cookies.remove("access");
            if (error.response && error.response.status === 409) {
                if (error.response.data.error === "wrong code") {
                    setError2(dict.signup.errors.wrong_code);
                } else {
                    setError2(dict.signup.errors.try_again_later);
                }
            } else {
                setError2(dict.signup.errors.unexpected);
            }
        }
    };

    return (
        <div>
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                {dict.signup.title}
            </h2>

            <form
                className="mt-8 w-full flex justify-center items-center mb-2 flex-col grid-cols-2"
                onSubmit={handleSubmit2}
            >
                <div className="col-span-2 flex w-full flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="username2">
                            {dict.signup.username}
                        </Label>
                        <Input
                            id="username2"
                            placeholder="username"
                            type="text"
                            required
                        />
                        {errorUser2 && (
                            <div
                                className={`text-red-500 text-sm z-10 h-5 text-right pb-1 animate-fadeOut`}
                            >
                                {errorUser2}
                            </div>
                        )}
                    </LabelInputContainer>
                </div>

                <LabelInputContainer className="col-span-2 mb-4">
                    <Label htmlFor="phone">{dict.signup.phone}</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder={dict.signup.phone_placeholder}
                        required
                    />
                    {errorphone2 && (
                        <div
                            className={`text-red-500 text-sm z-10 h-5 text-right pb-1 animate-fadeOut`}
                        >
                            {errorphone2}
                        </div>
                    )}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="real_name">{dict.signup.real_name}</Label>
                    <Input id="real_name" type="text" required />
                    {errorreal_name && (
                        <div
                            className={`text-red-500 text-sm z-10 h-5 text-right pb-1 animate-fadeOut`}
                        >
                            {errorreal_name}
                        </div>
                    )}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="bank_number">{dict.signup.bank}</Label>
                    <Input id="bank_number" type="text" required />
                    {errorbank && (
                        <div
                            className={`text-red-500 text-sm z-10 h-5 text-right pb-1 animate-fadeOut`}
                        >
                            {errorbank}
                        </div>
                    )}
                </LabelInputContainer>

                <LabelInputContainer className="col-span-2 mb-4">
                    <Label htmlFor="password2">{dict.signup.password}</Label>
                    <Input
                        id="password2"
                        placeholder="••••••••"
                        type="password"
                        required
                    />
                    {errorp12 && (
                        <div
                            className={`text-red-500 h-5 text-sm z-10 text-right pb-1 animate-fadeOut`}
                        >
                            {errorp12}
                        </div>
                    )}
                </LabelInputContainer>

                <LabelInputContainer className="col-span-2 mb-4">
                    <Label htmlFor="password22">{dict.signup.password2}</Label>
                    <Input
                        id="password22"
                        placeholder="••••••••"
                        type="password"
                    />
                    {errorp22 && (
                        <div
                            className={`text-red-500 h-5 text-sm z-10 text-right pb-1 animate-fadeOut`}
                        >
                            {errorp22}
                        </div>
                    )}
                </LabelInputContainer>

                {/* <LabelInputContainer className="col-span-2 mb-8">
          <Label htmlFor="refer">{dict.signup.referer}</Label>
          <Input id="refer" placeholder={dict.signup.referer_placeholder} type="number" />
        </LabelInputContainer> */}

                <div className="w-full col-span-2 mb-3 flex justify-center items-center">
                    <ReCAPTCHA
                        sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                        onChange={handleCaptchaChange}
                    />
                </div>

                <div className="col-span-2 w-f flex items-center space-x-2 mb-3">
                    <Checkbox id="terms" onCheckedChange={handleTerms} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {dict.terms}
                        <Link href={`/${lang}/terms_and_conditions`}>
                            {lang == "en" ? (
                                <IoNavigate className="inline mx-1" />
                            ) : (
                                <PiNavigationArrowFill className="inline mx-1" />
                            )}
                        </Link>
                    </label>
                </div>

                {error2 && (
                    <div className="text-red-500 text-sm z-10 h-5 text-right pb-1 animate-fadeOut">
                        {error2}
                    </div>
                )}

                <button
                    className="bg-gradient-to-br rounded-full relative group/btn bg-primary transition-all duration-200 hover:scale-95 block w-full text-white h-10 font-medium shadow text-center"
                    type="submit"
                    // disabled={isLoading2 || !isCaptchaVerified}
                >
                    {isLoading2
                        ? `${dict.signup.loading}...`
                        : `${dict.signup.btn}`}
                    <BottomGradient />
                </button>
            </form>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent
                    className={`${openDialog ? "flex flex-col" : "hidden"} items-center justify-center p-3`}
                >
                    <h1>{dict.signup.otp}</h1>
                    <GetCode
                        values={values}
                        setValues={setValues}
                        handleChange={handleChange}
                    />
                    <button
                        className="border border-neutral-400 px-8 py-1 rounded hover:-translate-y-1 duration-200"
                        onClick={handlePhoneVerification}
                    >
                        {dict.signup.submit_otp}
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
