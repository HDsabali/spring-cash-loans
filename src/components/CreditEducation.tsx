import React from 'react';
import { Clock, CreditCard, TrendingDown, AlertTriangle, MessageSquare, ShieldAlert, BookOpen } from 'lucide-react';

export const CreditEducation: React.FC = () => {
  const tips = [
    {
      icon: Clock,
      title: 'Make monthly payments on time',
      copy: 'Pay your accounts by their due dates.',
    },
    {
      icon: CreditCard,
      title: "Don't miss credit card payments",
      copy: 'Keep up with your credit card repayment obligations.',
    },
    {
      icon: TrendingDown,
      title: 'Pay outstanding balances',
      copy: 'Where possible, reduce and settle outstanding balances responsibly.',
    },
    {
      icon: AlertTriangle,
      title: 'Avoid legal action',
      copy: "Don't allow unpaid credit obligations to escalate into legal proceedings.",
    },
    {
      icon: MessageSquare,
      title: 'Communicate with creditors',
      copy: 'Notify creditors as soon as possible if you are experiencing difficulty making payments.',
    },
    {
      icon: ShieldAlert,
      title: 'Avoid unnecessary new credit',
      copy: "Don't take on additional credit when you're already working to pay down existing debt.",
    },
  ];

  return (
    <section className="py-20 bg-[#F7F8F6] text-[#102A43] border-b border-[#E4E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E7EB] text-[#168C8C] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Financial Wellness Education
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#102A43] tracking-tight">
            How to Improve Your Credit Score
          </h2>

          <p className="text-[#52606D] text-base sm:text-lg">
            Healthy credit habits can help you maintain a stronger financial profile over time.
          </p>
        </div>

        {/* 6 Educational Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E4E7EB] hover:border-[#168C8C]/50 rounded-xl p-8 transition-all hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#E7F4F2] border border-[#168C8C]/20 flex items-center justify-center text-[#168C8C] group-hover:bg-[#168C8C] group-hover:text-white transition-all mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-[#102A43] mb-3 group-hover:text-[#168C8C] transition-colors">
                    {tip.title}
                  </h3>

                  <p className="text-[#52606D] text-sm leading-[1.6] font-normal">
                    {tip.copy}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E4E7EB] flex items-center justify-between text-xs font-semibold text-[#7B8794]">
                  <span>Educational Tip</span>
                  <span className="text-[#168C8C] font-mono">0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Educational Note */}
        <div className="mt-12 text-center text-xs text-[#7B8794] max-w-2xl mx-auto">
          * Educational Guidance: Building and maintaining credit health is a long-term process. Practicing positive credit management supports your profile over time, though specific credit scoring models are evaluated independently by registered credit bureaus.
        </div>

      </div>
    </section>
  );
};
