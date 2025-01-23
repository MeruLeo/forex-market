import React from 'react';


export interface Transaction {
    jDate: string;
    time: string;
    transaction_id: string;
    amount_dollar: string;
    amount_rial: string;
    type: string;
  }
  
  export interface TransactionProps {
    transactions: Transaction[];
     dict: any;
  }

const TransactionsTable: React.FC<TransactionProps> = ({transactions, dict}) => {
    return (
        <div className="w-full flex flex-col max-h-72 min-h-72 px-4 py-6 border rounded-md shadow-lg">
            <div className='w-full border-b-2 mb-2'>
                <h1 className="text-lg font-bold mb-4 text-right">{dict.profile.transactions.title}</h1>
            </div>

            <div className="profile-info overflow-auto max-h-full">

                <div className="max-w-full overflow-x-auto font-light">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-center dark:bg-meta-4 text-[14px]">
                                <th className="px-2 py-1 font-medium text-black dark:text-white xl:pl-11">
                                {dict.profile.transactions.date}
                                </th>
                                <th className="px-2 py-1 font-medium text-black dark:text-white xl:pl-11">
                                {dict.profile.transactions.ticket}
                                </th>
                                <th className="px-2 py-1 font-medium text-black dark:text-white xl:pl-11">
                                {dict.profile.transactions.amount_dollar}
                                </th>
                               
                                <th className="px-2 py-1 font-medium text-black dark:text-white xl:pl-11">
                                {dict.profile.transactions.type}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr className="hover:bg-gray-200 dark:hover:bg-zinc-900 text-[12px]">
                                    <td className="border-b border-[#eee] px-2 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center">
                                        {dict.lang === 'en'? transaction.time : transaction.jDate} 
                                    </td>
                                    <td className="border-b border-[#eee] px-2 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center">
                                        {transaction.transaction_id}
                                    </td>
                                    <td className="border-b border-[#eee] px-2 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center">
                                        {transaction.amount_dollar}
                                    </td>
                                   
                                    <td className="border-b border-[#eee] px-2 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center">
                                        {transaction.type == 'واریز'? dict.profile.transactions.deposit : dict.profile.transactions.withdraw}
                                    </td>
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default TransactionsTable;
