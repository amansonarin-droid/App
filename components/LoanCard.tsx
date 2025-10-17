import React, { useState } from 'react';
import type { Loan } from '../types';
import { useCurrency } from './CurrencyContext';
import { XIcon } from './icons';

type Role = 'customer' | 'service_provider' | 'admin' | null;

interface LoanCardProps {
  loan: Loan;
  onPayment: (loanId: string, amount: number, type: 'interest' | 'emi') => void;
  role: Role;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatCurrency = (amount: number) => Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusStyles = {
    active: { dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10 dark:bg-green-500/20' },
    overdue: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10 dark:bg-red-500/20' },
    closed: { dot: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10 dark:bg-slate-500/20' },
};

const PaymentModal: React.FC<{loan: Loan; type: 'interest' | 'emi'; onClose: () => void; onConfirm: (amount: number) => void;}> = ({ loan, type, onClose, onConfirm }) => {
    const { currencySymbol } = useCurrency();
    const monthlyInterest = loan.loan.currentPrincipal * (loan.loan.interestRate / 100);
    const defaultAmount = type === 'emi' ? (loan.loan.emiAmount || 0) : monthlyInterest;
    const [amount, setAmount] = useState(defaultAmount.toFixed(2));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(parseFloat(amount));
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Record {type === 'emi' ? 'EMI' : 'Interest'} Payment</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><XIcon className="h-5 w-5"/></button>
                </div>
                <p className="text-sm text-slate-500 mb-4">For: {loan.borrower.name}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Payment Amount ({currencySymbol})</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-gold-500" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 rounded-lg">Confirm Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const LoanCard: React.FC<LoanCardProps> = ({ loan, onPayment, role }) => {
    const { currencySymbol } = useCurrency();
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentType, setPaymentType] = useState<'interest' | 'emi'>('interest');

    const handleOpenPaymentModal = (type: 'interest' | 'emi') => {
        setPaymentType(type);
        setPaymentModalOpen(true);
    };

    const handleConfirmPayment = (amount: number) => {
        onPayment(loan.id, amount, paymentType);
        setPaymentModalOpen(false);
    };

    const styles = statusStyles[loan.status];

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col group">
            <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{loan.borrower.name}</p>
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}></div>
                        <span className={`text-xs font-semibold ${styles.text} capitalize`}>{loan.status}</span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{loan.loan.repaymentType === 'emi' ? 'EMI Loan' : 'Full Payment Loan'} @ {loan.loan.interestRate}% p.m.</p>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Principal:</span>
                        <span className="font-medium">{currencySymbol}{formatCurrency(loan.loan.currentPrincipal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Interest Due:</span>
                        <span className={`font-medium ${loan.outstandingInterest > 0 ? 'text-red-500' : ''}`}>{currencySymbol}{formatCurrency(loan.outstandingInterest)}</span>
                    </div>
                     <div className="flex justify-between pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500">Next Due Date:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatDate(loan.nextPaymentDueDate)}</span>
                    </div>
                </div>
            </div>
            {loan.status !== 'closed' && role !== 'customer' && (
                <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-b-xl flex gap-2">
                    {loan.loan.repaymentType === 'full' ? (
                        <button onClick={() => handleOpenPaymentModal('interest')} className="w-full text-center py-2 px-3 text-sm font-semibold bg-gold-100 dark:bg-gold-900/50 text-gold-700 dark:text-gold-200 rounded-md hover:bg-gold-200 dark:hover:bg-gold-900">Pay Interest</button>
                    ) : (
                        <button onClick={() => handleOpenPaymentModal('emi')} className="w-full text-center py-2 px-3 text-sm font-semibold bg-gold-100 dark:bg-gold-900/50 text-gold-700 dark:text-gold-200 rounded-md hover:bg-gold-200 dark:hover:bg-gold-900">Pay EMI</button>
                    )}
                </div>
            )}
            {isPaymentModalOpen && <PaymentModal loan={loan} type={paymentType} onClose={() => setPaymentModalOpen(false)} onConfirm={handleConfirmPayment} />}
        </div>
    );
};

export default LoanCard;