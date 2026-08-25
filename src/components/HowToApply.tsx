import React from 'react';
import { Laptop, ClipboardCheck, Award, Banknote, ArrowRight } from 'lucide-react';

interface HowToApplyProps {
  onOpenApplyModal: () => void;
}

export const HowToApply: React.FC<HowToApplyProps> = ({ onOpenApplyModal }) => {
  const steps = [
    {
      number: '01',
      title: 'Apply Online',
      copy: 'Complete your application through our secure digital journey.',
      icon: Laptop,
    },
    {
      number: '02',
      title: 'Application Assessment',
      copy: 'We review your application and supporting information.',
      icon: ClipboardCheck,
    },
    {
      number: '03',
      title: 'Approval',
      copy: "If approved, we'll provide the applicable loan terms.",
      icon: Award,
    },
    {
      number: '04',
      title: 'Funds Paid',
      copy: 'Approved funds are transferred electronically to your bank account.',
      icon: Banknote,
    },
  ];

  return (
    <section id="how-to-apply" className="py-20 bg-white text-[#102A43] border-b border-[#E4E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#102A43] tracking-tight">
            How to Apply for a Loan
          </h2>
          <p className="text-[#52606D] text-base sm:text-lg">
            Our straightforward digital process makes applying clear and efficient from start to finish.
          </p>
        </div>

        {/* Timeline Grid (Horizontal Desktop / Vertical Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative mb-16">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#E4E7EB] -translate-y-6 -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#F7F8F6] border border-[#E4E7EB] hover:border-[#168C8C]/40 rounded-2xl p-6 transition-all hover:shadow-sm group relative z-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E7EB] flex items-center justify-center text-[#168C8C] group-hover:bg-[#168C8C] group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-[#7B8794] group-hover:text-[#168C8C] transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#102A43] mb-2 group-hover:text-[#168C8C] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-[#52606D] text-sm leading-[1.6] font-normal">
                    {step.copy}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E4E7EB] text-xs font-semibold text-[#7B8794]">
                  Step {idx + 1} of 4
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA (rounded-full) */}
        <div className="text-center">
          <button
            onClick={onOpenApplyModal}
            className="bg-[#168C8C] hover:bg-[#127272] text-white font-bold px-9 py-4 rounded-full shadow-sm transition-all inline-flex items-center gap-3 cursor-pointer text-base"
          >
            <span>Start Your Online Application</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
