import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

interface PreparationProps {
  onNext: () => void;
}

export const Preparation: React.FC<PreparationProps> = ({ onNext }) => {
  const handleClick = () => {
    audioEngine.playClick();
    onNext();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 pt-24 pb-12 text-center max-w-md mx-auto relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-softPink/10 border border-softPink/30 text-softPink text-xs tracking-widest uppercase font-semibold">
        <Sparkles size={14} />
        <span>Before We Begin... ❤️</span>
      </div>

      <div className="my-auto space-y-6 w-full">
        <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
          Before We Begin... ❤️
        </h2>

        <div className="glass-card-gold p-6 space-y-3 text-left text-sm leading-relaxed text-white/90 font-light border border-warmGold/30">
          <p className="text-warmGold font-serif font-semibold text-base">
            Samiksha...
          </p>
          <p>
            You'll turn eighteen only once.
          </p>
          <p>
            So today I have just one request.
          </p>
          <p className="text-white font-medium">
            Wear your favourite outfit.
          </p>
          <p className="text-white font-medium">
            Do your hair the way you like.
          </p>
          <p className="text-white font-medium">
            Bring your brightest smile.
          </p>
          <p className="pt-1">
            Because someone has been waiting for this day for a very long time.
          </p>
          <p className="text-warmGold font-serif italic pt-2">
            I'll wait...
          </p>
          <p className="text-white/80 italic">
            No matter how long it takes.
          </p>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-warmGold via-softPink to-warmGold text-[#0F0F10] font-bold text-base tracking-wide shadow-roseGlow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <span>I'm Ready ❤️</span>
        <Heart size={18} className="fill-current text-[#0F0F10]" />
      </button>
    </div>
  );
};
