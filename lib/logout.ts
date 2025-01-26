import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";

// import { useAppContext } from "@/context";
// import { getUserFromToken } from "./jwt";
function handle_server_logout() {
    const token = Cookies.get("access");
    if (token == null) {
        return;
    }
    //     const response = axiosInstance.post("/user/logout");
    // } catch (error) {
    //     console.log(error);
    // }
}
export function LogoutUser() {
    // const { user, setUser } = useAppContext();
    handle_server_logout();
    sessionStorage.removeItem("token");
    Cookies.remove("token");
    // setUser(getUserFromToken())
}
