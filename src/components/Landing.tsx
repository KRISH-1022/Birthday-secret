import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

interface LandingProps {
  onNext: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onNext }) => {
  const handleClick = () => {
    audioEngine.playClick();
    onNext();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 pt-24 pb-12 text-center max-w-md mx-auto relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warmGold/10 border border-warmGold/30 text-warmGold text-xs tracking-widest uppercase font-semibold shadow-goldGlow">
        <Sparkles size={14} />
        <span>18 Years • 18 Memories</span>
      </div>

      <div className="my-auto space-y-6 w-full">
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-warmGold leading-tight">
          Happy 18th Birthday, Samiksha ❤️
        </h1>

        <div className="glass-card-gold p-6 space-y-4 border border-warmGold/30 text-white/90 text-sm leading-relaxed font-light text-left">
          <p className="text-base text-warmGold font-serif font-semibold">
            Today isn't about opening a gift.
          </p>
          <p>
            Today is about walking through eighteen memories...
          </p>
          <p>
            Every place you visit holds a story.
          </p>
          <p className="text-white font-medium">
            Every story brings you one step closer to someone waiting for you.
          </p>
          <p className="text-white/80 font-light">
            Take your time.
          </p>
          <p className="text-white/80 font-light">
            Don't rush.
          </p>
          <p className="text-white/80 font-light">
            Don't skip.
          </p>
          <p className="text-white/90 font-serif italic pt-1">
            Today only happens once.
          </p>
          <p className="text-right text-warmGold font-serif text-base pt-2">— Krish</p>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-warmGold via-[#D4AF37] to-softPink text-[#0F0F10] font-bold text-base tracking-wide shadow-goldGlow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <span>Begin Journey</span>
        <Heart size={18} className="fill-current text-[#0F0F10]" />
      </button>
    </div>
  );
};
