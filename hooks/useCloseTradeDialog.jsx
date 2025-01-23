import React from 'react';
import { useState } from 'react';
import ConfirmationDialog from '@/components/CloseTradeDialog'


export function useConfirmationDialog(){
    const [showDialog, setShowDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const [loading, setLoading] = useState(false);

    const confirm = (dict, message, operation,min,max, ...args) => {
        setDialogProps({
            dict,
            message,
            operation,
            min,
            max,
            args
        });
        setShowDialog(true);
    }


    const handleConfirm = async (valume) =>{
        setLoading(true);
        setShowDialog(false);

        if(dialogProps.operation){
            try{
                await dialogProps.operation(...dialogProps.args,valume);
            }catch(error){
                console.log('Error: ', error);
            }finally{
                setLoading(false);
            }
        }
    }

    const handleCancel = () =>{
        setShowDialog(false);
        setDialogProps({});
    }


    return {
        confirm,
        ConfirmationDialogComponent:(
            <ConfirmationDialog 
                dict={dialogProps.dict}
                show={showDialog}
                message={dialogProps.message}
                min={dialogProps.min}
                max={dialogProps.max}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={loading}
            />
        ),
    };

}