import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { KhatabookCustomer, KhatabookTransaction, CustomerScheme } from '../types';
import { useCurrency } from './CurrencyContext';
import { useAuth } from './AuthContext';
// FIX: Removed unused RepeatIcon import.
import { PlusIcon, UsersIcon, ArrowDownLeftIcon, ArrowUpRightIcon, XIcon, DownloadIcon, SearchIcon, PrintIcon, PaperclipIcon, UploadCloudIcon } from './icons';

// --- MOCK DATA ---
const getInitialCustomers = (): KhatabookCustomer[] => [
    {
        id: 'cust-1', name: 'Suresh Patel', phone: '9876543210', balance: -15000,
        transactions: [
            { id: 'txn-1', type: 'debit', amount: 25000, description: 'Gold Chain Purchase', date: '2023-10-15', photo: null },
            { id: 'txn-2', type: 'credit', amount: 10000, description: 'Cash Payment', date: '2023-10-20', photo: null },
        ],
        schemes: [
            { 
                id: 'sch-1', metalType: 'gold', monthlyInstallment: 5000, durationMonths: 12, startDate: '2023-09-01', status: 'active',
                transactions: [
                    { id: 'sch-txn-1', date: '2023-09-05', amountPaid: 5000, rateAtPurchase: 6800, gramsPurchased: 0.735 },
                    { id: 'sch-txn-2', date: '2023-10-05', amountPaid: 5000, rateAtPurchase: 6950, gramsPurchased: 0.719 },
                ]
            }
        ]
    },
    { id: 'cust-2', name: 'Anita Verma', phone: '9988776655', balance: 5200, transactions: [], schemes: [] },
    { id: 'cust-3', name: 'Rajesh Singh', phone: '9123456789', balance: 0, transactions: [], schemes: [] },
];

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const formatCurrency = (amount: number) => Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// --- MODALS ---
const AddCustomerModal: React.FC<{onClose: () => void, onAdd: (name: string, phone: string) => void}> = ({onClose, onAdd}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name && phone) onAdd(name, phone);
    };
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg mb-4">Add New Customer</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Customer Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                    <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-gold-600 rounded-lg">Add Customer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddTransactionModal: React.FC<{onClose: () => void, onAdd: (type: 'credit'|'debit', amount: number, description: string, photo: string | null) => void}> = ({onClose, onAdd}) => {
    const [type, setType] = useState<'credit'|'debit'>('credit');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await toBase64(file);
            setPhoto(base64);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(amount && description) onAdd(type, parseFloat(amount), description, photo);
    }
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg mb-4">New Transaction</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setType('credit')} className={`w-full py-2 rounded-md ${type==='credit' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>Credit (Jama)</button>
                        <button type="button" onClick={() => setType('debit')} className={`w-full py-2 rounded-md ${type==='debit' ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>Debit (Udhaar)</button>
                    </div>
                    <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                    <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                    
                    <div>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-2 text-sm border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <UploadCloudIcon className="h-5 w-5"/> Attach a Photo
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
                        {photo && (
                            <div className="mt-2 flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <img src={photo} alt="preview" className="h-10 w-10 rounded object-cover"/>
                                <span className="text-xs text-slate-500">Image attached.</span>
                                <button type="button" onClick={() => setPhoto(null)}><XIcon className="h-4 w-4"/></button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-gold-600 rounded-lg">Add Entry</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CreateSchemeModal: React.FC<{onClose: () => void, onAdd: (scheme: Omit<CustomerScheme, 'id'|'transactions'|'status'|'startDate'>) => void}> = ({onClose, onAdd}) => {
    const [metalType, setMetalType] = useState<'gold'|'silver'>('gold');
    const [installment, setInstallment] = useState('');
    const [duration, setDuration] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(installment && duration) onAdd({metalType, monthlyInstallment: parseFloat(installment), durationMonths: parseInt(duration)});
    }
    return (
         <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg mb-4">Create New Scheme</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={metalType} onChange={e => setMetalType(e.target.value as any)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                        <option value="gold">Gold Scheme</option>
                        <option value="silver">Silver Scheme</option>
                    </select>
                    <input type="number" placeholder="Monthly Installment" value={installment} onChange={e => setInstallment(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                    <input type="number" placeholder="Duration (in Months)" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-gold-600 rounded-lg">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- MAIN COMPONENTS ---

const CustomerSchemes: React.FC<{customer: KhatabookCustomer, onNewScheme: (scheme: Omit<CustomerScheme, 'id'|'transactions'|'status'|'startDate'>) => void, isCustomer: boolean }> = ({customer, onNewScheme, isCustomer}) => {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [viewingHistory, setViewingHistory] = useState<string|null>(null);
    const { currencySymbol } = useCurrency();

    const getTotalAccumulated = (scheme: CustomerScheme) => scheme.transactions.reduce((sum, tx) => sum + tx.gramsPurchased, 0);

    return(
        <div className="space-y-4">
            {!isCustomer && (
                <div className="text-right">
                    <button onClick={() => setCreateOpen(true)} className="flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-500 ml-auto">
                        <PlusIcon className="h-4 w-4"/> Create New Scheme
                    </button>
                </div>
            )}
             {customer.schemes?.length ? customer.schemes.map(scheme => (
                <div key={scheme.id} className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold capitalize">{scheme.metalType} Purchase Plan</h4>
                            <p className="text-xs text-slate-500">{formatCurrency(scheme.monthlyInstallment)}/month for {scheme.durationMonths} months</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-gold-500">{getTotalAccumulated(scheme).toFixed(3)}g</p>
                            <p className="text-xs text-slate-500">Accumulated</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-2 border-t dark:border-slate-700">
                        <button onClick={() => setViewingHistory(viewingHistory === scheme.id ? null : scheme.id)} className="text-sm font-semibold text-blue-600">
                            {viewingHistory === scheme.id ? 'Hide History' : 'View History'}
                        </button>
                        {viewingHistory === scheme.id && (
                            <table className="w-full text-xs text-left mt-2">
                                <thead><tr className="border-b dark:border-slate-600"><th className="py-1">Date</th><th className="py-1">Rate</th><th className="py-1">Amount</th><th className="py-1">Grams</th></tr></thead>
                                <tbody>
                                    {scheme.transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td className="py-1">{formatDate(tx.date)}</td>
                                            <td className="py-1">{currencySymbol}{tx.rateAtPurchase}/10g</td>
                                            <td className="py-1">{currencySymbol}{formatCurrency(tx.amountPaid)}</td>
                                            <td className="py-1">{tx.gramsPurchased.toFixed(3)}g</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )) : <p className="text-center text-sm text-slate-500 p-4">No active schemes for this customer.</p>}
            {isCreateOpen && <CreateSchemeModal onClose={() => setCreateOpen(false)} onAdd={(s) => {onNewScheme(s); setCreateOpen(false);}} />}
        </div>
    );
};

const Khatabook: React.FC = () => {
    const { currencySymbol } = useCurrency();
    const { role, user } = useAuth();
    const [customers, setCustomers] = useState<KhatabookCustomer[]>(getInitialCustomers);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'ledger' | 'schemes'>('ledger');
    
    // Modals visibility
    const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);
    const [isAddTxnOpen, setAddTxnOpen] = useState(false);
    const [isReportOpen, setReportOpen] = useState(false);
    const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

    useEffect(() => {
        if (role === 'customer' && user?.identifier) {
            const customer = customers.find(c => c.phone === user.identifier);
            if (customer) {
                setSelectedCustomerId(customer.id);
            } else {
                setSelectedCustomerId(null); // No customer found for this identifier
            }
        }
    }, [role, user, customers]);


    const selectedCustomer = useMemo(() => customers.find(c => c.id === selectedCustomerId), [customers, selectedCustomerId]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [customers, searchTerm]);

    const summary = useMemo(() => {
        const youWillGet = customers.reduce((sum, c) => c.balance < 0 ? sum + Math.abs(c.balance) : sum, 0);
        const youWillGive = customers.reduce((sum, c) => c.balance > 0 ? sum + c.balance : sum, 0);
        return { youWillGet, youWillGive };
    }, [customers]);

    const customerSummary = useMemo(() => {
        if (!selectedCustomer) return { totalCredit: 0, totalDebit: 0 };
        const totalCredit = selectedCustomer.transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
        const totalDebit = selectedCustomer.transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
        return { totalCredit, totalDebit };
    }, [selectedCustomer]);

    const handleAddCustomer = (name: string, phone: string) => {
        const newCustomer: KhatabookCustomer = { id: `cust-${Date.now()}`, name, phone, balance: 0, transactions: [] };
        setCustomers(prev => [newCustomer, ...prev]);
        setSelectedCustomerId(newCustomer.id);
        setAddCustomerOpen(false);
    };

    const handleAddTransaction = (type: 'credit'|'debit', amount: number, description: string, photo: string | null) => {
        if (!selectedCustomerId) return;
        setCustomers(prev => prev.map(c => {
            if (c.id === selectedCustomerId) {
                const newTx: KhatabookTransaction = { id: `txn-${Date.now()}`, type, amount, description, date: new Date().toISOString(), photo };
                const balanceChange = type === 'credit' ? amount : -amount;
                return { ...c, balance: c.balance + balanceChange, transactions: [newTx, ...c.transactions] };
            }
            return c;
        }));
        setAddTxnOpen(false);
    };

    const handleAddScheme = (schemeData: Omit<CustomerScheme, 'id'|'transactions'|'status'|'startDate'>) => {
        if (!selectedCustomerId) return;
        const newScheme: CustomerScheme = {
            ...schemeData,
            id: `sch-${Date.now()}`,
            startDate: new Date().toISOString(),
            status: 'active',
            transactions: [],
        };
        setCustomers(prev => prev.map(c => {
            if (c.id === selectedCustomerId) {
                return { ...c, schemes: [...(c.schemes || []), newScheme] };
            }
            return c;
        }));
    };

    const CustomerReport: React.FC = () => {
        if (!selectedCustomer) return null;
        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={() => setReportOpen(false)}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b flex justify-between items-center bg-slate-50 text-black">
                        <h3 className="text-lg font-bold">Statement for {selectedCustomer.name}</h3>
                        <div>
                             <button onClick={() => window.print()} className="mr-4 text-sm font-medium text-slate-700 flex items-center gap-2"><PrintIcon className="h-5 w-5"/> Print</button>
                             <button onClick={() => setReportOpen(false)}><XIcon className="h-6 w-6" /></button>
                        </div>
                    </div>
                    <div className="overflow-y-auto p-8 text-black" id="invoice-preview">
                       <h2 className="text-2xl font-bold mb-1">Aman Jewellers</h2>
                       <p className="text-sm mb-6">Customer Ledger Statement</p>
                       <p><strong>Customer:</strong> {selectedCustomer.name}</p>
                       <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                       <p className="mb-4"><strong>Date:</strong> {formatDate(new Date().toISOString())}</p>
                       <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100"><tr><th className="p-2">Date</th><th className="p-2">Description</th><th className="p-2 text-right">Credit</th><th className="p-2 text-right">Debit</th><th className="p-2 text-right">Balance</th></tr></thead>
                            <tbody>
                                {[...selectedCustomer.transactions].reverse().map((tx, index, arr) => {
                                    const runningBalance = arr.slice(0, index + 1).reduce((bal, t) => bal + (t.type === 'credit' ? t.amount : -t.amount), 0);
                                    return(
                                    <tr key={tx.id} className="border-b">
                                        <td className="p-2">{formatDate(tx.date)}</td>
                                        <td className="p-2">{tx.description}</td>
                                        <td className="p-2 text-right text-green-600">{tx.type==='credit' ? formatCurrency(tx.amount) : '-'}</td>
                                        <td className="p-2 text-right text-red-600">{tx.type==='debit' ? formatCurrency(tx.amount) : '-'}</td>
                                        <td className="p-2 text-right font-semibold">{formatCurrency(runningBalance)}</td>
                                    </tr>
                                )})}
                            </tbody>
                            <tfoot className="font-bold bg-slate-100">
                                <tr>
                                    <td colSpan={4} className="p-2 text-right">Final Balance:</td>
                                    <td className="p-2 text-right">{formatCurrency(selectedCustomer.balance)} {selectedCustomer.balance > 0 ? 'Cr' : 'Dr'}</td>
                                </tr>
                            </tfoot>
                       </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Khatabook</h1>
                
                {role !== 'customer' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full"><UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-300"/></div>
                            <div>
                                <p className="text-sm text-slate-500">Total Customers</p>
                                <p className="text-xl font-bold">{customers.length}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full"><ArrowUpRightIcon className="h-6 w-6 text-red-600 dark:text-red-300"/></div>
                            <div>
                                <p className="text-sm text-slate-500">You Will Get (Lena Hai)</p>
                                <p className="text-xl font-bold">{currencySymbol}{formatCurrency(summary.youWillGet)}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full"><ArrowDownLeftIcon className="h-6 w-6 text-green-600 dark:text-green-300"/></div>
                            <div>
                                <p className="text-sm text-slate-500">You Will Give (Dena Hai)</p>
                                <p className="text-xl font-bold">{currencySymbol}{formatCurrency(summary.youWillGive)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 mt-6">
                {/* Left Panel: Customer List */}
                {role !== 'customer' && (
                    <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold">Customers ({filteredCustomers.length})</h2>
                            <button onClick={() => setAddCustomerOpen(true)} className="flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-500"><PlusIcon className="h-4 w-4"/> Add</button>
                        </div>
                        <div className="relative mb-2">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/>
                            <input type="text" placeholder="Search customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 pl-10 bg-slate-100 dark:bg-slate-700 rounded-md"/>
                        </div>
                        <div className="overflow-y-auto flex-grow -mr-2 pr-2">
                            {filteredCustomers.map(customer => (
                                <div key={customer.id} onClick={() => {setSelectedCustomerId(customer.id); setActiveTab('ledger')}} className={`p-3 rounded-lg cursor-pointer mb-2 ${selectedCustomerId === customer.id ? 'bg-gold-100 dark:bg-gold-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{customer.name}</p>
                                        <p className={`font-bold text-sm ${customer.balance > 0 ? 'text-green-600' : customer.balance < 0 ? 'text-red-600' : ''}`}>
                                            {formatCurrency(customer.balance)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                        <p>{customer.phone}</p>
                                        <p>{customer.balance > 0 ? 'You will give' : customer.balance < 0 ? 'You will get' : 'Settled'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Right Panel: Transaction Details */}
                <div className={`w-full ${role === 'customer' ? 'md:w-full' : 'md:w-2/3'} bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col`}>
                    {selectedCustomer ? (
                        <>
                            <div className="p-4 border-b dark:border-slate-700">
                                <h2 className="font-bold text-lg">{selectedCustomer.name}</h2>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-slate-500">Balance: <span className={`font-bold ${selectedCustomer.balance > 0 ? 'text-green-600' : selectedCustomer.balance < 0 ? 'text-red-600' : ''}`}>{currencySymbol}{formatCurrency(selectedCustomer.balance)}</span></p>
                                    <button onClick={() => setReportOpen(true)} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-500"><DownloadIcon className="h-4 w-4"/> Download Report</button>
                                </div>
                            </div>

                             <div className="p-4 border-b dark:border-slate-700 flex justify-around text-center text-sm">
                                <div><p className="text-slate-500">Total Credit</p><p className="font-bold text-green-600">{currencySymbol}{formatCurrency(customerSummary.totalCredit)}</p></div>
                                <div><p className="text-slate-500">Total Debit</p><p className="font-bold text-red-600">{currencySymbol}{formatCurrency(customerSummary.totalDebit)}</p></div>
                            </div>

                            <div className="border-b dark:border-slate-700">
                                <div className="flex">
                                    <button onClick={() => setActiveTab('ledger')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'ledger' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-slate-500'}`}>Ledger</button>
                                    <button onClick={() => setActiveTab('schemes')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'schemes' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-slate-500'}`}>Schemes</button>
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-grow p-4">
                               {activeTab === 'ledger' ? (
                                    <>
                                        {selectedCustomer.transactions.length > 0 ? (
                                            selectedCustomer.transactions.map(tx => (
                                                <div key={tx.id} className={`flex items-start gap-3 p-3 rounded-lg mb-2 ${tx.type === 'credit' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                                    <div className={`p-1.5 rounded-full self-center ${tx.type === 'credit' ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'}`}>
                                                        {tx.type === 'credit' ? <ArrowDownLeftIcon className="h-4 w-4 text-green-600 dark:text-green-200"/> : <ArrowUpRightIcon className="h-4 w-4 text-red-600 dark:text-red-200"/>}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold">{tx.description}</p>
                                                            <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{currencySymbol}{formatCurrency(tx.amount)}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                                                            {tx.photo && (
                                                                <button onClick={() => setViewingPhoto(tx.photo!)} className="text-slate-400 hover:text-slate-600">
                                                                    <PaperclipIcon className="h-4 w-4"/>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : <p className="text-center text-sm text-slate-500 p-8">No transactions yet.</p>}
                                    </>
                               ) : <CustomerSchemes customer={selectedCustomer} onNewScheme={handleAddScheme} isCustomer={role === 'customer'} />}
                            </div>

                            {role !== 'customer' && activeTab === 'ledger' && (
                                <div className="p-4 mt-auto border-t dark:border-slate-700">
                                    <button onClick={() => setAddTxnOpen(true)} className="w-full py-3 bg-gold-600 text-white font-bold rounded-lg hover:bg-gold-500">Add New Entry</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col justify-center items-center text-slate-500">
                            <UsersIcon className="h-16 w-16 mb-2"/>
                            <p>Select a customer to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {isAddCustomerOpen && <AddCustomerModal onClose={() => setAddCustomerOpen(false)} onAdd={handleAddCustomer} />}
            {isAddTxnOpen && <AddTransactionModal onClose={() => setAddTxnOpen(false)} onAdd={handleAddTransaction} />}
            {isReportOpen && <CustomerReport />}
            {viewingPhoto && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setViewingPhoto(null)}>
                    <div className="relative max-w-full max-h-full">
                         <img src={viewingPhoto} alt="Transaction attachment" className="w-auto h-auto max-w-full max-h-[90vh] object-contain"/>
                         <button onClick={() => setViewingPhoto(null)} className="absolute -top-2 -right-2 text-white bg-slate-800 rounded-full p-1"><XIcon className="h-6 w-6" /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Khatabook;