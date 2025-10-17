import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, CalculatorIcon, BookIcon, BillIcon, GemIcon, SettingsIcon, HelpIcon, IdCardIcon, ChatIcon } from './icons';

const navItems = [
  { to: '/', text: 'Dashboard', icon: DashboardIcon },
  { to: '/calculators', text: 'Calculator', icon: CalculatorIcon },
  { to: '/byajbook', text: 'Byajbook', icon: BookIcon },
  { to: '/khatabook', text: 'Khatabook', icon: BookIcon },
  { to: '/billingbook', text: 'Billingbook', icon: BillIcon },
  { to: '/chat', text: 'Chat', icon: ChatIcon },
  { to: '/gold-silver-book', text: 'Gold/Silverbook', icon: GemIcon },
  { to: '/digilocker', text: 'DigiLocker', icon: IdCardIcon },
];

const helpItem = { to: '/help', text: 'Help/FAQ', icon: HelpIcon };
const settingsItem = { to: '/settings', text: 'Settings', icon: SettingsIcon };


interface SidebarProps {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
    const NavLinkItem: React.FC<{ to: string, text: string, icon: React.FC<React.SVGProps<SVGSVGElement>> }> = ({ to, text, icon: Icon }) => (
         <NavLink
            to={to}
            end={to === '/'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
                `flex items-center px-3 py-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-gold-500/10 text-gold-300 font-semibold border-l-4 border-gold-400'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`
            }
        >
            <Icon className="h-6 w-6 mr-3" />
            <span className="text-sm">{text}</span>
        </NavLink>
    );

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="px-2">
                <div className="flex items-center text-2xl font-bold text-gold-400">
                    <GemIcon className="h-8 w-8 mr-2" />
                    <h1>FinGold</h1>
                </div>
                <nav className="mt-8">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLinkItem {...item} />
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="mt-auto px-2">
                <NavLinkItem {...helpItem} />
                <NavLinkItem {...settingsItem} />
            </div>
        </div>
    );

    return (
        <>
            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
            
            {/* Sidebar */}
            <aside className={`fixed lg:relative top-0 left-0 h-full bg-slate-800 dark:bg-slate-900 w-64 p-2 z-40 transform transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <NavContent />
            </aside>
        </>
    );
};

export default Sidebar;