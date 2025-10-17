import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BillIcon, BookIcon, GemIcon, LoanIcon, DashboardIcon, ChatIcon } from './icons';
import { useAuth } from './AuthContext';

const providerNavItems = [
  { to: '/billingbook', text: 'Billing', icon: BillIcon },
  { to: '/khatabook', text: 'Ledger', icon: BookIcon },
  { to: '/byajbook', text: 'Loans', icon: LoanIcon },
  { to: '/chat', text: 'Chat', icon: ChatIcon },
  { to: '/gold-silver-book', text: 'Stock', icon: GemIcon },
];

const customerNavItems = [
    { to: '/', text: 'Dashboard', icon: DashboardIcon },
    { to: '/byajbook', text: 'Loans', icon: LoanIcon },
    { to: '/khatabook', text: 'Ledger', icon: BookIcon },
    { to: '/billingbook', text: 'Bills', icon: BillIcon },
    { to: '/chat', text: 'Chat', icon: ChatIcon },
];


const BottomNav: React.FC = () => {
    const { role } = useAuth();
    const location = useLocation();
    const navItems = role === 'customer' ? customerNavItems : providerNavItems;
    
    // FIX: Explicitly type indicatorStyle state with React.CSSProperties to allow for properties like 'transform'.
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const [bgPath, setBgPath] = useState('');
    const navRef = useRef<HTMLElement>(null);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
    
    const [dimensions, setDimensions] = useState({ width: window.innerWidth });
    
    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth });
        window.addEventListener('resize', handleResize);
        window.addEventListener("orientationchange", handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener("orientationchange", handleResize);
        }
    }, []);

    const activeIndex = navItems.findIndex(item => {
        if (item.to === '/') return location.pathname === '/';
        return location.pathname.startsWith(item.to);
    });

    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, navItems.length);
    }, [navItems]);

    useLayoutEffect(() => {
        const calculateLayout = () => {
            if (navRef.current) {
                const navWidth = navRef.current.offsetWidth;
                const navHeight = 64; // Corresponds to h-16
                const borderRadius = 20;

                if (activeIndex !== -1) {
                    const itemElement = itemRefs.current[activeIndex];
                    if (itemElement) {
                        const itemLeft = itemElement.offsetLeft;
                        const itemWidth = itemElement.offsetWidth;
                        const indicatorX = itemLeft + itemWidth / 2;

                        setIndicatorStyle({
                            transform: `translateX(${indicatorX}px) translateX(-50%)`,
                            opacity: 1,
                        });
                        
                        const dipHeight = 35;
                        const dipWidth = 70;
                        
                        const startX = indicatorX - dipWidth / 2;
                        const endX = indicatorX + dipWidth / 2;
                        const controlPointOffset = dipWidth * 0.45;

                        const path = `
                            M 0 ${borderRadius}
                            A ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} 0
                            L ${startX} 0
                            C ${startX + controlPointOffset} 0, ${indicatorX - controlPointOffset} ${dipHeight}, ${indicatorX} ${dipHeight}
                            S ${endX - controlPointOffset} 0, ${endX} 0
                            L ${navWidth - borderRadius} 0
                            A ${borderRadius} ${borderRadius} 0 0 1 ${navWidth} ${borderRadius}
                            L ${navWidth} ${navHeight - borderRadius}
                            A ${borderRadius} ${borderRadius} 0 0 1 ${navWidth - borderRadius} ${navHeight}
                            L ${borderRadius} ${navHeight}
                            A ${borderRadius} ${borderRadius} 0 0 1 0 ${navHeight - borderRadius}
                            Z
                        `;
                        setBgPath(path);
                    }
                } else {
                    setIndicatorStyle({ opacity: 0 });
                    const path = `
                        M 0 ${borderRadius}
                        A ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} 0
                        L ${navWidth - borderRadius} 0
                        A ${borderRadius} ${borderRadius} 0 0 1 ${navWidth} ${borderRadius}
                        L ${navWidth} ${navHeight - borderRadius}
                        A ${borderRadius} ${borderRadius} 0 0 1 ${navWidth - borderRadius} ${navHeight}
                        L ${borderRadius} ${navHeight}
                        A ${borderRadius} ${borderRadius} 0 0 1 0 ${navHeight - borderRadius}
                        Z
                    `;
                    setBgPath(path);
                }
            }
        };
        calculateLayout();
    }, [activeIndex, navItems, dimensions]);

    // FIX: JSX cannot render components from array access directly. Store the component in a capitalized variable first.
    const ActiveIcon = activeIndex > -1 && navItems[activeIndex] ? navItems[activeIndex].icon : null;

    return (
        <div 
            className="fixed bottom-4 left-4 right-4 z-30 lg:hidden" 
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <nav
                ref={navRef}
                className="relative w-full h-16"
            >
                <div
                    style={indicatorStyle}
                    className="absolute top-[-15px] w-16 h-16 bg-lime-400 rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] flex items-center justify-center shadow-[0_-5px_15px_-3px_rgba(163,230,53,0.4)]"
                >
                    {ActiveIcon && <ActiveIcon className="h-7 w-7 text-zinc-900" />}
                </div>
                
                <svg className="absolute top-0 left-0 w-full h-full drop-shadow-lg" preserveAspectRatio="none">
                    <path d={bgPath} className="fill-white dark:fill-zinc-900 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]"/>
                </svg>

                <ul className="flex justify-around items-center h-full relative z-10">
                    {navItems.map((item, index) => (
                        <li
                            key={index}
                            // FIX: The ref callback should not return a value. Use a block body to ensure an implicit `undefined` return.
                            ref={el => { itemRefs.current[index] = el; }}
                            className="flex-1 h-full"
                        >
                            <NavLink
                                to={item.to}
                                end={item.to === '/'}
                                className="flex flex-col items-center justify-center w-full h-full"
                                aria-label={item.text}
                            >
                                <div className={`transition-all duration-300 ${activeIndex === index ? 'opacity-0 scale-75 -translate-y-2' : 'opacity-100'}`}>
                                    <item.icon className="h-6 w-6 text-gray-400" />
                                </div>
                                <span className={`absolute bottom-2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${activeIndex === index ? 'opacity-100 text-lime-400' : 'opacity-0 text-gray-400'}`}>
                                    {item.text}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};
export default BottomNav;