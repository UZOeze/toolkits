import { Crown, ArrowRight } from 'lucide-react';

export default function BuyPremiumButton() {
  return (
    <a
      href="https://selar.com/42a4ip828h"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed left-4 top-1/2 z-[998] -translate-y-1/2 hidden lg:flex flex-col items-center gap-2"
    >
      {/* Vertical text button */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 px-3 py-5 shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all duration-400 hover:scale-110 hover:shadow-[0_0_50px_rgba(255,215,0,0.9)]"
           style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <div className="relative flex items-center gap-2 text-black">
          <Crown className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-black uppercase tracking-[0.15em] leading-none">
            Buy Premium BinaryOption Toolkits
          </span>
          <ArrowRight className="h-4 w-4 flex-shrink-0 rotate-90" />
        </div>
      </div>
    </a>
  );
}
