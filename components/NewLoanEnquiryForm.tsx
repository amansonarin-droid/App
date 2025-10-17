import React, { useState } from 'react';
import type { LoanEnquiry } from '../types';
import { useCurrency } from './CurrencyContext';
import { UserIcon, IdCardIcon, CameraIcon, BoxIcon, LoanIcon, CheckCircleIcon, UploadCloudIcon, XIcon } from './icons';

interface NewLoanEnquiryFormProps {
    onSubmit: (enquiry: Omit<LoanEnquiry, 'id' | 'status' | 'submittedDate'>) => void;
    onBack: () => void;
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const FileInput: React.FC<{ label: string; onFileSelect: (file: string | null) => void; preview: string | null; }> = ({ label, onFileSelect, preview }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await toBase64(file);
            onFileSelect(base64);
        } else {
            onFileSelect(null);
        }
    };
    
    if (preview) {
        return (
             <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
                <div className="flex items-center gap-3 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <img src={`data:image/jpeg;base64,${preview}`} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-grow">
                        <p className="text-sm font-semibold">Document Ready</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Uploaded successfully</p>
                    </div>
                    <button type="button" onClick={() => onFileSelect(null)} className="p-1 text-slate-500 hover:text-red-500">
                        <XIcon className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
            <button type="button" onClick={() => inputRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm">
                <UploadCloudIcon className="h-8 w-8 text-slate-400" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Click to upload {label}</span>
                <span className="text-xs text-slate-500">PNG, JPG up to 2MB</span>
            </button>
            <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png" />
        </div>
    );
}

const NewLoanEnquiryForm: React.FC<NewLoanEnquiryFormProps> = ({ onSubmit, onBack }) => {
    const { currencySymbol } = useCurrency();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Omit<LoanEnquiry, 'id'|'status'|'submittedDate'>>({
        personalDetails: { name: '', phone: '', address: '', photo: null },
        documents: { aadhaar: null, pan: null },
        mortgage: { description: '', photo: null },
        loan: { amount: 0, tenureMonths: 12 },
    });
    
    const handleChange = (section: keyof typeof formData, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const isStep1Valid = formData.personalDetails.name && formData.personalDetails.phone && formData.personalDetails.address;

    const renderStepContent = () => {
        switch (step) {
            case 1: // Personal Details
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><UserIcon className="h-6 w-6 text-gold-500" /><h3 className="font-bold text-lg">Personal Details</h3></div>
                        <input type="text" placeholder="Full Name" value={formData.personalDetails.name} onChange={e => handleChange('personalDetails', 'name', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        <input type="tel" placeholder="Phone Number" value={formData.personalDetails.phone} onChange={e => handleChange('personalDetails', 'phone', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        <textarea placeholder="Full Address" value={formData.personalDetails.address} onChange={e => handleChange('personalDetails', 'address', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" rows={2} required />
                        <FileInput label="Your Photo" preview={formData.personalDetails.photo} onFileSelect={file => handleChange('personalDetails', 'photo', file)} />
                    </div>
                );
            case 2: // Documents
                return (
                     <div className="space-y-4">
                        <div className="flex items-center gap-3"><IdCardIcon className="h-6 w-6 text-gold-500" /><h3 className="font-bold text-lg">Digital Locker: Document Upload</h3></div>
                         <FileInput label="Aadhaar Card" preview={formData.documents.aadhaar} onFileSelect={file => handleChange('documents', 'aadhaar', file)} />
                         <FileInput label="PAN Card" preview={formData.documents.pan} onFileSelect={file => handleChange('documents', 'pan', file)} />
                    </div>
                );
            case 3: // Mortgage
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><BoxIcon className="h-6 w-6 text-gold-500" /><h3 className="font-bold text-lg">Mortgage Details</h3></div>
                        <textarea placeholder="Item to Mortgage (e.g., Gold Chain 22k, 25 grams)" value={formData.mortgage.description} onChange={e => handleChange('mortgage', 'description', e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" rows={3} required />
                        <FileInput label="Mortgage Item Photo" preview={formData.mortgage.photo} onFileSelect={file => handleChange('mortgage', 'photo', file)} />
                    </div>
                );
            case 4: // Loan Details
                return (
                     <div className="space-y-4">
                        <div className="flex items-center gap-3"><LoanIcon className="h-6 w-6 text-gold-500" /><h3 className="font-bold text-lg">Loan Requirements</h3></div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Loan Amount ({currencySymbol})</label>
                            <input type="number" placeholder="e.g., 50000" value={formData.loan.amount || ''} onChange={e => handleChange('loan', 'amount', parseFloat(e.target.value))} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Tenure (in Months)</label>
                            <input type="number" placeholder="e.g., 12" value={formData.loan.tenureMonths || ''} onChange={e => handleChange('loan', 'tenureMonths', parseInt(e.target.value))} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" required />
                        </div>
                    </div>
                );
            case 5: // Review
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><CheckCircleIcon className="h-6 w-6 text-gold-500" /><h3 className="font-bold text-lg">Review and Submit</h3></div>
                        <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg space-y-2 text-sm">
                            <p><strong>Name:</strong> {formData.personalDetails.name}</p>
                            <p><strong>Phone:</strong> {formData.personalDetails.phone}</p>
                            <p><strong>Loan Amount:</strong> {currencySymbol}{formData.loan.amount.toLocaleString('en-IN')}</p>
                            <p><strong>Tenure:</strong> {formData.loan.tenureMonths} Months</p>
                            <p><strong>Mortgage:</strong> {formData.mortgage.description}</p>
                            <p><strong>Documents:</strong> {formData.documents.aadhaar ? 'Aadhaar Uploaded' : 'No Aadhaar'}, {formData.documents.pan ? 'PAN Uploaded' : 'No PAN'}</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">By submitting, you agree to our terms and conditions and confirm that the information provided is accurate.</p>
                    </div>
                )
            default: return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-lg">
            <div className="mb-4">
                 <div className="flex justify-between items-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                     <span>Step {step} of 5</span>
                     <button onClick={onBack} className="text-xs hover:text-gold-500">&times; Cancel</button>
                 </div>
                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                    <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${(step / 5) * 100}%` }}></div>
                 </div>
            </div>

            <div className="min-h-[300px] flex flex-col justify-center">
                {renderStepContent()}
            </div>

            <div className="pt-4 flex gap-4">
                {step > 1 && <button onClick={prevStep} className="flex-1 bg-slate-200 dark:bg-slate-600 font-bold py-3 rounded-lg">Back</button>}
                {step < 5 && <button onClick={nextStep} disabled={step === 1 && !isStep1Valid} className="flex-1 bg-gold-600 text-white font-bold py-3 rounded-lg disabled:bg-slate-400">Next</button>}
                {step === 5 && <button onClick={() => onSubmit(formData)} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg">Submit Application</button>}
            </div>
        </div>
    );
};

export default NewLoanEnquiryForm;