"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/aceternity/label";
import { Input } from "@/components/aceternity/input";
import { cn } from "@/lib/utils";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetState } from "../../redux/slices/loginSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { useRouter } from "next/navigation";

export function LoginFormDemo({ dict, lang }: { dict: any; lang: string }) {
    const router = useRouter();

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
            router.push(`${lang}/user`);
        }
    }, [success, dispatch, dict, router]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // if (!isCaptchaVerified) {
        //     alert(dict.login.errors.captcha);
        //     return;
        // }

        const phone_number = (
            document.getElementById("phone") as HTMLInputElement
        ).value;
        const password = (
            document.getElementById("password") as HTMLInputElement
        ).value;

        try {
            dispatch(loginUser({ username: phone_number, password }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                {dict.login.title}
            </h2>

            <form
                className="mt-8 mb-2 flex flex-col justify-center items-center"
                onSubmit={handleSubmit}
            >
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
                    <div className="bg-red-500 my-4 text-center text-white w-fit p-4 rounded-full text-sm z-10 h-5 flex justify-center items-center">
                        {error}
                    </div>
                )}

                <button
                    className="bg-gradient-to-br rounded-full relative group/btn bg-primary transition-all duration-200 hover:scale-95 block w-full text-white h-10 font-medium shadow"
                    type="submit"
                    // disabled={loading || !isCaptchaVerified}
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
