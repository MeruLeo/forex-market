import React from 'react';


export interface Order {
    symbol: string;
    type: string;
    ticket: string;
    trade_id: string;
    price: string;
    unit: string;
    result: string;
    jDate: string;
  }
  
  export interface OrdersTableProps {
    orders: Order[];
  }


const OrdersTable: React.FC<OrdersTableProps> = ({orders}) => {
    return (
        <div className="w-full flex flex-col max-h-56 mt-2 px-4 py-6 border rounded-md shadow-lg" style={{ direction: 'rtl' }}>
            <div className='w-full border-b-2 mb-2'>
                <h1 className="text-lg font-bold mb-4 text-right">دستورات</h1>
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
                                    نوع
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    تیکت
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    تیکت معامله
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    قیمت
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    واحد
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    نتیجه
                                </th>
                                <th className="px-1 py-1 font-medium text-black dark:text-white xl:pl-11">
                                    تاریخ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                
                                <tr className="hover:bg-gray-200 dark:hover:bg-zinc-900 text-[12px]">
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.symbol}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.type}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.ticket}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.trade_id}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.price}
                                    </td>
                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.unit}
                                    </td>

                                    <td className="border-b border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.result}
                                    </td>
                                    <td className="border-b text-nowrap border-[#eee] px-1 py-1 pl-9 dark:border-strokedark xl:pl-11 text-center" style={{direction:"ltr"}}>
                                        {order.jDate}
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

export default OrdersTable;
