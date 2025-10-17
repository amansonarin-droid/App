import React, { useState, useMemo } from 'react';
import type { WalletTransaction } from '../types';
import { useCurrency } from './CurrencyContext';
import { PlusIcon, WalletIcon, XIcon } from './icons';

// Hardcoded current rates for demonstration
const GOLD_RATE_24K_PER_10G = 72850;
const SILVER_RATE_PER_1G = 85.50;

const getInitialWallets = (): { gold: { transactions: WalletTransaction[] }, silver: { transactions: WalletTransaction[] } } => ({
    gold: {
        transactions: [
            { id: 'g-txn-1', date: '2023-11-10', amountPaid: 50000, rateAtPurchase: 65000, gramsPurchased: 7.692 },
            { id: 'g-txn-2', date: '2024-01-15', amountPaid: 70000, rateAtPurchase: 68500, gramsPurchased: 10.219 },
        ]
    },
    silver: {
        transactions: [
            { id: 's-txn-1', date: '2023-12-05', amountPaid: 10000, rateAtPurchase: 75, gramsPurchased: 133.333 },
        ]
    }
});

const formatCurrency = (amount: number) => amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

type MetalType = 'gold' | 'silver';

const AddPurchaseModal: React.FC<{
    metal: MetalType,
    onClose: () => void,
    onAdd: (metal: MetalType, transaction: Omit<WalletTransaction, 'id'>) => void
}> = ({ metal, onClose, onAdd }) => {
    const { currencySymbol } = useCurrency();
    const defaultRate = metal === 'gold' ? GOLD_RATE_24K_PER_10G : SILVER_RATE_PER_1G;
    const rateUnit = metal === 'gold' ? 'per 10g' : 'per 1g';
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amountPaid, setAmountPaid] = useState('');
    const [rateAtPurchase, setRateAtPurchase] = useState(defaultRate.toString());

    const gramsPurchased = useMemo(() => {
        const amount = parseFloat(amountPaid);
        const rate = parseFloat(rateAtPurchase);
        if (!amount || !rate || amount <= 0 || rate <= 0) return 0;

        const ratePerGram = metal === 'gold' ? rate / 10 : rate;
        return amount / ratePerGram;
    }, [amountPaid, rateAtPurchase, metal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const transaction: Omit<WalletTransaction, 'id'> = {
            date,
            amountPaid: parseFloat(amountPaid),
            rateAtPurchase: parseFloat(rateAtPurchase),
            gramsPurchased,
        };
        onAdd(metal, transaction);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg capitalize">Add {metal} Purchase</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><XIcon className="h-5 w-5"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-gold-500" required />
                    <input type="number" placeholder={`Amount Paid (${currencySymbol})`} value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-gold-500" required />
                    <input type="number" placeholder={`Rate at Purchase (${rateUnit})`} value={rateAtPurchase} onChange={e => setRateAtPurchase(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-gold-500" required />
                    <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-md text-center">
                        <p className="text-sm text-slate-500">Grams Purchased</p>
                        <p className="font-bold text-lg text-gold-500">{gramsPurchased.toFixed(3)}g</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-gold-500 hover:bg-gold-600 rounded-lg">Add Purchase</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const HistoryModal: React.FC<{
    metal: MetalType,
    transactions: WalletTransaction[],
    onClose: () => void
}> = ({ metal, transactions, onClose }) => {
    const { currencySymbol } = useCurrency();
    const rateUnit = metal === 'gold' ? '/ 10g' : '/ 1g';
    return(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="font-bold text-lg capitalize">{metal} Purchase History</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><XIcon className="h-6 w-6"/></button>
                </div>
                <div className="overflow-y-auto -mx-6 px-6">
                    <table className="w-full text-sm text-left">
                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900">
                            <tr>
                                <th className="p-2 font-semibold">Date</th>
                                <th className="p-2 text-right font-semibold">Amount Paid</th>
                                <th className="p-2 text-right font-semibold">Rate ({rateUnit})</th>
                                <th className="p-2 text-right font-semibold">Grams Purchased</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                [...transactions].reverse().map(tx => (
                                    <tr key={tx.id} className="border-b dark:border-slate-700">
                                        <td className="p-2">{formatDate(tx.date)}</td>
                                        <td className="p-2 text-right">{currencySymbol}{formatCurrency(tx.amountPaid)}</td>
                                        <td className="p-2 text-right">{currencySymbol}{formatCurrency(tx.rateAtPurchase)}</td>
                                        <td className="p-2 text-right font-semibold text-gold-600 dark:text-gold-400">{tx.gramsPurchased.toFixed(3)}g</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-slate-500">No purchase history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const GoldSilverbook: React.FC = () => {
    const { currencySymbol } = useCurrency();
    const [wallets, setWallets] = useState(getInitialWallets);
    const [isAddModalOpen, setAddModalOpen] = useState<MetalType | null>(null);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState<MetalType | null>(null);

    const totals = useMemo(() => {
        const totalGoldGrams = wallets.gold.transactions.reduce((sum, tx) => sum + tx.gramsPurchased, 0);
        const totalSilverGrams = wallets.silver.transactions.reduce((sum, tx) => sum + tx.gramsPurchased, 0);

        const goldCurrentValue = (totalGoldGrams / 10) * GOLD_RATE_24K_PER_10G;
        const silverCurrentValue = totalSilverGrams * SILVER_RATE_PER_1G;
        
        return { totalGoldGrams, totalSilverGrams, goldCurrentValue, silverCurrentValue };
    }, [wallets]);

    const handleAddPurchase = (metal: MetalType, transaction: Omit<WalletTransaction, 'id'>) => {
        const newTx: WalletTransaction = { ...transaction, id: `${metal.charAt(0)}-txn-${Date.now()}` };
        setWallets(prev => ({
            ...prev,
            [metal]: {
                transactions: [newTx, ...prev[metal].transactions]
            }
        }));
        setAddModalOpen(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Gold & Silver Wallet</h1>
                <p className="text-slate-500 dark:text-slate-400">Track your personal precious metal investments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gold Wallet Card */}
                <div className="bg-gradient-to-br from-gold-50 via-white to-gold-100 dark:from-slate-800 dark:via-slate-800/50 dark:to-gold-900/20 rounded-xl shadow-lg p-6 border border-gold-200 dark:border-gold-800/50">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gold-100 dark:bg-gold-900/50 rounded-full">
                            <WalletIcon className="h-8 w-8 text-gold-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Gold Wallet</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">24k Purity</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="text-center bg-white/50 dark:bg-slate-900/40 p-3 rounded-lg">
                            <p className="text-sm text-slate-500">Total Holdings</p>
                            <p className="text-3xl font-bold">{totals.totalGoldGrams.toFixed(3)}g</p>
                        </div>
                        <div className="text-center bg-white/50 dark:bg-slate-900/40 p-3 rounded-lg">
                            <p className="text-sm text-slate-500">Current Market Value</p>
                            <p className="text-3xl font-bold text-green-600">{currencySymbol}{formatCurrency(totals.goldCurrentValue)}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setAddModalOpen('gold')} className="w-full flex items-center justify-center gap-2 bg-gold-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg">
                           <PlusIcon className="h-5 w-5"/> Add Purchase
                        </button>
                        <button onClick={() => setHistoryModalOpen('gold')} className="w-full text-center py-2.5 px-3 text-sm font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg">View History</button>
                    </div>
                </div>

                {/* Silver Wallet Card */}
                 <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-800 dark:via-slate-800/50 dark:to-teal-900/20 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-full">
                           <WalletIcon className="h-8 w-8 text-slate-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Silver Wallet</h2>
                            <p className="text-sm text-slate-500">99.5% Purity</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="text-center bg-white/50 dark:bg-slate-900/40 p-3 rounded-lg">
                            <p className="text-sm text-slate-500">Total Holdings</p>
                            <p className="text-3xl font-bold">{totals.totalSilverGrams.toFixed(3)}g</p>
                        </div>
                        <div className="text-center bg-white/50 dark:bg-slate-900/40 p-3 rounded-lg">
                            <p className="text-sm text-slate-500">Current Market Value</p>
                            <p className="text-3xl font-bold text-green-600">{currencySymbol}{formatCurrency(totals.silverCurrentValue)}</p>
                        </div>
                    </div>
                     <div className="flex gap-3 mt-6">
                        <button onClick={() => setAddModalOpen('silver')} className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-teal-600 transition-colors shadow-md hover:shadow-lg">
                           <PlusIcon className="h-5 w-5"/> Add Purchase
                        </button>
                        <button onClick={() => setHistoryModalOpen('silver')} className="w-full text-center py-2.5 px-3 text-sm font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg">View History</button>
                    </div>
                </div>
            </div>
            
            {isAddModalOpen && <AddPurchaseModal metal={isAddModalOpen} onClose={() => setAddModalOpen(null)} onAdd={handleAddPurchase} />}
            {isHistoryModalOpen && <HistoryModal metal={isHistoryModalOpen} transactions={wallets[isHistoryModalOpen].transactions} onClose={() => setHistoryModalOpen(null)} />}
        </div>
    );
};

export default GoldSilverbook;