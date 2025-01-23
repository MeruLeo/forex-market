'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/shadcn/skeleton";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/shadcn/card"
import { Label } from "@/components/shadcn/label"
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group"
import { toast } from 'sonner';

import { Input } from "@/components/shadcn/input";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context';
interface Banks {
    [key: string]: string;
  }
  
  const banks: Banks = {
    "melli": "603799",
    "sepah": "589210",
    "saderat": "603769",
    "keshavarzi": "603770",
    "maskan": "628023",
    "pasian": "622106",
    "pasargad": "502229",
    "ghavamin": "639599",
    "saman": "621986",
    "sina": "639346",
    "shahr": "504706",
    "mellat": "610433",
    "tejarat": "627353",
    "refah": "589463",
    "dey": "502938",
}

const ClientPayment = ({ dict }: { dict: any }) => {
    const [cardNumber, setCardNumber] = useState('')
    const [card_Number, setCard_Number] = useState('')
    const [amount, setAmount] = useState('')
    const [bankImage, setBankImage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { user, setUser } = useAppContext();

    const get_payment = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zarinpal/payment/request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: localStorage.getItem('token'),
                     amount: amount,
                     bank_number:cardNumber
                    }),
            });

            const res = await response.json();
            if (response.ok) {
                setIsLoading(false)
                router.push(res.url)
                return
            }
            if (response.status == 400 || response.status == 401 || response.status == 500 ) {
                setIsLoading(false)
                toast(res.error)
                return
            }

            if (!response.ok) {
                setIsLoading(false)
                toast(res.error)
                return
            }

        } catch (error) {
            setIsLoading(false)
            toast('error')
        }
    }
    const handleAmountChange = (e: any) => {

        setAmount(e.target.value);
    };

    useEffect(() => {
        // Format the initial card number
        const formatCardNumber = (value: any) => {
            const rawValue = value.replace(/\D/g, ''); // Remove non-digit characters
            const formattedValue = rawValue.replace(/(.{4})/g, '$1  ').trim(); // Format to groups of 4
            setCardNumber(formattedValue); // Update the state with the formatted value
        };

        formatCardNumber(cardNumber);
    }, []);
    const handleNumberChange = (e: any) => {
        const rawValue = e.target.value.replace(/\D/g, '');

        // Format the card number to groups of 4 digits
        const formattedValue = rawValue.replace(/(.{4})/g, '$1  ').trim();
        setCardNumber(formattedValue);

        // Check if the card number starts with any bank's number
        const bankKey = Object.keys(banks).find(key => rawValue.startsWith(banks[key]));
        if (bankKey) {
            setBankImage(`/${bankKey}.png`); // Set the corresponding bank logo
        } else {
            setBankImage(''); // Clear the bank logo if no match
        }
    }


    return (
        <main className="flex flex-col items-center w-full min-h-screen md:pt-10 pt-6">

            {/* Card code */}
            <div className='min-w-80 sm:min-w-96 relative overflow-hidden'>
                <div className="h-40 sm:h-48 rounded-lg overflow-hidden my-3 dark:bg-[url('/animated_dark.svg')] bg-[url('/animated_light.svg')] bg-cover bg-center bg-no-repeat">
                    <div className='flex flex-col items-center justify-center w-full p-4'>
                        <div className='w-full text-4xl flex justify-between'>
                            <div className='h-12'>
                                {bankImage ? <Image src={bankImage} alt={bankImage} height={50} width={50} /> : ''}
                            </div>
                        </div>

                        <div className='w-full flex flex-col justify-between mt-4'>
                            <div className='w-full'>

                                <div className='text-left'>
                                    <div className='text-sm max-w-64 overscroll-contain'>
                                        {cardNumber == "" ?
                                            <Skeleton className='w-64 h-6' />
                                            : <h1 className='text-left font-semibold text-lg'>{cardNumber}</h1>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Card className="w-full max-w-96">
                <CardContent className="w-full flex flex-col items-center justify-center" dir={dict.card.email == "Email" ? 'ltr' : 'rtl'}>
                    <div className="w-full flex flex-col items-center">
                        <label htmlFor="card-number" className="w-full text-xs px-2 translate-y-1">
                            <span className="bg-white dark:bg-slate-950">{dict.card.number}</span>
                        </label>
                        <Input id="card-number"
                            dir='ltr'
                            name="number"
                            placeholder={dict.card.sample_number}
                            className="px-4"
                            onChange={handleNumberChange}
                            value={cardNumber}
                        />
                    </div>



                    <div className="w-full flex flex-col items-center">
                        <label htmlFor="amount" className="w-full text-xs px-2 translate-y-1">
                            <span className="bg-white dark:bg-slate-950">{dict.card.amount}</span>
                        </label>
                        <Input id="amount" type="number"
                            name="amount" value={amount}
                            onChange={handleAmountChange}
                            placeholder={dict.card.unit} className="px-4" />
                    </div>
                </CardContent>
                <CardFooter className="w-full">
                    <div className="flex items-center justify-around px-1 mt-2 w-full">
                        <button className="bg-black text-white dark:bg-white dark:text-black text-base rounded-md px-10 py-[6px] pt-1"
                            // disabled={isLoading}
                            onClick={get_payment}>
                            {dict.card.pay}
                        </button>
                    </div>
                </CardFooter>
            </Card>


            {/* <Footer params={p}/> */}
        </main>
    )
}

export default ClientPayment