import React from 'react';

export interface NumberStat {
  value: string;
  label: string;
}

const defaultStats: NumberStat[] = [
  { value: '30+', label: 'Years of Experience' },
  { value: '1.3M+', label: 'Customers Helped' },
  { value: 'R 2B+', label: 'Finance Provided' },
  { value: '8M+', label: 'Personal Loans Provided' },
];

interface FinanceNumbersProps {
  statsList?: NumberStat[];
}

export const FinanceNumbers: React.FC<FinanceNumbersProps> = ({
  statsList = defaultStats,
}) => {
  return (
    <section className="bg-white py-12 sm:py-24 border-b border-[#E4E7EB] font-sans relative select-none">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Main Heading Section: Left-aligned on mobile, Centered on desktop */}
        <div className="text-left sm:text-center max-w-5xl mx-auto mb-10 sm:mb-20">
          {/* Small Eyebrow Heading */}
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#168C8C] block mb-2 sm:mb-3">
            Trusted Experience. Real Impact.
          </span>

          <h2 className="text-3xl sm:text-[32px] md:text-[40px] leading-tight md:leading-[48px] font-extrabold text-[#102A43] tracking-tight font-heading max-w-4xl sm:mx-auto">
            For over 30 years, we've helped customers and businesses move forward.
          </h2>
        </div>

        {/* ================= MOBILE VIEW (Matches exact screenshot layout) ================= */}
        <div className="block sm:hidden relative pb-10">
          <div className="grid grid-cols-2 gap-y-10 gap-x-4 text-center relative z-10">
            {statsList.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-start space-y-2">
                <span className="text-4xl font-bold text-[#102A43] tracking-tight font-heading leading-none">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-[#102A43] leading-snug px-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Dot Matrix Pattern for Mobile at bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[72px] opacity-30 pointer-events-none z-0"
            style={{
              backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              backgroundPosition: 'bottom center'
            }}
          />
        </div>

        {/* ================= DESKTOP VIEW ================= */}
        <div className="hidden sm:block">
          {/* Stat Numbers Row */}
          <div className="grid grid-cols-4 gap-8 text-center items-center">
            {statsList.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center min-h-[128px]">
                <span className="text-6xl lg:text-[100px] leading-tight lg:leading-[128px] font-[500] text-[#102A43] tracking-tight font-heading">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Dotted Pattern Container: Spaced 10px from numbers, 6 lines of dots */}
          <div className="relative mt-[10px] h-[96px] px-4 overflow-hidden flex items-center">
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#64748B 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
                backgroundPosition: 'center'
              }}
            />

            <div className="w-full grid grid-cols-4 gap-8 relative z-10 text-center">
              {statsList.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-center">
                  <span className="text-[20px] leading-[20px] font-medium text-[#102A43] tracking-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
