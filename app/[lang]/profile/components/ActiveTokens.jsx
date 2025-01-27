import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MdEditDocument } from "react-icons/md";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useAppContext } from "@/context";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TokenIcon from "@mui/icons-material/Token";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export default function ActiveTokens({ dict }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const [tokens, setTokens] = useState([]);
    const handleClickOpen = () => {
        setOpen(true);
        fetch_tokens();
    };
    const handleClose = (event, reason) => {
        setOpen(false);
    };
    const handleActionClick = async (id) => {
        try {
            // const token = Cookies.get("access");
            const data = {
                monitor: id,
            };
            console.log("----------------------", data);
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL2}/revoke-token`,
                data,
                {
                    headers: {
                        "X-Source": "nextjs",
                    },
                },
            );
        } catch (error) {
            console.log(error);
            toast(error.message);
        }
    };
    // const fetch_tokens = async () => {
    //     const token = Cookies.get("access");
    //     setIsLoading(true);
    //     await verifyToken(token);
    //     try {
    //         const response = await axiosInstance.post(
    //             `${process.env.NEXT_PUBLIC_API_URL2}/get-user-tokens`,
    //             {
    //                 headers: {
    //                     "X-Source": "nextjs",
    //                 },
    //             },
    //         );

    //         const data = response.data;
    //         if (data.status === 200) {
    //             console.log(data);
    //             setTokens(data);
    //             setIsLoading(false);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast(error);
    //         setIsLoading(false);
    //     }
    // };

    // async function verifyToken(token) {
    //     if (token == null) {
    //         toast("No token found, redirecting to login.");
    //         window.location.href = "/";
    //         return;
    //     }
    //     try {
    //         const response = await axiosInstance.post(
    //             `${process.env.NEXT_PUBLIC_API_URL}/account/verify_token`,
    //         );

    //         if (response.status !== 202) {
    //             toast("Invalid token, redirecting to login.");
    //             Cookies.remove("access"); // Optionally clear token
    //             window.location.href = "/";
    //         }
    //     } catch (error) {
    //         console.error("Error verifying token:", error);
    //         toast("Error verifying token, redirecting to login.");
    //         Cookies.remove("access"); // Optionally clear token
    //         window.location.href = "/";
    //     }
    // }

    return (
        <React.Fragment>
            <IconButton color="inherit" size="medium" onClick={handleClickOpen}>
                <TokenIcon />
            </IconButton>
            <BootstrapDialog
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: theme === "dark" ? "#263238" : "white",
                        color: theme === "dark" ? "#E0E0E0" : "white",
                        fontFamily: "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                        dir: dict.lang == "en" ? "ltr" : "ltr",
                    },
                }}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        my: 1,
                        py: 0,
                        fontFamily: "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                        bgcolor: theme === "dark" ? "#263238" : "white",
                        color: theme === "dark" ? "#E0E0E0" : "black",
                    }}
                    id="customized-dialog-title"
                >
                    Active Sessions
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme === "dark" ? "#E0E0E0" : "grey",
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent
                    sx={{
                        fontFamily: "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                        bgcolor: theme === "dark" ? "#263238" : "white",
                        color: theme === "dark" ? "#E0E0E0" : "white",
                    }}
                    dividers
                >
                    <Box
                        sx={{
                            "& > :not(style)": { m: 1, width: "90%" },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily:
                                "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                            bgcolor: theme === "dark" ? "#263238" : "white",
                            color: theme === "dark" ? "#E0E0E0" : "white",
                        }}
                    >
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <table className="block w-full overflow-scroll">
                                <thead>
                                    <tr>
                                        <th className="px-3">Agent</th>
                                        <th className="px-3">IP</th>
                                        <th className="px-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tokens.map((token) => (
                                        <tr
                                            key={token.id}
                                            className="dark:bg-zinc-800 dark:text-white text-black"
                                            style={{
                                                backgroundColor: token.current
                                                    ? "green"
                                                    : "",
                                            }}
                                        >
                                            <td>{token.agent}</td>
                                            <td>{token.ip}</td>
                                            <td>
                                                <IconButton
                                                    aria-label="revoke"
                                                    onClick={() =>
                                                        handleActionClick(
                                                            token.id,
                                                        )
                                                    }
                                                    sx={{
                                                        color: "red",
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}
