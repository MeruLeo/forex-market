"use client";
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/shadcn/card";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/shadcn/drawer";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/shadcn/dialog";
import { LuSearch } from "react-icons/lu";
import { Input } from '../shadcn/input';
import { toast } from 'sonner';
import { MdDeleteOutline } from "react-icons/md";
import { useAppContext } from "@/context";

const ClientMessage = ({
    dict, dict_message, len_trades, len_pending, balance
}: {
    dict: any; dict_message: any, len_trades: number, len_pending: number, balance: number,
}) => {
    const [messages, setMessages] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const handleDeleteMessage = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: localStorage.getItem('token'), id: id }),
            });
            if (response.ok) {
                setMessages(messages.filter((msg: any) => msg.id !== id));
            }
        } catch (error) {
            console.error('Error during POST request:', error);
        }
    };

    const handlePageChange = (direction: string) => {
        if (direction === "next" && currentPage * itemsPerPage < messages.length) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const getCurrentItems = (items: any[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const getTotalPages = (totalItems: number) => {
        return Math.ceil(totalItems / itemsPerPage);
    };

    useEffect(() => {
        const get_messagees = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: localStorage.getItem('token') }),
                });

                const res = await response.json();
                if (!response.ok) {
                    toast(res.error)
                    return
                }
                setMessages(res)
            } catch (error) {
                toast(dict.history.errors.order_error)
            }
        }

        get_messagees();

    }, [len_trades, len_pending, balance])


    return (
        <div className='w-full h-full sm:h-full overflow-y-scroll overflow-x-hidden'>
            <Card className='w-full h-full'>
                <CardHeader className='flex items-center justify-center py-2'>
                    <div className='w-full flex items-center justify-center mx-3 mt-3'>
                        <p className='font-semibold text-lg'>{dict.message.header}</p>
                        <p className='w-6 hidden sm:flex'></p>
                    </div>
                </CardHeader>
                <CardContent className='w-full px-2'>
                    <div className='w-full h-[60vh] sm:h-80 flex flex-col items-center overflow-y-scroll overflow-x-hidden'>
                        {getCurrentItems(messages).map((message: any, idx: number) => (
                            <div key={idx} className={`w-full ${message.is_read?'':message.is_alert ? 'bg-orange-500 animate-pulse' : '' } `}>
                                <MessageItem
                                    message={message}
                                    dict_message={dict_message}
                                    onDelete={handleDeleteMessage}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="relative">
                        <div className='absolute inset-0 flex items-center justify-center mt-3'   >
                            <button
                                className='px-3 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-300 to-blue-500   hover:from-blue-600 hover:to-blue-800 hover:scale-105 disabled:bg-gray-400 disabled:text-gray-800 disabled:cursor-not-allowed'
                                onClick={() => handlePageChange("prev")}
                            >
                                {dict.history.prev}
                            </button>
                            <span className='text-m   text-gray-800  px-1 py-1 '>
                                {dict.history.page}
                            </span>
                            <span className='text-m  text-gray-800  px-1 py-1 '>
                                {currentPage}
                            </span>
                            <span className='text-m   text-gray-800  px-1 py-1 '>
                                {dict.history.from}
                            </span>
                            <span className='text-m  text-gray-800  px-1 py-1 '>
                                {getTotalPages(messages.length)}
                            </span>

                            <button
                                className='px-3 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-300 to-blue-500   hover:from-blue-600 hover:to-blue-800 hover:scale-105 disabled:bg-gray-400 disabled:text-gray-800 disabled:cursor-not-allowed'
                                onClick={() => handlePageChange("next")}
                            >
                                {dict.history.next}
                            </button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default ClientMessage;

interface MessageItemProps {
    message: any;
    dict_message: any;
    onDelete: (id: string) => void;
}

export const MessageItem = ({ message, dict_message, onDelete }: MessageItemProps) => {
    const messageContent = dict_message[message.code];
    let content = '';
    const username = message.user_name || '';
    const trade_price = message.trade ? message.trade.entry : '';
    const trade_exit = message.trade ? message.trade.exit : '';
    const trade_ticket = message.trade ? message.trade.ticket : '';
    const trade_profit = message.trade ? message.trade.profit.toFixed(2) : '';
    const trade_sl = message.trade ? message.trade.sl : '';
    const trade_tp = message.trade ? message.trade.tp : '';
    const order_id = message.order ? message.order.id : '';
    const order_tp = message.order ? message.order.tp : '';
    const order_type = message.order ? message.order.type : '';
    const order_sl = message.order ? message.order.sl : '';
    const order_price = message.order ? message.order.price : '';
    const order_time = message.order ? message.order.time_jalali : '';
    const increase = message.increased_amount || '';
    const balance = message.balance;
    const equity = message.equity;
    const margin = message.margin;
    const margin_level = message.margin_level;
    const free_margin = message.free_margin;
    const withdraw_amount = message.withdraw_amount || '';
    const withdraw_rial = message.withdraw_rial || '';
    const margin_level_trade = message.code == '88' ? message.content: '';

    const values = {
        username: username,
        trade_price: trade_price,
        trade_exit: trade_exit,
        trade_ticket: trade_ticket,
        trade_profit: trade_profit,
        trade_sl: trade_sl,
        trade_tp: trade_tp,
        order_id: order_id,
        order_sl: order_sl,
        order_tp: order_tp,
        order_type: order_type,
        order_price: order_price,
        order_time: order_time,
        increase: increase,
        balance: balance.toString(),
        equity: equity.toString(),
        margin: margin.toString(),
        margin_level: margin_level.toString(),
        free_margin: free_margin.toString(),
        withdraw_amount: withdraw_amount,
        withdraw_rial: withdraw_rial,
        margin_level_trade:margin_level_trade
    };
    if (messageContent) {
        content = formatString(messageContent.content, values, dict_message);
    }

    const handle_read_messages = async (id: string) => {
        if (message.is_read) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/set_read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: localStorage.getItem('token'), id: id }),
            });
        } catch (error) {
            console.error('Error during POST request:', error);
        }
    };

    const handle_delete_message = () => {
        onDelete(message.id);
    };

    return (
        <div dir={dict_message.lang == "en" ? 'ltr' : 'rtl'}
            className={`relative flex items-center justify-start w-full my-3
        ${message.is_read ? 'filter opacity-60' : ''} `}>
            <div className={`absolute w-2 h-2 rounded-full bg-sky-500 animate-ping
                ${message.is_read ? 'hidden' : 'block'} -top-1 left-1`} />
            <div className='w-full flex flex-col items-center justify-center'>
                <Dialog onOpenChange={() => { handle_read_messages(message.id) }}>
                    <DialogTrigger className='flex items-center justify-start w-full'>
                        <div className='flex items-center justify-between px-1 w-full'>
                            <p className='truncate font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-indigo-600 dark:from-sky-400 dark:to-indigo-400'>
                                {message.code == '10' ? message.title : messageContent ? messageContent.title : 'Unknown Message'}
                            </p>
                            <span className='text-xs text-center'>{message.time_jalali}</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center justify-center'>
                        <div className='flex flex-col md:flex-row items-center justify-between px-1 w-full'>
                            <span className='text-sm w-16' />
                            <p className='font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-indigo-600 dark:from-sky-400 dark:to-indigo-400'>
                                {message.code == '10' ? message.title : messageContent ? messageContent.title : 'Unknown Message'}
                            </p>
                            <span className='text-xs w-16'>{message.time_jalali}</span>
                        </div>
                        <div className='flex items-center justify-between px-1 w-full'>
                            <p className={`w-full text-sm ${dict_message.lang == 'en' ? 'text-left' : 'text-right'}`} style={{direction: dict_message.lang === 'en' ? 'ltr': 'rtl'}}>
                                {['10', '4', '5'].includes(message.code) ? (
                                    message.content.replaceAll('price', dict_message.price).replaceAll('pair', dict_message.pair)
                                ) : message.code === '99' ? (
                                    <>
                                        {content} . 
                                        <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
                                    </>
                                ) : message.code === '6'?(<> {content} , {message.content.replaceAll('price', dict_message.price).replaceAll('pair', dict_message.pair)} </>) : (
                                    content
                                )}
                            </p>
                        </div>
                        {/* {console.log(message.sender.replaceAll(/'/g, '"'))} */}
                        <div className='flex items-center justify-between px-1 w-full'>
                            <span className='text-xs underline px-2'>
                                {
                                    (() => {
                                        try {
                                            // Replace single quotes with double quotes and parse the JSON
                                            const parsedMessage = JSON.parse(message.sender.replaceAll(/'/g, '"'));
                                            
                                            // Return the appropriate message based on the language
                                            if (dict_message.lang === 'kur') {
                                                return parsedMessage['message_sender_kur'] || 'Default message for Kurdish';
                                            } else if (dict_message.lang === 'fa') {
                                                return parsedMessage['message_sender_fa'] || 'پیام پیش فرض برای فارسی';
                                            } else {
                                                return parsedMessage['message_sender'] || 'Default message';
                                            }
                                        } catch (error) {
                                            // console.error("JSON parsing error:", error);
                                            return message.sender; // Fallback message in case of error
                                        }
                                    })()

                                    //  dict_message.lang == 'kur' ? JSON.parse(message.sender.replaceAll(/'/g, '"'))['message_sender_kur']:
                                    //  dict_message.lang == 'fa' ? JSON.parse(message.sender.replaceAll(/'/g, '"'))['message_sender_fa']:
                                    //   JSON.parse(message.sender.replaceAll(/'/g, '"'))['message_sender']
                                }
                            </span>
                        </div>
                    </DialogContent>
                </Dialog>
                <div className='flex items-center justify-between px-1 w-full'>
                    <p className='truncate text-xs' style={{direction: dict_message.lang === 'en' ? 'ltr': 'rtl'}}>
                        {['10', '4', '5'].includes(message.code) ? (
                            message.content.replaceAll('price', dict_message.price).replaceAll('pair', dict_message.pair)
                        ) : message.code === '99' ? (
                            <>
                                {content} . 
                                <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
                            </>
                        ) : message.code === '6'?(<> {content} , {message.content.replaceAll('price', dict_message.price).replaceAll('pair', dict_message.pair)} </>) :(
                            content
                        )}
                    </p>
                    <div className='flex'>
                        <span className='text-xs underline px-2'>
                            {
                                 (() => {
                                    try {
                                        // Replace single quotes with double quotes and parse the JSON
                                        const parsedMessage = JSON.parse(message.sender.replaceAll(/'/g, '"'));
                                        
                                        // Return the appropriate message based on the language
                                        if (dict_message.lang === 'kur') {
                                            return parsedMessage['message_sender_kur'] || 'Default message for Kurdish';
                                        } else if (dict_message.lang === 'fa') {
                                            return parsedMessage['message_sender_fa'] || 'پیام پیش فرض برای فارسی';
                                        } else {
                                            return parsedMessage['message_sender'] || 'Default message';
                                        }
                                    } catch (error) {
                                        // console.error("JSON parsing error:", error);
                                        return message.sender; // Fallback message in case of error
                                    }
                                })()

                                // dict_message.lang == 'kur' ? JSON.parse(message.sender.replaceAll(/'/g, '"'))['message_sender_kur']:
                                // dict_message.lang == 'fa' ? JSON.parse(message.sender.replaceAll(/'/g, '"'))['message_sender_fa']:
                                //  JSON.parse(message.sender.replaceAll(/'/g, '"'))['message_sender']
                            }
                        </span>
                        <button className='hover:text-amber-400' onClick={handle_delete_message}><MdDeleteOutline /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function formatString(template: string, values: { [key: string]: any },  dict_message:any): string {
    let msg = template.replace(/{(\w+)}/g, (match, key) => {
        return typeof values[key] !== 'undefined' ? values[key] : match;
    });
    if(values.trade_profit < 0){
        msg = msg.replace(dict_message.profit, dict_message.lose)
    }
    return msg
}
