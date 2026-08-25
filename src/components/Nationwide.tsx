import React from 'react';
import { Laptop, PhoneCall, ShieldCheck, ChevronRight } from 'lucide-react';

interface NationwideProps {
  onOpenApplyModal?: (loanType?: 'personal' | 'business' | 'asset') => void;
  onOpenContact?: () => void;
}

export const Nationwide: React.FC<NationwideProps> = ({ onOpenApplyModal, onOpenContact }) => {
  return (
    <section className="relative w-full overflow-hidden border-b border-[#12355B] bg-[#102A43]">
      {/* Background Image Container */}
      <div 
        className="w-full relative min-h-[460px] lg:min-h-[500px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/nationwide-bg.jpg')`,
        }}
      >
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-20 relative z-10">
          <div className="max-w-2xl space-y-6 text-left">
            
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-tight font-sans">
              We Assist Clients Nationwide
            </h2>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
              Access our financing solutions from wherever you are in South Africa. Our secure digital application journey allows you to apply remotely with complete convenience and confidence.
            </p>

            {/* Coverage highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <div className="w-8 h-8 rounded-full bg-[#168C8C]/20 border border-[#168C8C]/40 flex items-center justify-center text-[#168C8C] shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <span>100% Digital Remote Application & Verification</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <div className="w-8 h-8 rounded-full bg-[#168C8C]/20 border border-[#168C8C]/40 flex items-center justify-center text-[#168C8C] shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span>Dedicated National Telephonic & Digital Support</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <div className="w-8 h-8 rounded-full bg-[#168C8C]/20 border border-[#168C8C]/40 flex items-center justify-center text-[#168C8C] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Secure Electronic Document Submission</span>
              </div>
            </div>

            {/* Contact Us Button */}
            <div className="pt-4">
              <button
                onClick={() => onOpenContact && onOpenContact()}
                className="bg-[#168C8C] hover:bg-[#127272] text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2.5 text-[16px] cursor-pointer"
              >
                <span>Contact Us</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
