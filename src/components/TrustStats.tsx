import React from 'react';

export interface PartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
}

// 15 Bank logos directly loaded from /bank-logos/ (copied from Desktop BANK folder)
const bankLogos: PartnerLogo[] = [
  { id: '1', logoUrl: '/bank-logos/1.jpeg', name: 'Bank Partner 1' },
  { id: '2', logoUrl: '/bank-logos/2.png', name: 'Bank Partner 2' },
  { id: '3', logoUrl: '/bank-logos/3.png', name: 'Bank Partner 3' },
  { id: '4', logoUrl: '/bank-logos/4.jpeg', name: 'Bank Partner 4' },
  { id: '5', logoUrl: '/bank-logos/5.svg', name: 'Bank Partner 5' },
  { id: '6', logoUrl: '/bank-logos/6.webp', name: 'Bank Partner 6' },
  { id: '7', logoUrl: '/bank-logos/7.webp', name: 'Bank Partner 7' },
  { id: '8', logoUrl: '/bank-logos/8.png', name: 'Bank Partner 8' },
  { id: '9', logoUrl: '/bank-logos/9.jpeg', name: 'Bank Partner 9' },
  { id: '10', logoUrl: '/bank-logos/10.jpeg', name: 'Bank Partner 10' },
  { id: '11', logoUrl: '/bank-logos/11.png', name: 'Bank Partner 11' },
  { id: '12', logoUrl: '/bank-logos/12.png', name: 'Bank Partner 12' },
  { id: '13', logoUrl: '/bank-logos/13.png', name: 'Bank Partner 13' },
  { id: '14', logoUrl: '/bank-logos/14.png', name: 'Bank Partner 14' },
  { id: '15', logoUrl: '/bank-logos/15.png', name: 'Bank Partner 15' },
];

export const TrustStats: React.FC = () => {
  // Duplicate array for a 100% seamless, uninterrupted parallax infinite marquee loop
  const displayLogos = [...bankLogos, ...bankLogos, ...bankLogos];

  return (
    <section className="bg-[#0B1F33] text-white py-6 border-y border-[#102A43] relative z-10 shadow-inner overflow-hidden select-none">
      {/* Section Heading */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h3 className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#168C8C] opacity-95">
          Supported by:
        </h3>
      </div>

      {/* Infinite Horizontal Parallax Marquee Container */}
      <div className="relative w-full overflow-hidden flex items-center py-2">
        {/* Left Edge Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-[#0B1F33] via-[#0B1F33]/90 to-transparent z-10 pointer-events-none" />

        {/* Continuous Scrolling Track - Direct transparent rendering with no white cards */}
        <div className="animate-marquee-scroll flex items-center gap-8 sm:gap-12">
          {displayLogos.map((logo, index) => (
            <div 
              key={`${logo.id}-${index}`}
              className="flex items-center justify-center shrink-0 h-12 px-2 transition-transform hover:scale-105 duration-300"
            >
              <img 
                src={logo.logoUrl} 
                alt={logo.name} 
                className="h-8 sm:h-10 w-auto max-w-[140px] object-contain transition-all" 
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Right Edge Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-[#0B1F33] via-[#0B1F33]/90 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};
