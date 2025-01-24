import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditOrderDialog from "./EditOrderDialog"; // فرض می‌کنم این یک کامپوننت جداگانه است
import { toast } from "sonner";
import { useConfirmationDialog } from "../../hooks/useConfirmationDialog";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";

const OrderCard = ({ order, dict, idx }) => {
    const { confirm, ConfirmationDialogComponent } = useConfirmationDialog();

    const [isOpen, setIsOpen] = useState(false);
    const [sendingClose, setSendingClose] = useState(false);
    const onCloseOrderClicked = async (id) => {
        setSendingClose(true);
        try {
            const data = {
                token: Cookies.get("access"),
                id: id,
            };
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/mt5/close_order`,
                data,
            );

            const res = response.data;
            if (!response.ok) {
                toast(res.error);
                setSendingClose(false);
                return;
            }
            setSendingClose(false);
            toast(dict.order.closed);
        } catch (error) {
            setSendingClose(false);
            toast(dict.order.errors.order_error);
        }
    };

    return (
        <div
            key={idx}
            className="w-full relative min-h-24 flex flex-col justify-center items-center border dark:border-sky-700 m-2 px-3 pb-2 rounded-lg"
        >
            {/* Header section - always visible */}
            <div
                className="w-full flex items-center justify-between pt-1"
                onClick={() => setIsOpen(!isOpen)}
            >
                <p className={`space-x-2 w-36 text-sm sm:w-40 font-bold`}>
                    <span
                        className="w-20 inline-block "
                        style={{
                            padding:
                                dict.lang === "en" ? "0 8px 0 0" : "0 0 0 8px",
                            color: "orange",
                        }}
                    >
                        {dict.trade[order.type]}
                    </span>
                </p>

                <p className="space-x-2 w-36 text-sm sm:w-40">
                    <span className="w-14 sm:w-20 inline-block">
                        {dict.trade.lot}
                    </span>
                    <span style={{ margin: "0 0 0 2px" }}>:</span>
                    <span dir="ltr" style={{ margin: "0 0 0 2px" }}>
                        <span className="font-semibold text-2xl">
                            {order.unit}
                        </span>
                        <span
                            className={`text-xs text-gray-500 ${order.leverage == 1 ? "hidden" : ""}`}
                        >
                            X
                        </span>
                        <span
                            className={`text-sm ${order.leverage == 1 ? "hidden" : ""}`}
                        >
                            {order.leverage}
                        </span>
                    </span>
                </p>

                <p className="text-lg font-bold">
                    {order.symbol_name[dict.lang] || "No Name"}
                </p>
                <p className={`space-x-2 w-36 text-sm sm:w-40 font-bold`}>
                    <span className="w-20 inline-block ">{order.price}</span>
                </p>
            </div>

            {/* Detailed section - only visible if card is open */}
            {isOpen && (
                <>
                    <div className="w-full flex items-center justify-between mt-2">
                        <div className="mx-2">
                            <IconButton
                                color="inherit"
                                size="small"
                                disabled={sendingClose}
                                onClick={() => {
                                    confirm(
                                        dict,
                                        dict.confirmation.close_order,
                                        onCloseOrderClicked,
                                        order.id,
                                    );
                                }}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </div>
                        <div className="mx-1">
                            <EditOrderDialog
                                order_type={order.type}
                                order_id={order.id}
                                order_price={order.price}
                                order_tp={order.tp}
                                order_sl={order.sl}
                                order_leverage={order.leverage}
                                order_unit={order.unit}
                                dict={dict}
                            />
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.order.price}
                            </span>
                            <span>:</span>
                            <span>{order.price}</span>
                        </p>
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.lot}
                            </span>
                            <span>:</span>
                            <span dir="ltr">
                                <span className="font-semibold">
                                    {order.unit}
                                </span>
                                {/* <span className='text-xs text-gray-500'>X</span> */}
                                {/* <span className='text-sm'>{order.leverage}</span> */}
                            </span>
                        </p>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.sl}
                            </span>
                            <span>:</span>
                            <span>{order.sl}</span>
                        </p>
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.tp}
                            </span>
                            <span>:</span>
                            <span>{order.tp}</span>
                        </p>
                    </div>
                </>
            )}

            {ConfirmationDialogComponent}
        </div>
    );
};

export default OrderCard;
