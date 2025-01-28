import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";
import { toast } from "sonner";

// import { useAppContext } from "@/context";
// import { getUserFromToken } from "./jwt";
async function handle_server_logout() {
    try {
        const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL}/account/logout`,
            {
                refresh: Cookies.get("refresh"),
            },
        );
        if (response.status === 200) {
            Cookies.remove("access");
            Cookies.remove("refresh");

            // setUser(getUserFromToken());
        }
    } catch (err) {
        console.error("Error logging out:", err);
    }
}
export function LogoutUser() {
    // const { user, setUser } = useAppContext();
    handle_server_logout();
}
