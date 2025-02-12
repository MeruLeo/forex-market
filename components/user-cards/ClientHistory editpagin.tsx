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
import { LuCalendar } from "react-icons/lu";
import Cookies from "js-cookie";

const ClientHistory = ({ dict }: { dict: any }) => {
    const [trades, setTrades] = useState([]);
    const tradeHeaders = [
        "symbol",
        "ticket",
        "type",
        "entry",
        "exit",
        "profit",
        "unit",
        "leverage",
        "tp",
        "sl",
        "state",
        "time",
    ];
    const [deals, setDeals] = useState([]);
    const dealHeaders = [
        "symbol",
        "ticket",
        "trade_id",
        "type",
        "dir",
        "price",
        "profit",
        "unit",
        "time",
    ];

    const [orders, setOrders] = useState([]);

    const orderHeaders = [
        "symbol",
        "ticket",
        "trade_id",
        "type",
        "price",
        "unit",
        "result",
        "time",
    ];
    const [transactions, setTransactions] = useState([]);
    const transactionsHeaders = [
        "type",
        "transaction_id",
        "amount_dollar",
        "transaction_id",
        "time",
    ];

    useEffect(() => {
        const get_trades = async () => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/mt5/user_trades`,
                    { token: Cookies.get("access") },
                    { headers: { "Content-Type": "application/json" } },
                );

                if (response.status !== 200) {
                    toast(response.data.error);
                    return;
                }
                setTrades(response.data);
            } catch (error) {
                toast(dict.history.errors.trade_error);
            }
        };

        const get_deals = async () => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/mt5/user_deals`,
                    { token: Cookies.get("access") },
                    { headers: { "Content-Type": "application/json" } },
                );

                if (response.status !== 200) {
                    toast(response.data.error);
                    return;
                }
                setDeals(response.data);
            } catch (error) {
                toast(dict.history.errors.deal_error);
            }
        };

        const get_orders = async () => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/mt5/user_orders`,
                    { token: Cookies.get("access") },
                    { headers: { "Content-Type": "application/json" } },
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
                    { token: Cookies.get("access") },
                    { headers: { "Content-Type": "application/json" } },
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
    }, []);
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
    const tabChanger = (e: string) => {
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

    return (
        <div className="w-full h-full sm:h-full overflow-y-scroll overflow-x-hidden">
            <Card className="w-full h-full">
                <CardHeader className="flex items-center justify-center py-2">
                    <div className="w-full flex items-center justify-between mx-3 mt-3">
                        <Drawer>
                            <DrawerTrigger className="flex items-center w-6">
                                <LuCalendar className="text-xl" />
                            </DrawerTrigger>
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
                                onClick={() => tabChanger("trade")}
                                value="trade"
                            >
                                {dict.history.trade}
                            </TabsTrigger>
                            <TabsTrigger
                                className="w-32"
                                onClick={() => tabChanger("deal")}
                                value="deal"
                            >
                                {dict.history.deal}
                            </TabsTrigger>
                            <TabsTrigger
                                className="w-32"
                                onClick={() => tabChanger("order")}
                                value="order"
                            >
                                {dict.history.order}
                            </TabsTrigger>
                            <TabsTrigger
                                className="w-32"
                                onClick={() => tabChanger("transaction")}
                                value="transaction"
                            >
                                {dict.history.transaction}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="trade">
                            <div className="h-[62vh] sm:h-[270px] overflow-scroll">
                                {trades.length ? (
                                    <HistoryTable
                                        items={trades}
                                        headers={tradeHeaders}
                                        dict={dict}
                                        isOrder={false}
                                    />
                                ) : (
                                    <Empty dict={dict} />
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="deal">
                            <div className="h-[62vh] sm:h-[270px] overflow-scroll">
                                {deals.length ? (
                                    <HistoryTable
                                        items={deals}
                                        headers={dealHeaders}
                                        dict={dict}
                                        isOrder={false}
                                    />
                                ) : (
                                    <Empty dict={dict} />
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="order">
                            <div className="h-[62vh] sm:h-[270px] overflow-scroll">
                                {orders.length ? (
                                    <HistoryTable
                                        items={orders}
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
                                        items={transactions}
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
    items: any;
    headers: any;
    dict: any;
    isOrder: Boolean;
}
const HistoryTable = ({ items, headers, dict, isOrder }: ItemInt) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((header: any, idx: number) => (
                        <TableHead key={idx} className="w-32">
                            {dict.history.table[header]}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item: any, idx: number) => (
                    <TableRow key={idx}>
                        {headers.map((header: any, idx: number) => (
                            <TableCell key={idx} className="font-medium">
                                {header == "symbol"
                                    ? item.symbol_name[dict.lang]
                                    : header == "type"
                                      ? isOrder
                                          ? item[header]
                                          : dict.history.table[item.type]
                                      : header == "dir"
                                        ? dict.history.table[item.dir]
                                        : header == "result"
                                          ? dict.history.table[item.result]
                                          : header == "time"
                                            ? item.time_jalali
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
import axiosInstance from "@/utils/axiosInstance";

const Empty = ({ dict }: { dict: any }) => {
    return (
        <div className="w-full h-full flex  flex-col items-center justify-center">
            <FaFolderOpen className="text-4xl m-4" />
            <p>{dict.history.empty}</p>
        </div>
    );
};
