"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/shadcn/drawer";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table";
import ExportLis from "@/components/user-cards/ExpertList";
import * as XLSX from "xlsx";
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Calendar from "@/components/user-cards/calendar";
import DatePicker, { DateObject, Value } from "react-multi-date-picker";
import Cookies from "js-cookie";

interface Trade {
    commission?: number;
    swap?: number;
    profit?: number;
    [key: string]: any;
}

function roundToTwoDecimals(trades: Trade[]): Trade[] {
    return trades.map((trade) => ({
        ...trade,
        commission:
            trade.commission !== undefined
                ? parseFloat(trade.commission.toFixed(2))
                : trade.commission,
        swap:
            trade.swap !== undefined
                ? parseFloat(trade.swap.toFixed(2))
                : trade.swap,
        profit:
            trade.profit !== undefined
                ? parseFloat(trade.profit.toFixed(2))
                : trade.profit,
    }));
}

const ClientHistory = ({
    dict,
    len_trades,
    len_pending,
    balance,
}: {
    dict: any;
    len_trades: number;
    len_pending: number;
    balance: number;
}) => {
    const [date1, setDate1] = useState<string>("");
    const [date2, setDate2] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [accountType, setAccountType] = useState<string>("Hedging");
    const [trades, setTrades] = useState([]);

    const handleDateUpdate = (
        newDate1: string,
        newDate2: string,
        newSearch: string,
    ) => {
        setDate1(newDate1);
        setDate2(newDate2);
        setSearch(newSearch);
    };
    const fetchConf = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL2}/get-site-config`,
                { headers: { "Cache-Control": "no-cache" } },
            );

            if (response.status !== 200) {
                return;
            }

            setAccountType(response.data.account_type);
            console.log(response.data.account_type);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchConf();
    }, []);

    // const tradeHeaders = [
    //     "num", "symbol", "id", "type", "state", "entry", "exit", "profit",'swap','commission', "unit", 'leverage', "tp", "sl", "time", "closeTime", "closed_by"
    // ]

    const tradeHeaders = [
        "num",
        "symbol",
        "id",
        "type",
        "state",
        "entry",
        "exit",
        "profit",
        "swap",
        "commission",
        "unit",
        "leverage",
        "tp",
        "sl",
        "time",
        "closeTime",
        ...(accountType.toLowerCase() === "netting" ? ["closed_by"] : []),
    ];

    const [deals, setDeals] = useState([]);
    const dealHeaders = [
        "num",
        "symbol",
        "ticket",
        "trade_id",
        "type",
        "price",
        "profit",
        "commission",
        "unit",
        "time",
    ];

    const [orders, setOrders] = useState([]);

    const orderHeaders = [
        "num",
        "symbol",
        "id",
        "type",
        "price",
        "unit",
        "leverage",
        "result",
        "time",
    ];
    const [transactions, setTransactions] = useState([]);
    const transactionsHeaders = [
        "num",
        "type",
        "amount_dollar",
        "transaction_id",
        "time",
    ];

    useEffect(() => {
        const get_trades = async () => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/mt5/user_trades`,
                    {
                        token: Cookies.get("access"),
                        from_date: date1,
                        to_date: date2,
                        search: search,
                    },
                );

                if (response.status !== 200) {
                    toast(response.data.error);
                    return;
                }

                const res = roundToTwoDecimals(response.data);
                setTrades(res);
            } catch (error) {
                toast(dict.history.errors.trade_error);
            }
        };

        const get_deals = async () => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/mt5/user_deals`,
                    {
                        token: Cookies.get("access"),
                        from_date: date1,
                        to_date: date2,
                        search: search,
                    },
                );

                if (response.status !== 200) {
                    toast(response.data.error);
                    return;
                }

                const res = roundToTwoDecimals(response.data);
                setDeals(res);
            } catch (error) {
                toast(dict.history.errors.deal_error);
            }
        };

        const get_orders = async () => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/mt5/user_orders`,
                    {
                        token: Cookies.get("access"),
                        from_date: date1,
                        to_date: date2,
                        search: search,
                    },
                );

                if (response.status !== 200) {
                    toast(response.data.error);
                    return;
                }

                setOrders(response.data);
            } catch (error) {
                toast(dict.history.errors.order_error);
            }
        };

        const get_transactions = async () => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/zarinpal/transactions`,
                    {
                        token: Cookies.get("access"),
                        from_date: date1,
                        to_date: date2,
                        search: search,
                    },
                );

                if (response.status !== 200) {
                    toast(response.data.error);
                    return;
                }

                setTransactions(response.data);
            } catch (error) {
                toast(dict.history.errors.order_error);
            }
        };

        const token = Cookies.get("access");
        if (!token) {
            toast("No token found, redirecting to login.");
            window.location.href = "/";
            return;
        } else {
            get_trades();
            get_deals();
            get_orders();
            get_transactions();
        }
    }, [len_trades, len_pending, balance, date1, date2, search]);
    const [target, setTarget] = useState("trade");
    const [target_len, setTarget_len] = useState(trades.length);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const itemsPerPageOptions = [5, 10, 20, 50, 100];

    const handlePageChange = (direction: string) => {
        if (direction === "next" && currentPage * itemsPerPage < target_len) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleItemsPerPageChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };
    const getTotalPages = (totalItems: number) => {
        return Math.ceil(totalItems / itemsPerPage);
    };
    const tabCahnger = (e: string) => {
        if (e == "trade") setTarget("trade");
        if (e == "deal") setTarget("deal");
        if (e == "order") setTarget("order");
        if (e == "transaction") setTarget("transaction");
    };
    useEffect(() => {
        if (target == "trade") setTarget_len(trades.length);
        if (target == "deal") setTarget_len(deals.length);
        if (target == "order") setTarget_len(orders.length);
        if (target == "transaction") setTarget_len(transactions.length);
        setCurrentPage(1);
    }, [target, trades, deals, orders, transactions]);

    const getCurrentItems = (items: any[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    // console.log(trades)
    const handleExport = () => {
        if (target == "order") {
            const new_list = ExportLis(orders);
            const worksheet = XLSX.utils.json_to_sheet(new_list);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${target}.xlsx`);
        }
        if (target == "deal") {
            const new_list = ExportLis(deals);
            const worksheet = XLSX.utils.json_to_sheet(new_list);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${target}.xlsx`);
        }
        if (target == "trade") {
            const new_list = ExportLis(trades);
            const worksheet = XLSX.utils.json_to_sheet(new_list);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${target}.xlsx`);
        }

        if (target == "transaction") {
            const worksheet = XLSX.utils.json_to_sheet(transactions);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${target}.xlsx`);
        }
    };

    return (
        <div className="w-full h-full sm:h-full overflow-y-scroll overflow-x-hidden">
            <Card className="w-full h-full">
                <CardHeader className="flex items-center justify-center py-2">
                    <div className="w-full flex items-center justify-between mx-3 mt-3">
                        <Drawer>
                            <IconButton
                                color="inherit"
                                size="small"
                                onClick={handleExport}
                            >
                                <SaveAltIcon />
                            </IconButton>

                            <Calendar
                                dict={dict}
                                onUpdateDates={handleDateUpdate}
                            />

                            <DrawerContent className="sm:w-[50vw] mx-auto">
                                <DrawerHeader className="flex items-center justify-between">
                                    <DrawerTitle></DrawerTitle>
                                </DrawerHeader>
                                <div className="w-full flex items-center justify-center mb-3">
                                    <p>{dict.history.title}</p>
                                </div>
                                <div className="mb-10 mx-6"></div>
                                <div className="w-full flex items-center justify-center mb-6">
                                    <DatePickerWithRange />
                                </div>
                            </DrawerContent>
                        </Drawer>
                        <p className="font-semibold text-lg">
                            {dict.history.header}
                        </p>
                        <p className="w-6 hidden sm:flex"></p>
                    </div>
                </CardHeader>
                <CardContent className="w-full px-2">
                    <Tabs defaultValue="trade" className="w-full">
                        <TabsList className="w-full flex items-center justify-center">
                            <TabsTrigger
                                className="w-32"
                                onClick={() => tabCahnger("trade")}
                                value="trade"
                            >
                                {dict.history.trade}
                            </TabsTrigger>
                            {/* <TabsTrigger className='w-32' onClick={() => tabCahnger('deal')} value="deal">{dict.history.deal}</TabsTrigger> */}
                            <TabsTrigger
                                className="w-32"
                                onClick={() => tabCahnger("order")}
                                value="order"
                            >
                                {dict.history.order}
                            </TabsTrigger>
                            <TabsTrigger
                                className="w-32"
                                onClick={() => tabCahnger("transaction")}
                                value="transaction"
                            >
                                {dict.history.transaction}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="trade">
                            <div className="h-[62vh] sm:h-[270px] overflow-scroll">
                                {trades.length ? (
                                    <HistoryTable
                                        items={getCurrentItems(trades)}
                                        headers={tradeHeaders}
                                        dict={dict}
                                        isOrder={false}
                                    />
                                ) : (
                                    <Empty dict={dict} />
                                )}
                            </div>
                        </TabsContent>
                        {/* <TabsContent value="deal">
                            <div className='h-[62vh] sm:h-[270px] overflow-scroll'>
                                {deals.length ? (
                                    <HistoryTable items={getCurrentItems(deals)} headers={dealHeaders} dict={dict} isOrder={false} />
                                ) :
                                    (<Empty dict={dict} />)}
                            </div>
                        </TabsContent> */}
                        <TabsContent value="order">
                            <div className="h-[62vh] sm:h-[270px] overflow-scroll">
                                {orders.length ? (
                                    <HistoryTable
                                        items={getCurrentItems(orders)}
                                        headers={orderHeaders}
                                        dict={dict}
                                        isOrder={true}
                                    />
                                ) : (
                                    <Empty dict={dict} />
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="transaction">
                            <div className="h-[62vh] sm:h-[270px] overflow-scroll">
                                {transactions.length ? (
                                    <HistoryTable
                                        items={getCurrentItems(transactions)}
                                        headers={transactionsHeaders}
                                        dict={dict}
                                        isOrder={false}
                                    />
                                ) : (
                                    <Empty dict={dict} />
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center mt-4">
                            <button
                                className="px-3 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-300 to-blue-500   hover:from-blue-600 hover:to-blue-800 hover:scale-105 disabled:bg-gray-400 disabled:text-gray-800 disabled:cursor-not-allowed"
                                onClick={() => handlePageChange("prev")}
                            >
                                {dict.history.prev}
                            </button>
                            <span className="text-m   text-gray-800  px-1 py-1 ">
                                {dict.history.page}
                            </span>
                            <span className="text-m  text-gray-800  px-1 py-1 ">
                                {currentPage}
                            </span>
                            <span className="text-m   text-gray-800  px-1 py-1 ">
                                {dict.history.from}
                            </span>
                            <span className="text-m  text-gray-800  px-1 py-1 ">
                                {getTotalPages(target_len)}
                            </span>

                            <button
                                className="px-3 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-300 to-blue-500   hover:from-blue-600 hover:to-blue-800 hover:scale-105 disabled:bg-gray-400 disabled:text-gray-800 disabled:cursor-not-allowed"
                                onClick={() => handlePageChange("next")}
                            >
                                {dict.history.next}
                            </button>

                            <select
                                className="ml-4 px-2  border border-gray-300 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-lg  "
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                {itemsPerPageOptions.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                        className="bg-gray-200"
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientHistory;

interface ItemInt {
    items: any[];
    headers: string[];
    dict: any;
    isOrder: boolean;
}
const formatDate = (dateString: string) => {
    if (dateString === null) {
        return "-";
    }
    const date = new Date(dateString);

    const pad = (number: number) => (number < 10 ? "0" + number : number);

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

const HistoryTable = ({ items, headers, dict, isOrder }: ItemInt) => {
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const handleSort = (header: string) => {
        if (sortField === header) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(header);
            setSortOrder("asc");
        }
    };

    const sortedItems = [...items].sort((a, b) => {
        if (sortField === null) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return 0;
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((header: any, idx: number) => (
                        <TableHead
                            key={idx}
                            className="w-32 cursor-pointer"
                            onClick={() => handleSort(header)}
                        >
                            {dict.history.table[header]}
                            {sortField === header &&
                                (sortOrder === "asc" ? " 🔼" : " 🔽")}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedItems.map((item: any, idx1: number) => (
                    <TableRow key={idx1}>
                        {headers.map((header: any, idx: number) => (
                            <TableCell
                                key={idx}
                                className="font-medium"
                                style={{
                                    color:
                                        header === "profit"
                                            ? item.profit > 0
                                                ? "#458bd8"
                                                : item.profit < 0
                                                  ? "#ee605e"
                                                  : ""
                                            : header === "type"
                                              ? item.type === "buy"
                                                  ? "#458bd8"
                                                  : item.type === "sell"
                                                    ? "#ee605e"
                                                    : item.type === "deposit"
                                                      ? "#458bd8"
                                                      : item.type === "withdraw"
                                                        ? "#ee605e"
                                                        : ""
                                              : "",
                                }}
                            >
                                {header === "symbol"
                                    ? item.symbol_name[dict.lang]
                                    : header === "num"
                                      ? idx1 + 1
                                      : header === "type"
                                        ? isOrder
                                            ? dict.history.table[
                                                  item.type.replaceAll(" ", "_")
                                              ]
                                            : dict.history.table[item.type]
                                        : header === "dir"
                                          ? dict.history.table[item.dir]
                                          : header === "result"
                                            ? dict.history.table[item.result]
                                            : header === "state"
                                              ? dict.history.table[item.state]
                                              : header === "closeTime"
                                                ? dict.lang == "en"
                                                    ? formatDate(item.closeTime)
                                                    : item.closeTime_jalali
                                                : header === "time"
                                                  ? dict.lang == "en"
                                                      ? formatDate(item.time)
                                                      : item.time_jalali
                                                  : item[header]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

import { FaFolderOpen } from "react-icons/fa6";
import { DatePickerWithRange } from "../ui/DateRange";
import { toast } from "sonner";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";

const Empty = ({ dict }: { dict: any }) => {
    return (
        <div className="w-full h-full flex  flex-col items-center justify-center">
            <FaFolderOpen className="text-4xl m-4" />
            <p>{dict.history.empty}</p>
        </div>
    );
};
