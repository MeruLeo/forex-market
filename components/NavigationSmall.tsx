import React from 'react'
import { ModeToggle } from "@/components/mode-toggle";
import Link from 'next/link';
import { UserNav } from './user-nav';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary'
import LocaleSwitcher from './locale-switcher';
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import WithdrawalRequest from '@/components/user-cards/WithdrawalRequest'
import { getDictionary_user } from "@/lib/dictionary";






const NavigationSmall = async ({
  params: { lang }, siteTitle, botUrl, callUrl, pwaUrl, reserveUrl,botIcon, pwaIcon, callIcon, reserveIcon
}: {
  params: { lang: Locale }, siteTitle:string, botUrl:string, callUrl:string, pwaUrl:string, reserveUrl:string, botIcon:string,pwaIcon:string,callIcon:string, reserveIcon:string
}) => {

  const dict_user: any = await getDictionary_user(lang)
  const dict: any = await getDictionary(lang)
  const p = { lang };
  const reserveIcon_ = { __html: reserveIcon };
  const callIcon_ = { __html: callIcon };
  const pwaIcon_ = { __html: pwaIcon };
  const botIcon_ = { __html: botIcon };

  return (
    <nav className='fixed w-full top-0 left-0 z-20 shadow-lg
    backdrop-filter backdrop-blur-md'>

      <div className='flex justify-between items-center w-full'>
        <div className='px-3 z-30 flex sm:items-center sm:justify-center'>
          <Link id='sitetitle' href={`/${lang}/user`} className='w-full text-center'>
            {siteTitle}
          </Link>
        </div>

        <div className='object-right pr-4 lg:pr-8 flex overflow-x-auto'>

        
        
        <div className='flex gap-[1px]'>

          <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
              <a href={reserveUrl} target='_blank' dangerouslySetInnerHTML={{ __html: `${reserveIcon}` }}  style={{width:'25px', height:'25px'}} />
          </div>


          <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
              <a href={callUrl} target='_blank' dangerouslySetInnerHTML={{ __html: `${callIcon}` }}  style={{width:'25px', height:'25px'}} />
          </div>

          <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
              <a href={pwaUrl} target='_blank' dangerouslySetInnerHTML={{ __html: `${pwaIcon}` }}  style={{width:'25px', height:'25px'}} />
          </div>

          <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
              <a href={botUrl} target='_blank'  dangerouslySetInnerHTML={{ __html: `${botIcon}` }}  style={{width:'25px', height:'25px'}}  />
          </div>
        </div>


          <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
            <WithdrawalRequest dict={dict_user} />
          </div>

          

          {/* <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
            <Link href={`/${lang}/payment`} className='animate-rotateVertical text-2xl 
            rounded-lg hover:bg-slate-50 hover:dark:bg-slate-800'>
              <RiMoneyDollarCircleFill className='m-2  ' />
            </Link>
          </div> */}

          <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
            <div className='animate-rotateVertical text-2xl 
            rounded-lg hover:bg-slate-50 hover:dark:bg-slate-800'>
              <ModeToggle />
            </div>
          </div>

          <div className='pt-0 sm:pt-2 pr-1 flex items-center justify-center'>
            <div className='animate-rotateVertical text-2xl 
            rounded-lg hover:bg-slate-50 hover:dark:bg-slate-800'>

              <LocaleSwitcher params={p} />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 pt-[6px]">
            <UserNav lang={lang} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationSmall