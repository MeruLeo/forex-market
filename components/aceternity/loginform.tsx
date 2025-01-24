"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/aceternity/label";
import { Input } from "@/components/aceternity/input";
import { cn } from "@/lib/utils";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetState } from "../../redux/slices/loginSlice";
import { AppDispatch, RootState } from "../../redux/store";

export function LoginFormDemo({ dict }: { dict: any }) {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success } = useSelector(
        (state: RootState) => state.login,
    );
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const handleCaptchaChange = (value: string | null) => {
        setIsCaptchaVerified(!!value);
    };

    useEffect(() => {
        if (success) {
            alert(dict.login_success);
            dispatch(resetState());
        }
    }, [success, dispatch, dict]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isCaptchaVerified) {
            alert(dict.login.errors.captcha);
            return;
        }

        const phone_number = (
            document.getElementById("phone") as HTMLInputElement
        ).value;
        const password = (
            document.getElementById("password") as HTMLInputElement
        ).value;

        dispatch(loginUser({ username: phone_number, password }));
    };

    return (
        <div>
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                {dict.login.title}
            </h2>

            <form className="mt-8 mb-2" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="phone">{dict.signup.phone}</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder={dict.signup.phone_placeholder}
                        required
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">{dict.signup.password}</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        required
                    />
                </LabelInputContainer>

                <div className="w-full mb-3 flex justify-center items-center">
                    <ReCAPTCHA
                        sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                        onChange={handleCaptchaChange}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm z-10 h-5 text-right pb-1">
                        {error}
                    </div>
                )}

                <button
                    className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow"
                    type="submit"
                    disabled={loading || !isCaptchaVerified}
                >
                    {loading
                        ? `${dict.signup.loading}...`
                        : `${dict.login.btn}`}
                </button>
            </form>
        </div>
    );
}

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
