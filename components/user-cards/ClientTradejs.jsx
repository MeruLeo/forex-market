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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import TradeCard from "@/components/user-cards/TradeCard";
import OrderCard from "@/components/user-cards/OrderCard";
import GroupClose from "@/components/user-cards/GroupClose";
import GroupClosePendings from "@/components/user-cards/GroupClosePendings";
import Wallet from "@/components/Wallet";
import { LuFilePlus2 } from "react-icons/lu";
import { Input } from "../shadcn/input";
import { Checkbox } from "../shadcn/checkbox";
import { toast } from "sonner";
import { Grid2 } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

function calculateTotalProfit(items) {
    return items.reduce((total, item) => {
        return total + (item.profit || 0);
    }, 0);
}

const ClientTrade = ({ dict, trades, stat, pending, symbols }) => {
    const [marketPrice, setMarketPrice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState(trades);
    const [statistic, setStatistic] = useState(stat);
    const [pending_order, setPending] = useState(pending);
    const [symbols_list, setSymbols_list] = useState(symbols);
    const [symbolToTrade, setSymbolToTrade] = useState("");
    const [askValue, setAskValue] = useState("");
    const [bidValue, setBidValue] = useState("");
    const [maxLeverage, setMaxLeverage] = useState("");
    const [leverage_s, setLeverage_S] = useState(1);
    const [showWalletIcon, setShowWalletIcon] = useState(false);

    // console.log({list})
    useEffect(() => {
        if (symbols_list.length > 0) {
            setSymbolToTrade(symbols_list[0].id);
        } else {
            setSymbolToTrade("");
        }
    }, [symbols_list.length]);
    useEffect(() => {
        setList(trades);
        setStatistic(stat);
        setPending(pending);
        setSymbols_list(symbols);
        const selectedPair = symbols.find(
            (symbol) => symbol.id === symbolToTrade,
        );
        if (selectedPair) {
            setAskValue(selectedPair.ask);
            setBidValue(selectedPair.bid);
            setMaxLeverage(selectedPair.max_leverage);
        }
    }, [trades, stat, pending, symbols]);

    const get_first_item = () => {
        handleSymbolSelectChange(symbols[0]?.id);
    };
    const get_pair_leverage = (pair) => {
        setIsLoading(true);
        try {
            const response = fetch(
                `${process.env.NEXT_PUBLIC_API_URL2}/get-user-leverage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: Cookies.get("access"),
                        pair: pair,
                    }),
                },
            ).then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log(data);

                        setLeverage_S(data.leverage);
                        setIsLoading(false);
                    });
                } else {
                    toast("Failed to get Leverage.");
                    setIsLoading(false);
                }
            });
        } catch (error) {
            toast("An error occurred while getting Leverage.");
            setIsLoading(false);
        }
    };
    const fetchConf = async () => {
        try {
            const token = Cookies.get("access");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL2}/get-site-config`,
                {
                    headers: {
                        "Cache-Control": "no-cache",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const res = response.data;

            if (!res.status === 200) {
                toast("Failed to get config.");
                return;
            }
            setShowWalletIcon(res.wallet_is_enable);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchConf();
    }, []);
    const handleSymbolSelectChange = (value) => {
        setSymbolToTrade(value);
        get_pair_leverage(value);
        if (symbols) {
            const selectedPair = symbols.find(
                (symbol) => symbol.symbol_id === value,
            );
            if (selectedPair) {
                setAskValue(selectedPair.ask);
                setBidValue(selectedPair.bid);
                setMaxLeverage(selectedPair.max_leverage);
            }
        }
    };

    const [price, setPrice] = useState(0);
    const [unit, setUnit] = useState(1);
    const [leverage, setLeverage] = useState(1);
    const [sl, setSl] = useState(0);
    const [tp, setTp] = useState(0);

    const handleTrade = async (type) => {
        const token = Cookies.get("access");

        if (!symbolToTrade) {
            toast(dict.trade.errors.symbol_notfound);
            return;
        }
        if (!unit) {
            toast(dict.trade.errors.unit_empty);
            return;
        }
        if (!leverage) {
            toast(dict.trade.errors.leverage_empty);
            return;
        }

        setIsLoading(true);
        const data = {
            symbol: symbolToTrade,
            type: type,
            price: marketPrice ? 0 : price,
            unit: unit,
            leverage: leverage,
            sl: sl || 0,
            tp: tp || 0,
        };
        const place_trade = async (data) => {
            try {
                const response = await axiosInstance.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/mt5/trade`,
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-Source": "nextjs",
                        },
                    },
                );

                if (response.status === 200) {
                    const data = response.data;
                    if (data.message === "trade stored succes") {
                        toast(dict.order.success);
                        setPrice(0);
                        setUnit(1);
                        setLeverage(1);
                        setSl(0);
                        setTp(0);
                        if (symbols_list.length > 0) {
                            setSymbolToTrade(symbols_list[0].id);
                        } else {
                            setSymbolToTrade("");
                        }
                        setMarketPrice(false);
                        setIsLoading(false);
                        return;
                    }

                    toast(dict.trade.success);
                    setPrice(0);
                    setUnit(1);
                    setLeverage(1);
                    setSl(0);
                    setTp(0);
                    if (symbols_list.length > 0) {
                        setSymbolToTrade(symbols_list[0].id);
                    } else {
                        setSymbolToTrade("");
                    }
                    setMarketPrice(false);
                } else {
                    const errorData = response.data;
                    if (
                        errorData.error ===
                        "New trade or orders are currently disallowed"
                    ) {
                        toast(dict.trade.errors.new_trade_disallowed);
                        return;
                    }
                    if (
                        errorData.error ===
                        "You can only buy or sell in one symbol at a time."
                    ) {
                        toast(dict.trade.errors.same_trade_error);
                        return;
                    }
                    if (errorData.error === "not enough balance") {
                        toast(dict.trade.errors.balance);
                        return;
                    }

                    if (errorData.error === "The amount of TP is not allowed") {
                        toast(dict.order.errors.wrong_tp);
                        return;
                    } else if (
                        errorData.error === "The amount of SL is not allowed"
                    ) {
                        toast(dict.order.errors.wrong_sl);
                        return;
                    }

                    toast(errorData.error);
                }
            } catch (error) {
                toast(dict.trade.sth_went_wrong);
            } finally {
                setIsLoading(false);
            }
        };
    };

    return (
        <div className="w-full h-full sm:h-full overflow-y-scroll overflow-x-hidden">
            <Card className="w-full h-full overflow-hidden overflow-y-auto">
                <CardHeader className="flex items-center justify-center py-2">
                    <div className="w-full flex items-center justify-between mx-3 mt-3">
                        <Drawer>
                            <div className=" flex flex-row top-0 left-0 m-0 mx-0 px-0">
                                <div className="relative px-2 py-1">
                                    <DrawerTrigger className="flex items-center w-6">
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                        >
                                            <LuFilePlus2
                                                className="text-xl"
                                                onClick={get_first_item}
                                                style={{ color: "#458bd8" }}
                                            />
                                        </IconButton>
                                    </DrawerTrigger>
                                </div>
                                <div className="relative px-2 my-0 py-0 ">
                                    <GroupClose dict={dict} />
                                    <GroupClosePendings dict={dict} />

                                    {showWalletIcon ? (
                                        <Wallet dict={dict} />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                            <DrawerContent className="sm:w-[50vw] mx-auto pb-16">
                                <DrawerHeader className="flex items-center justify-between">
                                    <DrawerTitle></DrawerTitle>
                                </DrawerHeader>
                                <div className="w-full flex items-center justify-center mb-3">
                                    <p>{dict.trade.title}</p>
                                </div>
                                <div className="flex items-center justify-center my-3 w-full">
                                    <Select
                                        onValueChange={handleSymbolSelectChange}
                                        value={symbolToTrade}
                                    >
                                        <SelectTrigger className="w-32 min-w-[8rem]">
                                            <SelectValue
                                                placeholder={
                                                    dict.price.placeholder
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {symbols.map((symbol, idx) => (
                                                <div key={idx}>
                                                    <SelectItem
                                                        value={symbol.id}
                                                        className="w-full flex items-center justify-between"
                                                    >
                                                        <span>
                                                            {
                                                                symbol.names[
                                                                    dict.lang
                                                                ]
                                                            }
                                                        </span>
                                                    </SelectItem>
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <span className="px-2 text-sm">
                                        <u>
                                            {dict.trade.leverage}: {leverage_s}
                                        </u>
                                    </span>
                                </div>
                                <div className="flex items-center justify-center my-3">
                                    <span
                                        className="text-blue-300 px-2"
                                        style={{ color: "skyblue" }}
                                    >
                                        {bidValue}
                                    </span>
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="z-10 bg-white dark:bg-slate-950 h-3 translate-y-0 px-1 mx-1 dark:bg-[#020617]"
                                        >
                                            {dict.trade.placeholder}
                                        </label>
                                        <Input
                                            id="price"
                                            placeholder={dict.trade.placeholder}
                                            className="w-32"
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                            disabled={
                                                marketPrice || !symbolToTrade
                                            }
                                        />
                                    </div>
                                    <span className="text-red-500 px-2">
                                        {askValue}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center my-3">
                                    <Checkbox
                                        id="market_price"
                                        checked={marketPrice}
                                        onCheckedChange={() =>
                                            setMarketPrice(!marketPrice)
                                        }
                                    />
                                    <label
                                        htmlFor="market_price"
                                        className="z-10 bg-white dark:bg-slate-950 text-sm mx-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {dict.trade.market}
                                    </label>
                                </div>
                                <div className="flex items-center justify-center my-3 ">
                                    <div
                                        className="px-3 "
                                        style={{ maxWidth: "180px" }}
                                    >
                                        <label
                                            htmlFor="sl"
                                            className="z-10 bg-white dark:bg-slate-950 h-3 translate-y-0 px-1 mx-1 dark:bg-[#020617]"
                                        >
                                            {dict.trade.sl}
                                        </label>
                                        <Input
                                            id="sl"
                                            type="number"
                                            value={sl}
                                            style={{
                                                borderColor:
                                                    sl < 0 ? "red" : "",
                                            }}
                                            onChange={(e) =>
                                                setSl(e.target.value)
                                            }
                                            name="sl"
                                        />
                                    </div>
                                    <div
                                        className="px-3 "
                                        style={{ maxWidth: "180px" }}
                                    >
                                        <label
                                            htmlFor="tp"
                                            className="z-10 bg-white dark:bg-slate-950 h-3 translate-y-0 px-1 mx-1 dark:bg-[#020617]"
                                        >
                                            {dict.trade.tp}
                                        </label>
                                        <Input
                                            id="tp"
                                            type="number"
                                            value={tp}
                                            style={{
                                                borderColor:
                                                    tp < 0 ? "red" : "",
                                            }}
                                            onChange={(e) =>
                                                setTp(e.target.value)
                                            }
                                            name="tp"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center my-3  hidden">
                                    <div>
                                        <label
                                            htmlFor="leverage"
                                            className="z-10 bg-white dark:bg-slate-950 h-3 translate-y-0 px-1 mx-1 dark:bg-[#020617]"
                                        >
                                            {dict.trade.leverage}
                                        </label>
                                        <Input
                                            id="leverage"
                                            type="number"
                                            className="w-48 min-w-[12rem]"
                                            value={leverage}
                                            style={{
                                                borderColor:
                                                    leverage <= 0 ? "red" : "",
                                            }}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                const parsedValue = parseInt(
                                                    newValue,
                                                    10,
                                                );
                                                if (!isNaN(parsedValue)) {
                                                    setLeverage(parsedValue);
                                                } else if (newValue === "") {
                                                    setLeverage("");
                                                }
                                            }}
                                            // min={1}
                                            step={1}
                                            name="leverage"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center my-3">
                                    <div>
                                        <label
                                            htmlFor="unit"
                                            className="z-10 bg-white dark:bg-slate-950 h-3 translate-y-0 px-1 mx-1 dark:bg-[#020617]"
                                        >
                                            {dict.trade.lot}
                                        </label>
                                        <Input
                                            id="unit"
                                            type="number"
                                            className="w-32 min-w-[12rem]"
                                            value={unit}
                                            style={{
                                                borderColor:
                                                    unit <= 0 ? "red" : "",
                                            }}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                const parsedValue = parseInt(
                                                    newValue,
                                                    10,
                                                );

                                                if (!isNaN(parsedValue)) {
                                                    setUnit(parsedValue);
                                                } else if (newValue === "") {
                                                    setUnit("");
                                                }

                                                // if (/^\d*$/.test(e.target.value)) setUnit(Math.floor(e.target.value) )
                                            }}
                                            // min={1}
                                            step={1}
                                            name="unit"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center ">
                                    <button
                                        onClick={() => handleTrade("buy")}
                                        disabled={
                                            isLoading ||
                                            !symbolToTrade ||
                                            (price == 0 && !marketPrice) ||
                                            leverage <= 0 ||
                                            unit <= 0 ||
                                            tp < 0 ||
                                            sl < 0 ||
                                            (!marketPrice &&
                                                sl > price &&
                                                tp != 0) ||
                                            (!marketPrice &&
                                                tp < price &&
                                                tp != 0)
                                        }
                                        className="bg-sky-500 px-5 py-1 mx-2 rounded-md hover:bg-sky-600"
                                    >
                                        {isLoading
                                            ? dict.trade.loading_btn
                                            : dict.trade.buy}
                                    </button>
                                    <button
                                        onClick={() => handleTrade("sell")}
                                        disabled={
                                            isLoading ||
                                            !symbolToTrade ||
                                            (price == 0 && !marketPrice) ||
                                            leverage <= 0 ||
                                            unit <= 0 ||
                                            tp < 0 ||
                                            sl < 0 ||
                                            (!marketPrice &&
                                                sl < price &&
                                                sl != 0) ||
                                            (!marketPrice &&
                                                tp > price &&
                                                sl != 0)
                                        }
                                        className="bg-red-500 px-5 py-1 mx-2 rounded-md hover:bg-red-600"
                                    >
                                        {isLoading
                                            ? dict.trade.loading_btn
                                            : dict.trade.sell}
                                    </button>
                                </div>
                            </DrawerContent>
                        </Drawer>

                        {trades.length > 0 && (
                            <p
                                className="font-semibold "
                                style={{
                                    color:
                                        calculateTotalProfit(trades) > 0
                                            ? "#458bd8"
                                            : "#ee605e",
                                }}
                            >
                                {calculateTotalProfit(trades).toFixed(2)}
                            </p>
                        )}
                        <p className="font-semibold text-lg">
                            {dict.trade.header}
                        </p>
                        <p className="w-6 hidden sm:flex"></p>
                    </div>
                </CardHeader>
                <CardContent className="w-full px-2 pl-1">
                    <div
                        className="w-full h-full flex flex-col items-center justify-start px-3"
                        dir={dict.trade.header === "Trades" ? "ltr" : "rtl"}
                    >
                        <div className="w-full flex items-center justify-center">
                            <p className="whitespace-nowrap">
                                {dict.trade.balance}
                            </p>
                            <div className="w-full mx-6 border-b-2 border-dotted dark:border-slate-700" />
                            <p>
                                {statistic.balance
                                    ? statistic.balance.toFixed(2)
                                    : "0.0"}
                            </p>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <p className="whitespace-nowrap">
                                {dict.trade.equity}
                            </p>
                            <div className="w-full mx-6 border-b-2 border-dotted dark:border-slate-700" />
                            <p>
                                {statistic.equity
                                    ? statistic.equity.toFixed(2)
                                    : "0.0"}
                            </p>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <p className="whitespace-nowrap">
                                {dict.trade.margin}
                            </p>
                            <div className="w-full mx-6 border-b-2 border-dotted dark:border-slate-700" />
                            <p>
                                {statistic.free_margin
                                    ? statistic.margin.toFixed(2)
                                    : "0.0"}
                            </p>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <p className="whitespace-nowrap">
                                {dict.trade.free_m}
                            </p>
                            <div className="w-full mx-6 border-b-2 border-dotted dark:border-slate-700" />
                            <p>
                                {statistic.free_margin
                                    ? statistic.free_margin.toFixed(2)
                                    : "0.0"}
                            </p>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <p className="whitespace-nowrap">
                                {dict.trade.margin_level}
                            </p>
                            <div className="w-full mx-6 border-b-2 border-dotted dark:border-slate-700" />
                            <p>
                                {statistic.free_margin
                                    ? statistic.margin_level.toFixed(2)
                                    : "0.0"}
                            </p>
                        </div>
                        <div className="w-full h-2 border-b dark:border-slate-700" />
                    </div>

                    <Grid2
                        dir={dict.trade.header === "Trades" ? "ltr" : "rtl"}
                        container
                        sx={{
                            width: "100%",
                            maxHeight: { xs: "55vh", sm: "14rem" },
                            minHeight: { xs: "55vh", sm: "14rem" },
                            paddingX: 2,
                            paddingy: 3,
                            overflowY: "scroll",
                            overflowX: "hidden",
                        }}
                    >
                        {list.map((trade, idx) => (
                            <TradeCard trade={trade} dict={dict} idx={idx} />
                        ))}

                        <hr className="w-full mt-4" />
                        <p className="w-full h-4 text-center translate-y-[-15px]">
                            <span className="px-2 my-2 bg-white dark:bg-slate-950">
                                {dict.pending}
                            </span>
                        </p>

                        {pending_order.map((order, idx) => (
                            <OrderCard order={order} dict={dict} idx={idx} />
                        ))}
                    </Grid2>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientTrade;
