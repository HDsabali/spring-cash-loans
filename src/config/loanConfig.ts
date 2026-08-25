/**
 * Spring Cash Loans (Pty) Ltd - Central Configuration & Data Object
 * 
 * Instructions for Client/Developer:
 * 1. Update annualInterestRate, monthlyServiceFee, or term limits here to reflect changing pricing policy.
 * 2. All calculations in the application read directly from this central config object.
 */

export interface LoanCategoryStats {
  personalLoansIssued: string;
  businessLoansIssued: string;
  assetFinanceIssued: string;
  isVerified: boolean;
}

export interface CalculatorConfig {
  /** Minimum selectable loan amount in ZAR */
  minimumLoanAmount: number;
  /** Maximum selectable loan amount in ZAR */
  maximumLoanAmount: number;
  /** Step increment for loan slider in ZAR */
  loanStep: number;
  /** Default preset loan amount in ZAR */
  defaultLoanAmount: number;
  
  /** Minimum repayment term in months */
  minimumTermMonths: number;
  /** Maximum repayment term in months */
  maximumTermMonths: number;
  /** Step increment for term slider in months */
  termStep: number;
  /** Default selected term in months */
  defaultTerm: number;

  /** Starting annual interest rate as decimal (e.g., 0.1175 for 11.75% p.a.) */
  annualInterestRate: number;
  /** Monthly account management / service fee in ZAR (0 if excluded) */
  monthlyServiceFee: number;
  /** Initiation fee in ZAR (0 - No initiation fee display) */
  initiationFee: number;

  /** Regulatory disclaimer displayed beneath calculator */
  disclaimer: string;
}

export interface CompanyConfig {
  name: string;
  legalName: string;
  yearsOperating: string;
  totalCustomersHelped: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  contactEmail: string;
  applicationsEmail: string;
  headOfficePlaceholder: string;
  ncaRegistrationPlaceholder: string;
}

export const loanStatsConfig: LoanCategoryStats = {
  personalLoansIssued: "R 2 800 000 000+",
  businessLoansIssued: "R 1 900 000 000+",
  assetFinanceIssued: "R 3 400 000 000+",
  isVerified: false,
};

export const calculatorConfig: CalculatorConfig = {
  minimumLoanAmount: 5000,
  maximumLoanAmount: 350000,
  loanStep: 5000,
  defaultLoanAmount: 50000,

  minimumTermMonths: 12,
  maximumTermMonths: 72,
  termStep: 6,
  defaultTerm: 24,

  annualInterestRate: 0.1175, // 11.75% p.a. starting rate
  monthlyServiceFee: 0, // 0 (Configurable)
  initiationFee: 0, // 0 (No initiation fee)

  disclaimer:
    "Calculator results are estimates for illustrative purposes only. Your actual interest rate, repayment amount and applicable terms will depend on your application, credit assessment and final loan agreement.",
};

export const companyConfig: CompanyConfig = {
  name: "Spring Cash Loans",
  legalName: "SPRING CASH LOANS (PTY) LTD",
  yearsOperating: "30+",
  totalCustomersHelped: "1.3M+",
  phonePlaceholder: "+27 (0) 800 123 4567",
  emailPlaceholder: "info@springcashloans.co.za",
  contactEmail: "info@springcashloans.co.za",
  applicationsEmail: "applications@springcashloans.co.za",
  headOfficePlaceholder: "South Africa",
  ncaRegistrationPlaceholder: "National Credit Regulator (NCR) Number: NCRCP19642",
};

/**
 * Mathematically accurate fixed-rate loan amortisation calculator engine
 * 
 * Formula:
 * monthlyRate = annualInterestRate / 12
 * payment = principal * [ monthlyRate / (1 - (1 + monthlyRate)^(-numberOfPayments)) ]
 */
export function calculateLoanRepayment(amount: number, termMonths: number) {
  const safeAmount = isNaN(amount) ? calculatorConfig.minimumLoanAmount : amount;
  const safeTerm = isNaN(termMonths) ? calculatorConfig.defaultTerm : termMonths;

  const monthlyRate = calculatorConfig.annualInterestRate / 12;
  
  let baseMonthlyPayment = 0;
  if (monthlyRate > 0) {
    baseMonthlyPayment =
      safeAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -safeTerm)));
  } else {
    baseMonthlyPayment = safeAmount / safeTerm;
  }

  const customerMonthlyPayment = baseMonthlyPayment + calculatorConfig.monthlyServiceFee;
  const totalRepayment = (baseMonthlyPayment * safeTerm) + (calculatorConfig.monthlyServiceFee * safeTerm);
  const totalInterest = totalRepayment - safeAmount - (calculatorConfig.monthlyServiceFee * safeTerm);

  return {
    loanAmount: safeAmount,
    termMonths: safeTerm,
    monthlyRepayment: customerMonthlyPayment,
    baseMonthlyPayment,
    monthlyServiceFee: calculatorConfig.monthlyServiceFee,
    totalRepayment,
    totalInterest,
    annualInterestRatePercent: calculatorConfig.annualInterestRate * 100,
  };
}

/**
 * Formats numbers into South African Rand format with spaces as thousand separators
 * e.g. 5000 -> "R 5 000", 350000 -> "R 350 000", 5634.82 -> "R 5 634.82"
 */
export function formatRandSpace(amount: number, includeDecimals: boolean = false): string {
  if (isNaN(amount)) amount = 0;
  const parts = amount.toFixed(includeDecimals ? 2 : 0).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return includeDecimals ? `R ${parts[0]}.${parts[1]}` : `R ${parts[0]}`;
}

export const personalLoanTerms = [12, 24, 36, 48, 60, 72];
export const businessLoanTerms = [6, 12, 18, 24, 36, 48, 60];
export const assetFinanceTerms = [12, 24, 36, 48, 60, 72, 84];

