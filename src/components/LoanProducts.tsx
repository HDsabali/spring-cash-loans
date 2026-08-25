import React, { useState } from 'react';
import { productData, ProductDetail } from '../data/productData';
import { ArrowRight, ShieldCheck, CheckCircle, ChevronRight } from 'lucide-react';

interface LoanProductsProps {
  onOpenApplyModal: (loanType: 'personal' | 'business' | 'asset') => void;
}

export const LoanProducts: React.FC<LoanProductsProps> = ({ onOpenApplyModal }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'asset'>('personal');

  const currentProduct: ProductDetail = productData[activeTab];

  return (
    <section id="products" className="py-20 bg-white text-[#102A43] border-b border-[#E4E7EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#102A43] tracking-tight leading-tight">
            Find the Right Finance for You
          </h2>
          <p className="text-[#52606D] text-base sm:text-lg leading-relaxed font-normal">
            Whether you're looking to manage personal expenses, grow your business or finance an important asset, we have financing options designed around your needs.
          </p>
        </div>

        {/* Pill-Shaped Segmented Tab Selector (rounded-full) */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-[#F7F8F6] border border-[#E4E7EB] max-w-full overflow-x-auto no-scrollbar shadow-inner">
            {(['personal', 'business', 'asset'] as const).map((key) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#102A43] text-white shadow-sm'
                      : 'text-[#52606D] hover:text-[#102A43] hover:bg-white'
                  }`}
                >
                  <span>{productData[key].tabLabel}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#168C8C]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="bg-[#F7F8F6] border border-[#E4E7EB] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Product Information */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Eyebrow */}
              <div className="inline-block text-xs font-bold uppercase tracking-widest text-[#168C8C]">
                {currentProduct.eyebrow}
              </div>

              {/* Heading */}
              <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#102A43] tracking-tight leading-snug">
                {currentProduct.heading}
              </h3>

              {/* Body Copy */}
              <p className="text-[#52606D] text-base sm:text-lg leading-relaxed font-normal">
                {currentProduct.bodyCopy}
              </p>

              {/* Key Use Cases / Highlights */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-[#7B8794] uppercase tracking-wider">
                  {currentProduct.id === 'personal' ? "We've got the personal loan for you" : "Key Financing Applications:"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentProduct.useCases.map((useCase, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-white border border-[#E4E7EB] rounded-xl px-3.5 py-2.5">
                      <CheckCircle className="w-4 h-4 text-[#168C8C] shrink-0" />
                      <span className="text-[#102A43] text-[14px] font-medium leading-snug">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary CTA (Left Aligned, rounded-full) */}
              <div className="pt-4 flex justify-start">
                <button
                  onClick={() => onOpenApplyModal(currentProduct.id)}
                  className="bg-[#168C8C] hover:bg-[#127272] text-white font-semibold px-9 py-4 rounded-full shadow-sm transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <span>{currentProduct.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column: Premium Photography & Overlay Button */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#E4E7EB] bg-white shadow-sm group">
                <img
                  src={currentProduct.imageSrc}
                  alt={currentProduct.imageAlt}
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
