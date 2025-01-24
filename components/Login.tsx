"use client";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { loginUser, resetState } from "@/redux/slices/loginSlice";

const LoginDialog = ({
    isOpen,
    onclose,
}: {
    isOpen: boolean;
    onclose: any;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { error, success, loading } = useSelector(
        (state: RootState) => state.login,
    );

    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const handleClose = () => {
        onclose();
        dispatch(resetState());
    };

    const openToast = () => {
        toast("Welcome Back");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = (
            document.getElementById("username") as HTMLInputElement
        ).value;
        const password = (
            document.getElementById("password") as HTMLInputElement
        ).value;

        dispatch(loginUser({ username, password }));
    };

    const handleCaptchaChange = (value: any) => {
        setIsCaptchaVerified(!!value);
    };

    useEffect(() => {
        if (success) {
            // Cookies.set("access"); // Set actual token if needed
            openToast();
            onclose();
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error, onclose]);

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className=" overflow-hidden w-[90vw] -translate-x-10  sm:max-w-96 px-0 border-0 opacity-100">
                    <DialogHeader className="text-left px-6 sm:px-12 z-10">
                        <DialogTitle className="heading text-2xl font-semibold">
                            Log in
                        </DialogTitle>
                        <p className="">Welcome back!</p>
                    </DialogHeader>

                    <div className="flex flex-col justify-center items-center gap-1 w-full h-full">
                        <form
                            className="my-8 w-full px-6 sm:px-12 pt-2"
                            onSubmit={handleSubmit}
                        >
                            {error && (
                                <div className="text-red-500 text-sm z-10 h-5 text-left pb-1 animate-fadeOut">
                                    {error}
                                </div>
                            )}
                            <LabelInputContainer className="my-2">
                                <label
                                    htmlFor="username"
                                    className="text-sm text-black dark:text-white font-semibold z-10"
                                >
                                    Username / Email
                                </label>
                                <CustomInput id="username" type="text" />
                            </LabelInputContainer>
                            <LabelInputContainer className="my-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm text-black dark:text-white font-semibold z-10"
                                >
                                    Password
                                </label>
                                <CustomInput
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </LabelInputContainer>
                            <div className="w-full mb-3 flex justify-center items-center">
                                <ReCAPTCHA
                                    sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                                    onChange={handleCaptchaChange}
                                />
                            </div>

                            <button
                                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900
                             dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white
                              rounded-md h-10 mt-10
                              font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] 
                              dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                                type="submit"
                                disabled={loading || !isCaptchaVerified}
                            >
                                {loading ? "Loading..." : "Log in →"}
                            </button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoginDialog;

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

const CustomInput = ({
    id,
    type,
    placeholder,
    className,
}: {
    id?: string;
    type?: string;
    placeholder?: string;
    className?: string;
}) => {
    return (
        <input
            className={cn(
                "border border-neutral-400 dark:border-neutral-950 bg-neutral-100 dark:bg-neutral-800 rounded-md p-1 pl-3 z-10",
                className,
            )}
            id={id}
            type={type}
            placeholder={placeholder}
            required
        />
    );
};
