"use client";
import { getUserFromToken, verify_token } from "@/lib/jwt";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";

const AppContext = createContext<any>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
    let [user, setUser] = useState(getUserFromToken());
    let [refreshFailCount, setRefreshFailCount] = useState(0);
    const router = useRouter();
    useEffect(() => {
        const checkToken = async () => {
            const token = Cookies.get("access");

            // If no token, redirect to home
            if (!token) {
                if (
                    window.location.href.endsWith("en") ||
                    window.location.href.endsWith("fa") ||
                    window.location.href.endsWith("kur")
                ) {
                } else {
                    toast("No token found, redirecting to login.");
                    router.push("/");
                    window.location.href = "/";
                }
                return;
            }

            try {
                const response = await verifyToken(token);

                // If response status is not 202, redirect to home
                if (response.status !== 202) {
                    if (
                        window.location.href.endsWith("en") ||
                        window.location.href.endsWith("fa") ||
                        window.location.href.endsWith("kur")
                    ) {
                    } else {
                        toast("Invalid token, redirecting to login.");
                        Cookies.remove("access");
                        router.push("/");
                        window.location.href = "/";
                    }
                    return;
                }
            } catch (error) {
                if (
                    window.location.href.endsWith("en") ||
                    window.location.href.endsWith("fa") ||
                    window.location.href.endsWith("kur")
                ) {
                } else {
                    console.error("Error verifying token:", error);
                    toast("Error verifying token, redirecting to login.");
                    Cookies.remove("access");
                    router.push("/");
                    window.location.href = "/";
                }
            }
        };

        checkToken();
        const interval = setInterval(
            async () => {
                const token = Cookies.get("access");

                if (!token) {
                    return;
                }
                try {
                    const _ = await refreshToken(token);
                } catch (error) {
                    console.error("Error refreshing token");
                }
            },
            15 * 60 * 1000,
        ); // هر 15 دقیقه

        return () => clearInterval(interval);
    }, []);

    const verifyToken = async (token: string) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/account/verify_token`,
            );
            return response;
        } catch (error) {
            console.error("Error verifying token:", error);
            throw error;
        }
    };

    const refreshToken = async (token: string) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/account/renew`,
            );

            if (response.status === 200) {
                const newToken = response.data.token;
                Cookies.set("access", newToken);
            } else {
                const errorData = response.data;
                console.error("Error refreshing token:", errorData);
                throw new Error(
                    `Error ${response.status}: ${errorData.message || "Unknown error"}`,
                );
            }
        } catch (error: any) {
            console.error("Failed to refresh token:", error);
            setRefreshFailCount((prevCount: number) => {
                const newCount = prevCount + 1;
                if (newCount >= 5) {
                    Cookies.remove("access");
                    toast("Session expired, please login again");
                    return 0;
                }
                return newCount;
            });
        }
    };

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
