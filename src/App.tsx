import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStats } from './components/TrustStats';
import { FinanceNumbers } from './components/FinanceNumbers';
import { LoanProducts } from './components/LoanProducts';
import { LoanCalculator } from './components/LoanCalculator';
import { WhatWeOffer } from './components/WhatWeOffer';
import { EFTDirectPayment } from './components/EFTDirectPayment';
import { Nationwide } from './components/Nationwide';
import { Requirements } from './components/Requirements';
import { HowToApply } from './components/HowToApply';
import { ApplicationModal } from './components/ApplicationModal';
import { ContactUs } from './components/ContactUs';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'contact'>('landing');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [modalLoanType, setModalLoanType] = useState<'personal' | 'business' | 'asset'>('personal');
  const [modalAmount, setModalAmount] = useState<number>(50000);
  const [modalTerm, setModalTerm] = useState<number>(24);

  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/apply') || hash.includes('apply')) {
        setIsApplyModalOpen(true);
        setCurrentView('landing');
      } else if (path.includes('/contact') || hash.includes('contact')) {
        setIsApplyModalOpen(false);
        setCurrentView('contact');
      } else {
        setIsApplyModalOpen(false);
        setCurrentView('landing');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const handleOpenApplyModal = (
    loanType: 'personal' | 'business' | 'asset' = 'personal',
    amount: number = 50000,
    term: number = 24
  ) => {
    setModalLoanType(loanType);
    setModalAmount(amount);
    setModalTerm(term);
    setIsApplyModalOpen(true);
    if (window.location.pathname !== '/apply') {
      window.history.pushState(null, '', '/apply');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    setIsApplyModalOpen(false);
    setCurrentView('contact');
    if (window.location.pathname !== '/contact') {
      window.history.pushState(null, '', '/contact');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setIsApplyModalOpen(false);
    setCurrentView('landing');
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToProducts = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        const navOffset = 80;
        const elementPosition = productsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#102A43] flex flex-col font-sans">
      {/* Sticky Header Navigation */}
      <Navbar 
        onOpenApplyModal={handleOpenApplyModal} 
        onGoHome={handleGoHome} 
        onOpenContact={handleOpenContact}
        activeView={isApplyModalOpen ? 'apply' : currentView === 'contact' ? 'contact' : 'home'}
      />

      {/* Main Content Area */}
      {!isApplyModalOpen ? (
        currentView === 'landing' ? (
          <>
            {/* Main Landing Page Sections */}
            <main className="flex-grow">
              {/* Full Hero Section */}
              <Hero
                onOpenApplyModal={() => handleOpenApplyModal('personal')}
                onOpenContact={handleOpenContact}
              />

              {/* Company Achievement Bar */}
              <TrustStats />

              {/* Loan Products Segmented Pill Selector */}
              <LoanProducts onOpenApplyModal={handleOpenApplyModal} />

              {/* Interactive Loan Calculator Section */}
              <LoanCalculator onOpenApplyModal={handleOpenApplyModal} />

              {/* Finance Numbers Section */}
              <FinanceNumbers />

              {/* What We Offer */}
              <WhatWeOffer />

              {/* Funds Paid Directly to Your Account (EFT & Security) */}
              <div className="mb-[50px]">
                <EFTDirectPayment onOpenApplyModal={() => handleOpenApplyModal('personal')} />
              </div>

              {/* Nationwide Service */}
              <div className="mb-[50px]">
                <Nationwide onOpenContact={handleOpenContact} />
              </div>

              {/* Qualification Requirements & Credit Score Checklist */}
              <Requirements />

              {/* How To Apply Timeline */}
              <HowToApply onOpenApplyModal={() => handleOpenApplyModal('personal')} />
            </main>

            {/* Institutional Footer */}
            <Footer 
              onOpenApplyModal={() => handleOpenApplyModal('personal')} 
              onGoHome={handleGoHome} 
              onOpenContact={handleOpenContact}
            />
          </>
        ) : (
          <>
            {/* Dedicated Contact Us Page */}
            <main className="flex-grow">
              <ContactUs 
                onOpenApplyModal={handleOpenApplyModal}
                onGoHome={handleGoHome}
              />
            </main>

            {/* Institutional Footer */}
            <Footer 
              onOpenApplyModal={() => handleOpenApplyModal('personal')} 
              onGoHome={handleGoHome} 
              onOpenContact={handleOpenContact}
            />
          </>
        )
      ) : (
        /* Dedicated Application View (Replaces Landing Page completely) */
        <main className="flex-grow bg-[#0B1F33] py-6 sm:py-10 min-h-[calc(100vh-80px)] flex flex-col justify-center">
          <ApplicationModal
            isOpen={isApplyModalOpen}
            onClose={() => {
              setIsApplyModalOpen(false);
              if (window.location.pathname !== '/') {
                window.history.pushState(null, '', '/');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialLoanType={modalLoanType}
            initialAmount={modalAmount}
            initialTerm={modalTerm}
          />
        </main>
      )}

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
