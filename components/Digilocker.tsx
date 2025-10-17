import React from 'react';
import { ShieldCheckIcon, BillIcon, LockIcon } from './icons';

const FeatureItem: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; text: string }> = ({ icon: Icon, text }) => (
    <div className="flex items-center space-x-4">
        <div className="bg-teal-500/10 dark:bg-teal-500/20 p-3 rounded-full">
            <Icon className="h-6 w-6 text-teal-600 dark:text-teal-300" />
        </div>
        <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{text}</span>
    </div>
);

const DigiLockerCards = () => (
    <div className="relative w-full max-w-sm h-64 my-8">
        {/* Back Card */}
        <div className="absolute top-0 left-0 w-[95%] transform -rotate-6 bg-white rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-700/50 ml-[2.5%] transition-transform duration-500 group-hover:rotate-[-8deg]">
             <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-600/50"></div>
             <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-600/50 mt-2"></div>
        </div>
        {/* Middle Card */}
        <div className="absolute top-4 left-0 w-[95%] transform rotate-3 bg-white rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-700 ml-[2.5%] transition-transform duration-500 group-hover:rotate-6">
            <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-600/50"></div>
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-600/50 mt-2"></div>
        </div>
        {/* Front Card */}
        <div className="absolute top-8 left-0 w-full transform rotate-0 bg-gradient-to-br from-gold-400 to-amber-500 text-white rounded-xl shadow-2xl p-6 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm opacity-80">DigiLocker</p>
                <div className="w-10 h-6 bg-white/20 rounded-md"></div>
            </div>
            <div className="mt-12">
                <p className="text-xs opacity-70">Your Name</p>
                <p className="font-bold text-xl">SURESH PATEL</p>
            </div>
             <div className="mt-2">
                 <p className="text-xs opacity-70">Aadhaar Number</p>
                <p className="font-mono tracking-widest">**** **** 1234</p>
            </div>
        </div>
    </div>
);


const Digilocker: React.FC = () => {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">DigiLocker</h1>
                <p className="text-slate-500 dark:text-slate-400">Securely access your government-issued documents anytime.</p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center relative">
                    <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-teal-50 to-white dark:from-teal-900/20 dark:to-transparent -z-0"></div>
                    
                    <div className="z-10 group">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-4 lg:mt-8">
                            Your Digital Wallet
                        </h2>
                        <DigiLockerCards />
                         <p className="max-w-md text-slate-600 dark:text-slate-400 mt-4">
                            FinGold provides secure, reliable storage for all your DigiLocker documents and certificates, keeping them safe and accessible.
                        </p>
                    </div>
                </div>
                
                <div className="p-8 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700/50">
                    <div className="max-w-md mx-auto space-y-6">
                        <FeatureItem icon={ShieldCheckIcon} text="Fully secure access" />
                        <FeatureItem icon={BillIcon} text="Government issued documents" />
                        <FeatureItem icon={LockIcon} text="End to End encryption" />
                    </div>
                </div>
                
                <div className="p-6 bg-slate-100 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 text-center mb-2">
                        You will be redirected to the official DigiLocker website to authenticate.
                    </p>
                    <button className="w-full max-w-md mx-auto block bg-teal-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-teal-600 transition-colors text-lg shadow-md hover:shadow-lg">
                        Connect to DigiLocker
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Digilocker;