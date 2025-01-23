import React from 'react';
import InputWithLabel from './InputWithLabel'; 


export  interface Account {
  total_withdraw: string;
  total_deposit: string;
  total_profit_trades: string;
  total_commission_trades: string;
  total_swap_trades: string;
  total_buy_unit_trades:string,
  total_sell_unit_trades:string,
  buy_trades_count:string,
  sell_trades_count:string,
}
export interface AccountCardProps {
  account: Account;
  dict: any;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, dict }) => {
    return (
    <div className="px-2 py-2 border rounded-md shadow-lg">
      <div className='w-full border-b-2 mb-2'>
        <h1 className="text-lg font-bold mb-4 text-right">{dict.profile.account.title}</h1>
      </div>
      <div className="profile-info ">
        
        <InputWithLabel label={dict.profile.account.totalProfit} value={account.total_profit_trades} type="text" disabled={true} />
        <InputWithLabel label={dict.profile.account.totalCommission} value={account.total_commission_trades} type="text" disabled={true} />
        <InputWithLabel label={dict.profile.account.totalSwap} value={account.total_swap_trades} type="text" disabled={true} />
        <InputWithLabel label={dict.profile.account.totalWithdraw} value={account.total_withdraw} type="text" disabled={true} />
        <InputWithLabel label={dict.profile.account.totalDeposit} value={account.total_deposit} type="text" disabled={true} />
      
        <InputWithLabel label={dict.profile.account.totalBuyUnit} value={account.total_buy_unit_trades} type="text" disabled={true} />
        <InputWithLabel label={dict.profile.account.totalSellUint} value={account.total_sell_unit_trades} type="text" disabled={true} />
        <InputWithLabel label={dict.profile.account.totalBuy} value={account.buy_trades_count} type="text" disabled={true} />
        <InputWithLabel label={dict.profile.account.totalSell} value={account.sell_trades_count} type="text" disabled={true} />

      </div>
    </div>
  );
};

export default AccountCard;
