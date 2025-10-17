import React, { useState } from 'react';
import EMICalculator from './EMICalculator';
import InterestCalculator from './InterestCalculator';

type CalculatorType = 'emi' | 'compound' | 'simple';

const Calculators: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CalculatorType>('emi');
    
    const tabs: {id: CalculatorType, label: string}[] = [
        { id: 'emi', label: 'EMI Calculator' },
        { id: 'compound', label: 'Compound Interest' },
        { id: 'simple', label: 'Simple Interest' }
    ];
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Financial Calculators</h1>
                <p className="text-slate-500 dark:text-slate-400">Powerful tools for your financial planning.</p>
            </div>
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <div className="sm:hidden">
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-base focus:border-gold-500 focus:outline-none focus:ring-gold-500 sm:text-sm"
                            onChange={(e) => setActiveTab(e.target.value as CalculatorType)}
                            value={activeTab}
                        >
                            {tabs.map(tab => ( <option key={tab.id} value={tab.id}>{tab.label}</option> ))}
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <div className="border-b border-slate-200 dark:border-slate-700">
                             <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-gold-500 text-gold-600 dark:text-gold-400'
                                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-700/50">
                    {activeTab === 'emi' && <EMICalculator />}
                    {activeTab === 'compound' && <InterestCalculator type="compound" />}
                    {activeTab === 'simple' && <InterestCalculator type="simple" />}
                </div>
            </div>
        </div>
    );
};

export default Calculators;