import Cookies from "js-cookie";

// import { useAppContext } from "@/context";
// import { getUserFromToken } from "./jwt";
function handle_server_logout() {
    const token = Cookies.get("access");
    if (token == null) {
        return;
    }
    const data = {
        token,
    };
    try {
        const response = fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/logout`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Source": "nextjs",
                },
                body: JSON.stringify(data),
            },
        ).then((response) => {
            console.log(response);
        });
    } catch (error) {
        console.log(error);
    }
}
export function LogoutUser() {
    // const { user, setUser } = useAppContext();
    handle_server_logout();
    sessionStorage.removeItem("token");
    Cookies.remove("token");
    // setUser(getUserFromToken())
}
