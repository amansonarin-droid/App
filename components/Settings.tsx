import React, { useState, useEffect } from 'react';
import { useCurrency } from './CurrencyContext';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Theme</h2>
            <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Appearance</span>
                <div className="flex items-center space-x-2">
                    <span className={`text-sm ${theme === 'light' ? 'text-gold-600' : 'text-slate-500'}`}>Light</span>
                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 dark:focus:ring-offset-slate-800 ${
                            theme === 'dark' ? 'bg-gold-600' : 'bg-slate-300'
                        }`}
                        aria-label="Toggle theme"
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gold-400' : 'text-slate-500'}`}>Dark</span>
                </div>
            </div>
        </div>
    );
}

const CurrencyPreference: React.FC = () => {
    const { currency, setCurrency } = useCurrency();
    const currencies = [
        { code: 'INR', name: 'Indian Rupee (₹)' },
        { code: 'USD', name: 'US Dollar ($)' },
        { code: 'EUR', name: 'Euro (€)' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Currency</h2>
            <div className="flex items-center justify-between">
                <label htmlFor="currency-select" className="text-slate-600 dark:text-slate-400">Default Currency</label>
                <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-48 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-gold-500 focus:outline-none text-slate-800 dark:text-slate-200"
                >
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const PlaceholderContent: React.FC = () => (
  <div className="text-center p-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
    <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400">More Settings Coming Soon</h2>
    <p className="mt-2 text-slate-500">
      We're working on adding more customization options to enhance your experience.
    </p>
  </div>
);

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Customize your experience and manage your account.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <ThemeToggle />
        <CurrencyPreference />
        <PlaceholderContent />
      </div>
    </div>
  );
};

export default Settings;