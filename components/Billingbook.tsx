import React, { useState, useMemo, useRef } from 'react';
import type { Invoice, InvoiceItem, OldGoldItem } from '../types';
import { useCurrency } from './CurrencyContext';
import { useAuth } from './AuthContext';
import { PlusIcon, TrashIcon, PrintIcon, XIcon, SettingsIcon, SendIcon, BillIcon } from './icons';

// Mock gold rate (per 10g 24k)
const GOLD_RATE_24K_PER_10G = 72850;

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const formatCurrency = (amount: number) => amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const getInvoiceId = (invoice: Invoice) => `INV-${new Date(invoice.invoiceDate).getTime().toString().slice(-6)}`;

const mockInvoicesData: Invoice[] = [
    {
        customer: { title: 'Mr.', name: 'Suresh Patel', phone: '9876543210', address: '123 Main St, Delhi', gstin: '29ABCDE1234F1Z5' },
        items: [{ id: 'item-1-1', description: '22k Gold Ring', weight: 5.2, purity: 22, wastage: 12, makingCharge: 18 }],
        oldGoldItems: [],
        hsnCode: '7113', terms: 'Thank you for your business!', invoiceDate: new Date('2024-05-20T10:00:00Z').toISOString(),
        subTotal: 38547.38, oldGoldTotal: 0, taxableAmount: 38547.38, cgst: 578.21, sgst: 578.21, grandTotal: 39703.80, businessLogo: null, template: 'modern',
    },
    {
        customer: { title: 'Mrs.', name: 'Anita Verma', phone: '9988776655', address: '456 Park Ave, Mumbai', gstin: '' },
        items: [{ id: 'item-2-1', description: 'Silver Anklets', weight: 80.5, purity: 24, wastage: 0, makingCharge: 25 }],
        oldGoldItems: [{ id: 'old-2-1', description: 'Old silver coin', weight: 20, purity: 24 }],
        hsnCode: '7114', terms: 'Thank you for your business!', invoiceDate: new Date('2024-06-11T15:30:00Z').toISOString(),
        subTotal: 8593.13, oldGoldTotal: 1710, taxableAmount: 6883.13, cgst: 103.25, sgst: 103.25, grandTotal: 7089.63, businessLogo: null, template: 'classic',
    },
    {
        customer: { title: 'Mr.', name: 'Suresh Patel', phone: '9876543210', address: '123 Main St, Delhi', gstin: '29ABCDE1234F1Z5' },
        items: [{ id: 'item-3-1', description: '18k Gold Earrings', weight: 3.1, purity: 18, wastage: 15, makingCharge: 20 }],
        oldGoldItems: [],
        hsnCode: '7113', terms: 'Thank you for your business!', invoiceDate: new Date('2024-07-01T12:00:00Z').toISOString(),
        subTotal: 20456.91, oldGoldTotal: 0, taxableAmount: 20456.91, cgst: 306.85, sgst: 306.85, grandTotal: 21070.61, businessLogo: null, template: 'simple',
    },
];

// --- INVOICE TEMPLATES ---

const ModernTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <div className="text-black text-sm">
        <header className="flex justify-between items-start pb-4 border-b border-gray-300">
            <div>
                {invoice.businessLogo ? <img src={invoice.businessLogo} alt="Business Logo" className="h-20 object-contain"/> : <h1 className="text-3xl font-bold text-gray-800">Aman Jewellers</h1> }
                <p>123 Jewel Lane, Gold City, 12345</p>
            </div>
            <div className="text-right">
                <h2 className="text-4xl font-bold uppercase text-gray-700">Invoice</h2>
                <p><strong>Invoice #:</strong> {getInvoiceId(invoice)}</p>
                <p><strong>Date:</strong> {formatDate(invoice.invoiceDate)}</p>
            </div>
        </header>
        <main>
            <section className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold text-gray-600">Bill To:</h3>
                    <p className="font-bold">{invoice.customer.title} {invoice.customer.name}</p>
                    <p>{invoice.customer.address}</p>
                    <p>{invoice.customer.phone}</p>
                    {invoice.customer.gstin && <p><strong>GSTIN:</strong> {invoice.customer.gstin}</p>}
                </div>
            </section>
             <section className="mt-8">
                <h3 className="font-semibold mb-2">New Items (HSN: {invoice.hsnCode})</h3>
                <table className="w-full text-left">
                   <thead><tr className="bg-gray-100 text-xs uppercase"><th className="p-2">Item</th><th className="p-2 text-right">Weight(g)</th><th className="p-2 text-right">Purity</th><th className="p-2 text-right">Value</th></tr></thead>
                   <tbody>{invoice.items.map(item => <tr key={item.id} className="border-b"><td className="p-2">{item.description}</td><td className="p-2 text-right">{item.weight.toFixed(3)}</td><td className="p-2 text-right">{item.purity}k</td><td className="p-2 text-right">{formatCurrency(invoice.subTotal / invoice.items.length)}</td></tr>)}</tbody>
                </table>
            </section>
            {invoice.oldGoldItems.length > 0 && (
            <section className="mt-6">
                <h3 className="font-semibold mb-2">Old Gold Exchange</h3>
                <table className="w-full text-left">
                    <thead><tr className="bg-gray-100 text-xs uppercase"><th className="p-2">Item</th><th className="p-2 text-right">Weight(g)</th><th className="p-2 text-right">Purity</th><th className="p-2 text-right">Value</th></tr></thead>
                    <tbody>{invoice.oldGoldItems.map(item => <tr key={item.id} className="border-b"><td className="p-2">{item.description}</td><td className="p-2 text-right">{item.weight.toFixed(3)}</td><td className="p-2 text-right">{item.purity}k</td><td className="p-2 text-right">{formatCurrency(invoice.oldGoldTotal / invoice.oldGoldItems.length)}</td></tr>)}</tbody>
                </table>
            </section>
            )}
            <section className="mt-8 flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(invoice.subTotal)}</span></div>
                    <div className="flex justify-between"><span>Old Gold Credit:</span><span className="text-red-600">- {formatCurrency(invoice.oldGoldTotal)}</span></div>
                    <div className="flex justify-between font-bold border-t pt-2"><span>Taxable Amount:</span><span>{formatCurrency(invoice.taxableAmount)}</span></div>
                    <div className="flex justify-between"><span>CGST (1.5%):</span><span>+ {formatCurrency(invoice.cgst)}</span></div>
                    <div className="flex justify-between"><span>SGST (1.5%):</span><span>+ {formatCurrency(invoice.sgst)}</span></div>
                    <div className="flex justify-between text-xl font-bold bg-gray-100 p-2 rounded"><span>Grand Total:</span><span>₹{formatCurrency(invoice.grandTotal)}</span></div>
                </div>
            </section>
            <footer className="mt-12 border-t pt-4 text-xs text-gray-500">
                <p>{invoice.terms}</p>
            </footer>
        </main>
    </div>
);

const ClassicTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <div className="text-black text-sm font-serif">
        <header className="text-center mb-8">
            {invoice.businessLogo ? <img src={invoice.businessLogo} alt="Business Logo" className="h-24 mx-auto mb-4 object-contain"/> : <h1 className="text-4xl font-bold tracking-widest text-gray-800">AMAN JEWELLERS</h1> }
            <p>123 Jewel Lane, Gold City, 12345</p>
        </header>
        <div className="w-full border-t-2 border-b-2 border-gray-800 my-8 py-2 text-center">
            <h2 className="text-3xl font-bold uppercase text-gray-700">INVOICE</h2>
        </div>
        <main>
            <section className="mb-8 grid grid-cols-2">
                 <div>
                    <p><strong>Bill To:</strong></p>
                    <p className="font-bold">{invoice.customer.title} {invoice.customer.name}</p>
                    <p>{invoice.customer.address}</p>
                    {invoice.customer.gstin && <p><strong>GSTIN:</strong> {invoice.customer.gstin}</p>}
                </div>
                <div className="text-right">
                    <p><strong>Invoice #:</strong> {getInvoiceId(invoice)}</p>
                    <p><strong>Date:</strong> {formatDate(invoice.invoiceDate)}</p>
                </div>
            </section>
             <section className="mt-8">
                <table className="w-full text-left">
                   <thead><tr className="border-b-2 border-gray-800 text-xs uppercase"><th className="py-2">Description (HSN: {invoice.hsnCode})</th><th className="py-2 text-right">Amount</th></tr></thead>
                   <tbody>
                       {invoice.items.map(item => <tr key={item.id} className="border-b"><td className="py-2">{item.description} ({item.weight.toFixed(3)}g, {item.purity}k)</td><td className="py-2 text-right">{formatCurrency(invoice.subTotal / invoice.items.length)}</td></tr>)}
                   </tbody>
                </table>
            </section>
             {invoice.oldGoldItems.length > 0 && (
                <section className="mt-4">
                    <table className="w-full text-left">
                       <thead><tr className="border-b-2 border-gray-800 text-xs uppercase"><th className="py-2">Exchange Details</th><th className="py-2 text-right">Credit</th></tr></thead>
                       <tbody>
                           {invoice.oldGoldItems.map(item => <tr key={item.id} className="border-b"><td className="py-2">{item.description} ({item.weight.toFixed(3)}g, {item.purity}k)</td><td className="py-2 text-right text-red-600">- {formatCurrency(invoice.oldGoldTotal / invoice.oldGoldItems.length)}</td></tr>)}
                       </tbody>
                    </table>
                </section>
             )}
            <section className="mt-8 flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(invoice.subTotal)}</span></div>
                    <div className="flex justify-between"><span>Exchange Credit:</span><span>{formatCurrency(invoice.oldGoldTotal)}</span></div>
                     <div className="flex justify-between font-bold border-t pt-2"><span>Taxable Amount:</span><span>{formatCurrency(invoice.taxableAmount)}</span></div>
                    <div className="flex justify-between"><span>CGST (1.5%):</span><span>{formatCurrency(invoice.cgst)}</span></div>
                    <div className="flex justify-between"><span>SGST (1.5%):</span><span>{formatCurrency(invoice.sgst)}</span></div>
                    <div className="flex justify-between text-lg font-bold border-t-2 border-gray-800 mt-2 pt-2"><span>Total Due:</span><span>₹{formatCurrency(invoice.grandTotal)}</span></div>
                </div>
            </section>
            <footer className="mt-16 text-center text-xs text-gray-500">
                <p>{invoice.terms}</p>
            </footer>
        </main>
    </div>
);


