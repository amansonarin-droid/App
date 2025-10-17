import React, { useState, useMemo } from 'react';
import type { Loan, BorrowerDetails, LoanDetails, MortgageDetails } from '../types';
import { useCurrency } from './CurrencyContext';
import { XIcon, UserIcon, IdCardIcon, BoxIcon, CameraIcon, CheckCircleIcon, AlertTriangleIcon, UploadCloudIcon } from './icons';

interface CreateLoanFormProps {
    onAddLoan: (loan: Omit<Loan, 'id'>) => void;
    onClose: () => void;
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

type DocumentStatus = 'pending' | 'verifying' | 'verified' | 'failed';

interface DocumentValidationState {
    status: DocumentStatus;
    error?: string;
    fileName?: string;
}

interface FileInputProps {
    label: string;
    onFileSelect: (file: File | null) => void;
    onRemove: () => void;
    preview: string | null;
    validation: DocumentValidationState;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin h-8 w-8 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const FileInput: React.FC<FileInputProps> = ({ label, onFileSelect, onRemove, preview, validation }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        onFileSelect(file || null);
    };

    const renderContent = () => {
        switch (validation.status) {
            case 'verifying':
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Verifying...</p>
                    </div>
                );
            case 'verified':
                return (
                     <div className="flex items-center gap-3 w-full">
                        <img src={`data:image/jpeg;base64,${preview}`} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{validation.fileName}</p>
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1"><CheckCircleIcon className="h-3 w-3"/> Verified</p>
                        </div>
                        <button type="button" onClick={onRemove} className="p-1 text-slate-500 hover:text-red-500"><XIcon className="h-5 w-5"/></button>
                    </div>
                );
            case 'failed':
                 return (
                     <div className="flex flex-col items-center justify-center text-center h-full">
                         <AlertTriangleIcon className="h-8 w-8 text-red-500" />
                         <p className="mt-1 text-sm font-semibold text-red-500">{validation.error}</p>
                         <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 text-xs font-semibold text-blue-600 hover:underline">Try Again</button>
                    </div>
                );
            case 'pending':
            default:
                return (
                    <button type="button" onClick={() => inputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center gap-2 text-sm text-center">
                        <UploadCloudIcon className="h-8 w-8 text-slate-400" />
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Click to upload {label}</span>
                        <span className="text-xs text-slate-500">PNG, JPG up to 2MB</span>
                    </button>
                );
        }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
            <div className={`relative p-2 w-full h-28 border-2 border-dashed rounded-lg transition-colors ${validation.status === 'failed' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600'} ${validation.status === 'pending' ? 'hover:bg-slate-100 dark:hover:bg-slate-700' : ''}`}>
                {renderContent()}
                <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png" />
            </div>
        </div>
    );
};


const CreateLoanForm: React.FC<CreateLoanFormProps> = ({ onAddLoan, onClose }) => {
    const { currencySymbol } = useCurrency();
    const [step, setStep] = useState(1);

    const [borrower, setBorrower] = useState<BorrowerDetails>({ name: '', phone: '', address: '', photo: null, aadhaarCard: null, panCard: null });
    const [mortgage, setMortgage] = useState<MortgageDetails>({ itemDescription: '', itemValue: 0, itemPhoto: null });
    const [loan, setLoan] = useState<Omit<LoanDetails, 'currentPrincipal' | 'ltv' | 'emiAmount'>>({ principal: 0, interestRate: 1.5, repaymentType: 'full', tenureMonths: 12 });

    const [docValidation, setDocValidation] = useState<{
        photo: DocumentValidationState;
        aadhaar: DocumentValidationState;
        pan: DocumentValidationState;
        itemPhoto: DocumentValidationState;
    }>({
        photo: { status: 'pending' },
        aadhaar: { status: 'pending' },
        pan: { status: 'pending' },
        itemPhoto: { status: 'pending' },
    });


    const validateAndConvertFile = async (file: File): Promise<{ base64: string | null; status: DocumentStatus; error?: string }> => {
        const MAX_SIZE_MB = 2;
        const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

        if (!ALLOWED_TYPES.includes(file.type)) {
            return { base64: null, status: 'failed', error: 'Invalid file type (JPG/PNG only).' };
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return { base64: null, status: 'failed', error: `File is too large (Max ${MAX_SIZE_MB}MB).` };
        }

        const base64 = await toBase64(file);
        // Simulate a real document check, e.g. using an OCR API
        const isDocumentValid = Math.random() > 0.1; // 90% success rate for demo
        if (!isDocumentValid) {
             return { base64: null, status: 'failed', error: 'Document could not be verified.' };
        }

        return { base64, status: 'verified', error: undefined };
    };

    const handleDocumentSelect = async (docType: 'aadhaarCard' | 'panCard' | 'photo' | 'itemPhoto', file: File | null) => {
        const keyMap = { photo: 'photo', aadhaarCard: 'aadhaar', panCard: 'pan', itemPhoto: 'itemPhoto' };
        const validationKey = keyMap[docType];
        
        // FIX: Replaced combined changeHandler with explicit checks for docType to allow TypeScript
        // to correctly infer types and avoid 'Argument of type 'any' is not assignable to parameter of type 'never'' error.
        if (!file) {
            if (docType === 'itemPhoto') {
                handleMortgageChange(docType, null);
            } else {
                handleBorrowerChange(docType, null);
            }
            setDocValidation(prev => ({ ...prev, [validationKey]: { status: 'pending' } }));
            return;
        }

        setDocValidation(prev => ({...prev, [validationKey]: { status: 'verifying' }}));
        const { base64, status, error } = await validateAndConvertFile(file);

        setTimeout(() => { // Simulate verification delay
            if (status === 'verified') {
                if (docType === 'itemPhoto') {
                    handleMortgageChange(docType, base64);
                } else {
                    handleBorrowerChange(docType, base64);
                }
            } else {
                if (docType === 'itemPhoto') {
                    handleMortgageChange(docType, null);
                } else {
                    handleBorrowerChange(docType, null);
                }
            }
            setDocValidation(prev => ({ ...prev, [validationKey]: { status, error, fileName: file.name } }));
        }, 1500);
    };

    const handleRemoveDocument = (docType: 'aadhaarCard' | 'panCard' | 'photo' | 'itemPhoto') => {
        const keyMap = { photo: 'photo', aadhaarCard: 'aadhaar', panCard: 'pan', itemPhoto: 'itemPhoto' };
        const validationKey = keyMap[docType];
        
        // FIX: Replaced combined changeHandler with explicit checks for docType to allow TypeScript
        // to correctly infer types and avoid 'Argument of type 'any' is not assignable to parameter of type 'never'' error.
        if (docType === 'itemPhoto') {
            handleMortgageChange(docType, null);
        } else {
            handleBorrowerChange(docType, null);
        }
        
        setDocValidation(prev => ({ ...prev, [validationKey]: { status: 'pending' } }));
    };

    const handleBorrowerChange = (field: keyof BorrowerDetails, value: string | null) => {
        setBorrower(prev => ({ ...prev, [field]: value }));
    };
    const handleMortgageChange = (field: keyof MortgageDetails, value: string | number | null) => {
        setMortgage(prev => ({ ...prev, [field]: value }));
    };
    const handleLoanChange = (field: keyof typeof loan, value: string | number) => {
        setLoan(prev => ({ ...prev, [field]: value }));
    };
    
    const ltv = useMemo(() => {
        if (!mortgage.itemValue || !loan.principal) return 0;
        return (Number(loan.principal) / Number(mortgage.itemValue)) * 100;
    }, [loan.principal, mortgage.itemValue]);

    const emiAmount = useMemo(() => {
        if (loan.repaymentType !== 'emi') return undefined;
        const p = Number(loan.principal);
        const r = Number(loan.interestRate) / 100; // Monthly rate
        const n = Number(loan.tenureMonths);

        if (p > 0 && r > 0 && n > 0) {
            return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }
        return undefined;
    }, [loan.principal, loan.interestRate, loan.tenureMonths, loan.repaymentType]);

    const handleSubmit = () => {
        const today = new Date();
        const nextPaymentDate = new Date(today);
        nextPaymentDate.setMonth(today.getMonth() + 1);
        const finalDueDate = new Date(today);
        finalDueDate.setMonth(today.getMonth() + Number(loan.tenureMonths));

        const newLoan: Omit<Loan, 'id'> = {
            borrower,
            mortgage,
            loan: {
                ...loan,
                principal: Number(loan.principal),
                interestRate: Number(loan.interestRate),
                tenureMonths: Number(loan.tenureMonths),
                currentPrincipal: Number(loan.principal),
                ltv,
                emiAmount,
            },
            startDate: today.toISOString(),
            nextPaymentDueDate: nextPaymentDate.toISOString(),
            finalDueDate: finalDueDate.toISOString(),
            outstandingInterest: 0,
            status: 'active',
            paymentHistory: [],
        };
        onAddLoan(newLoan);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><UserIcon className="h-6 w-6"/></div>
                            <h3 className="font-bold text-lg">Borrower Details</h3>
                        </div>
                        <input type="text" placeholder="Full Name" value={borrower.name} onChange={e => handleBorrowerChange('name', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        <input type="tel" placeholder="Phone Number" value={borrower.phone} onChange={e => handleBorrowerChange('phone', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        <textarea placeholder="Full Address" value={borrower.address} onChange={e => handleBorrowerChange('address', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" rows={2} required />
                    </div>
                );
            case 2:
                return (
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><IdCardIcon className="h-6 w-6"/></div>
                            <h3 className="font-bold text-lg">Digital Locker: Document Upload</h3>
                        </div>
                         <FileInput 
                            label="Borrower Photo" 
                            onFileSelect={(file) => handleDocumentSelect('photo', file)}
                            onRemove={() => handleRemoveDocument('photo')}
                            preview={borrower.photo} 
                            validation={docValidation.photo}
                        />
                        <FileInput 
                            label="Aadhaar Card" 
                            onFileSelect={(file) => handleDocumentSelect('aadhaarCard', file)}
                            onRemove={() => handleRemoveDocument('aadhaarCard')}
                            preview={borrower.aadhaarCard}
                            validation={docValidation.aadhaar}
                        />
                        <FileInput 
                            label="PAN Card" 
                            onFileSelect={(file) => handleDocumentSelect('panCard', file)}
                            onRemove={() => handleRemoveDocument('panCard')}
                            preview={borrower.panCard}
                            validation={docValidation.pan}
                        />
                    </div>
                );
            case 3:
                 return (
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><BoxIcon className="h-6 w-6"/></div>
                            <h3 className="font-bold text-lg">Mortgage & Loan Details</h3>
                        </div>
                        <textarea placeholder="Item Description (e.g., Gold Chain 22k)" value={mortgage.itemDescription} onChange={e => handleMortgageChange('itemDescription', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" rows={2} required />
                        <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Estimated Item Value ({currencySymbol})</label>
                             <input type="number" placeholder="Value" value={mortgage.itemValue || ''} onChange={e => handleMortgageChange('itemValue', Number(e.target.value))} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        </div>
                         <FileInput 
                            label="Item Photo" 
                            onFileSelect={(file) => handleDocumentSelect('itemPhoto', file)}
                            onRemove={() => handleRemoveDocument('itemPhoto')}
                            preview={mortgage.itemPhoto}
                            validation={docValidation.itemPhoto}
                        />
                         <hr className="my-2 border-slate-200 dark:border-slate-700"/>
                        <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Principal Amount ({currencySymbol})</label>
                             <input type="number" placeholder="Principal" value={loan.principal || ''} onChange={e => handleLoanChange('principal', Number(e.target.value))} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Monthly Interest Rate (%)</label>
                             <input type="number" step="0.01" placeholder="Interest Rate" value={loan.interestRate || ''} onChange={e => handleLoanChange('interestRate', Number(e.target.value))} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Tenure (in Months)</label>
                             <input type="number" placeholder="Tenure" value={loan.tenureMonths || ''} onChange={e => handleLoanChange('tenureMonths', Number(e.target.value))} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Repayment Type</label>
                            <select value={loan.repaymentType} onChange={e => handleLoanChange('repaymentType', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <option value="full">Full Payment at End</option>
                                <option value="emi">EMI</option>
                            </select>
                        </div>
                        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between"><span>Loan-to-Value (LTV):</span> <span className="font-bold">{ltv.toFixed(2)}%</span></div>
                            {loan.repaymentType === 'emi' && emiAmount && <div className="flex justify-between"><span>Calculated EMI:</span> <span className="font-bold">{currencySymbol}{emiAmount.toFixed(2)}</span></div>}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Create New Loan</h2>
                    <button onClick={onClose}><XIcon className="h-6 w-6"/></button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    {renderStep()}
                </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 flex justify-between">
                    <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg disabled:opacity-50">Back</button>
                    {step < 3 ? (
                        <button onClick={() => setStep(s => s + 1)} className="px-4 py-2 text-white bg-gold-600 rounded-lg">Next</button>
                    ) : (
                        <button onClick={handleSubmit} className="px-4 py-2 text-white bg-green-600 rounded-lg">Create Loan</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateLoanForm;