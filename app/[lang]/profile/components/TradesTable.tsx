import React from 'react';


export interface Trade {
    symbol: string;
    state: string;
    ticket: string;
    type: string;
    entry: string;
    exit: string;
    profit: string;
    swap: string;
    commission: string;
    unit: string;
    leverage: string;
    tp: string;
    sl: string;
    jDate: string;
  }
  
  export interface TradesTableProps {
    trades: Trade[];
  }


const TradesTable: React.FC<TradesTableProps> = ({trades}) => {
    return (
        <div className="w-full flex flex-col max-h-96 px-4 py-6 border rounded-md shadow-lg" style={{ direction: 'rtl' }}>
            <div className='w-full border-b-2 mb-2'>
                <h1 className="text-lg font-bold mb-4 text-right">معاملات</h1>
            </div>

            <div className="profile-info overflow-auto max-h-full">

                <div className="max-w-full overflow-x-auto font-light">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-center dark:bg-meta-4 text-[14px]">
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    نماد
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    وضعیت
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    تیکت
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    نوع
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    ورود
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    خروج
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    سود
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    سواپ
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    کمسیون
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    واحد
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    اهرم
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    حد سود
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    حد ضرر
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    تاریخ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map(trade => (
                                
                                <tr className={`hover:bg-gray-200 dark:hover:bg-zinc-900 text-[12px] ${trade.state === 'open' ? 'bg-green-300 dark:bg-[#019f1c]' : trade.state === 'close' ? '' : ''}`}>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.symbol}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.state}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.ticket}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.type}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.entry}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.exit}
                                    </td>

                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.profit}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.swap}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.commission}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.unit}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.leverage}
                                    </td>
                                  
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.tp}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.sl}
                                    </td>
                                    <td className="border-b text-nowrap border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {trade.jDate}
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

export default TradesTable;
