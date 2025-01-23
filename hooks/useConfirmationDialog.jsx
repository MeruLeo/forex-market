import React from 'react';
import { useState } from 'react';
import ConfirmationDialog from '@/components/ConfirmationDialog'


export function useConfirmationDialog(){
    const [showDialog, setShowDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const [loading, setLoading] = useState(false);

    const confirm = (dict, message, operation, ...args) => {
        setDialogProps({
            dict,
            message,
            operation,
            args
        });
        setShowDialog(true);
    }


    const handleConfirm = async () =>{
        setLoading(true);
        setShowDialog(false);

        if(dialogProps.operation){
            try{
                await dialogProps.operation(...dialogProps.args);
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
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={loading}
            />
        ),
    };

}