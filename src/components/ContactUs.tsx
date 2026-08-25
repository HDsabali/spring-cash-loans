import React, { useState, useRef } from 'react';
import { 
  Phone, Mail, MapPin, ShieldCheck, ChevronDown, ChevronRight, 
  Send, CheckCircle, Info, Lock, ArrowRight, FileText, HelpCircle, MessageSquare
} from 'lucide-react';
import { companyConfig } from '../config/loanConfig';

interface ContactUsProps {
  onOpenApplyModal: (loanType?: 'personal' | 'business' | 'asset') => void;
  onGoHome: () => void;
}

export const ContactUs: React.FC<ContactUsProps> = ({ onOpenApplyModal, onGoHome }) => {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    category: 'General enquiry',
    appRefNumber: '',
    contactMethod: 'Phone' as 'Phone' | 'Email',
    message: '',
    privacyConsent: false,
    marketingConsent: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Accordion FAQ Open Tracker
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form Section Ref for smooth scrolling
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToFormWithCategory = (categoryName: string) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
    if (formRef.current) {
      const navOffset = 90;
      const elementPosition = formRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name.';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.mobileNumber.trim() || formData.mobileNumber.replace(/\D/g, '').length < 9) {
      errors.mobileNumber = 'Please enter a valid South African mobile number.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please enter your enquiry message.';
    } else if (formData.message.length > 1000) {
      errors.message = 'Message must not exceed 1000 characters.';
    }

    if (!formData.privacyConsent) {
      errors.privacyConsent = 'You must accept the privacy consent to submit your enquiry.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `ENQ-ZA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedRef(ref);
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 1200);
  };

  const faqs = [
    {
      q: 'How do I apply for a loan?',
      a: 'You can start by selecting the loan type that best suits your needs and completing our secure online application. Your application will be subject to the relevant assessment and approval process.',
    },
    {
      q: 'How do I check the status of my application?',
      a: 'Contact our support team and provide your application reference number if one has been issued.',
    },
    {
      q: 'What documents do I need?',
      a: "Document requirements depend on the type of loan and your individual circumstances. During your application, we'll let you know which documents are required.",
    },
    {
      q: 'How is my loan application assessed?',
      a: "Applications are assessed based on the information you provide and the company's applicable credit and affordability assessment processes. Submitting an application does not guarantee approval.",
    },
    {
      q: 'Can I change my loan amount or repayment period?',
      a: 'If your application has not yet been finalised, contact our team to discuss whether changes can be made.',
    },
    {
      q: 'What interest rate will I receive?',
      a: 'Our rates start from 11.75% p.a. Your actual interest rate and final loan terms will depend on your application and assessment.',
    },
  ];

  return (
    <div className="w-full bg-[#F7F8F6] text-[#102A43] font-sans">
      
      {/* 1. HERO SECTION (With background image) */}
      <section 
        className="w-full relative border-b border-[#E4E7EB] flex items-center justify-center bg-cover bg-center overflow-hidden py-14 sm:py-20"
        style={{
          backgroundImage: `url('/contact-hero-bg.jpg')`,
        }}
      >
        {/* Dark Navy Overlay for optimal text readability */}
        <div className="absolute inset-0 bg-[#0B1F33]/65"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4 relative z-10 text-white">
          <span className="text-[#E7F4F2] font-semibold text-xs uppercase tracking-widest bg-[#168C8C]/90 border border-[#168C8C] px-3.5 py-1 rounded-full inline-block shadow-sm">
            WE'RE HERE TO HELP
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-tight font-sans drop-shadow-md">
            How can we help you?
          </h1>

          <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-medium drop-shadow-sm">
            Whether you have a question about a loan, need help with an application or would like to speak to our team, we're here to assist you.
          </p>
        </div>
      </section>



      {/* 3. CONTACT FORM & 7. RIGHT-SIDE HELP PANEL */}
      <section ref={formRef} className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: The Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
              
              {!isSuccess ? (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-[#102A43]">Send us a message</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Complete the form below and our team will get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sipho Nkosi"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full h-13 px-4 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                          formErrors.fullName ? 'border-red-500 bg-red-50/50' : 'border-[#E4E7EB] focus:ring-2 focus:ring-[#168C8C] focus:bg-white'
                        }`}
                      />
                      {formErrors.fullName && (
                        <span className="text-xs text-red-600 font-semibold mt-1 block">{formErrors.fullName}</span>
                      )}
                    </div>

                    {/* Email & Mobile Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email Address */}
                      <div>
                        <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          placeholder="name@domain.co.za"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full h-13 px-4 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                            formErrors.email ? 'border-red-500 bg-red-50/50' : 'border-[#E4E7EB] focus:ring-2 focus:ring-[#168C8C] focus:bg-white'
                          }`}
                        />
                        {formErrors.email && (
                          <span className="text-xs text-red-600 font-semibold mt-1 block">{formErrors.email}</span>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-1.5">
                          Mobile Number *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                            +27
                          </span>
                          <input
                            type="tel"
                            placeholder="082 123 4567"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            className={`w-full h-13 pl-12 pr-4 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                              formErrors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-[#E4E7EB] focus:ring-2 focus:ring-[#168C8C] focus:bg-white'
                            }`}
                          />
                        </div>
                        {formErrors.mobileNumber && (
                          <span className="text-xs text-red-600 font-semibold mt-1 block">{formErrors.mobileNumber}</span>
                        )}
                      </div>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                      <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-1.5">
                        What can we help you with? *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full h-13 pl-4 pr-10 bg-slate-50 border border-[#E4E7EB] rounded-xl text-sm font-semibold text-[#102A43] appearance-none outline-none focus:ring-2 focus:ring-[#168C8C] focus:bg-white cursor-pointer transition-all"
                        >
                          <option>General enquiry</option>
                          <option>Personal Loan</option>
                          <option>Business Loan</option>
                          <option>Asset Finance</option>
                          <option>Help with my application</option>
                          <option>Existing loan enquiry</option>
                          <option>Documents</option>
                          <option>Repayment enquiry</option>
                          <option>Update my details</option>
                          <option>Complaint or feedback</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#168C8C] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>





                    {/* Your Message */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                          Your message *
                        </label>
                        <span className={`text-[11px] font-semibold ${formData.message.length > 1000 ? 'text-red-600' : 'text-slate-400'}`}>
                          {formData.message.length} / 1000
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        maxLength={1000}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`w-full p-4 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                          formErrors.message ? 'border-red-500 bg-red-50/50' : 'border-[#E4E7EB] focus:ring-2 focus:ring-[#168C8C] focus:bg-white'
                        }`}
                      />
                      {formErrors.message && (
                        <span className="text-xs text-red-600 font-semibold mt-1 block">{formErrors.message}</span>
                      )}
                    </div>

                    {/* 4. PRIVACY CONSENT & MARKETING */}
                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 text-xs text-slate-700 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.privacyConsent}
                          onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                          className="accent-[#168C8C] w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                        />
                        <span>
                          I consent to the processing of my personal information for the purpose of responding to my enquiry, in accordance with the Privacy Policy. *
                        </span>
                      </label>
                      {formErrors.privacyConsent && (
                        <span className="text-xs text-red-600 font-semibold block">{formErrors.privacyConsent}</span>
                      )}

                      <label className="flex items-start gap-3 text-xs text-slate-500 font-normal cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={formData.marketingConsent}
                          onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                          className="accent-[#168C8C] w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                        />
                        <span>(Optional) I'd like to receive relevant news, offers and financial information.</span>
                      </label>
                    </div>

                    {/* 5. SUBMIT BUTTON */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[#168C8C] hover:bg-[#127272] text-white font-bold px-9 py-4 rounded-full transition-all shadow-md flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Sending message...</span>
                        ) : (
                          <><span>Send Message</span> <ArrowRight className="w-5 h-5" /></>
                        )}
                      </button>
                    </div>

                  </form>
                </>
              ) : (
                /* 6. SUCCESS STATE */
                <div className="text-center py-8 space-y-6 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43]">Your message has been sent</h2>
                    <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for contacting us. We've received your message and a member of our team will get back to you.
                    </p>
                  </div>

                  {submittedRef && (
                    <div className="bg-slate-50 border border-[#E4E7EB] p-4 rounded-xl inline-block text-center space-y-1">
                      <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">Enquiry Reference</span>
                      <span className="text-xl font-extrabold text-[#12355B]">{submittedRef}</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={onGoHome}
                      className="bg-[#12355B] hover:bg-[#102A43] text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm cursor-pointer shadow-sm"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDE: Help Panel & 8. Security Notice */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 7. RIGHT-SIDE HELP PANEL */}
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-[#102A43] border-b border-[#E4E7EB] pb-3">
                Before you contact us
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-[#102A43] text-sm">APPLYING FOR A LOAN</h4>
                  <p className="text-slate-600 leading-relaxed">
                    You can apply online by completing our secure loan application.
                  </p>
                  <button 
                    onClick={() => onOpenApplyModal('personal')}
                    className="text-[#168C8C] font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Start an application</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 pt-3 border-t border-[#E4E7EB]">
                  <h4 className="font-bold text-[#102A43] text-sm">CHECKING YOUR APPLICATION</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Have your application reference number ready when contacting us about an existing application.
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-[#E4E7EB]">
                  <h4 className="font-bold text-[#102A43] text-sm">REQUIRED DOCUMENTS</h4>
                  <p className="text-slate-600 leading-relaxed">
                    The documents you need may depend on the type of finance you're applying for.
                  </p>
                  <a href="#requirements" onClick={onGoHome} className="text-[#168C8C] font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1">
                    <span>View loan requirements</span> <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-1 pt-3 border-t border-[#E4E7EB]">
                  <h4 className="font-bold text-[#102A43] text-sm">EXISTING LOAN</h4>
                  <p className="text-slate-600 leading-relaxed">
                    For questions about your repayment or account, select “Existing loan enquiry” when contacting us.
                  </p>
                </div>
              </div>
            </div>



          </div>

        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="py-14 bg-white border-t border-b border-[#E4E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43]">Frequently asked questions</h2>
            <p className="text-slate-500 text-sm">Find answers to some common questions before getting in touch.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-[#E4E7EB] rounded-xl overflow-hidden bg-[#F7F8F6]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-[#102A43] text-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#168C8C] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#E4E7EB]/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. COMPLAINTS AND FEEDBACK */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h3 className="text-xl font-bold text-[#102A43]">Complaints and feedback</h3>
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
          We're committed to providing a fair and professional service. If you're unhappy with any aspect of your experience, we'd like to hear from you.
        </p>
        <div>
          <button
            type="button"
            onClick={() => scrollToFormWithCategory('Complaint or feedback')}
            className="bg-white hover:bg-slate-100 text-[#12355B] border border-[#12355B] font-bold px-6 py-2.5 rounded-full text-xs transition-all cursor-pointer"
          >
            Submit a complaint
          </button>
        </div>
      </section>

      {/* 12. NATIONWIDE SERVICE BANNER */}
      <section className="bg-[#12355B] text-white py-14 border-t border-[#102A43]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            We're here to help, wherever you are.
          </h2>

          <p className="text-slate-200 text-base leading-relaxed">
            Our team supports customers across South Africa with personal, business and asset finance solutions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenApplyModal('personal')}
              className="w-full sm:w-auto bg-[#168C8C] hover:bg-[#127272] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md text-sm cursor-pointer"
            >
              Apply for Finance
            </button>
            <button
              onClick={() => scrollToFormWithCategory('General enquiry')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm cursor-pointer border border-white/20"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
