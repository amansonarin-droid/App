import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Help & FAQ</h1>
        <p className="text-slate-500 dark:text-slate-400">Find answers to common questions and learn how to use the FinGold Toolkit.</p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6 divide-y divide-slate-200 dark:divide-slate-700">
            <div className="pt-6 first:pt-0">
              <h3 className="font-semibold text-gold-600 dark:text-gold-400">How do I use the AI Jewelry Studio?</h3>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Navigate to the 'AI Jewelry Studio' from the dashboard. Simply type a detailed description of the jewelry you want to create in the text box and click "Generate Design". The more specific you are (e.g., "22k gold necklace with a peacock pendant and ruby inlays"), the better the result will be. You can also upload a reference image to guide the AI.
              </p>
            </div>
            
            <div className="pt-6">
              <h3 className="font-semibold text-gold-600 dark:text-gold-400">How do I change the theme or currency?</h3>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Navigate to the 'Settings' page using the link in the sidebar. There you will find options to toggle between light and dark themes, and to select your preferred currency (INR, USD, EUR). Your choices are saved automatically for your device.
              </p>
            </div>

            <div className="pt-6">
              <h3 className="font-semibold text-gold-600 dark:text-gold-400">Are the gold and silver rates live?</h3>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                The rates displayed on the dashboard are for demonstration purposes and updated periodically. In a real-world application, these would be connected to a live market data feed for real-time accuracy.
              </p>
            </div>

             <div className="pt-6">
              <h3 className="font-semibold text-gold-600 dark:text-gold-400">What are the 'Byajbook', 'Khatabook', etc.?</h3>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                These are digital ledgers for various accounting needs common in the jewelry business. 'Byajbook' is for managing interest-based loans, 'Khatabook' is a general customer ledger, 'Billingbook' is for creating invoices, and the 'Gold/Silver Wallet' is for tracking personal metal investments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;