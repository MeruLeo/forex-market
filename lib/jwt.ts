import { jwtDecode } from "jwt-decode";
import { LogoutUser } from "./logout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";

interface DecodedToken {
    exp: number; // Expiration time in seconds
    [key: string]: any; // Additional JWT claims
}
function isTokenExpired(exp: number): boolean {
    const expiryTimeInMs = exp * 1000; // Convert seconds to milliseconds
    const currentTimeInMs = Date.now();
    return currentTimeInMs > expiryTimeInMs; // Expired if current time is greater
}

export async function verify_token() {
    const token = Cookies.get("token");
    const data = {
        token,
    };
    try {
        const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL}/account/verify_token`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Source": "nextjs",
                },
            },
        );

        if (response.status !== 202) {
            Cookies.remove("access");
            console.error("No authentication token found!");
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export function getUserFromToken(): DecodedToken | null {
    if (typeof window === "undefined") return null; // Ensure this runs in a browser

    try {
        const token = Cookies.get("token"); // Retrieve the token
        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token); // Decode the token
                if (!isTokenExpired(decodedToken.exp)) {
                    return decodedToken;
                } else {
                    LogoutUser(); // Handle logout on token expiration
                    return null;
                }
            } catch (error) {
                console.error("Token decoding failed:", error);
                LogoutUser();
                return null;
            }
        }
        LogoutUser();
        return null; // No token found
    } catch {
        LogoutUser();
        return null; // No token found
    }
}

export function decodeToken(token: string): DecodedToken | null {
    try {
        const decodedToken = jwtDecode<DecodedToken>(token); // Decode the token
        if (!isTokenExpired(decodedToken.exp)) {
            return decodedToken;
        } else {
            LogoutUser(); // Handle logout on token expiration
            return null;
        }
    } catch (error) {
        console.error("Token decoding failed:", error);
        LogoutUser();
        return null;
    }
}
