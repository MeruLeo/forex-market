import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditPositionDialog from "./EditPositionDialog";
import { toast } from "sonner";
import { useConfirmationDialog } from "../../hooks/useCloseTradeDialog";
import Cookies from "js-cookie";

// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-UK', {
//       year: 'numeric',
//       day: '2-digit',
//       month: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false,
//     //   timeZoneName: 'short',
//     }).format(date);
//   };

const formatDate = (dateString) => {
    if (dateString === null) {
        return "-";
    }
    const date = new Date(dateString);

    const pad = (number) => (number < 10 ? "0" + number : number);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}/${month}/${day} ${hour}:${minute}:${seconds}`;

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        //   timeZoneName: 'short',
    }).format(date);
};

const TradeCard = ({ trade, dict, idx }) => {
    const { confirm, ConfirmationDialogComponent } = useConfirmationDialog();
    const [isOpen, setIsOpen] = useState(false);
    const [sendingClose, setSendingClose] = useState(false);

    const onCloseTradeClicked = async (ticket, symbol_id, valume) => {
        setSendingClose(true);

        try {
            const data = {
                token: Cookies.get("access"),
                symbol: symbol_id,
                valume: valume,
                ticket: ticket,
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/mt5/close_partial`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                },
            );

            const res = await response.json();
            if (!response.ok) {
                toast(res.error);
                setSendingClose(false);
                return;
            }
            setSendingClose(false);
            toast(dict.trade.closed);
        } catch (error) {
            setSendingClose(false);
            toast(dict.trade.errors.close_error);
        }
    };
    return (
        <div
            key={idx}
            className="w-full relative min-h-24 flex flex-col justify-center items-center border dark:border-sky-700 m-2 px-3 pb-2 rounded-lg sm:mx-0"
        >
            {/* Header section - always visible */}
            <div
                className="w-full md:max-w-full md:pr-0 flex items-center justify-between pt-1"
                onClick={() => setIsOpen(!isOpen)}
            >
                <p
                    className={`text-base w-14 sm:px-0 font-bold`}
                    style={{
                        padding: dict.lang === "en" ? "0 8px 0 0" : "0 0 0 8px",
                        color: trade.type === "buy" ? "#458bd8" : "#ee605e",
                    }}
                >
                    {dict.trade[trade.type]}
                </p>
                <p className="space-x-2 w-36 text-sm sm:w-40">
                    <span className="w-14 sm:w-20 inline-block">
                        {dict.trade.lot}
                    </span>
                    <span style={{ margin: "0 0 0 2px" }}>:</span>
                    <span dir="ltr" style={{ margin: "0 0 0 2px" }}>
                        <span className="font-semibold text-2xl">
                            {trade.unit}
                        </span>
                        <span
                            className={`text-xs text-gray-500 ${trade.leverage == 1 ? "hidden" : ""}`}
                        >
                            X
                        </span>
                        <span
                            className={`text-sm ${trade.leverage == 1 ? "hidden" : ""}`}
                        >
                            {trade.leverage}
                        </span>
                    </span>
                </p>

                <p className="text-lg font-bold px-2 sm:px-0">
                    {trade.symbol_name[dict.lang] || "No Name"}
                </p>
                <p
                    className="sm:flex text-sm w-14 px-0 font-bold"
                    style={{ color: trade.profit > 0 ? "#458bd8" : "#ee605e" }}
                >
                    {trade.profit.toFixed(2)}
                </p>
            </div>

            {/* Detailed section - only visible if card is open */}
            {isOpen && (
                <>
                    <div className="w-full flex items-center justify-between mt-2">
                        <div className="mx-2 sm:mx-0">
                            <IconButton
                                color="inherit"
                                size="small"
                                disabled={sendingClose}
                                onClick={() => {
                                    confirm(
                                        dict,
                                        dict.confirmation.close_trade,
                                        onCloseTradeClicked,
                                        1,
                                        trade.unit,
                                        trade.ticket,
                                        trade.symbol_id,
                                    );
                                }}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <p
                                className=" sm:flex text-sm w-14 px-0 "
                                style={{ direction: "ltr" }}
                            >
                                {dict.lang == "en"
                                    ? formatDate(trade.time)
                                    : trade.time_jalali}
                            </p>
                        </div>
                        <div className="mx-1 sm:mx-0">
                            <EditPositionDialog
                                order_type={trade.type}
                                current_price={trade.current}
                                order_id={trade.id}
                                order_ticket={trade.ticket}
                                order_tp={trade.tp}
                                order_sl={trade.sl}
                                dict={dict}
                            />
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.current}
                            </span>
                            <span>:</span>
                            <span className="mt-1">{trade.current}</span>
                        </p>
                        <p className=" sm:flex text-sm w-14 px-0 ">
                            #{trade.ticket}
                        </p>
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.lot}
                            </span>
                            <span>:</span>
                            <span dir="ltr">
                                <span className="font-bold text-[320px]">
                                    {trade.unit}
                                </span>
                                {/* <span className='text-xs text-gray-500'>X</span> */}
                                {/* <span className='text-sm'>{trade.leverage}</span> */}
                            </span>
                        </p>
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.entry}
                            </span>
                            <span>:</span>
                            <span>{trade.entry}</span>
                        </p>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.sl}
                            </span>
                            <span>:</span>
                            <span>{trade.sl}</span>
                        </p>
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.tp}
                            </span>
                            <span>:</span>
                            <span>{trade.tp}</span>
                        </p>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.swap}
                            </span>
                            <span>:</span>
                            <span>{trade.swap.toFixed(2)}</span>
                        </p>
                        <p className="space-x-2 w-36 text-sm sm:w-40">
                            <span className="w-14 sm:w-20 inline-block">
                                {dict.trade.commission}
                            </span>
                            <span>:</span>
                            <span>{trade.commission.toFixed(2)}</span>
                        </p>
                    </div>
                </>
            )}

            {ConfirmationDialogComponent}
        </div>
    );
};

export default TradeCard;
