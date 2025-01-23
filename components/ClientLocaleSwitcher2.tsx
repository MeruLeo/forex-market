"use client";
import React from 'react'
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import { i18n, type Locale } from "@/i18n.config";
import { usePathname } from "next/navigation";
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"

const ClientLocaleSwitcher = ({
  dict
}: {
  dict: any
}) => {
  const pathName = usePathname();
  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className="flex sm:flex-col gap-2 sm:gap-5">
       
            {i18n.locales.map((locale) => (
              <div key={locale}>
                <Link href={redirectedPathName(locale)} className="w-full flex justify-between items-center">
                
                <div>{locale == 'en'? 'English':locale == 'fa'? 'فارسی': 'کوردی'}</div>
                <div>
                {locale == 'kur'? (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="1" y="11" width="30" height="10" fill="#fff" stroke-width="0"></rect><path d="m5,4h22c2.2077,0,4,1.7923,4,4v4H1v-4c0-2.2077,1.7923-4,4-4Z" fill="#ed1b1e" stroke-width="0"></path><path d="m5,20h22c2.2077,0,4,1.7923,4,4v4H1v-4c0-2.2077,1.7923-4,4-4Z" transform="translate(32 48) rotate(180)" fill="#248f41" stroke-width="0"></path><path d="m27,4H5c-2.2091,0-4,1.7908-4,4v16c0,2.2092,1.7909,4,4,4h22c2.2092,0,4-1.7908,4-4V8c0-2.2092-1.7908-4-4-4Zm3,20c0,1.6543-1.3457,3-3,3H5c-1.6543,0-3-1.3457-3-3V8c0-1.6543,1.3457-3,3-3h22c1.6543,0,3,1.3457,3,3v16Z" opacity=".15" stroke-width="0"></path><path d="m27,5H5c-1.6569,0-3,1.3431-3,3v1c0-1.6569,1.3431-3,3-3h22c1.6569,0,3,1.3431,3,3v-1c0-1.6569-1.3431-3-3-3Z" fill="#fff" opacity=".2" stroke-width="0"></path><path d="m16,9.3519l.4982,3.38,1.4724-3.0831-.5202,3.3768,2.3157-2.5121-1.4924,3.0734,2.9532-1.7179-2.332,2.4969,3.3284-.7711-2.9644,1.6987,3.4078.2442-3.3333.7494,3.1844,1.2378-3.4061-.2664,2.6781,2.1215-3.1763-1.2586,1.9338,2.8166-2.6642-2.1389,1.0177,3.2615-1.9154-2.8291.0111,3.4165-.9964-3.268-.9964,3.268.0111-3.4165-1.9154,2.8291,1.0177-3.2615-2.6642,2.1389,1.9338-2.8166-3.1763,1.2586,2.6781-2.1215-3.4061.2664,3.1844-1.2379-3.3333-.7494,3.4078-.2442-2.9644-1.6987,3.3284.7711-2.332-2.4969,2.9532,1.7179-1.4924-3.0733,2.3157,2.5121-.5202-3.3768,1.4724,3.0831.4982-3.38Z" fill="#f3bf45" stroke-width="0"></path></svg>) :locale == 'en'?(<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>):(<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#fff" d="M1 11H31V21H1z"></path><path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#4d9e4a"></path><path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#c92a1d"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M18.061,16.805c.39-1.199,.021-2.514-.934-3.337,1.038,1.536,.664,3.611-.825,4.692l.104-2.56v-2.015c-.161-.077-.301-.194-.405-.34-.104,.145-.243,.262-.405,.34v2.015l.104,2.56c-1.489-1.081-1.864-3.156-.825-4.692-.956,.822-1.324,2.138-.934,3.337,.263,.809,.825,1.437,1.523,1.803-.427,.156-.883,.227-1.342,.204,.539,.175,1.091,.195,1.608,.086l.004,.108,.267,.367,.267-.367,.004-.108c.517,.109,1.069,.089,1.608-.086-.459,.022-.915-.049-1.342-.204,.699-.366,1.26-.994,1.523-1.803Z" fill="#c92a1d"></path><path d="M19.077,14.634c-.355-.614-.943-1.058-1.631-1.23,1.513,1.138,1.818,3.287,.68,4.801-.002,.003-.004,.005-.006,.008,1.252-.724,1.681-2.326,.957-3.578Z" fill="#c92a1d"></path><path d="M14.554,13.404c-.688,.172-1.277,.616-1.631,1.23-.724,1.252-.295,2.854,.957,3.578-.002-.003-.004-.005-.006-.008-1.138-1.513-.833-3.663,.68-4.801Z" fill="#c92a1d"></path><path d="M15.311,13.215c.223,.157,.532,.103,.689-.12,.157,.223,.466,.277,.689,.12,.187-.132,.26-.375,.175-.588-.048,.254-.292,.421-.546,.373-.134-.025-.25-.107-.318-.225-.068,.118-.184,.2-.318,.225-.254,.048-.498-.119-.546-.373-.085,.213-.013,.456,.175,.588Z" fill="#c92a1d"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>)}
                  
                  </div>
                </Link>
              </div>
            ))}
         
      </div>
    </div>
  )
}

export default ClientLocaleSwitcher