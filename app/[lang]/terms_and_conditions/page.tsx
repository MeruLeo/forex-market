import React from "react";
import { Metadata } from "next"
import { Locale } from '@/i18n.config';
import { getDictionary_terms } from "@/lib/dictionary";
import { TracingBeam } from "@/components/aceternity/traceBeam";
import BlurIn from "@/components/magic/blurIn";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";

export async function generateMetadata(
    { params }:any
  ): Promise<Metadata> {
    // read route params
    const lang = params.lang
    const t = lang==='en' ? "terms and conditions" : "شرایط و ضوابط" ;
    const description = lang === 'en' ? 'full text of terms and conditions of meta copy' : 'توضیح کامل شرایط و ضوابط سایت meta copy' ;
    return {
      title: t,
      description: description
    }
  }

  
  
export default async function Terms({
    params: { lang }
  } : {
    params: {lang: Locale}
  }) {
    const p = {lang};
    const dict:any = await getDictionary_terms(lang)

    const fetchTerm = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/get-site-terms`, {cache: 'no-cache'});
        let res = await response.json();
        if (!response.ok) {
          return
        }
        return {
          'fa_term':res.fa_term,
          'en_term':res.en_term,
          'kur_term':res.kur_term,
          'fa_term_title':res.fa_term_title,
          'en_term_title':res.en_term_title,
          'kur_term_title':res.kur_term_title,
        }
  
      } catch (error) {
        return {
          'fa_term':'fa_term',
          'en_term':'en_term',
          'kur_term':'kur_term',
          'fa_term_title':'fa_term_title',
          'en_term_title':'en_term_title',
          'kur_term_title':'kur_term_title',
        }
      }
    }
    const appTerms:any = await fetchTerm()

    return(
        <div className="flex min-h-screen flex-col items-center overflow-hidden justify-start pb-2 pt-6 px-2">
          <div className="px-5 mb-8 sm:px-10 w-full flex justify-start h-8 items-center">
            <Link href={`/${lang}?signup=1`}><IoIosArrowRoundBack className="text-3xl hover:text-4xl ease-in-out duration-200 transition"/></Link>
          </div>

          <BlurIn
            word={lang=='en'?appTerms.en_term_title:lang=='fa'?appTerms.fa_term_title:appTerms.kur_term_title}
            className="text-4xl font-bold"
          />
          <TracingBeam className="px-6">
            <div className="p-3 flex flex-col items-center justify-start mt-4">
            {lang=='en'?appTerms.en_term:lang=='fa'?appTerms.fa_term:appTerms.kur_term}
            </div>
            {/* <div className="p-3 flex flex-col items-center justify-start mt-4" dangerouslySetInnerHTML={{ __html: dict.text }}/> */}
          </TracingBeam>
        </div>
    )

}