import React from 'react';
import { ArrowRight, PhoneCall } from 'lucide-react';

interface HeroProps {
  onOpenApplyModal: () => void;
  onOpenContact?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenApplyModal, onOpenContact }) => {
  // High-resolution Desktop hero image served directly from /hero-bg.jpg
  const heroBgImage = '/hero-bg.jpg';

  return (
    <section
      style={{ height: '750px', minHeight: '750px', maxHeight: '750px' }}
      className="relative text-white flex flex-col justify-center overflow-hidden bg-[#102A43]"
    >
      
      {/* Pure High-Quality Background Image fitting exact 750px height */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img
          src={heroBgImage}
          alt="South African business partners smiling at laptop"
          className="w-full h-full object-cover object-right lg:object-center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-8 text-left">
          
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
              Finance What <br className="hidden sm:inline" />
              <span className="text-[#168C8C] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                Matters Most.
              </span>
            </h1>
            
            {/* Supporting copy (Font Weight 500 / Medium) */}
            <p className="text-lg sm:text-[18px] text-white font-medium leading-[1.6] max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Flexible financing solutions designed to help individuals and businesses move forward. Personal loans, business loans, and asset finance backed by over 30 years of stability.
            </p>
          </div>

          {/* CTA Buttons (rounded-full) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onOpenApplyModal}
              className="bg-[#168C8C] hover:bg-[#127272] text-white text-[16px] font-semibold px-9 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenContact}
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white text-[16px] font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-sm active:scale-95"
            >
              <PhoneCall className="w-5 h-5 text-white" />
              <span>Contact Us</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
