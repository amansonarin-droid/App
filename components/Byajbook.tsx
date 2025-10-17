import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { Loan, LoanEnquiry, EnquiryStatus } from '../types';
import { PlusIcon, LoanIcon, BellIcon, XIcon, CheckCircleIcon, AlertTriangleIcon } from './icons';
import LoanCard from './LoanCard';
import CreateLoanForm from './CreateLoanForm';
import NewLoanEnquiryForm from './NewLoanEnquiryForm';
import EnquiryCard from './EnquiryCard';
import { useAuth } from './AuthContext';

// --- MOCK DATA ---
const getInitialLoans = (): Loan[] => {
    const today = new Date();
    const addMonths = (date: Date, months: number) => { const d = new Date(date); d.setMonth(d.getMonth() + months); return d; };
    return [
        {
            id: 'loan-1',
            borrower: { name: 'Ramesh Kumar', phone: '9876543210', address: '123 Main St, Delhi', photo: null, aadhaarCard: null, panCard: null },
            mortgage: { itemDescription: 'Gold Chain 20g', itemValue: 120000, itemPhoto: null },
            loan: { principal: 80000, currentPrincipal: 80000, interestRate: 1.25, repaymentType: 'full', tenureMonths: 12, ltv: 66.67 },
            startDate: addMonths(today, -2).toISOString(), nextPaymentDueDate: addMonths(today, -1).toISOString(), finalDueDate: addMonths(today, 10).toISOString(),
            outstandingInterest: 2000, status: 'overdue', paymentHistory: []
        },
        {
            id: 'loan-2',
            borrower: { name: 'Geeta Sharma', phone: '9988776655', address: '456 Park Ave, Mumbai', photo: null, aadhaarCard: null, panCard: null },
            mortgage: { itemDescription: 'Silver Anklets 150g', itemValue: 12000, itemPhoto: null },
            loan: { principal: 10000, currentPrincipal: 10000, interestRate: 2, repaymentType: 'emi', tenureMonths: 6, ltv: 83.33, emiAmount: 1771.64 },
            startDate: addMonths(today, -1).toISOString(), nextPaymentDueDate: today.toISOString(), finalDueDate: addMonths(today, 5).toISOString(),
            outstandingInterest: 0, status: 'active', paymentHistory: []
        },
        {
            id: 'loan-3',
            borrower: { name: 'Ramesh Kumar', phone: '9876543210', address: '123 Main St, Delhi', photo: null, aadhaarCard: null, panCard: null },
            mortgage: { itemDescription: 'Gold Bangle 15g', itemValue: 90000, itemPhoto: null },
            loan: { principal: 60000, currentPrincipal: 0, interestRate: 1.5, repaymentType: 'full', tenureMonths: 6, ltv: 66.67 },
            startDate: addMonths(today, -8).toISOString(), nextPaymentDueDate: addMonths(today, -2).toISOString(), finalDueDate: addMonths(today, -2).toISOString(),
            outstandingInterest: 0, status: 'closed', paymentHistory: [{ id: 'p-1', date: addMonths(today, -2).toISOString(), amount: 65400, type: 'interest' }]
        },
    ];
};

const getInitialEnquiries = (): LoanEnquiry[] => {
    const today = new Date();
    const addDays = (date: Date, days: number) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
    return [
        {
            id: 'enq-1', status: 'pending', submittedDate: addDays(today, -1).toISOString(),
            personalDetails: { name: 'Vikram Singh', phone: '9123456780', address: '789 Market Rd, Jaipur', photo: null },
            documents: { aadhaar: null, pan: null },
            mortgage: { description: '22k Gold Bracelet', photo: null },
            loan: { amount: 50000, tenureMonths: 12 }
        },
        {
            id: 'enq-2', status: 'approved', submittedDate: addDays(today, -3).toISOString(),
            personalDetails: { name: 'Priya Mehta', phone: '9012345678', address: '101 River View, Pune', photo: null },
            documents: { aadhaar: null, pan: null },
            mortgage: { description: 'Diamond Ring', photo: null },
            loan: { amount: 150000, tenureMonths: 24 }
        }
    ];
};

