export interface Activity {
  id: number;
  type: 'invoice' | 'payment' | 'entry';
  description: string;
  amount: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

// --- Loan / Byajbook Types ---
export interface BorrowerDetails {
  name: string;
  phone: string;
  address: string;
  photo: string | null;
  aadhaarCard: string | null;
  panCard: string | null;
}

export interface MortgageDetails {
  itemDescription: string;
  itemValue: number;
  itemPhoto: string | null;
}

export interface LoanDetails {
  principal: number;
  currentPrincipal: number;
  interestRate: number; // Monthly percentage
  repaymentType: 'full' | 'emi';
  tenureMonths: number;
  ltv: number;
  emiAmount?: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: 'interest' | 'emi';
}

export interface Loan {
  id: string;
  borrower: BorrowerDetails;
  mortgage: MortgageDetails;
  loan: LoanDetails;
  startDate: string;
  nextPaymentDueDate: string;
  finalDueDate: string;
  outstandingInterest: number;
  status: 'active' | 'overdue' | 'closed';
  paymentHistory: Payment[];
}

// --- Loan Enquiry Types ---
export type EnquiryStatus = 'pending' | 'approved' | 'rejected' | 'visit_store';

export interface LoanEnquiry {
  id: string;
  status: EnquiryStatus;
  personalDetails: {
    name: string;
    phone: string;
    address: string;
    photo: string | null;
  };
  documents: {
    aadhaar: string | null;
    pan: string | null;
  };
  mortgage: {
    description: string;
    photo: string | null;
  };
  loan: {
    amount: number;
    tenureMonths: number;
  };
  submittedDate: string;
}


// --- Billing / Billingbook Types ---
export interface InvoiceItem {
    id: string;
    description: string;
    weight: number;
    purity: number; // Karat value e.g., 22
    wastage: number; // Percentage
    makingCharge: number; // Percentage
}

export interface OldGoldItem {
    id: string;
    description: string;
    weight: number;
    purity: number; // Karat value e.g., 22
}

export interface Invoice {
    customer: {
        title: 'Mr.' | 'Mrs.' | 'M/s';
        name: string;
        phone: string;
        address: string;
        gstin: string;
    };
    items: InvoiceItem[];
    oldGoldItems: OldGoldItem[];
    hsnCode: string;
    terms: string;
    invoiceDate: string;
    subTotal: number;
    oldGoldTotal: number;
    taxableAmount: number;
    cgst: number;
    sgst: number;
    grandTotal: number;
    businessLogo: string | null;
    template: 'modern' | 'classic' | 'simple';
}


// --- Ledger / Khatabook Types ---
export interface KhatabookTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  photo?: string | null; // Base64 string for the photo
}

export interface SchemeTransaction {
    id: string;
    date: string;
    amountPaid: number;
    rateAtPurchase: number; // Rate per 10g
    gramsPurchased: number;
}

export interface CustomerScheme {
    id: string;
    metalType: 'gold' | 'silver';
    monthlyInstallment: number;
    durationMonths: number;
    // FIX: Added missing startDate property.
    startDate: string;
    status: 'active' | 'completed';
    transactions: SchemeTransaction[];
}

export interface KhatabookCustomer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  transactions: KhatabookTransaction[];
  schemes?: CustomerScheme[];
}


// --- Wallet / GoldSilverbook Types ---
export interface WalletTransaction {
    id: string;
    date: string;
    amountPaid: number;
    rateAtPurchase: number; // Rate per 10g for gold, per 1g for silver
    gramsPurchased: number;
}

// --- Chat Types ---
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  senderId: string; // 'provider' for the service provider, or the customer's phone number
}

export interface ChatConversation {
  contactId: string; // The ID of the other person in the chat
  contactName: string;
  contactPhone?: string; // Add phone for matching customer data
  avatar?: string;
  messages: ChatMessage[];
  lastMessagePreview?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
}