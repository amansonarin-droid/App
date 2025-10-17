import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from './CurrencyContext';
import { 
    CalculatorIcon, BookIcon, BillIcon, GemIcon, IdCardIcon, LoanIcon, AlertTriangleIcon, 
    GetLoanIcon3D, SaveInGoldIcon3D, JewelAiIcon3D
} from './icons';
import { useAuth } from './AuthContext';

const StatCard: React.FC<{ 
    icon: React.FC<React.SVGProps<SVGSVGElement>>; 
    title: string;
    value: string; 
    change: string; 
    isPositive: boolean;
    iconBgClass: string;
}> = ({ icon: Icon, title, value, change, isPositive, iconBgClass }) => (
    <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-lg p-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${iconBgClass}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
        <p className={`text-sm font-semibold mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
    </div>
);

const ServiceCard: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; title: string; to: string; is3D?: boolean; accentColor?: string; }> = ({ icon: Icon, title, to, is3D = false, accentColor = 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200' }) => (
  <Link 
    to={to} 
    className="group relative block bg-white/60 dark:bg-slate-800/40 backdrop-blur-lg p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 text-center"
  >
    <div className="flex flex-col items-center justify-center h-full">
        <div className={`flex-shrink-0 flex items-center justify-center mb-2 ${is3D ? '' : `h-14 w-14 rounded-full transition-colors duration-300 ${accentColor}`}`}>
          <Icon className={`${is3D ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-8 w-8'}`} />
        </div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm leading-tight">{title}</h3>
    </div>
  </Link>
);

const allServices = [
    { title: 'Get Loan', to: '/byajbook?action=new-enquiry', icon: GetLoanIcon3D, is3D: true },
    { title: 'Save in Gold', to: '/gold-silver-book', icon: SaveInGoldIcon3D, is3D: true },
    { title: 'Jewel AI', to: '/jewel-ai', icon: JewelAiIcon3D, is3D: true },
    { title: 'AI Jewelry Studio', to: '/ai-designer', icon: GemIcon, accentColor: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300' },
    { title: 'Calculators', to: '/calculators', icon: CalculatorIcon, accentColor: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' },
    { title: 'Byajbook', to: '/byajbook', icon: BookIcon, accentColor: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300' },
    { title: 'Khatabook', to: '/khatabook', icon: BookIcon, accentColor: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300' },
    { title: 'Billingbook', to: '/billingbook', icon: BillIcon, accentColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-300' },
    { title: 'Gold/Silverbook', to: '/gold-silver-book', icon: GemIcon, accentColor: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' },
    { title: 'DigiLocker', to: '/digilocker', icon: IdCardIcon, accentColor: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300' },
];

const Dashboard: React.FC = () => {
    const { currencySymbol } = useCurrency();
    const { role } = useAuth();
    const goldRate = 72850;
    const silverRate = 85.50;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Good Morning!</h1>
                <p className="text-slate-500 dark:text-slate-400">Here's your financial overview for today.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-lg p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50 md:col-span-2 xl:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-700">
                        {/* Gold Section */}
                        <div className="flex items-center justify-between py-2 sm:py-0 sm:pr-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-gold-100 dark:bg-gold-900/50">
                                    <GemIcon className="h-6 w-6 text-gold-600 dark:text-gold-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">Gold Rate</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">24k, per 10g</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{`${currencySymbol}${goldRate.toLocaleString('en-IN')}`}</p>
                                <p className="text-xs font-semibold text-green-500">+0.8%</p>
                            </div>
                        </div>

                        {/* Silver Section */}
                        <div className="flex items-center justify-between pt-2 sm:pt-0 sm:pl-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700">
                                    <GemIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">Silver Rate</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">per 1g</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{`${currencySymbol}${silverRate.toLocaleString('en-IN')}`}</p>
                                <p className="text-xs font-semibold text-red-500">-1.2%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {role !== 'customer' && <>
                  <StatCard 
                      title="Active Loans" 
                      value="12" 
                      change="+2 this week" 
                      isPositive={true}
                      icon={LoanIcon}
                      iconBgClass="bg-cyan-500"
                  />
                  <StatCard 
                      title="Pending Payments" 
                      value={`${currencySymbol}5,22,180`} 
                      change="3 due today" 
                      isPositive={false}
                      icon={AlertTriangleIcon}
                      iconBgClass="bg-red-500"
                  />
                </>}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tools &amp; Services</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {allServices.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;