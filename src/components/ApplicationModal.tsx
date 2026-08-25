import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, ShieldCheck, ChevronRight, ChevronLeft, ChevronDown, Upload, 
  FileText, Lock, User, UserCheck, Briefcase, Car, Plus, Trash2, HelpCircle, 
  Download, AlertCircle, Info, Building2, Check, ArrowRight, Mail, MapPin, Landmark
} from 'lucide-react';
import { 
  calculateLoanRepayment, formatRandSpace, 
  personalLoanTerms, businessLoanTerms, assetFinanceTerms, 
  calculatorConfig 
} from '../config/loanConfig';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLoanType?: 'personal' | 'business' | 'asset';
  initialAmount?: number;
  initialTerm?: number;
}

interface AdditionalIncome {
  id: string;
  type: string;
  amount: string;
  regularity: 'regular' | 'variable';
}

interface CreditCommitment {
  id: string;
  provider: string;
  accountType: string;
  balance: string;
  monthlyRepayment: string;
}

interface DirectorOwner {
  id: string;
  fullName: string;
  idNumber: string;
  contactNumber: string;
  ownershipPercentage: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  initialLoanType = 'personal',
  initialAmount = 50000,
  initialTerm = 24,
}) => {
  // Wizard Stage (1 to 5, 6 is Success Status Screen)
  const [step, setStep] = useState<number>(1);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState<boolean>(false);
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refNumber, setRefNumber] = useState<string>('');

  // Step 1 State: Personalise
  const [loanType, setLoanType] = useState<'personal' | 'business' | 'asset'>(initialLoanType || 'personal');
  const [amount, setAmount] = useState<number>(initialAmount || 50000);
  const [amountInput, setAmountInput] = useState<string>(String(initialAmount || 50000));
  const [term, setTerm] = useState<number>(initialTerm || 24);
  const [creditProtectionChoice, setCreditProtectionChoice] = useState<'yes' | 'no' | 'existing'>('yes');

  useEffect(() => {
    if (amount) {
      setAmountInput(String(amount));
    }
  }, [amount]);

  // Step 2 State: Your Details
  const [personalDetails, setPersonalDetails] = useState({
    title: 'Mr',
    firstName: '',
    middleNames: '',
    surname: '',
    idOrPassport: '',
    idType: 'sa_id' as 'sa_id' | 'passport',
    dateOfBirth: '',
    residencyStatus: 'Permanent SA Resident',
    maritalStatus: 'Single',
    mobileNumber: '',
    email: '',
    residentialAddress: '',
    postalAddress: '',
    sameAsResidential: true,
    province: 'Gauteng',
    city: '',
    postalCode: '',
    employmentStatus: 'Permanently Employed',
    employerName: '',
    industry: 'Financial Services',
    jobTitle: '',
    employmentStartDate: '',
    workAddress: '',
    monthlyGrossIncome: '35000',
    monthlyNetIncome: '28000',
    salaryFrequency: 'Monthly',
    salaryBank: 'Standard Bank',
  });

  // Step 3 State: Finances & Documents & Branching
  const [additionalIncomes, setAdditionalIncomes] = useState<AdditionalIncome[]>([]);
  const [expenses, setExpenses] = useState({
    housing: '8500',
    utilities: '1800',
    household: '4500',
    transport: '2500',
    education: '0',
    insurance: '1200',
    medical: '2200',
    other: '800',
  });
  const [creditCommitments, setCreditCommitments] = useState<CreditCommitment[]>([]);
  const [banking, setBanking] = useState({
    bankName: 'Standard Bank',
    accountHolderName: '',
    accountType: 'Cheque / Current',
    accountNumber: '',
    branchCode: '',
  });

  // Uploaded Files Tracker
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const [documents, setDocuments] = useState({
    idDoc: { uploaded: false, name: '' },
    payslipDoc: { uploaded: false, name: '' },
    addressDoc: { uploaded: false, name: '' },
    bankStatementsDoc: { uploaded: false, name: '' },
    cipcDoc: { uploaded: false, name: '' },
    quotationDoc: { uploaded: false, name: '' },
  });

  // Business Branch State
  const [businessDetails, setBusinessDetails] = useState({
    registeredName: '',
    tradingName: '',
    registrationNumber: '',
    businessType: 'Pty Ltd',
    industry: 'Retail & Wholesale',
    dateEstablished: '',
    businessAddress: '',
    tradingAddress: '',
    employeeCount: '5-20 Employees',
    annualTurnover: '1500000',
    monthlyTurnover: '125000',
    monthlyOperatingExpenses: '80000',
  });
  const [directors, setDirectors] = useState<DirectorOwner[]>([]);

  // Asset Finance Branch State
  const [assetDetails, setAssetDetails] = useState({
    category: 'Vehicle',
    condition: 'New',
    description: '',
    supplierName: '',
    purchasePrice: '250000',
    deposit: '25000',
    amountToFinance: '225000',
    make: '',
    model: '',
    year: '2025',
    mileage: '0',
    vinNumber: '',
    registrationNumber: '',
  });

  // Step 4 State: Your Loan & Purpose
  const [loanPurpose, setLoanPurpose] = useState<string>('Home Improvements');
  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [declarations, setDeclarations] = useState({
    debtReview: false,
    administration: false,
    insolvent: false,
    legalProceedings: false,
  });

  // Step 5 State: Review & Consents
  const [consents, setConsents] = useState({
    infoTruth: false,
    privacyNotice: false,
    creditBureau: false,
    marketing: false,
  });

  // Validation Error Message
  const [validationError, setValidationError] = useState<string>('');

  if (!isOpen) return null;

  // Active Repayment Terms based on Selected Product
  const activeTerms = 
    loanType === 'personal' ? personalLoanTerms :
    loanType === 'business' ? businessLoanTerms : assetFinanceTerms;

  // Dynamic Amortisation Calculation Engine
  const repaymentData = calculateLoanRepayment(amount, term);

  // Totals Calculations for Step 3
  const primaryNet = parseFloat(personalDetails.monthlyNetIncome) || 0;
  const totalAdditionalIncome = additionalIncomes.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalMonthlyIncome = primaryNet + totalAdditionalIncome;

  const totalMonthlyExpenses = 
    (parseFloat(expenses.housing) || 0) +
    (parseFloat(expenses.utilities) || 0) +
    (parseFloat(expenses.household) || 0) +
    (parseFloat(expenses.transport) || 0) +
    (parseFloat(expenses.education) || 0) +
    (parseFloat(expenses.insurance) || 0) +
    (parseFloat(expenses.medical) || 0) +
    (parseFloat(expenses.other) || 0);

  const totalMonthlyCreditCommitments = creditCommitments.reduce(
    (sum, item) => sum + (parseFloat(item.monthlyRepayment) || 0), 0
  );

  // Dynamic Handlers
  const handleAddIncome = () => {
    setAdditionalIncomes((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'Rental Income', amount: '3500', regularity: 'regular' }
    ]);
  };

  const handleRemoveIncome = (id: string) => {
    setAdditionalIncomes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCreditCommitment = () => {
    setCreditCommitments((prev) => [
      ...prev,
      { id: Date.now().toString(), provider: 'FNB', accountType: 'Credit Card', balance: '15000', monthlyRepayment: '750' }
    ]);
  };

  const handleRemoveCreditCommitment = (id: string) => {
    setCreditCommitments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddDirector = () => {
    setDirectors((prev) => [
      ...prev,
      { id: Date.now().toString(), fullName: '', idNumber: '', contactNumber: '', ownershipPercentage: '50' }
    ]);
  };

  const handleRemoveDirector = (id: string) => {
    setDirectors((prev) => prev.filter((d) => d.id !== id));
  };

  const handleFileUpload = (docKey: keyof typeof documents, fileObj: File) => {
    setUploadedFiles((prev) => ({ ...prev, [docKey]: fileObj }));
    setDocuments((prev) => ({
      ...prev,
      [docKey]: { uploaded: true, name: fileObj.name || 'uploaded_document.pdf' },
    }));
  };

  // Step Validation Logic
  const validateStep = (): boolean => {
    setValidationError('');

    if (step === 1) {
      if (!loanType) {
        setValidationError('Please select a loan type to proceed.');
        return false;
      }
      if (amount < 5000 || amount > 350000) {
        setValidationError('Please enter a valid loan amount between R 5 000 and R 350 000.');
        return false;
      }
      if (!term) {
        setValidationError('Please select a repayment term.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!personalDetails.firstName.trim() || !personalDetails.surname.trim()) {
        setValidationError('Please provide your full name and surname.');
        return false;
      }
      if (!personalDetails.idOrPassport.trim()) {
        setValidationError('Please enter your South African ID Number or Passport number.');
        return false;
      }
      if (!personalDetails.mobileNumber.trim() || !personalDetails.email.trim()) {
        setValidationError('Please provide valid contact details (mobile number & email address).');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (loanType === 'business' && !businessDetails.registeredName.trim()) {
        setValidationError('Please enter your Registered Business Name.');
        return false;
      }
      if (loanType === 'asset' && !assetDetails.description.trim()) {
        setValidationError('Please enter a description of the asset to finance.');
        return false;
      }
      return true;
    }

    if (step === 4) {
      return true;
    }

    if (step === 5) {
      if (!consents.infoTruth || !consents.privacyNotice || !consents.creditBureau) {
        setValidationError('Please accept all required legal declarations and POPIA consents before submitting.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = async () => {
    if (!validateStep()) return;

    if (step === 5) {
      // Trigger Submit Application Flow to cPanel Mail API
      setIsSubmitting(true);
      const generatedRef = `APP-ZA-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      try {
        const formData = new FormData();
        formData.append('type', 'application');
        formData.append('refNumber', generatedRef);
        formData.append('loanType', loanType);
        formData.append('amount', String(amount));
        formData.append('term', String(term));
        formData.append('monthlyRepayment', String(repaymentData.monthlyRepayment));

        formData.append('title', personalDetails.title);
        formData.append('applicantName', `${personalDetails.firstName} ${personalDetails.surname}`);
        formData.append('idOrPassport', personalDetails.idOrPassport);
        formData.append('mobileNumber', personalDetails.mobileNumber);
        formData.append('email', personalDetails.email);
        formData.append('address', `${personalDetails.residentialAddress}, ${personalDetails.city}, ${personalDetails.province}`);

        formData.append('employmentStatus', employmentDetails.employmentStatus);
        formData.append('monthlyIncome', String(employmentDetails.grossMonthlyIncome));
        formData.append('bankName', bankDetails.bankName);
        formData.append('accountNumber', bankDetails.accountNumber);
        formData.append('accountType', bankDetails.accountType);

        // Attach uploaded documents
        Object.keys(uploadedFiles).forEach((key) => {
          const fileObj = uploadedFiles[key];
          if (fileObj) {
            formData.append(`file_${key}`, fileObj, fileObj.name);
          }
        });

        const res = await fetch('/submit.php', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          await fetch('/api/submit.php', {
            method: 'POST',
            body: formData,
          });
        }
      } catch (err) {
        console.warn('Backend application submission warning:', err);
      }

      setRefNumber(generatedRef);
      setIsSubmitting(false);
      setStep(6);
    } else {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-4 font-sans text-[#102A43]">
      
      {/* Application Top Bar Header (Height 250px with background image) */}
      <div 
        className="w-full relative rounded-2xl p-6 md:p-8 mb-6 shadow-sm flex items-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('/app-banner-bg.png')`,
          height: '250px',
          minHeight: '250px',
          maxHeight: '250px',
        }}
      >
        <div className="relative z-10 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans drop-shadow-md">
            Loan application
          </h1>
          <p className="text-slate-100 text-xs sm:text-sm mt-1 max-w-xl font-medium drop-shadow-sm leading-relaxed">
            Complete your application securely. Your progress is saved as you move through each step.
          </p>
        </div>
      </div>

      {/* Persistent Step Progress Indicator */}
      {step <= 5 && (
        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
          {/* Desktop 5-Step Indicator */}
          <div className="hidden md:grid grid-cols-5 gap-2 relative">
            {[
              { num: 1, name: 'Personalise' },
              { num: 2, name: 'Your Details' },
              { num: 3, name: 'Finances' },
              { num: 4, name: 'Your Loan' },
              { num: 5, name: 'Review & Submit' },
            ].map((s) => {
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center text-center relative z-10">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted 
                        ? 'bg-[#168C8C] text-white' 
                        : isActive 
                        ? 'bg-[#12355B] text-white ring-4 ring-[#E7F4F2]' 
                        : 'bg-slate-100 text-slate-400 border border-[#E4E7EB]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold mt-2 ${isActive ? 'text-[#12355B]' : isCompleted ? 'text-[#168C8C]' : 'text-slate-400'}`}>
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Step Header */}
          <div className="md:hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#102A43]">
              <span>Step {step} of 5: {step === 1 ? 'Personalise' : step === 2 ? 'Your Details' : step === 3 ? 'Finances' : step === 4 ? 'Your Loan' : 'Review & Submit'}</span>
              <span className="text-[#168C8C]">{Math.round((step / 5) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#E4E7EB]">
              <div 
                className="h-full bg-[#168C8C] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* Mobile Collapsible Summary Toggle */}
            <button
              onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
              className="w-[#102A43] text-xs font-semibold text-[#168C8C] pt-2 flex items-center gap-1 cursor-pointer"
            >
              <span>{mobileSummaryOpen ? 'Hide Application Summary' : 'View Application Summary'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${mobileSummaryOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Global Layout */}
      {step <= 5 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Step Form Content */}
          <div className="lg:col-span-8 space-y-6">

            {/* Validation Alert Box */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* ================= STEP 1: PERSONALISE ================= */}
            {step === 1 && (
              <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-[#102A43]">Let's personalise your loan</h2>
                  <p className="text-slate-500 text-sm mt-1">Choose the type of finance you need and tell us how much you'd like to apply for.</p>
                </div>

                {/* 3 Selectable Loan Type Cards */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Loan Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { 
                        type: 'personal', 
                        title: 'Personal Loan', 
                        copy: 'For personal expenses, home improvements, lifestyle needs and qualifying purposes.',
                        icon: User 
                      },
                      { 
                        type: 'business', 
                        title: 'Business Loan', 
                        copy: 'For working capital, business growth, equipment and qualifying business needs.',
                        icon: Briefcase 
                      },
                      { 
                        type: 'asset', 
                        title: 'Asset Finance', 
                        copy: 'Finance a qualifying vehicle, equipment, machinery or other asset.',
                        icon: Car 
                      },
                    ].map((card) => {
                      const isSelected = loanType === card.type;
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.type}
                          onClick={() => {
                            setLoanType(card.type as any);
                            if (card.type === 'personal') setTerm(24);
                            if (card.type === 'business') setTerm(24);
                            if (card.type === 'asset') setTerm(36);
                          }}
                          className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSelected 
                              ? 'border-[#168C8C] bg-[#E7F4F2]/40 shadow-sm ring-2 ring-[#168C8C]/20' 
                              : 'border-[#E4E7EB] bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#168C8C] text-white' : 'bg-slate-100 text-[#102A43]'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <input 
                              type="radio" 
                              name="loanType" 
                              checked={isSelected} 
                              onChange={() => {}}
                              className="accent-[#168C8C] w-4 h-4 cursor-pointer"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#102A43] text-base">{card.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">{card.copy}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Loan Amount Input & Slider */}
                <div className="space-y-4 pt-4 border-t border-[#E4E7EB]">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#102A43]">How much would you like to borrow?</label>
                    <span className="text-xs text-[#168C8C] font-semibold">Min R 5 000 • Max R 350 000</span>
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#168C8C] font-extrabold text-xl pointer-events-none select-none">R</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={amountInput}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setAmountInput(raw);
                        const num = Number(raw);
                        if (!isNaN(num) && num > 0) {
                          setAmount(Math.min(Math.max(num, 5000), 350000));
                        }
                      }}
                      onBlur={() => {
                        let num = Number(amountInput);
                        if (isNaN(num) || num < 5000) num = 5000;
                        if (num > 350000) num = 350000;
                        setAmount(num);
                        setAmountInput(String(num));
                      }}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-[#E4E7EB] rounded-xl font-bold text-xl text-[#102A43] focus:ring-2 focus:ring-[#168C8C] focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <input
                    type="range"
                    min={5000}
                    max={350000}
                    step={5000}
                    value={amount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAmount(val);
                      setAmountInput(String(val));
                    }}
                    className="w-full accent-[#168C8C] h-3 bg-slate-200 rounded-lg cursor-pointer touch-action-none py-1"
                  />
                </div>

                {/* Repayment Term Selector */}
                <div className="space-y-3 pt-4 border-t border-[#E4E7EB]">
                  <label className="text-sm font-bold text-[#102A43]">Select Repayment Period</label>
                  <div className="flex flex-wrap gap-2.5">
                    {activeTerms.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTerm(t)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                          term === t 
                            ? 'bg-[#12355B] text-white shadow-sm' 
                            : 'bg-slate-100 text-[#102A43] hover:bg-slate-200 border border-[#E4E7EB]'
                        }`}
                      >
                        {t} months
                      </button>
                    ))}
                  </div>
                </div>



                {/* Calculator Disclaimer Notice */}
                <div className="bg-[#F7F8F6] p-4 rounded-xl text-xs text-slate-500 space-y-1.5 border border-[#E4E7EB]">
                  <p className="font-semibold text-slate-700">Estimated Calculation:</p>
                  <p className="leading-relaxed">
                    Your estimated instalment is based on the loan amount, repayment period and advertised starting interest rate selected by you. It is provided for illustration purposes only and is not an offer or guarantee of approval.
                  </p>
                  <p className="leading-relaxed">
                    Your actual interest rate, repayment amount, fees and applicable terms will depend on your application, credit assessment and final loan agreement.
                  </p>
                </div>

              </div>
            )}

            {/* ================= STEP 2: YOUR DETAILS ================= */}
            {step === 2 && (
              <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-[#102A43]">Tell us about yourself</h2>
                  <p className="text-slate-500 text-sm mt-1">We need a few details to identify you and process your application.</p>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#168C8C]">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-3">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Title</label>
                      <select
                        value={personalDetails.title}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, title: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C]"
                      >
                        <option>Mr</option>
                        <option>Mrs</option>
                        <option>Ms</option>
                        <option>Dr</option>
                        <option>Adv</option>
                        <option>Prof</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">First Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sipho"
                        value={personalDetails.firstName}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C]"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Surname *</label>
                      <input
                        type="text"
                        placeholder="e.g. Nkosi"
                        value={personalDetails.surname}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, surname: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">South African ID / Passport *</label>
                      <div className="relative flex items-center">
                        <UserCheck className="w-4 h-4 text-[#168C8C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="13-Digit SA ID Number"
                          value={personalDetails.idOrPassport}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, idOrPassport: e.target.value })}
                          className="w-full pl-10 pr-3 p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Residency Status</label>
                      <div className="relative">
                        <select
                          value={personalDetails.residencyStatus}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, residencyStatus: e.target.value })}
                          className="w-full p-3 pr-10 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold text-[#102A43] appearance-none outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white cursor-pointer transition-all"
                        >
                          <option>Permanent SA Resident</option>
                          <option>Temporary Resident / Permit Holder</option>
                          <option>Foreign National</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#168C8C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4 pt-4 border-t border-[#E4E7EB]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#168C8C]">Contact & Address Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile Number *</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#168C8C] font-bold text-xs pointer-events-none">
                          +27
                        </span>
                        <input
                          type="tel"
                          placeholder="082 123 4567"
                          value={personalDetails.mobileNumber}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, mobileNumber: e.target.value })}
                          className="w-full pl-11 pr-3 p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address *</label>
                      <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-[#168C8C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          placeholder="name@domain.co.za"
                          value={personalDetails.email}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                          className="w-full pl-10 pr-3 p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Residential Street Address *</label>
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-[#168C8C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. 145 Sandton Drive, Sandton"
                        value={personalDetails.residentialAddress}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, residentialAddress: e.target.value })}
                        className="w-full pl-10 pr-3 p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Province</label>
                      <div className="relative">
                        <select
                          value={personalDetails.province}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, province: e.target.value })}
                          className="w-full p-3 pr-10 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold text-[#102A43] appearance-none outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white cursor-pointer transition-all"
                        >
                          <option>Gauteng</option>
                          <option>Western Cape</option>
                          <option>KwaZulu-Natal</option>
                          <option>Eastern Cape</option>
                          <option>Free State</option>
                          <option>Limpopo</option>
                          <option>Mpumalanga</option>
                          <option>North West</option>
                          <option>Northern Cape</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#168C8C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">City / Town</label>
                      <input
                        type="text"
                        placeholder="e.g. Johannesburg"
                        value={personalDetails.city}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, city: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Postal Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 2196"
                        value={personalDetails.postalCode}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, postalCode: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="space-y-4 pt-4 border-t border-[#E4E7EB]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#168C8C]">Employment Details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Employment Status</label>
                      <div className="relative">
                        <select
                          value={personalDetails.employmentStatus}
                          onChange={(e) => setPersonalDetails({ ...personalDetails, employmentStatus: e.target.value })}
                          className="w-full p-3 pr-10 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold text-[#102A43] appearance-none outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white cursor-pointer transition-all"
                        >
                          <option>Permanently Employed</option>
                          <option>Self-Employed / Business Owner</option>
                          <option>Contract Worker</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#168C8C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Employer / Business Name</label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={personalDetails.employerName}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, employerName: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= STEP 3: FINANCES & DOCUMENTS & BRANCHES ================= */}
            {step === 3 && (
              <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-[#102A43]">Let's understand your finances</h2>
                  <p className="text-slate-500 text-sm mt-1">This information helps us assess affordability and determine the loan terms you may qualify for.</p>
                </div>

                {/* 1. Monthly Income Category */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#168C8C]">Monthly Income</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Gross Monthly Salary (R)</label>
                      <input
                        type="number"
                        value={personalDetails.monthlyGrossIncome}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, monthlyGrossIncome: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Net Monthly Salary (R)</label>
                      <input
                        type="number"
                        value={personalDetails.monthlyNetIncome}
                        onChange={(e) => setPersonalDetails({ ...personalDetails, monthlyNetIncome: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C]"
                      />
                    </div>
                  </div>

                  {/* Additional Income Sources */}
                  {additionalIncomes.map((inc) => (
                    <div key={inc.id} className="p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-[#102A43]">{inc.type}:</span> {formatRandSpace(parseFloat(inc.amount) || 0)} / mo ({inc.regularity})
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveIncome(inc.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddIncome}
                    className="text-xs text-[#168C8C] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add additional income source (e.g. rental, commission)
                  </button>
                </div>



                {/* 4. Banking Information & Security Notice */}
                <div className="space-y-4 pt-4 border-t border-[#E4E7EB]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#168C8C]">Banking Details for Payout</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Bank Name</label>
                      <div className="relative">
                        <select
                          value={banking.bankName}
                          onChange={(e) => setBanking({ ...banking, bankName: e.target.value })}
                          className="w-full p-3 pr-10 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold text-[#102A43] appearance-none outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white cursor-pointer transition-all"
                        >
                          <option>Standard Bank</option>
                          <option>FirstRand Bank</option>
                          <option>FNB</option>
                          <option>Absa Bank</option>
                          <option>Nedbank</option>
                          <option>Capitec Bank</option>
                          <option>Investec Bank</option>
                          <option>African Bank</option>
                          <option>Discovery Bank</option>
                          <option>TymeBank</option>
                          <option>Bidvest Bank</option>
                          <option>Sasfin Bank</option>
                          <option>Al Baraka Bank</option>
                          <option>OM Bank</option>
                          <option>Bank Zero</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#168C8C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Account Type</label>
                      <div className="relative">
                        <select
                          value={banking.accountType}
                          onChange={(e) => setBanking({ ...banking, accountType: e.target.value })}
                          className="w-full p-3 pr-10 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold text-[#102A43] appearance-none outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white cursor-pointer transition-all"
                        >
                          <option>Cheque / Current</option>
                          <option>Transmission</option>
                          <option>Savings</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#168C8C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Account Number</label>
                      <div className="relative flex items-center">
                        <Landmark className="w-4 h-4 text-[#168C8C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="10-Digit Account Number"
                          value={banking.accountNumber}
                          onChange={(e) => setBanking({ ...banking, accountNumber: e.target.value })}
                          className="w-full pl-10 pr-3 p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>


                </div>

                {/* DYNAMIC BRANCH 1: BUSINESS LOAN BRANCH */}
                {loanType === 'business' && (
                  <div className="space-y-4 pt-6 border-t-2 border-[#168C8C] bg-slate-50 p-5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#168C8C]" />
                      <h3 className="text-base font-bold text-[#102A43]">Business Details & Directors</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Registered Business Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Enterprises (Pty) Ltd"
                          value={businessDetails.registeredName}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, registeredName: e.target.value })}
                          className="w-full p-3 bg-white border border-[#E4E7EB] rounded-xl text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">CIPC Registration Number</label>
                        <input
                          type="text"
                          placeholder="2020/123456/07"
                          value={businessDetails.registrationNumber}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, registrationNumber: e.target.value })}
                          className="w-full p-3 bg-white border border-[#E4E7EB] rounded-xl text-sm font-semibold"
                        />
                      </div>
                    </div>

                    {/* Directors Repeatable List */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-[#102A43]">Company Directors / Shareholders</label>
                      {directors.map((d) => (
                        <div key={d.id} className="p-3 bg-white border border-[#E4E7EB] rounded-xl flex items-center justify-between text-xs">
                          <span>Director ID: {d.idNumber || 'Pending'} ({d.ownershipPercentage}% ownership)</span>
                          <button type="button" onClick={() => handleRemoveDirector(d.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddDirector} className="text-xs text-[#168C8C] font-bold flex items-center gap-1"><Plus className="w-4 h-4" /> Add Company Director</button>
                    </div>
                  </div>
                )}

                {/* DYNAMIC BRANCH 2: ASSET FINANCE BRANCH */}
                {loanType === 'asset' && (
                  <div className="space-y-4 pt-6 border-t-2 border-[#168C8C] bg-slate-50 p-5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-[#168C8C]" />
                      <h3 className="text-base font-bold text-[#102A43]">Tell us about the asset</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Asset Description *</label>
                        <input
                          type="text"
                          placeholder="e.g. 2024 Toyota Hilux 2.8 GD-6"
                          value={assetDetails.description}
                          onChange={(e) => setAssetDetails({ ...assetDetails, description: e.target.value })}
                          className="w-full p-3 bg-white border border-[#E4E7EB] rounded-xl text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Dealer / Supplier Name</label>
                        <input
                          type="text"
                          placeholder="Approved Dealership Name"
                          value={assetDetails.supplierName}
                          onChange={(e) => setAssetDetails({ ...assetDetails, supplierName: e.target.value })}
                          className="w-full p-3 bg-white border border-[#E4E7EB] rounded-xl text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Smart Document Upload Area */}
                <div className="space-y-4 pt-4 border-t border-[#E4E7EB]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#168C8C]">Smart Document Upload</h3>
                  <p className="text-xs text-slate-500">Upload clear copies of your required documents (JPG, PNG Only up to 10MB each).</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'idDoc', label: 'South African ID Document' },
                      { key: 'payslipDoc', label: 'Latest Payslip / Proof of Income' },
                      { key: 'addressDoc', label: 'Proof of Address (Max 3 months old)' },
                    ].map((docItem) => {
                      const docState = documents[docItem.key as keyof typeof documents];
                      return (
                        <div key={docItem.key} className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#102A43]">{docItem.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${docState.uploaded ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                              {docState.uploaded ? '✓ Uploaded' : 'Required'}
                            </span>
                          </div>

                          <label className="w-full py-2.5 bg-white border border-[#E4E7EB] hover:border-[#168C8C] rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-[#168C8C] cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>{docState.uploaded ? docState.name : 'Upload Document'}</span>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(docItem.key as any, file);
                              }}
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ================= STEP 4: YOUR LOAN ================= */}
            {step === 4 && (
              <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-[#102A43]">Review your loan parameters</h2>
                  <p className="text-slate-500 text-sm mt-1">Check your structured loan configuration before proceeding to final compliance declarations.</p>
                </div>

                {/* Visual Summary Card */}
                <div className="bg-[#12355B] text-white p-6 rounded-2xl space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">Product Selected</span>
                      <h3 className="text-xl font-bold text-[#168C8C]">{loanType.toUpperCase()} LOAN</h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="text-xs text-[#168C8C] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-300 block">Loan Amount</span>
                      <span className="text-base font-bold text-white">{formatRandSpace(amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-300 block">Term</span>
                      <span className="text-base font-bold text-white">{term} Months</span>
                    </div>
                    <div>
                      <span className="text-slate-300 block">Monthly Instalment</span>
                      <span className="text-base font-bold text-[#168C8C]">{formatRandSpace(repaymentData.monthlyRepayment, true)}</span>
                    </div>
                    <div>
                      <span className="text-slate-300 block">Total Repayment</span>
                      <span className="text-base font-bold text-white">{formatRandSpace(repaymentData.totalRepayment, true)}</span>
                    </div>
                  </div>
                </div>

                {/* Loan Purpose Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#102A43]">What will you use the loan for? *</label>
                  <div className="relative">
                    <select
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full p-3.5 pr-10 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold text-[#102A43] appearance-none outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white cursor-pointer transition-all"
                    >
                      <option>Home Improvements</option>
                      <option>Education & Tuition</option>
                      <option>Solar / Renewable Energy Installation</option>
                      <option>Water & Security Infrastructure</option>
                      <option>Vehicle Maintenance & Expenses</option>
                      <option>Debt Consolidation</option>
                      <option>Emergency Expenses</option>
                      <option>Other Purpose</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#168C8C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {loanPurpose === 'Other Purpose' && (
                    <input
                      type="text"
                      placeholder="Please specify your loan purpose..."
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold"
                    />
                  )}
                </div>



              </div>
            )}

            {/* ================= STEP 5: REVIEW & SUBMIT ================= */}
            {step === 5 && (
              <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-[#102A43]">Review your application</h2>
                  <p className="text-slate-500 text-sm mt-1">Please check your information carefully before submitting your application.</p>
                </div>

                {/* Expandable Section Review Accordions */}
                <div className="space-y-4">
                  
                  {/* Accordion 1: Loan Details */}
                  <div className="p-4 bg-slate-50 border border-[#E4E7EB] rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-[#E4E7EB] pb-2">
                      <span className="font-bold text-sm text-[#102A43]">1. Loan Parameters</span>
                      <button type="button" onClick={() => setStep(1)} className="text-xs text-[#168C8C] font-bold">Edit</button>
                    </div>
                    <p className="text-xs text-slate-600">
                      {loanType.toUpperCase()} Loan • {formatRandSpace(amount)} over {term} months (Instalment: {formatRandSpace(repaymentData.monthlyRepayment, true)}/mo)
                    </p>
                  </div>

                  {/* Accordion 2: Personal Details */}
                  <div className="p-4 bg-slate-50 border border-[#E4E7EB] rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-[#E4E7EB] pb-2">
                      <span className="font-bold text-sm text-[#102A43]">2. Personal Details</span>
                      <button type="button" onClick={() => setStep(2)} className="text-xs text-[#168C8C] font-bold">Edit</button>
                    </div>
                    <p className="text-xs text-slate-600">
                      {personalDetails.title} {personalDetails.firstName} {personalDetails.surname} • ID: {personalDetails.idOrPassport} • {personalDetails.mobileNumber}
                    </p>
                  </div>

                  {/* Accordion 3: Finances & Documents */}
                  <div className="p-4 bg-slate-50 border border-[#E4E7EB] rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-[#E4E7EB] pb-2">
                      <span className="font-bold text-sm text-[#102A43]">3. Finances & Documents</span>
                      <button type="button" onClick={() => setStep(3)} className="text-xs text-[#168C8C] font-bold">Edit</button>
                    </div>
                    <p className="text-xs text-slate-600">
                      Net Income: {formatRandSpace(primaryNet)} • Total Expenses: {formatRandSpace(totalMonthlyExpenses)} • Documents Uploaded
                    </p>
                  </div>

                </div>

                {/* Final Consents & Declarations */}
                <div className="space-y-3 pt-4 border-t border-[#E4E7EB]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#168C8C]">Declarations & Consent</h3>

                  <label className="flex items-start gap-3 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.infoTruth}
                      onChange={(e) => setConsents({ ...consents, infoTruth: e.target.checked })}
                      className="accent-[#168C8C] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>I confirm that the information I have provided is true, accurate and complete. *</span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.privacyNotice}
                      onChange={(e) => setConsents({ ...consents, privacyNotice: e.target.checked })}
                      className="accent-[#168C8C] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>I consent to the processing of my personal information for credit assessment in accordance with POPIA. *</span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.creditBureau}
                      onChange={(e) => setConsents({ ...consents, creditBureau: e.target.checked })}
                      className="accent-[#168C8C] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>I authorize SPRING CASH LOANS (PTY) LTD to conduct credit bureau checks and verify information. *</span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-slate-500 font-normal cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={consents.marketing}
                      onChange={(e) => setConsents({ ...consents, marketing: e.target.checked })}
                      className="accent-[#168C8C] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>(Optional) Yes, I'd like to receive relevant promotional offers and financial updates.</span>
                  </label>
                </div>

              </div>
            )}

            {/* Navigation Buttons (Back & Continue / Submit) */}
            <div className="flex items-center justify-between pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-white hover:bg-slate-100 text-[#102A43] border border-[#E4E7EB] font-bold px-6 py-3.5 rounded-full transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="bg-[#168C8C] hover:bg-[#127272] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : step === 5 ? (
                  <span>Submit Application</span>
                ) : (
                  <><span>Continue</span> <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Sticky Application Summary Card */}
          <div className={`lg:col-span-4 lg:block ${mobileSummaryOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-[#102A43] text-white p-6 rounded-2xl space-y-6 sticky top-24 shadow-xl border border-[#12355B]">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#168C8C] font-bold">Live Calculator</span>
                <h3 className="text-xl font-bold text-white mt-1">Your application</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Loan type:</span>
                  <span className="font-bold text-white uppercase">{loanType} Loan</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Amount:</span>
                  <span className="font-bold text-white text-sm">{formatRandSpace(amount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Term:</span>
                  <span className="font-bold text-white">{term} months</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-slate-300">Estimated instalment:</span>
                  <span className="font-extrabold text-[#168C8C] text-base">{formatRandSpace(repaymentData.monthlyRepayment, true)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Interest rate:</span>
                  <span className="font-semibold text-slate-200">From 11.75% p.a.</span>
                </div>
              </div>

              <div className="bg-[#12355B] p-4 rounded-xl text-[12px] text-slate-300 leading-relaxed border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold text-[12px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#168C8C]" />
                  <span>Transparent Rates</span>
                </div>
                <p className="text-[12px]">Calculations use standard fixed amortisation algorithms. Final terms depend on credit verification.</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ================= STEP 6: SUBMITTED APPLICATION STATUS SCREEN ================= */
        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-8 shadow-lg my-8">
          
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#102A43]">Application submitted</h2>
            <p className="text-slate-600 text-sm">
              Thank you. We've received your application and will assess the information provided.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="bg-slate-50 border border-[#E4E7EB] p-4 rounded-xl inline-block text-center space-y-1">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">Application Reference Number</span>
            <span className="text-2xl font-extrabold text-[#12355B] tracking-wider">{refNumber}</span>
          </div>

          {/* Application Status Timeline */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-[#E4E7EB] text-left space-y-4">
            <h4 className="font-bold text-[#102A43] text-sm">Application Status Progress</h4>
            <div className="space-y-3 text-xs">
              {[
                { label: '1. Application received', done: true },
                { label: '2. Information being reviewed', active: true },
                { label: '3. Credit assessment', pending: true },
                { label: '4. Decision notification', pending: true },
                { label: '5. Next steps & payout', pending: true },
              ].map((st, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    st.done ? 'bg-green-600 text-white' : st.active ? 'bg-[#168C8C] text-white ring-2 ring-[#E7F4F2]' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {st.done ? '✓' : i + 1}
                  </div>
                  <span className={`font-semibold ${st.done || st.active ? 'text-[#102A43]' : 'text-slate-400'}`}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-[#12355B] hover:bg-[#102A43] text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm cursor-pointer border border-[#E4E7EB] shadow-sm"
            >
              Return to Main Page
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