const Byajbook: React.FC = () => {
    const { role, user } = useAuth();
    const location = useLocation();
    const [loans, setLoans] = useState<Loan[]>(getInitialLoans);
    const [loanEnquiries, setLoanEnquiries] = useState<LoanEnquiry[]>(getInitialEnquiries);

    const [isCreateFormOpen, setCreateFormOpen] = useState(false);
    const [reminders, setReminders] = useState<Loan[]>([]);
    
    // View state for different roles
    const [customerView, setCustomerView] = useState<'list' | 'enquiry' | 'submitted'>('list');
    const [providerView, setProviderView] = useState<'loans' | 'enquiries'>('loans');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (role === 'customer' && params.get('action') === 'new-enquiry') {
            setCustomerView('enquiry');
        }
    }, [location, role]);

    const filteredLoans = useMemo(() => {
        if (role === 'customer' && user?.identifier) {
            return loans.filter(loan => loan.borrower.phone === user.identifier);
        }
        return loans;
    }, [loans, role, user]);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const reminderDate = new Date();
        reminderDate.setDate(today.getDate() + 3);
        const dueSoon = loans.filter(l => (l.status === 'active' || l.status === 'overdue') && new Date(l.nextPaymentDueDate) <= reminderDate);
        if (dueSoon.length > 0) setReminders(dueSoon);
    }, [loans]);

    const handleAddLoan = (newLoanData: Omit<Loan, 'id'>) => {
        const newLoan: Loan = { ...newLoanData, id: `loan-${Date.now()}` };
        setLoans(prev => [newLoan, ...prev]);
        setCreateFormOpen(false);
    };
    
    const handleNewEnquiry = (enquiryData: Omit<LoanEnquiry, 'id' | 'status' | 'submittedDate'>) => {
        const newEnquiry: LoanEnquiry = {
            ...enquiryData,
            id: `enq-${Date.now()}`,
            status: 'pending',
            submittedDate: new Date().toISOString(),
        };
        setLoanEnquiries(prev => [newEnquiry, ...prev]);
        setCustomerView('submitted');
    };

    const handleEnquiryAction = (enquiryId: string, newStatus: EnquiryStatus) => {
        setLoanEnquiries(prev => prev.map(enq => enq.id === enquiryId ? { ...enq, status: newStatus } : enq));
    };

    const handlePayment = (loanId: string, amount: number, type: 'interest' | 'emi') => {
        setLoans(prevLoans => prevLoans.map(loan => {
            if (loan.id === loanId) {
                const updatedLoan = { ...loan, paymentHistory: [...loan.paymentHistory, { id: `payment-${Date.now()}`, date: new Date().toISOString(), amount, type }] };
                // Payment logic here...
                if (updatedLoan.loan.currentPrincipal <= 0) updatedLoan.status = 'closed';
                return updatedLoan;
            }
            return loan;
        }));
    };
    
    const handleCloseReminders = () => setReminders([]);

    // --- RENDER LOGIC ---

    const renderCustomerView = () => {
        switch (customerView) {
            case 'enquiry':
                return <NewLoanEnquiryForm onSubmit={handleNewEnquiry} onBack={() => setCustomerView('list')} />;
            case 'submitted':
                return (
                    <div className="text-center p-10 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
                        <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500"/>
                        <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Enquiry Submitted!</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Thank you. Your loan application is now under review. We will contact you shortly.</p>
                        <button onClick={() => setCustomerView('list')} className="mt-6 bg-gold-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg">
                            Back to My Loans
                        </button>
                    </div>
                );
            case 'list':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredLoans.length > 0 ? (
                            filteredLoans.map(loan => <LoanCard key={loan.id} loan={loan} onPayment={handlePayment} role={role} />)
                        ) : (
                             <div className="col-span-full text-center p-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                                <LoanIcon className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500"/>
                                <p className="mt-2 font-semibold text-slate-600 dark:text-slate-400">No active loans found.</p>
                                <p className="text-sm text-slate-500">Submit a new enquiry to get started.</p>
                            </div>
                        )}
                    </div>
                );
        }
    };
    
    const renderProviderView = () => (
        <>
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                     <button onClick={() => setProviderView('loans')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${providerView === 'loans' ? 'border-gold-500 text-gold-600 dark:text-gold-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Active Loans</button>
                    <button onClick={() => setProviderView('enquiries')} className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${providerView === 'enquiries' ? 'border-gold-500 text-gold-600 dark:text-gold-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Loan Enquiries
                        {loanEnquiries.filter(e => e.status === 'pending').length > 0 && <span className="absolute top-3 -right-4 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center ring-2 ring-gray-50 dark:ring-gray-900">{loanEnquiries.filter(e => e.status === 'pending').length}</span>}
                    </button>
                </nav>
            </div>
            {providerView === 'loans' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
                    {filteredLoans.map(loan => <LoanCard key={loan.id} loan={loan} onPayment={handlePayment} role={role} />)}
                </div>
            ) : (
                <div className="space-y-4 pt-6">
                    {loanEnquiries.length > 0 ? (
                        loanEnquiries.map(enquiry => <EnquiryCard key={enquiry.id} enquiry={enquiry} onAction={handleEnquiryAction} />)
                    ) : (
                        <div className="text-center p-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                           <p className="font-semibold text-slate-600 dark:text-slate-400">No loan enquiries found.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {role === 'customer' ? 'My Loans' : 'Byajbook'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {role === 'customer' ? 'View your loan history and submit new enquiries.' : 'Manage all interest-based loans and applications.'}
                    </p>
                </div>
                 {role === 'customer' && customerView === 'list' && (
                    <button onClick={() => setCustomerView('enquiry')} className="w-full sm:w-auto flex items-center justify-center bg-gold-500 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg">
                        <PlusIcon className="h-5 w-5 mr-2" /> New Loan Enquiry
                    </button>
                )}
                {role !== 'customer' && (
                    <button onClick={() => setCreateFormOpen(true)} className="w-full sm:w-auto flex items-center justify-center bg-gold-500 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg">
                        <PlusIcon className="h-5 w-5 mr-2" /> New Loan
                    </button>
                )}
            </div>

            {role === 'customer' ? renderCustomerView() : renderProviderView()}

            {isCreateFormOpen && <CreateLoanForm onAddLoan={handleAddLoan} onClose={() => setCreateFormOpen(false)} />}
            {reminders.length > 0 && <ReminderModal reminders={reminders} onClose={handleCloseReminders} />}
        </div>
    );
};

const ReminderModal: React.FC<{ reminders: Loan[], onClose: () => void }> = ({ reminders, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><BellIcon className="h-6 w-6 text-gold-500"/> Payment Reminders</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><XIcon className="h-6 w-6"/></button>
            </div>
            {/* Reminder content... */}
        </div>
    </div>
);

export default Byajbook;