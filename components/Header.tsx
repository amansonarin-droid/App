import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserIcon, MenuIcon, BellIcon } from './icons';

interface HeaderProps {
    onMenuClick: () => void;
}

const getTitleFromPathname = (pathname: string): string => {
    const cleanPathname = pathname.split('?')[0];
    const routeToTitle: { [key: string]: string } = {
        '/': 'Dashboard',
        '/calculators': 'Calculators',
        '/byajbook': 'Byajbook',
        '/khatabook': 'Khatabook',
        '/billingbook': 'Billingbook',
        '/gold-silver-book': 'Gold/Silverbook',
        '/settings': 'Settings',
        '/help': 'Help & FAQ',
        '/digilocker': 'DigiLocker',
        '/ai-designer': 'AI Design Studio',
        '/jewel-ai': 'Jewel AI Adviser',
        '/chat': 'Chat',
    };
    return routeToTitle[cleanPathname] || 'FinGold Toolkit';
}


const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const location = useLocation();
    const title = getTitleFromPathname(location.pathname);

    return (
    <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 z-20">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
             <button
                className="lg:hidden p-2 -ml-2 mr-2 rounded-md text-slate-600 dark:text-slate-300"
                onClick={onMenuClick}
                aria-label="Open menu"
            >
                <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">{title}</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors" aria-label="Notifications">
             <BellIcon className="h-6 w-6"/>
             <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900/50"></span>
          </button>
          <div className="relative">
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" aria-label="User profile">
                <UserIcon className="h-6 w-6"/>
            </button>
          </div>
        </div>
      </div>
    </header>
    );
};

export default Header;