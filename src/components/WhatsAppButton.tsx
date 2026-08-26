import React, { useState } from 'react';

interface WhatsAppButtonProps {
  url?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  url = 'https://api.whatsapp.com/message/BRWFZPJLWQYVE1?autoload=1&app_absent=0',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = url;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Hover Tooltip / Expanded Label */}
      <div 
        className={`bg-[#0B1F33] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered 
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 translate-x-2 scale-95 hidden sm:block'
        }`}
      >
        <span>Need help? Chat on WhatsApp</span>
      </div>

      {/* Main Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-white/20 active:scale-95"
      >
        {/* Pulsing Ring Effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 pointer-events-none group-hover:opacity-0 transition-opacity" />

        {/* WhatsApp Icon */}
        <svg 
          className="w-7 h-7 fill-current relative z-10 drop-shadow-xs" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.099.16-1.048 3.827 3.916-1.044.176.124zm11.236-4.526c-.332-.166-1.967-.97-2.272-1.08-.304-.112-.526-.166-.749.167-.222.332-.862 1.08-1.057 1.302-.194.221-.389.249-.721.083-.332-.166-1.401-.516-2.668-1.646-.986-.88-1.652-1.966-1.846-2.298-.194-.332-.021-.511.145-.676.15-.148.332-.387.498-.581.166-.194.221-.332.332-.553.111-.221.055-.415-.028-.581-.083-.166-.749-1.801-1.025-2.463-.269-.646-.543-.559-.749-.57l-.638-.011c-.221 0-.581.083-.886.415-.304.332-1.163 1.135-1.163 2.77 0 1.634 1.191 3.212 1.357 3.434.166.221 2.345 3.58 5.681 5.023.793.343 1.412.548 1.895.702.796.253 1.52.217 2.094.131.64-.096 1.967-.803 2.244-1.577.277-.775.277-1.439.194-1.577-.083-.139-.304-.222-.636-.388z" />
        </svg>

        {/* Online Green Dot Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full z-20" />
      </a>
    </div>
  );
};