const SimpleTemplate: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <div className="text-black text-sm font-sans">
         <header className="mb-8">
            {invoice.businessLogo ? <img src={invoice.businessLogo} alt="Business Logo" className="h-16 mb-2 object-contain"/> : <h1 className="text-2xl font-bold text-gray-800">Aman Jewellers</h1> }
            <p className="text-xs">123 Jewel Lane, Gold City, 12345</p>
        </header>
        <div className="flex justify-between items-start mb-6">
             <div>
                <p className="text-xs text-gray-600">Bill To:</p>
                <p>{invoice.customer.title} {invoice.customer.name}</p>
                 {invoice.customer.gstin && <p className="text-xs">GSTIN: {invoice.customer.gstin}</p>}
            </div>
            <div className="text-right text-xs">
                <p><strong>Invoice</strong></p>
                <p>#{getInvoiceId(invoice)}</p>
                <p>{formatDate(invoice.invoiceDate)}</p>
            </div>
        </div>
        <main>
            <table className="w-full text-left text-xs">
               <thead>
                    <tr className="bg-gray-100 font-bold">
                        <th className="p-2">DESCRIPTION (HSN: {invoice.hsnCode})</th>
                        <th className="p-2 text-right">WEIGHT</th>
                        <th className="p-2 text-right">RATE</th>
                        <th className="p-2 text-right">TOTAL</th>
                    </tr>
                </thead>
               <tbody>
                   {invoice.items.map(item => (
                       <tr key={item.id} className="border-b">
                           <td className="p-2">{item.description}</td>
                           <td className="p-2 text-right">{item.weight.toFixed(3)}g</td>
                           <td className="p-2 text-right">{item.purity}k</td>
                           <td className="p-2 text-right">{formatCurrency(invoice.subTotal / invoice.items.length)}</td>
                       </tr>
                   ))}
                   {invoice.oldGoldItems.map(item => (
                       <tr key={item.id} className="border-b">
                           <td className="p-2">{item.description} (Exchange)</td>
                           <td className="p-2 text-right">{item.weight.toFixed(3)}g</td>
                           <td className="p-2 text-right">{item.purity}k</td>
                           <td className="p-2 text-right text-red-600">- {formatCurrency(invoice.oldGoldTotal / invoice.oldGoldItems.length)}</td>
                       </tr>
                   ))}
               </tbody>
               <tfoot>
                    <tr><td colSpan={3} className="text-right p-2 font-bold">SUBTOTAL</td><td className="text-right p-2">{formatCurrency(invoice.subTotal)}</td></tr>
                    <tr><td colSpan={3} className="text-right p-2 font-bold">EXCHANGE</td><td className="text-right p-2">{formatCurrency(invoice.oldGoldTotal)}</td></tr>
                    <tr><td colSpan={3} className="text-right p-2 font-bold">TAXABLE</td><td className="text-right p-2">{formatCurrency(invoice.taxableAmount)}</td></tr>
                    <tr><td colSpan={3} className="text-right p-2">CGST @1.5%</td><td className="text-right p-2">{formatCurrency(invoice.cgst)}</td></tr>
                    <tr><td colSpan={3} className="text-right p-2">SGST @1.5%</td><td className="text-right p-2">{formatCurrency(invoice.sgst)}</td></tr>
                    <tr className="bg-gray-100 font-bold text-base"><td colSpan={3} className="text-right p-2">GRAND TOTAL</td><td className="text-right p-2">₹{formatCurrency(invoice.grandTotal)}</td></tr>
               </tfoot>
            </table>
        </main>
    </div>
);


