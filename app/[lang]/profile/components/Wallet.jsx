import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import IconButton from '@mui/material/IconButton';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { useTheme } from 'next-themes';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Cookies from "js-cookie"
import axiosInstance from '@/utils/axiosInstance';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
  },
}));


const Wallet = ({ dict }) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const [is_loading, setIs_loading] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0.0);
  const [balance, setBalance] = useState(0.0);
  const [walleUpdate, setWalletUpdate] = useState('');
  const [amount, setAmount] = useState(0.0);
  const [error, setError] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
    getWallet()
  };
  const handleClose = (event, reason) => {
      setOpen(false);
  };
  

  const handleTakeFromWallet = async () => {
    console.log(typeof(amount))
    
    if(amount<=0){
      toast(dict.wallet.wrong_amount)
      return;
    }
    if (amount > walletAmount) {
      toast(dict.wallet.wrong_amount)
      return;
    }
    setIs_loading(true)

    try {
        const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL2}/take-from-wallet`,
            {
                amount: amount,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (response.status === 200) {
            setIs_loading(false);
            toast("success");
            getWallet();
        } else {
            setIs_loading(false);
            if (response.status === 406) {
                toast(dict.wallet.faild_wallet_amount);
            } else {
                toast("Failed.");
            }
        }
    } catch (error) {
        setIs_loading(false);
        toast("An error occurred");
    }
  };

  const handleAddToWallet = async () => {
    if(amount<=0){
      toast(dict.wallet.wrong_amount)
      return;
    }
    setIs_loading(true)
   
    const token = Cookies.get("access")

    try {
        const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL2}/add-to-wallet`,
            {
                token,
                amount,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (response.status === 200) {
            setIs_loading(false);
            toast("success");
            getWallet();
        } else {
            setIs_loading(false);
            if (response.status === 406) {
                const data = response.data;
                if (data.message === "faild_open_trade") {
                    toast(dict.wallet.faild_open_trade);
                } else if (data.message === "faild_balance_amount") {
                    toast(dict.wallet.faild_balance_amount);
                } else {
                    toast(data.message || "Failed.");
                }
            } else {
                toast("Failed.");
            }
        }
    } catch (error) {
        setIs_loading(false);
        toast("An error occurred");
    }
  };

  const getWallet = async () => {
    setIs_loading(true)
    try {
        const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL2}/user-wallet`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (response.status === 200) {
            const data = response.data;
            setWalletAmount(data.amount.toFixed(2));
            setWalletUpdate(data.updated_at);
            setBalance(data.balance.toFixed(2));
            setAmount(0.0);
            setIs_loading(false);
        } else {
            setIs_loading(false);
            setWalletAmount(0);
            setAmount(0.0);
            setBalance(0.0);
            setWalletUpdate("----/--/--");
            const data = response.data;
            setError(data.message || "Failed.");
            toast(data.message || "Failed.");
        }
    } catch (error) {
        setIs_loading(false);
        setWalletAmount(0);
        setBalance(0.0);
        setWalletUpdate("----/--/--");
        setAmount(0.0);
        toast("An error occurred");
    }
  };


  return (
    <React.Fragment>
    <IconButton color="inherit" size='medium' onClick={handleClickOpen}>
      <AccountBalanceWalletIcon />
    </IconButton>
    <BootstrapDialog
        sx={{
            '& .MuiPaper-root': {
                backgroundColor: theme === 'dark' ? '#263238' : 'white',
                color: theme === 'dark' ? '#E0E0E0' : 'white',
                fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                dir: dict.lang == 'en' ? 'ltr' : 'ltr',
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
            {dict.wallet.title}  <AccountBalanceWalletIcon />
        </DialogTitle>
        <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
                position: 'absolute',
                right: dict.lang === 'en' ? 8: '' ,
                left: dict.lang !== 'en' ? 8: '' ,
                top: 8,
                color: theme === 'dark' ? '#E0E0E0' : 'grey',
            }}
        >
            <CloseIcon />
        </IconButton>
        <DialogContent
            sx={{
                fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                bgcolor: theme === 'dark' ? '#263238' : 'white',
                color: theme === 'dark' ? '#E0E0E0' : 'white',
            }}
            dividers
        >
            <Box
                sx={{
                    '& > :not(style)': { m: 1, width: '90%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center', fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                    bgcolor: theme === 'dark' ? '#263238' : 'white',
                    color: theme === 'dark' ? '#E0E0E0' : 'white',
                }}
            >

            <form >
              <div className='mb-4'>

              <label htmlFor="wallet-amount"  className='dark:bg-zinc-800 dark:text-white text-black'>{dict.wallet.balance} </label>
              <span className='dark:bg-zinc-800 dark:text-white text-black mx-2 px-2 my-2'>{balance}</span>

              <Divider />
              

                <label htmlFor="wallet-amount"  className='dark:bg-zinc-800 dark:text-white text-black'>{dict.wallet.wallet_equity} </label>
                <span className='dark:bg-zinc-800 dark:text-white text-black mx-2 px-2 my-2'>{walletAmount}</span>
                <Divider />
               
              </div>
              <div>
                <label htmlFor="amount" className='dark:bg-zinc-800 dark:text-white text-black'>{dict.wallet.amount} </label>
                <input
                  type="number"
                  step={0.01}
                  className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                  id="amount"
                  value={amount}
                  disabled={is_loading}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setAmount(0.0);
                    } else {
                      const parsedValue = parseFloat(value);
                      if (!isNaN(parsedValue) && parsedValue >= 0) {
                        setAmount(parsedValue);
                      }
                    }
                  }}
                  required
                />
                
              </div>
                <Button sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',color: theme === 'dark' ? '#E0E0E0' : 'black', }} fullWidth  variant="contained" color="error" size="large" onClick={handleTakeFromWallet} disabled={is_loading} >
                {dict.wallet.withdraw}
                    </Button>

                    <Button sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',color: theme === 'dark' ? '#E0E0E0' : 'black', }} fullWidth  variant="contained" color="error" size="large" onClick={handleAddToWallet} disabled={is_loading} >
                    {dict.wallet.deposit}
                    </Button>
                
            </form>
                

            </Box>
        </DialogContent>
    </BootstrapDialog>
</React.Fragment>
  );
};

export default Wallet;
