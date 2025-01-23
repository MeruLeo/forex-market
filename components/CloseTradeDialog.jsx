'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import { useTheme } from 'next-themes';
import Divider from '@mui/material/Divider';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ConfirmationDialog({dict, show, message, onConfirm, onCancel, loading, min,max}) {
    if(!show) return null

    const { theme } = useTheme();
    const [value, setValue] = useState(max);

     // Function to handle increment
    const increment = () => {
        setValue((prevValue) => {
        const newValue = parseFloat((prevValue + 1).toFixed(2)); // Increase by 0.01
        return newValue <= max ? newValue : max; // Don't exceed max value
        });
    };

    // Function to handle decrement
    const decrement = () => {
        setValue((prevValue) => {
        const newValue = parseFloat((prevValue - 1).toFixed(2)); // Decrease by 0.01
        return newValue >= min ? newValue : min; // Don't go below min value
        });
    };

    // Function to handle manual input change
    const handleChange = (e) => {
        let newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
        // Ensure the value is within min and max bounds
        newValue = Math.max(min, Math.min(newValue, max));
        setValue(newValue.toFixed(2)); // Keep two decimal places
        }
    };

    const confirmValue = ()=>{
        onConfirm(value)
    }
 

    return (
        <React.Fragment >
            <BootstrapDialog
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: theme === 'dark' ? '#263238' : 'white',
                        color: theme === 'dark' ? '#E0E0E0' : 'white',
                        fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                        height: 'auto',
                        direction: dict.lang === 'en' ? 'ltr': 'rtl'
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
                        py: 0, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                        bgcolor: theme === 'dark' ? '#263238' : 'white',
                        color: theme === 'dark' ? '#E0E0E0' : 'black',
                        minWidth: '300px'
                    }}
                    id="customized-dialog-title"
                >
                    {dict.confirmation.title}
                </DialogTitle>
               

                <DialogContent
                    sx={{
                        bgcolor: theme === 'dark' ? '#263238' : 'white',
                        color: theme === 'dark' ? '#E0E0E0' : 'white',
                    }}
                    dividers
                >
                    <Box
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                            display: 'block',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center', fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                            bgcolor: theme === 'dark' ? '#263238' : 'white',
                            color: theme === 'dark' ? '#E0E0E0' : 'white',
                        }}
                    >
                        <p className='dark:text-white text-black'>{message}</p>
                         
                        <div className={`flex justify-center items-center ${max == 1 ? 'hidden' : ''}`}>
                            <p style={{color: theme === 'dark' ? '#E0E0E0' : 'black', padding:'0 5px' }}>{min}</p>
                            <button onClick={decrement} style={{ padding: '5px', fontSize: '16px',color: theme === 'dark' ? '#E0E0E0' : 'black' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                </svg>
                            </button>
                            <input
                                type="number"
                                value={value}
                                onChange={handleChange}
                                step="1"
                                min={min}
                                max={max}
                                style={{
                                width: '100px',
                                textAlign: 'center',
                                padding: '5px',
                                fontSize: '16px',
                                color: theme === 'dark' ? '#E0E0E0' : 'black'
                                }}
                            />
                            <button onClick={increment} style={{ padding: '5px', fontSize: '16px',color: theme === 'dark' ? '#E0E0E0' : 'black' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            <p style={{color: theme === 'dark' ? '#E0E0E0' : 'black', padding:'0 5px' }}>{max}</p>
                        </div>
                    
                    
                    <Divider />

                    <Button sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',color: theme === 'dark' ? '#E0E0E0' : 'black', }} fullWidth  variant="contained" color="error" size="large" onClick={confirmValue} disabled={loading} >
                    {dict.confirmation.confirm}
                    </Button>
                    <Button className='dark:text-white text-black' sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', color: theme === 'dark' ? '#E0E0E0' : 'black',}} fullWidth  variant="contained" color="green" size="large" onClick={onCancel} disabled={loading} >
                    {dict.confirmation.cancel}
                    </Button>
                       
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}
