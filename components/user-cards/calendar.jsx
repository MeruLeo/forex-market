'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import Divider from '@mui/material/Divider';
import DatePicker, { DateObject, Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import gregorian from "react-date-object/calendars/gregorian"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian_en from "react-date-object/locales/gregorian_en"
import TimePicker from "react-multi-date-picker/plugins/time_picker";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function Calendar({ dict, onUpdateDates }) {
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();


    const [date1, setLocalDate1] = useState("");
    const [date2, setLocalDate2] = useState("");
    const [search, setSearch] = useState("");

    const handleChange = (event) =>{
        setSearch(event.target.value)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        setOpen(false);

    };
    const handlesubmitDates = (e)=>{
        console.log(search, date1, date2);
        let d1="";
        let d2="";
        if(date1 !== null || date2 !== null){
            d1=date1.toString().replace("-", " ").replaceAll("/", "-");
            d2=date2.toString().replace("-", " ").replaceAll("/", "-");
        }
        onUpdateDates(d1,d2, search)
        handleClose()
    }
    // change to set datetime
    const SetDateTime = async (target) => {
        try {
            const data = {
                token: localStorage.getItem('token'),
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mt5/${target}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json();

            if (response.status === 200) {
                toast(res.message);
                setOpen(false);
                return;
            }
            if (!response.ok) {
                toast(res.error);
                return;
            }
        } catch (error) {
            toast(dict.order.errors.order_error);
        }
    };

    return (
        <React.Fragment >
            <button className='mx-3 flex' onClick={handleClickOpen}>              
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                </svg>
            </button>

            <BootstrapDialog
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: theme === 'dark' ? '#263238' : 'white',
                        color: theme === 'dark' ? '#E0E0E0' : 'white',
                        fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                        height: '500px',
                        direction: dict.lang === 'en' ? 'ltr': 'rtl'
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
                        py: 0, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                        bgcolor: theme === 'dark' ? '#263238' : 'white',
                        color: theme === 'dark' ? '#E0E0E0' : 'black',
                    }}
                    id="customized-dialog-title"
                >
                    {dict.history.calendar.title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right:dict.lang === 'en' ? 8 : 'auto',
                        left:dict.lang !== 'en' ? 8 : 'auto',

                        top: 8,
                        color: theme === 'dark' ? '#E0E0E0' : 'grey',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent
                    sx={{
                        bgcolor: theme === 'dark' ? '#263238' : 'white',
                        color: theme === 'dark' ? '#E0E0E0' : 'white',
                    }}
                    dividers
                >
                    <Box
                        sx={{
                            '& > :not(style)': { m: 1, minWidth: '400px' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center', fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                            bgcolor: theme === 'dark' ? '#263238' : 'white',
                            color: theme === 'dark' ? '#E0E0E0' : 'white',
                        }}
                    >
                        <div className='flex flex-col gap-4 w-[150px] overflow-hidden items-center justify-center'>
                            <div className='flex w-[150px] justify-center text-black dark:text-white items-center'>
                                <label htmlFor="" style={{width:'40px'}} className='mx-2'>{dict.history.calendar.from}: </label>
                                <DatePicker
                                    value={date1}
                                    format="YYYY/MM/DD-HH:mm:ss"
                                    locale={dict.lang=='en'? gregorian_en :persian_fa }
                                    calendar={dict.lang=='en'? gregorian :persian }
                                    plugins={[
                                    <TimePicker position="bottom" hStep={2} mStep={3} sStep={4} />,
                                    ]}
                                    onChange={setLocalDate1}
                                    style={{padding:'8px 12px', height:'40px', width: '180px'}}

                                />
                            </div>

                    <Divider />
                            <div className='flex w-[150px] justify-center text-black dark:text-white items-center'>
                                    <label htmlFor=""  style={{width:'40px'}} className='mx-2'>{dict.history.calendar.to}: </label>
                                    <DatePicker
                                        value={date2}
                                        format="YYYY/MM/DD-HH:mm:ss"
                                        locale={dict.lang=='en'? gregorian_en :persian_fa }
                                        calendar={dict.lang=='en'? gregorian :persian }
                                        plugins={[
                                            <TimePicker position="bottom" hStep={2} mStep={3} sStep={4} />,
                                        ]}
                                        onChange={setLocalDate2}
                                        style={{padding:'8px 12px', height:'40px', width: '180px'}}
                                    />
                            </div>
                            <Divider />

                            <div className='flex w-[150px] justify-center text-black dark:text-white'>
                                    <div className="flex gap-2 items-center justify-between">
                                       
                                    <label htmlFor=""  style={{width:'40px'}} className='mx-2'>{dict.history.calendar.search}: </label>
                                            <input
                                            type="text"
                                            value={search}
                                            onChange={handleChange}
                                            style={{padding:'8px 12px', height:'40px', width: '180px'}}
                                            className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                                            />
                                    </div>
                            </div>
                        </div>
                    

                    <Divider />

                    <Button sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', }} fullWidth  variant="contained" color="error" size="large" onClick={handlesubmitDates} >
                            {dict.history.calendar.submit}
                        </Button>
                        
 
                       
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}
