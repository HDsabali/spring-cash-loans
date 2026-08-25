import React from 'react';

export const Requirements: React.FC = () => {
  const qualifyItems = [
    'You must be between the ages of 18 and 65',
    'Be a permanent SA resident',
    'Be permanently employed',
    'Your salary must be paid directly into your bank account',
    'Your last payslip, or proof of income',
    'Proof of home address (up to 3 months old)',
    "3 months' bank statements",
  ];

  const scoreItems = [
    'Make monthly payments on time',
    "Don't miss any credit card payments",
    'Pay outstanding balances in full',
    "Don't end up in court for late or non-payment",
    "Notify creditors immediately if you can't make a payment",
    "Don't take out further credit when paying off debt",
  ];

  return (
    <section id="requirements" className="relative w-full overflow-hidden bg-[#0A1826] border-b border-[#12355B] font-sans">
      {/* Background Image Container with Dark Overlay */}
      <div 
        className="w-full relative min-h-[500px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/personal-loan.jpg')`,
        }}
      >
        {/* Subtle Dark Tint Overlay for 100% crisp white text visibility */}
        <div className="absolute inset-0 bg-[#0B1F33]/90 backdrop-blur-[2px] z-0" />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-16 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: TO QUALIFY */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-wide uppercase font-sans border-b border-white/10 pb-4">
                TO QUALIFY
              </h2>

              <ul className="space-y-4 text-white">
                {qualifyItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-base sm:text-lg font-bold leading-snug">
                    <span className="text-[#168C8C] text-xl leading-none select-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: HOW TO IMPROVE YOUR SCORE */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-wide uppercase font-sans border-b border-white/10 pb-4">
                HOW TO IMPROVE YOUR SCORE
              </h2>

              <ul className="space-y-4 text-white">
                {scoreItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-base sm:text-lg font-bold leading-snug">
                    <span className="text-[#168C8C] text-xl leading-none select-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
