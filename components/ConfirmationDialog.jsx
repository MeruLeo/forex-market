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

export default function ConfirmationDialog({dict, show, message, onConfirm, onCancel, loading }) {
    if(!show) return null

    const { theme } = useTheme();
 

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
                    <Divider />

                    <Button sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',color: theme === 'dark' ? '#E0E0E0' : 'black', }} fullWidth  variant="contained" color="error" size="large" onClick={onConfirm} disabled={loading} >
                    {dict.confirmation.confirm}
                    </Button>
                    <Button  sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',color: theme === 'dark' ? '#E0E0E0' : 'black', }} fullWidth  variant="contained" color="green" size="large" onClick={onCancel} disabled={loading} >
                    {dict.confirmation.cancel}
                    </Button>
                       
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}
