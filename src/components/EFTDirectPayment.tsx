import React from 'react';
import { ChevronRight } from 'lucide-react';

interface EFTDirectPaymentProps {
  onOpenApplyModal?: (loanType?: 'personal' | 'business' | 'asset') => void;
}

export const EFTDirectPayment: React.FC<EFTDirectPaymentProps> = ({ onOpenApplyModal }) => {
  return (
    <section className="w-full relative overflow-hidden bg-[#0A1826] border-b border-[#12355B]">
      {/* Full-bleed width image banner touching left and right side walls of the browser */}
      <div 
        className="w-full relative min-h-[360px] sm:min-h-[400px] lg:min-h-[440px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/eft-banner.png')`,
        }}
      >
        {/* Text and CTA container positioned on left side over dark backdrop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="max-w-xl space-y-5 text-left">
            
            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-tight font-sans">
              Get immediate payout on all your Loan.
            </h2>

            {/* Subtext */}
            <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed drop-shadow-sm">
              Apply for loan of up to R350,000 and receive the funds directly into your bank account.
            </p>

            {/* Apply Now Button */}
            <div className="pt-3">
              <button
                onClick={() => onOpenApplyModal && onOpenApplyModal('personal')}
                className="bg-[#168C8C] hover:bg-[#127272] text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2.5 text-[16px] cursor-pointer"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
