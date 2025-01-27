import { useState } from "react";
import { toast } from "sonner";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import { useTheme } from "next-themes";
import Divider from "@mui/material/Divider";
import { LogoutUser } from "@/lib/logout";
import IconButton from "@mui/material/IconButton";
import KeyIcon from "@mui/icons-material/Key";
import axiosInstance from "@/utils/axiosInstance";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const ChangePasswordModal = ({ dict }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { theme } = useTheme();

    const toggleModal = () => {
        setIsOpen(!isOpen);
        setError(""); // Reset error when opening modal
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL2}/change-password`,
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                },
            );

            if (response.status === 200) {
                toast("Password changed successfully. You will be logged out.");
                LogoutUser();
                window.location.href = "/";
                // toggleModal(); // Close modal
            } else {
                setError(response.data.message || "Failed to change password.");
                toast(response.data.message || "Failed to change password.");
            }
        } catch (error) {
            toast("An error occurred while changing password.");
        }
    };

    return (
        <>
            <IconButton color="inherit" size="medium" onClick={toggleModal}>
                <KeyIcon />
            </IconButton>
            {isOpen && (
                <BootstrapDialog
                    sx={{
                        "& .MuiPaper-root": {
                            backgroundColor:
                                theme === "dark" ? "#263238" : "white",
                            color: theme === "dark" ? "#E0E0E0" : "white",
                            fontFamily:
                                "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                            height: "auto",
                            direction: dict.lang === "en" ? "ltr" : "rtl",
                        },
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle
                        sx={{
                            m: 0,
                            p: 2,
                            my: 1,
                            py: 0,
                            fontFamily:
                                "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                            bgcolor: theme === "dark" ? "#263238" : "white",
                            color: theme === "dark" ? "#E0E0E0" : "black",
                            minWidth: "300px",
                        }}
                        id="customized-dialog-title"
                    >
                        {dict.profile.password.title}
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            bgcolor: theme === "dark" ? "#263238" : "white",
                            color: theme === "dark" ? "#E0E0E0" : "white",
                        }}
                        dividers
                    >
                        <Box
                            sx={{
                                "& > :not(style)": { m: 1, width: "100%" },
                                display: "block",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily:
                                    "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                                bgcolor: theme === "dark" ? "#263238" : "white",
                                color: theme === "dark" ? "#E0E0E0" : "white",
                            }}
                        >
                            <div className="flex gap-2 items-center justify-between">
                                <div
                                    className="w-1/2 font-light text-[12px] sm:text-sm lg:text-base text-nowrap"
                                    style={{
                                        color:
                                            theme === "dark"
                                                ? "#E0E0E0"
                                                : "black",
                                    }}
                                >
                                    {dict.profile.password.old}:{" "}
                                </div>
                                <div className="w-full">
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        id="old-password"
                                        onChange={(e) =>
                                            setOldPassword(e.target.value)
                                        }
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                                        style={{
                                            overflowY: "hidden",
                                            minHeight: "38px",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 items-center justify-between">
                                <div
                                    className="w-1/2 font-light text-[12px] sm:text-sm lg:text-base text-nowrap"
                                    style={{
                                        color:
                                            theme === "dark"
                                                ? "#E0E0E0"
                                                : "black",
                                    }}
                                >
                                    {dict.profile.password.new}
                                </div>
                                <div className="w-full">
                                    <input
                                        id="new-password"
                                        type="password"
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        value={newPassword}
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                                        style={{
                                            overflowY: "hidden",
                                            minHeight: "38px",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 items-center justify-between">
                                <div
                                    className="w-1/2 font-light text-[12px] sm:text-sm lg:text-base text-nowrap"
                                    style={{
                                        color:
                                            theme === "dark"
                                                ? "#E0E0E0"
                                                : "black",
                                    }}
                                >
                                    {dict.profile.password.new}
                                </div>
                                <div className="w-full">
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                        className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                                        style={{
                                            overflowY: "hidden",
                                            minHeight: "38px",
                                        }}
                                    />
                                </div>
                            </div>

                            <Divider />

                            <Button
                                sx={{
                                    textTransform: "none",
                                    my: 1,
                                    fontFamily:
                                        "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                                    color:
                                        theme === "dark" ? "#E0E0E0" : "black",
                                }}
                                fullWidth
                                variant="contained"
                                color="error"
                                size="large"
                                onClick={handleChangePassword}
                            >
                                {dict.profile.password.submit}
                            </Button>
                            <Button
                                className="dark:text-white text-black"
                                sx={{
                                    textTransform: "none",
                                    my: 1,
                                    fontFamily:
                                        "__Rubik_6eb173, __Rubik_Fallback_6eb173",
                                    color:
                                        theme === "dark" ? "#E0E0E0" : "black",
                                }}
                                fullWidth
                                variant="contained"
                                color="green"
                                size="large"
                                onClick={toggleModal}
                            >
                                {dict.profile.password.cancel}
                            </Button>
                        </Box>
                    </DialogContent>
                </BootstrapDialog>
            )}
        </>
    );
};

export default ChangePasswordModal;
