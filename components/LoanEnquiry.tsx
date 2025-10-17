import React, { useState } from 'react';
import { useCurrency } from './CurrencyContext';

const LoanEnquiry: React.FC = () => {
  const { currencySymbol } = useCurrency();
  const [applicantName, setApplicantName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !principal || !rate || !tenure) {
        alert("Please fill out all fields.");
        return;
    }
    
    const enquiryDetails = {
      applicantName,
      principal: parseFloat(principal),
      interestRate: parseFloat(rate),
      tenureYears: parseInt(tenure, 10),
    };

    console.log("New Loan Enquiry Submitted:", enquiryDetails);
    
    // Optionally, clear the form after submission
    setApplicantName('');
    setPrincipal('');
    setRate('');
    setTenure('');

    alert("Enquiry submitted successfully! We will get back to you shortly.");
  };

  return (
    <div className="space-y-6 w-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Loan Enquiry</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Submit your details, and we'll get back to you with the best offers.</p>
      </div>
      
      <div className="w-full">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="applicantName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Applicant Name</label>
              <input
                type="text"
                id="applicantName"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-gold-500 focus:outline-none text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label htmlFor="principal" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Principal Amount ({currencySymbol})</label>
              <input
                type="number"
                id="principal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="e.g., 50000"
                className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-gold-500 focus:outline-none text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                id="rate"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g., 12.5"
                className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-gold-500 focus:outline-none text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Tenure (Years)</label>
              <input
                type="number"
                id="tenure"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="e.g., 5"
                className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-gold-500 focus:outline-none text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gold-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gold-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Submit Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanEnquiry;