import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import Divider from '@mui/material/Divider';
import { useConfirmationDialog } from '../../hooks/useConfirmationDialog'
import Cookies from 'js-cookie';
import axiosInstance from '@/utils/axiosInstance';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function GroupClose({ dict }) {
    const {confirm, ConfirmationDialogComponent} = useConfirmationDialog();

    const [open, setOpen] = useState(false);
    const { theme } = useTheme();

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        setOpen(false);

    };

    const onEditOrderClicked = async (target) => {
        handleClose();
        try {
            const data = {
                token: Cookies.get("access"),
            };
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/mt5/${target}`,
                data,
            );

            const res = response.data;

            if (response.status === 200) {
                if (res.message === "succes closing all") {
                    toast(dict.confirmation.success_close_all_trades);
                } else if (res.message === "succes closing profit") {
                    toast(dict.confirmation.success_close_profits_trades);
                } else if (res.message === "succes closing loss") {
                    toast(dict.confirmation.success_close_loss_trades);
                } else if (res.message === "succes closing sells") {
                    toast(dict.confirmation.success_close_sells_trades);
                } else if (res.message === "succes closing buys") {
                    toast(dict.confirmation.success_close_buys_trades);
                } else {
                    toast(res.message);
                }
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
        <React.Fragment>
            <IconButton color="red" style={{color:"red"}} size='small' onClick={handleClickOpen} >
                <WorkspacesIcon />
            </IconButton>
            <BootstrapDialog
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: theme === 'dark' ? '#263238' : 'white',
                        color: theme === 'dark' ? '#E0E0E0' : 'white',
                        fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
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
                    {dict.trade.manage_all}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
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
                            '& > :not(style)': { m: 1, minWidth: '30ch' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center', fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                            bgcolor: theme === 'dark' ? '#263238' : 'white',
                            color: theme === 'dark' ? '#E0E0E0' : 'white',
                        }}
                    >
                        <Button sx={{ textTransform: 'none',my: 5, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', }} fullWidth variant="contained" color="error" size="large"
                            onClick={() => { confirm(dict,dict.confirmation.close_all, onEditOrderClicked, 'close_all') } }
                        >
                            {dict.trade.close_all}
                        </Button><Divider />
                        <Button sx={{ textTransform: 'none',my: 5, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', }} fullWidth variant="contained" color="error" size="large"
                            onClick={() =>  { confirm(dict,dict.confirmation.close_profit, onEditOrderClicked, 'close_profit') }}
                        >
                            {dict.trade.close_all_in_profit}
                        </Button><Divider />
                        <Button sx={{ textTransform: 'none',my: 5, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', }} fullWidth variant="contained" color="error" size="large"
                            onClick={() =>  { confirm(dict,dict.confirmation.close_loss, onEditOrderClicked, 'close_loss') }}
                        >
                            {dict.trade.close_all_in_loss}
                        </Button><Divider />
                        <Button sx={{ textTransform: 'none',my: 5, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', }} fullWidth variant="contained" color="error" size="large"
                            onClick={() => { confirm(dict,dict.confirmation.close_buys, onEditOrderClicked, 'close_buys') }}
                        >
                            {dict.trade.close_all_buys}
                        </Button><Divider />
                        <Button sx={{ textTransform: 'none',my: 5, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', }} fullWidth variant="contained" color="error" size="large"
                            onClick={() => { confirm(dict,dict.confirmation.close_sells, onEditOrderClicked, 'close_sells') }}
                        >
                            {dict.trade.close_all_sells}
                        </Button>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        { ConfirmationDialogComponent }

        </React.Fragment>
    );
}
