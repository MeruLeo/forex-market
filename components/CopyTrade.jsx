import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import IconButton from '@mui/material/IconButton';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { useTheme } from 'next-themes';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Checkbox } from './shadcn/checkbox';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
  },
}));


const CopyTrade = ({ dict, symbols }) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const [is_loading, setIs_loading] = useState(false);
  const [current_copy_from, setCurrentCopyFrom] = useState('');
  const [current_copy_units, setCurrentCopyUnits] = useState(1);
  const [current_copy_reverse, setCurrentCopyReverse] = useState(false);
  const [current_copy_symbol, setCurrentCopySymbol] = useState('');

  const [new_copy_from, setNewCopyFrom] = useState('');
  const [new_copy_unit, setNewCopyUnit] = useState(1);
  const [new_copy_symbol, setNewCopySymbol] = useState('');
  const [new_copy_reverse, setNewCopyReverse] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
    getCopyFrom()
  };
  const handleClose = (event, reason) => {
      setOpen(false);
  };
  

  const handleRemoveCopyTrade = async () => {
   
    setIs_loading(true)
    const token = localStorage.getItem('token')

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/remove-copy-from`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token,
        }),
      });

      if (response.ok) {
        setIs_loading(false)
        toast(dict.copy_trade.success_remove)

        const data = await response.json();
        setCurrentCopyFrom(data.copy_from || '-')
        setCurrentCopyUnits(data.max_unit || 1)
        setCurrentCopyReverse(data.reverse || false)
        setCurrentCopySymbol(data.symbol? data.symbol.name: '-')
        setNewCopyFrom('-')
        setNewCopyUnit(1)
        setNewCopySymbol('-')
        setNewCopyReverse(false)
        setIs_loading(false)

        setOpen(false);
      } else {
        setIs_loading(false)
        toast(dict.copy_trade.faild_remove)
      }
    } catch (error) {
        setIs_loading(false)
        toast('An error occurred');
    }
  };

  const handleSetCopyFrom = async () => {
    setIs_loading(true)
   
    const token = localStorage.getItem('token')

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/set-copy-from`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token,
            username: new_copy_from,
            symbol_id: new_copy_symbol,
            reverse: new_copy_reverse,
            max_units: new_copy_unit
        }),
      });

      if (response.ok) {
        setIs_loading(false)
        toast("success")
        
        const data = await response.json();
        setCurrentCopyFrom(data.copy_from || '-')
        setCurrentCopyUnits(data.max_unit || 1)
        setCurrentCopyReverse(data.reverse || false)
        setCurrentCopySymbol(data.symbol.name || '-')
        setNewCopyFrom('-')
        setNewCopyUnit(1)
        setNewCopySymbol('-')
        setNewCopyReverse(false)
        setIs_loading(false)
        setOpen(false);
        
      } else {
        setIs_loading(false)
        
        if (response.status === 400) {
            const data = await response.json();
            if(data.symbol_id){
                toast(dict.copy_trade.symbol_not_exists)
            }else if(data.message==='symbol_not_found'){
                toast(dict.copy_trade.symbol_not_exists)
            }else if(data.message==='user_not_found'){
                toast(dict.copy_trade.user_not_exists)
            }
        }else{
          toast(data.message || 'Failed.');
        }
      }
    } catch (error) {
        setIs_loading(false)
        toast('An error occurred');
    }
  };

  const getCopyFrom = async () => {
    setIs_loading(true)
    const token = localStorage.getItem('token')
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/get-copy-from`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentCopyFrom(data.copy_from || '-')
        setCurrentCopyUnits(data.max_unit || 1)
        setCurrentCopyReverse(data.reverse || false)
        setCurrentCopySymbol(data.symbol? data.symbol.name: '-')
        setNewCopyFrom('-')
        setNewCopyUnit(1)
        setNewCopySymbol('-')
        setNewCopyReverse(false)
        setIs_loading(false)
      } else {
        setIs_loading(false)
        setCurrentCopyFrom('-')
        setCurrentCopyUnits(1)
        setCurrentCopyReverse(false)
        setCurrentCopySymbol(symbol.name)
        setNewCopyFrom('-')
        setNewCopyUnit(1)
        setNewCopySymbol('-')
        setNewCopyReverse(false)
        const data = await response.json();
        toast(data.message || 'Failed.');

      }
    } catch (error) {
        console.log(error)
        setIs_loading(false)
        setCurrentCopyFrom('-')
        setCurrentCopyUnits(1)
        setCurrentCopyReverse(false)
        setCurrentCopySymbol('-')
        setNewCopyFrom('-')
        setNewCopyUnit(1)
        setNewCopySymbol('-')
        setNewCopyReverse(false)
        toast('An error occurred');
    }
  };


  return (
    <React.Fragment>
    <IconButton color="inherit" size='medium' onClick={handleClickOpen}>
      <AutoGraphIcon />
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
            {dict.copy_trade.title}  <AutoGraphIcon />
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
                    '& > :not(style)': { m: 1 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center', fontFamily: '__Rubik_6eb173, __Rubik_Fallback_6eb173',
                    bgcolor: theme === 'dark' ? '#263238' : 'white',
                    color: theme === 'dark' ? '#E0E0E0' : 'white',
                }}
            >

            <form >
              <div className='flex flex-col w-full mb-4'>
                
                <div className='flex flex-col w-full mb-1'>
                    <label className=' dark:text-white text-black'>{dict.copy_trade.current} </label>
                    <span className=' dark:text-white text-black mx-2 px-2 my-2'>{current_copy_from}</span>
                </div>

                <div className='flex w-full'>
                    <div className='flex flex-col w-full mb-1'>
                        <label className=' dark:text-white text-black'>{dict.copy_trade.symbol} </label>
                        <span className=' dark:text-white text-black mx-2 px-2 my-2'>{current_copy_symbol}</span>
                    </div>
                    <div className='flex flex-col w-full mb-1'>
                        <label className=' dark:text-white text-black'>{dict.copy_trade.units} </label>
                        <span className=' dark:text-white text-black mx-2 px-2 my-2'>{current_copy_units}</span>
                    </div>
                </div>
                <div className='flex'>
                    <label htmlFor="curret_is_reverce" className=' dark:text-white text-black mx-2'>{dict.copy_trade.reversed} </label>
                    <span className=' dark:text-white text-black mx-2'>{current_copy_reverse? dict.copy_trade.reverce_true: dict.copy_trade.reverce_false}</span>
                </div>
                
               


                <button
                className='text-black bg-orange-500 dark:text-white px-5 py-1 mx-2 mt-2 rounded'
                onClick={handleRemoveCopyTrade} disabled={is_loading}
                >
                    {dict.copy_trade.remove}
                </button>
              </div>


              <div className='flex flex-col w-full mb-3'>
                <label htmlFor="new_user" className=' dark:text-white text-black'>{dict.copy_trade.new} </label>
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                  id="new_copy_from"
                  value={new_copy_from}
                  disabled={is_loading}
                  onChange={(e) => {
                    setNewCopyFrom(e.target.value);
                  }}
                  required
                />
                <div className='flex gap-2'>
                    <div className='flex flex-col' style={{width:'120px'}}>
                        <label htmlFor="new_user" className=' dark:text-white text-black' style={{whiteSpace:'nowrap'}}>{dict.copy_trade.symbol} </label>
                        <select
                            id="symbol-select"
                            disabled={is_loading}
                            onChange={(e) => setNewCopySymbol(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                        >
                            <option key={0} value={0}>
                                select one
                            </option>
                            {symbols.map((symbol) => (
                                <option key={symbol.id} value={symbol.id}>
                                    {symbol.names[dict.lang]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col' style={{width:'90px'}}>
                        <label htmlFor="new_units" className=' dark:text-white text-black'>{dict.copy_trade.units} </label>
                        <input
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                        id="new_units"
                        value={new_copy_unit}
                        disabled={is_loading}
                        step={1}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const parsedValue = parseInt(newValue, 10);
                          if (!isNaN(parsedValue)) {
                            setNewCopyUnit(parsedValue);
                          } else if (newValue === "") {
                            setNewCopyUnit("");
                          }
                        }}
                        required
                        />
                    </div>

                </div>
                <div className='flex mt-2'>
                    <label htmlFor="curret_is_reverce" className=' dark:text-white text-black mx-2'>{dict.copy_trade.reversed} </label>
                    <Checkbox id="curret_is_reverce" checked={new_copy_reverse}  onCheckedChange={() => setNewCopyReverse(!new_copy_reverse)}/>
                </div>
               


                <button
                className='text-black bg-sky-500 px-5 py-1 mx-2 mt-2 rounded'
                onClick={handleSetCopyFrom} disabled={is_loading}
                >
                    {dict.copy_trade.confirm}
                </button>
                
              </div>
                
            </form>
                

            </Box>
        </DialogContent>
    </BootstrapDialog>
</React.Fragment>
  );
};

export default CopyTrade;
