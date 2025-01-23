'use client';

import { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/avatar';
import { RxPerson } from 'react-icons/rx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';
import LoginDialog from './Login';
import SignupDialog from './Signup';
import { getUserFromToken } from '@/lib/jwt';
import { LogoutUser } from '@/lib/logout';
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/i18n.config';

type Language = 'en' | 'fa' | 'kur';

const dictionaries_user: { [key in Language]: () => Promise<any> } = {
  en: () => import('@/locales/en/user.json').then(module => module.default),
  fa: () => import('@/locales/fa/user.json').then(module => module.default),
  kur: () => import('@/locales/kur/user.json').then(module => module.default),
}

const getDictionary_user = (language: Language) => dictionaries_user[language]();


export function UserNav({ lang }: { lang: string }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, setUser } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [profileTitle, setProfileTitle] = useState<string>();

  
  useEffect(() => {
    if (!user) {
      window.location.href = "/";
      router.push(`/${lang}`);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      LogoutUser()
      router.push(`/${lang}`);
    }
    const langu: Language = lang as Language;

    getDictionary_user(langu).then(res => {
      setProfileTitle(res.profile.title);
    });

    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const token_id = localStorage.getItem('token'); // Get the token from sessionStorage
      setUser(getUserFromToken()); // Call the function to set the user
    }
  }, []);

  const handleSignupOpen = (e: any) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };
  const handleSignupClose = () => {
    setIsSignupOpen(false);
  };

  const handleLoginOpen = (e: any) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };
  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    LogoutUser();
    setUser('');
    router.push(`/${lang}`);
  };

  const loggedIn = user ? true : false;

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?user.image:''} alt="@shadcn" />
            <AvatarFallback>
              <RxPerson className="text-lg" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {loggedIn && (
          <DropdownMenuContent className="w-56" align="end" forceMount>
             <DropdownMenuItem>
              <Link href={`/${lang}/profile`} className='w-full'>
                {profileTitle}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuLabel className="font-normal">
              {user?
              ( <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.username}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.real_name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.phone_number}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.bank_number}</p>
              </div>):''
              }
             
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={handleLogout}>
              <a href="#" className="w-full">
                {lang == 'en' ? 'Log out' : 'خروج'}
              </a>
            </DropdownMenuItem>
           
          </DropdownMenuContent>
        )}
        {!loggedIn && (
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem onClick={handleLoginOpen}> {lang == 'en' ? 'Log in' : 'ورد'} </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignupOpen}>{lang == 'en' ? 'Sign up' : 'عضویت'}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignupOpen}>{lang == 'en' ? 'Sign up' : 'عضویت'}</DropdownMenuItem>

            
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <LoginDialog isOpen={isLoginOpen} onclose={handleLoginClose} />
      <SignupDialog isOpen={isSignupOpen} onclose={handleSignupClose} />
    </div>
  );
}
