import React from 'react';
import type { LoanEnquiry, EnquiryStatus } from '../types';
import { useCurrency } from './CurrencyContext';

interface EnquiryCardProps {
    enquiry: LoanEnquiry;
    onAction: (enquiryId: string, newStatus: EnquiryStatus) => void;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const statusStyles: { [key in EnquiryStatus]: { dot: string; text: string; label: string } } = {
    pending: { dot: 'bg-yellow-500', text: 'text-yellow-800 dark:text-yellow-300', label: 'Pending' },
    approved: { dot: 'bg-green-500', text: 'text-green-800 dark:text-green-300', label: 'Approved' },
    rejected: { dot: 'bg-red-500', text: 'text-red-800 dark:text-red-300', label: 'Rejected' },
    visit_store: { dot: 'bg-blue-500', text: 'text-blue-800 dark:text-blue-300', label: 'Visit Store' },
};

const EnquiryCard: React.FC<EnquiryCardProps> = ({ enquiry, onAction }) => {
    const { currencySymbol } = useCurrency();
    const status = statusStyles[enquiry.status];

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{enquiry.personalDetails.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Submitted: {formatDate(enquiry.submittedDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${status.dot}`}></div>
                        <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
                    </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div>
                        <p className="text-xs text-slate-500">Loan Amount</p>
                        <p className="font-semibold">{currencySymbol}{enquiry.loan.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Tenure</p>
                        <p className="font-semibold">{enquiry.loan.tenureMonths} Months</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Mortgage Item</p>
                        <p className="font-semibold truncate">{enquiry.mortgage.description}</p>
                    </div>
                </div>
            </div>

            {enquiry.status === 'pending' && (
                <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-b-xl flex flex-col sm:flex-row gap-2">
                    <button onClick={() => onAction(enquiry.id, 'approved')} className="flex-1 text-center py-2 px-3 text-sm font-semibold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800/70">Approve</button>
                    <button onClick={() => onAction(enquiry.id, 'rejected')} className="flex-1 text-center py-2 px-3 text-sm font-semibold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800/70">Reject</button>
                    <button onClick={() => onAction(enquiry.id, 'visit_store')} className="flex-1 text-center py-2 px-3 text-sm font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/70">Mark for Visit</button>
                </div>
            )}
        </div>
    );
};

export default EnquiryCard;