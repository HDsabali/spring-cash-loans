import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, ChevronRight, Phone, ArrowUpRight } from 'lucide-react';
import { companyConfig } from '../config/loanConfig';

interface NavbarProps {
  onOpenApplyModal: (loanType?: 'personal' | 'business' | 'asset') => void;
  onGoHome?: () => void;
  onOpenContact?: () => void;
  activeView?: 'home' | 'contact' | 'apply';
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApplyModal, onGoHome, onOpenContact, activeView = 'home' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onGoHome) {
      onGoHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Personal Loans', href: '#products' },
    { name: 'Business Loans', href: '#products' },
    { name: 'Asset Finance', href: '#products' },
    { name: 'About Us', href: '#about-stats' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onGoHome) {
      onGoHome();
    }
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        const navOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <>
      {/* Top regulatory & trust banner */}
      <div className="bg-[#0B1F33] text-slate-300 text-xs py-2.5 px-4 border-b border-[#102A43]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#168C8C]">
              <ShieldCheck className="w-4 h-4 text-[#168C8C]" /> {companyConfig.ncaRegistrationPlaceholder}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-medium">
            <span className="hidden lg:inline text-slate-300">{companyConfig.phonePlaceholder.split('[')[0]}</span>
            <span className="text-[#168C8C] font-semibold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Nationwide Assistance
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#102A43] shadow-md border-b border-[#12355B]'
            : 'bg-[#102A43] border-b border-[#12355B]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 sm:h-28 relative">
            
            {/* Left Slot: Mobile Hamburger Menu Button (Mobile Only) */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-slate-200 hover:text-white hover:bg-[#12355B] focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo: Centered on Mobile, Left-aligned on Desktop */}
            <a 
              href="#" 
              onClick={handleLogoClick} 
              className="flex items-center group focus:outline-none cursor-pointer absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <img 
                src="/logo.png" 
                alt="Spring Cash Loans (Pty) Ltd" 
                className="h-[65px] sm:h-[80px] w-auto object-contain py-1 drop-shadow-md transition-all" 
              />
            </a>

            {/* Desktop Navigation Menu Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-[15px] font-semibold text-slate-200 hover:text-white hover:bg-[#12355B] rounded-full transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Side CTA (Desktop Contact Us) */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => {
                  if (onOpenContact) {
                    onOpenContact();
                  }
                }}
                className={`font-semibold px-7 py-3.5 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-[15px] cursor-pointer ${
                  activeView === 'contact'
                    ? 'bg-[#168C8C] text-white ring-2 ring-[#E7F4F2]'
                    : 'bg-[#168C8C] hover:bg-[#127272] text-white'
                }`}
              >
                <span>Contact Us</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Spacer for Mobile Balance */}
            <div className="w-10 lg:hidden" />

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#102A43] border-b border-[#12355B] px-4 pt-2 pb-6 space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 text-base font-semibold text-slate-100 hover:bg-[#12355B] rounded-full transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-[#12355B]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenContact) onOpenContact();
                }}
                className="w-full bg-[#168C8C] hover:bg-[#127272] text-white font-semibold py-3.5 rounded-full shadow-sm flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <span>Contact Us</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
