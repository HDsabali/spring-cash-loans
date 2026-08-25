import React from 'react';
import { Percent, Calendar, CheckSquare, Clock, Layers, CreditCard } from 'lucide-react';

export const WhatWeOffer: React.FC = () => {
  const benefits = [
    {
      icon: Percent,
      title: 'Competitive Interest Rates',
      description: 'Financing designed to offer competitive rates based on your application and credit profile.',
    },
    {
      icon: Calendar,
      title: 'Fixed Monthly Repayments',
      description: 'Know what to expect with predictable monthly repayments.',
    },
    {
      icon: CheckSquare,
      title: 'Hassle-Free Applications',
      description: 'Complete your application through a simple, secure digital journey.',
    },
    {
      icon: Clock,
      title: 'Flexible Repayment Options',
      description: 'Choose a repayment term that fits your financial circumstances, subject to approval.',
    },
    {
      icon: Layers,
      title: 'Variety of Loan Options',
      description: 'Access financing designed for different personal and financial needs.',
    },
    {
      icon: CreditCard,
      title: 'Funds Paid to Your Account',
      description: 'Approved funds are transferred electronically directly to your bank account.',
    },
  ];

  return (
    <section className="py-20 bg-[#F7F8F6] text-[#102A43] border-b border-[#E4E7EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#102A43] tracking-tight">
            What We Offer
          </h2>
          <p className="text-[#52606D] text-base sm:text-lg">
            Straightforward credit solutions designed with complete clarity and peace of mind.
          </p>
        </div>

        {/* 6 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white border border-[#E4E7EB] hover:border-[#168C8C]/50 rounded-xl p-8 transition-all hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#E7F4F2] border border-[#168C8C]/20 flex items-center justify-center text-[#168C8C] group-hover:bg-[#168C8C] group-hover:text-white transition-all mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#102A43] mb-3 group-hover:text-[#168C8C] transition-colors">
                    {benefit.title}
                  </h3>

                  <p className="text-[#52606D] text-sm leading-[1.6] font-normal">
                    {benefit.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E4E7EB] flex items-center text-xs font-semibold text-[#7B8794] group-hover:text-[#168C8C] transition-colors">
                  <span>Guaranteed Transparency</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
