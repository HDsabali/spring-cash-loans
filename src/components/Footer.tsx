import React from 'react';
import { companyConfig } from '../config/loanConfig';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenApplyModal: () => void;
  onGoHome?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApplyModal, onGoHome, onOpenContact }) => {
  const handleLogoClick = () => {
    if (onGoHome) {
      onGoHome();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F33] text-slate-300 text-sm border-t border-[#102A43]">
      
      {/* Final CTA Banner (Strict 350px height with background image) */}
      <div 
        className="w-full relative border-b border-[#102A43] flex items-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('/ready-bg.jpg')`,
          height: '350px',
          minHeight: '350px',
          maxHeight: '350px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-2xl space-y-4 text-left">
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans drop-shadow-md">
              Ready to Finance What Matters Most?
            </h3>
            <p className="text-slate-100 text-base sm:text-lg font-medium drop-shadow-sm">
              Apply online in minutes through our secure digital portal.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenApplyModal}
                className="bg-[#168C8C] hover:bg-[#127272] text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg cursor-pointer text-base inline-flex items-center justify-center"
              >
                Apply Online Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links (#0B1F33) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div onClick={handleLogoClick} className="flex items-center cursor-pointer group">
              <img 
                src="/logo.png" 
                alt="Spring Cash Loans (Pty) Ltd" 
                className="h-[65px] sm:h-[80px] w-auto object-contain py-1 drop-shadow-md" 
              />
            </div>

            <p className="text-[14px] text-slate-300 leading-relaxed font-normal">
              Established South African financial provider offering personal loans, business funding, and asset finance solutions across all 9 provinces. Built on stability, transparency, and compliance.
            </p>

            <div className="space-y-2 text-[14px] font-normal">
              <div className="flex items-center gap-2 text-slate-200">
                <Phone className="w-4 h-4 text-[#168C8C] shrink-0" />
                <span className="font-normal">{companyConfig.phonePlaceholder}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Mail className="w-4 h-4 text-[#168C8C] shrink-0" />
                <span className="font-normal">{companyConfig.emailPlaceholder}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-4 h-4 text-[#168C8C] shrink-0" />
                <span className="font-normal">{companyConfig.headOfficePlaceholder}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Loans */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Loans</h4>
            <ul className="space-y-2.5 text-[14px] font-normal">
              <li><a href="#products" className="hover:text-[#168C8C] transition-colors font-normal">Personal Loans</a></li>
              <li><a href="#products" className="hover:text-[#168C8C] transition-colors font-normal">Business Loans</a></li>
              <li><a href="#products" className="hover:text-[#168C8C] transition-colors font-normal">Asset Finance</a></li>
              <li><a href="#requirements" className="hover:text-[#168C8C] transition-colors font-normal">Eligibility Requirements</a></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Support</h4>
            <ul className="space-y-2.5 text-[14px] font-normal">
              <li>
                <button 
                  type="button" 
                  onClick={onOpenContact} 
                  className="hover:text-[#168C8C] transition-colors font-normal cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li><a href="#how-to-apply" className="hover:text-[#168C8C] transition-colors font-normal">How It Works</a></li>
              <li><a href="#requirements" className="hover:text-[#168C8C] transition-colors font-normal">Eligibility & Requirements</a></li>
              <li>
                <button 
                  type="button" 
                  onClick={onOpenContact} 
                  className="hover:text-[#168C8C] transition-colors font-normal cursor-pointer text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={onOpenContact} 
                  className="hover:text-[#168C8C] transition-colors font-normal cursor-pointer text-left"
                >
                  Application Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Compliance */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Legal & Compliance</h4>
            <ul className="space-y-2.5 text-[14px] text-slate-300 font-normal cursor-default">
              <li><span className="font-normal">Privacy Policy</span></li>
              <li><span className="font-normal">Terms & Conditions</span></li>
              <li><span className="font-normal">POPIA Information</span></li>
              <li><span className="font-normal">Complaints Process</span></li>
              <li><span className="font-normal">Regulatory Disclosures</span></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Regulatory & Disclaimer Bottom Bar */}
      <div className="bg-[#081726] border-t border-[#102A43] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#168C8C]" />
              <span>{companyConfig.ncaRegistrationPlaceholder}</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} {companyConfig.legalName}. All Rights Reserved.
            </div>
          </div>

          <p className="text-[14px] leading-relaxed text-slate-400 border-t border-[#102A43] pt-4 font-normal">
            <span className="font-semibold text-slate-300">Regulatory Notice:</span> Spring Cash Loans operates in compliance with South African financial legislation including the National Credit Act (NCA) and Protection of Personal Information Act (POPIA). Loan approval, terms, rates, and credit limits are subject to credit bureau assessment, income verification, and responsible lending criteria.
          </p>
        </div>
      </div>

    </footer>
  );
};
