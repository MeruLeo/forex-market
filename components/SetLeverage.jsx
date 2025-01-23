'use client';
import { cache, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import { useTheme } from 'next-themes';
import Divider from '@mui/material/Divider';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import IconButton from '@mui/material/IconButton';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const SetLeverage = ({dict, symbols}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [symbols_list, setSymbols_list] = useState(symbols);

  const [pair, setpair] = useState(0);
  const [leverage, setLeverage] = useState(1);
  const [error, setError] = useState('');
    const { theme } = useTheme();
  
  const toggleModal = () => {
    console.log(isOpen)
    if(isOpen==false){
      try{
        handleSymbolSelectChange(symbols[0].id)
      }catch{}
        
    }
    setIsOpen(!isOpen);
    setError(''); 
  };

  const handleChangeLeverage = (e) => {
    const newValue = e.target.value;
    // Use regex to allow only whole numbers
    if (/^\d*$/.test(newValue)) {
      setLeverage(newValue);
    }
};

  const handleSymbolSelectChange = (value) => {
    setpair(value);
    get_pair_leverage(value)
};
    const get_pair_leverage = async(pair) =>{
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/get-user-leverage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: localStorage.getItem('token'),
              pair: pair,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            setLeverage(data.leverage)
            setIsLoading(false)

          } else {
            const data = await response.json();
            setError(data.message || 'Failed to get Leverage.');
            toast(data.message || 'Failed to get Leverage.');
            setIsLoading(false)
          }
        } catch (error) {
            toast('An error occurred while getting Leverage.');
            setIsLoading(false)
        }
    }



  const ChangeLeverage = async () => {
    if (leverage === null || leverage <1 || leverage>100 || leverage==0) {
        toast(dict.leverage.error_leverage);
      return;
    }
    if (pair === null || pair <1 ||  pair==0) {
        toast(dict.leverage.error_pair);
        return;
      }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/set-user-leverage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          leverage: leverage,
          pair: pair,
        }),
      });

      if (response.ok) {
        toast(dict.leverage.success)
        toggleModal()
      } else {
        const data = await response.json();
        setError(data || dict.leverage.faild);
        toast(data || dict.leverage.faild);
      }
    } catch (error) {
        toast(dict.leverage._500)
    }
  };

  return (
    <>
    <IconButton color="red" style={{color:"green"}} size='small' onClick={toggleModal} >
                <ModeStandbyIcon />
    </IconButton>
     
      {isOpen && (
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
                    {dict.leverage.title}
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
                         
                        

                        <div className="flex gap-2 items-center justify-between">
                          <div className='w-1/2 font-light text-[12px] sm:text-sm lg:text-base text-nowrap' style={{color: theme === 'dark' ? '#E0E0E0' : 'black'}}>{dict.leverage.symbol}</div>
                          <div className='w-full'>

                           <div className='flex items-center justify-center my-3 w-full'>
                           <select
                                id="symbol-select"
                                disabled={isLoading}
                                value={pair}
                                onChange={(e) => handleSymbolSelectChange(e.target.value)}
                                className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                            >
                                {symbols.map((symbol) => (
                                    <option key={symbol.id} value={symbol.id}>
                                        {symbol.names[dict.lang]}
                                    </option>
                                ))}
                            </select>
                              
                            </div>
                            
                            
                          </div>
                        </div>

                        <div className="flex gap-2 items-center justify-between">
                          <div className='w-1/2 font-light text-[12px] sm:text-sm lg:text-base text-nowrap' style={{color: theme === 'dark' ? '#E0E0E0' : 'black'}}>{dict.leverage.title}: </div>
                          <div className='w-full'>
                            <input
                            type='number'
                            step={1}
                            value={leverage}
                            disabled={isLoading}
                            id="leverage"
                            onChange={handleChangeLeverage}
                            required
                            className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base" style={{overflowY: 'hidden', minHeight: '38px'}} />
                          </div>
                        </div>

                    
                    <Divider />

                    <Button sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',color: theme === 'dark' ? '#E0E0E0' : 'black', }} fullWidth  variant="contained" color="error" size="large" onClick={ChangeLeverage}  >
                    {dict.profile.password.submit}
                    </Button>
                    <Button className='dark:text-white text-black' sx={{ textTransform: 'none',my: 1, fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173', color: theme === 'dark' ? '#E0E0E0' : 'black',}} fullWidth  variant="contained" color="green" size="large" onClick={toggleModal}  >
                    {dict.profile.password.cancel}
                    </Button>
                       
                    </Box>
                </DialogContent>
            </BootstrapDialog>
      )}
    </>
  );
};

export default SetLeverage;
