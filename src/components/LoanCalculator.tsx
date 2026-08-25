import React, { useState } from 'react';
import { calculatorConfig, calculateLoanRepayment, formatRandSpace } from '../config/loanConfig';
import { Lock, ArrowRight, Info } from 'lucide-react';

interface LoanCalculatorProps {
  onOpenApplyModal: (loanType?: 'personal' | 'business' | 'asset', amount?: number, term?: number) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onOpenApplyModal }) => {
  const [amount, setAmount] = useState<number>(calculatorConfig.defaultLoanAmount);
  const [term, setTerm] = useState<number>(calculatorConfig.defaultTerm);
  const [amountError, setAmountError] = useState<string | null>(null);

  // Compute mathematically accurate dynamic repayment breakdown using full-precision amortisation
  const calculation = calculateLoanRepayment(amount, term);

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^\d]/g, '');
    let val = parseInt(rawVal, 10);
    if (isNaN(val)) val = 0;
    
    setAmount(val);

    if (val < calculatorConfig.minimumLoanAmount || val > calculatorConfig.maximumLoanAmount) {
      setAmountError(
        `Please enter an amount between ${formatRandSpace(calculatorConfig.minimumLoanAmount)} and ${formatRandSpace(calculatorConfig.maximumLoanAmount)}`
      );
    } else {
      setAmountError(null);
    }
  };

  const handleAmountBlur = () => {
    let clamped = Math.min(
      Math.max(amount, calculatorConfig.minimumLoanAmount),
      calculatorConfig.maximumLoanAmount
    );
    setAmount(clamped);
    setAmountError(null);
  };

  const handleAmountSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(e.target.value, 10));
    setAmountError(null);
  };

  const handleTermSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(parseInt(e.target.value, 10));
  };

  return (
    <section id="calculator" className="py-20 bg-[#102A43] text-white border-b border-[#12355B] relative font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Section Introduction */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12355B] border border-[#168C8C]/30 text-[#E7F4F2] text-xs font-bold uppercase tracking-widest">
            LOAN CALCULATOR
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-tight font-sans">
            See what your loan could look like
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
            Select your loan amount and repayment period to see an estimated monthly repayment.
          </p>
        </div>

        {/* 2. Calculator Layout: Desktop 55% Left / 45% Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (55% on desktop): Inputs / Sliders Container */}
          <div className="lg:col-span-7 bg-[#12355B]/80 border border-[#168C8C]/20 rounded-2xl p-6 sm:p-8 space-y-8 shadow-md backdrop-blur-sm flex flex-col justify-between">
            
            <div className="space-y-8">
              {/* 3. Loan Amount Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider">
                    Loan amount
                  </label>
                  
                  {/* Prominent Rand Display / Direct Input */}
                  <div className="relative flex items-center bg-[#102A43] border border-[#168C8C]/40 rounded-xl px-4 py-2 text-right">
                    <input
                      type="text"
                      value={formatRandSpace(amount)}
                      onChange={handleAmountInputChange}
                      onBlur={handleAmountBlur}
                      className="w-40 sm:w-48 bg-transparent text-right font-extrabold text-2xl sm:text-3xl text-white focus:outline-none focus:text-[#168C8C] transition-colors font-sans"
                    />
                  </div>
                </div>

                {amountError && (
                  <div className="text-amber-400 text-xs font-medium text-right">
                    {amountError}
                  </div>
                )}

                {/* Amount Custom Smooth Range Slider */}
                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min={calculatorConfig.minimumLoanAmount}
                    max={calculatorConfig.maximumLoanAmount}
                    step={calculatorConfig.loanStep}
                    value={amount}
                    onChange={handleAmountSlider}
                    className="w-full h-2.5 bg-[#102A43] rounded-lg appearance-none cursor-pointer accent-[#168C8C]"
                  />
                  
                  {/* Min / Max Labels */}
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{formatRandSpace(calculatorConfig.minimumLoanAmount)}</span>
                    <span>{formatRandSpace(calculatorConfig.maximumLoanAmount)}</span>
                  </div>
                </div>
              </div>

              <hr className="border-[#102A43]" />

              {/* 4. Repayment Period Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider">
                    Repayment period
                  </label>

                  {/* Prominent Term Display */}
                  <div className="bg-[#102A43] border border-[#168C8C]/40 rounded-xl px-4 py-2 text-right">
                    <span className="font-extrabold text-2xl sm:text-3xl text-white font-sans">
                      {term} <span className="text-base sm:text-lg font-semibold text-[#168C8C]">months</span>
                    </span>
                  </div>
                </div>

                {/* Term Custom Smooth Range Slider */}
                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min={calculatorConfig.minimumTermMonths}
                    max={calculatorConfig.maximumTermMonths}
                    step={calculatorConfig.termStep}
                    value={term}
                    onChange={handleTermSlider}
                    className="w-full h-2.5 bg-[#102A43] rounded-lg appearance-none cursor-pointer accent-[#168C8C]"
                  />

                  {/* Min / Max Labels */}
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{calculatorConfig.minimumTermMonths} months</span>
                    <span>{calculatorConfig.maximumTermMonths} months</span>
                  </div>
                </div>
              </div>
            </div>



          </div>

          {/* Right Column (45% on desktop): Visually Prominent Repayment Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-[#102A43] rounded-2xl p-6 sm:p-8 border border-[#E4E7EB] shadow-xl space-y-6">
              
              {/* 5. Estimated Monthly Repayment Header & Prominent Result */}
              <div className="space-y-2 border-b border-[#E4E7EB] pb-6 text-left">
                <div className="text-xs font-bold text-[#52606D] uppercase tracking-wider">
                  Estimated monthly repayment
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight leading-none font-sans">
                  {formatRandSpace(calculation.monthlyRepayment, true)}
                </div>
              </div>

              {/* 6. Output Breakdown */}
              <div className="space-y-3.5 text-sm">
                
                {/* Row 1: Loan Amount */}
                <div className="flex justify-between items-center text-[#52606D]">
                  <span>Loan amount</span>
                  <span className="font-bold text-[#102A43]">
                    {formatRandSpace(amount)}
                  </span>
                </div>

                {/* Row 2: Repayment Period */}
                <div className="flex justify-between items-center text-[#52606D]">
                  <span>Repayment period</span>
                  <span className="font-bold text-[#102A43]">
                    {term} months
                  </span>
                </div>

                {/* Row 3: Interest Rate */}
                <div className="pt-2 pb-2 border-t border-[#F7F8F6] space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#52606D]">Interest rate</span>
                    <div className="text-right">
                      <span className="font-extrabold text-[#168C8C] block text-sm">
                        Rates from {(calculatorConfig.annualInterestRate * 100).toFixed(2)}% p.a.
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#7B8794] leading-relaxed text-left">
                    Your actual interest rate may vary based on your application and credit assessment.
                  </p>
                </div>

                {/* Row 4: Total Interest */}
                <div className="flex justify-between items-center text-[#52606D] pt-2 border-t border-[#F7F8F6]">
                  <span>Total interest</span>
                  <span className="font-bold text-[#102A43]">
                    {formatRandSpace(calculation.totalInterest, true)}
                  </span>
                </div>

                {/* Row 5: Total Repayment */}
                <div className="flex justify-between items-center text-[#52606D] pt-1">
                  <span className="font-semibold text-[#102A43]">Total repayment</span>
                  <span className="font-extrabold text-[#102A43] text-base font-sans">
                    {formatRandSpace(calculation.totalRepayment, true)}
                  </span>
                </div>

                {/* Optional Fee Row: Monthly Service Fee (only rendered if > 0) */}
                {calculatorConfig.monthlyServiceFee > 0 && (
                  <div className="flex justify-between items-center text-[#52606D] pt-1 border-t border-[#F7F8F6]">
                    <span>Monthly service fee</span>
                    <span className="font-semibold text-[#102A43]">
                      {formatRandSpace(calculation.monthlyServiceFee, true)}
                    </span>
                  </div>
                )}

              </div>

              {/* 7. Disclaimer */}
              <div className="pt-4 border-t border-[#E4E7EB] space-y-1 text-xs text-[#7B8794] text-left">
                <div className="flex items-center gap-1.5 font-bold text-[#52606D]">
                  <Info className="w-3.5 h-3.5 text-[#168C8C] shrink-0" />
                  <span>Estimated calculation</span>
                </div>
                <p className="leading-relaxed text-[12px]">
                  {calculatorConfig.disclaimer}
                </p>
              </div>

              {/* Apply Now CTA (Full Width, rounded-full, 56px height) */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenApplyModal('personal', amount, term)}
                  className="w-full bg-[#168C8C] hover:bg-[#127272] text-white font-bold h-14 rounded-full shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer text-[16px]"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
