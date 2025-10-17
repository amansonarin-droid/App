import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
}

const CURRENCY_MAP: { [key: string]: string } = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const currencySymbol = useMemo(() => CURRENCY_MAP[currency] || '₹', [currency]);

  const value = { currency, setCurrency, currencySymbol };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