const Billingbook: React.FC = () => {
    const { currencySymbol } = useCurrency();
    const { role, user } = useAuth();
    const isCustomer = role === 'customer';
    const goldRatePerGram = GOLD_RATE_24K_PER_10G / 10;

    // Invoice Data State
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoicesData);

    // Form state
    const [customerTitle, setCustomerTitle] = useState<'Mr.' | 'Mrs.' | 'M/s'>('Mr.');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerGstin, setCustomerGstin] = useState('');
    const [hsnCode, setHsnCode] = useState('7113');
    const [newItems, setNewItems] = useState<Omit<InvoiceItem, 'id'>[]>([{ description: '', weight: 0, purity: 22, wastage: 10, makingCharge: 15 }]);
    const [oldGoldItems, setOldGoldItems] = useState<Omit<OldGoldItem, 'id'>[]>([]);

    // Settings state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [businessLogo, setBusinessLogo] = useState<string | null>(null);
    const [invoiceTemplate, setInvoiceTemplate] = useState<'modern' | 'classic' | 'simple'>('modern');
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Modal state
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);

    const customerInvoices = useMemo(() => {
        if (!user?.identifier) return [];
        return invoices.filter(inv => inv.customer.phone === user.identifier).sort((a,b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
    }, [invoices, user]);

    const calculations = useMemo(() => {
        const calculateItemValue = (item: Omit<InvoiceItem, 'id'>) => {
            if (item.weight <= 0) return 0;
            const pureWeight = item.weight * (item.purity / 24);
            const goldValue = pureWeight * goldRatePerGram;
            const wastageValue = goldValue * (item.wastage / 100);
            const makingValue = goldValue * (item.makingCharge / 100);
            return goldValue + wastageValue + makingValue;
        };
        const calculateOldGoldValue = (item: Omit<OldGoldItem, 'id'>) => {
             if (item.weight <= 0) return 0;
            const pureWeight = item.weight * (item.purity / 24);
            return pureWeight * goldRatePerGram;
        };

        const subTotal = newItems.reduce((acc, item) => acc + calculateItemValue(item), 0);
        const oldGoldTotal = oldGoldItems.reduce((acc, item) => acc + calculateOldGoldValue(item), 0);
        const taxableAmount = subTotal - oldGoldTotal;
        const cgst = taxableAmount > 0 ? taxableAmount * 0.015 : 0;
        const sgst = taxableAmount > 0 ? taxableAmount * 0.015 : 0;
        const grandTotal = taxableAmount + cgst + sgst;

        return { subTotal, oldGoldTotal, taxableAmount, cgst, sgst, grandTotal };
    }, [newItems, oldGoldItems, goldRatePerGram]);

    const handleUpdateItem = (index: number, field: keyof (InvoiceItem & OldGoldItem), value: string | number, isNew: boolean) => {
        if (isNew) {
            const updatedItems = [...newItems] as Omit<InvoiceItem, 'id'>[];
            (updatedItems[index] as any)[field] = value;
            setNewItems(updatedItems);
        } else {
            const updatedItems = [...oldGoldItems] as Omit<OldGoldItem, 'id'>[];
            (updatedItems[index] as any)[field] = value;
            setOldGoldItems(updatedItems);
        }
    };
    
    const handleAddItem = (isNew: boolean) => {
        if (isNew) {
            setNewItems([...newItems, { description: '', weight: 0, purity: 22, wastage: 10, makingCharge: 15 }]);
        } else {
            setOldGoldItems([...oldGoldItems, { description: '', weight: 0, purity: 22 }]);
        }
    };
    
    const handleRemoveItem = (index: number, isNew: boolean) => {
        if (isNew) {
            setNewItems(newItems.filter((_, i) => i !== index));
        } else {
            setOldGoldItems(oldGoldItems.filter((_, i) => i !== index));
        }
    };

    const handleGenerateInvoice = () => {
        if (!customerName || newItems.length === 0) {
            alert("Please fill in customer name and at least one new item.");
            return;
        }
        const invoiceData: Invoice = {
            customer: {
                title: customerTitle,
                name: customerName,
                phone: customerPhone,
                address: customerAddress,
                gstin: customerGstin,
            },
            items: newItems.map((item, i) => ({ ...item, id: `new-${i}`})),
            oldGoldItems: oldGoldItems.map((item, i) => ({ ...item, id: `old-${i}`})),
            hsnCode,
            terms: 'Thank you for your business! All goods remain the property of Aman Jewellers until paid for in full.',
            invoiceDate: new Date().toISOString(),
            ...calculations,
            businessLogo,
            template: invoiceTemplate,
        };
        setGeneratedInvoice(invoiceData);
        setInvoices(prev => [invoiceData, ...prev]);
        setIsPreviewOpen(true);
    };

    const handlePreviewInvoice = (invoice: Invoice) => {
        setGeneratedInvoice(invoice);
        setIsPreviewOpen(true);
    };

    const handleSendBill = () => {
        if (!generatedInvoice) return;
    
        const { customer, grandTotal, invoiceDate } = generatedInvoice;
        const phone = customer.phone.replace(/\D/g, ''); // Clean phone number of non-digits
        if (!phone) {
            alert("Customer phone number is not available to send the bill.");
            return;
        }
    
        const invoiceNumber = getInvoiceId(generatedInvoice);
        const totalAmount = `${currencySymbol}${formatCurrency(grandTotal)}`;
    
        const message = `Dear ${customer.title} ${customer.name},\n\nThank you for your purchase at Aman Jewellers.\n\nYour invoice #${invoiceNumber} for a total of ${totalAmount} is ready.\n\nWe appreciate your business!`;
    
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/91${phone}?text=${encodedMessage}`;
    
        window.open(whatsappUrl, '_blank');
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await toBase64(file);
            setBusinessLogo(base64);
        }
    };
    
    const renderTemplate = () => {
        if (!generatedInvoice) return null;
        switch(generatedInvoice.template) {
            case 'classic': return <ClassicTemplate invoice={generatedInvoice} />;
            case 'simple': return <SimpleTemplate invoice={generatedInvoice} />;
            case 'modern':
            default: return <ModernTemplate invoice={generatedInvoice} />;
        }
    };

    const renderItemRows = (isNew: boolean) => {
        const items = isNew ? newItems : oldGoldItems;
        const PurityOptions = () => (<> <option value="24">24k (99.9%)</option> <option value="22">22k (91.6%)</option> <option value="18">18k (75.0%)</option> <option value="14">14k (58.3%)</option> <option value="10">10k (41.7%)</option></>);

        return items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
                <input type="text" placeholder="Item Description" value={(item as InvoiceItem).description} onChange={e => handleUpdateItem(index, 'description', e.target.value, isNew)} className="col-span-3 p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                <input type="number" placeholder="Wt (g)" value={item.weight || ''} onChange={e => handleUpdateItem(index, 'weight', parseFloat(e.target.value) || 0, isNew)} className="col-span-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                <select value={item.purity} onChange={e => handleUpdateItem(index, 'purity', parseInt(e.target.value), isNew)} className="col-span-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-700">
                    <PurityOptions />
                </select>
                {isNew && (
                    <>
                        <input type="number" placeholder="Wastage %" value={(item as InvoiceItem).wastage || ''} onChange={e => handleUpdateItem(index, 'wastage', parseFloat(e.target.value) || 0, true)} className="col-span-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                        <input type="number" placeholder="Making %" value={(item as InvoiceItem).makingCharge || ''} onChange={e => handleUpdateItem(index, 'makingCharge', parseFloat(e.target.value) || 0, true)} className="col-span-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                    </>
                )}
                <button onClick={() => handleRemoveItem(index, isNew)} className={`text-red-500 hover:text-red-700 ${isNew ? 'col-span-1' : 'col-span-5'}`}>
                    <TrashIcon className="h-5 w-5 mx-auto"/>
                </button>
            </div>
        ));
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Billingbook</h1>
              <p className="text-slate-500 dark:text-slate-400">
                {isCustomer ? "View your invoice history." : "Create and manage professional invoices."}
              </p>
            </div>
            {!isCustomer && (
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <SettingsIcon className="h-6 w-6 text-slate-600 dark:text-slate-300"/>
                </button>
            )}
        </div>
        
        {isCustomer ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="font-semibold text-lg mb-4 border-b dark:border-slate-700 pb-2">Your Invoice History</h2>
                {customerInvoices.length > 0 ? (
                    <div className="space-y-3">
                        {customerInvoices.map((invoice) => (
                            <div key={getInvoiceId(invoice)} onClick={() => handlePreviewInvoice(invoice)} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <BillIcon className="h-6 w-6 text-gold-500"/>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-100">{getInvoiceId(invoice)}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(invoice.invoiceDate)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-slate-900 dark:text-slate-200">{currencySymbol}{formatCurrency(invoice.grandTotal)}</p>
                                    <p className="text-xs text-blue-500 font-semibold">View Details</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <BillIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600"/>
                        <p className="mt-2 font-semibold text-slate-600 dark:text-slate-400">No Invoices Found</p>
                        <p className="text-sm text-slate-500">You do not have any past bills with us.</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2">Customer Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <select value={customerTitle} onChange={e => setCustomerTitle(e.target.value as any)} className="p-2 border rounded-md bg-slate-100 dark:bg-slate-700">
                                <option>Mr.</option><option>Mrs.</option><option>M/s</option>
                            </select>
                            <input type="text" placeholder="Full Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="sm:col-span-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                            <input type="text" placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                            <input type="text" placeholder="Address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="sm:col-span-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                            <input type="text" placeholder="Customer GSTIN (Optional)" value={customerGstin} onChange={e => setCustomerGstin(e.target.value)} className="sm:col-span-3 p-2 border rounded-md bg-slate-100 dark:bg-slate-700"/>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2">New Jewellery Items</h2>
                        {renderItemRows(true)}
                        <button onClick={() => handleAddItem(true)} className="mt-2 flex items-center text-sm font-semibold text-gold-600 hover:text-gold-500"><PlusIcon className="h-4 w-4 mr-1"/> Add Item</button>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2">Old Gold Exchange</h2>
                        {renderItemRows(false)}
                        <button onClick={() => handleAddItem(false)} className="mt-2 flex items-center text-sm font-semibold text-gold-600 hover:text-gold-500"><PlusIcon className="h-4 w-4 mr-1"/> Add Old Gold</button>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                     <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg sticky top-6">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2">Invoice Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>New Gold Value:</span> <span>{currencySymbol}{formatCurrency(calculations.subTotal)}</span></div>
                            <div className="flex justify-between"><span>Old Gold Credit:</span> <span className="text-red-500">- {currencySymbol}{formatCurrency(calculations.oldGoldTotal)}</span></div>
                            <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Taxable Amount:</span> <span>{currencySymbol}{formatCurrency(calculations.taxableAmount)}</span></div>
                            <div className="flex justify-between"><span>CGST (1.5%):</span> <span>+ {currencySymbol}{formatCurrency(calculations.cgst)}</span></div>
                            <div className="flex justify-between"><span>SGST (1.5%):</span> <span>+ {currencySymbol}{formatCurrency(calculations.sgst)}</span></div>
                            <div className="flex justify-between text-xl font-bold border-t-2 pt-3 mt-3"><span>Grand Total:</span> <span className="text-gold-500">{currencySymbol}{formatCurrency(calculations.grandTotal)}</span></div>
                        </div>
                        <button onClick={handleGenerateInvoice} className="w-full mt-6 bg-gold-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gold-500 transition-colors">Generate Invoice</button>
                     </div>
                </div>
            </div>
        )}
        
        {isPreviewOpen && generatedInvoice && (
             <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4" onClick={() => setIsPreviewOpen(false)}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b flex justify-between items-center bg-slate-50 print-hide">
                        <h3 className="text-lg font-bold">Invoice Preview</h3>
                        <div className="flex items-center gap-4">
                             <button onClick={handleSendBill} className="text-sm font-medium text-slate-700 flex items-center gap-2 hover:text-gold-600 transition-colors">
                                <SendIcon className="h-5 w-5"/> Send Bill
                             </button>
                             <button onClick={() => window.print()} className="text-sm font-medium text-slate-700 flex items-center gap-2 hover:text-gold-600 transition-colors">
                                <PrintIcon className="h-5 w-5"/> Print
                             </button>
                             <button onClick={() => setIsPreviewOpen(false)}><XIcon className="h-6 w-6" /></button>
                        </div>
                    </div>
                    <div className="overflow-y-auto p-8" id="invoice-preview">
                        {renderTemplate()}
                    </div>
                </div>
            </div>
        )}

        {isSettingsOpen && (
             <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center" onClick={() => setIsSettingsOpen(false)}>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Invoice Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Business Logo</label>
                            <button onClick={() => logoInputRef.current?.click()} className="w-full p-2 border rounded-md">{businessLogo ? 'Change Logo' : 'Upload Logo'}</button>
                            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*"/>
                            {businessLogo && <img src={businessLogo} alt="logo preview" className="h-16 mt-2 mx-auto"/>}
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Invoice Template</label>
                            <select value={invoiceTemplate} onChange={e => setInvoiceTemplate(e.target.value as any)} className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-700">
                               <option value="modern">Modern</option><option value="classic">Classic</option><option value="simple">Simple</option>
                           </select>
                        </div>
                        <div className="flex justify-end pt-2">
                             <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-gold-600 rounded-lg">Done</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
};

export default Billingbook;