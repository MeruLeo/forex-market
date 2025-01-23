"use client";
import { getUserFromToken, verify_token } from "@/lib/jwt";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
                        Cookies.remove("access"); // Optionally clear token
                        router.push("/");
                        window.location.href = "/";
                    }
                    return;
                }

                // Optionally handle valid token response here
            } catch (error) {
                if (
                    window.location.href.endsWith("en") ||
                    window.location.href.endsWith("fa") ||
                    window.location.href.endsWith("kur")
                ) {
                } else {
                    console.error("Error verifying token:", error);
                    toast("Error verifying token, redirecting to login.");
                    Cookies.remove("access"); // Optionally clear token
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
        const data = {
            token: token,
        };
        return await fetch(
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
    };
    const refreshToken = async (token: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/account/renew`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: token }),
                },
            );
            if (response.ok) {
                token = await response.json();
                Cookies.set("access", token);
            }
            if (!response.ok) {
                const errorData = await response.json();
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
                    return 0; // Reset count after removing token
                }
                return newCount;
            });
            // localStorage.removeItem('token');
            // toast('session expired, login again');
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
