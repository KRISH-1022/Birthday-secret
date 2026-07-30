import React, { useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { Achievement } from '../types';
import { audioEngine } from '../utils/AudioEngine';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    audioEngine.playCelebrationFanfare();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center text-white">
      <div className="glass-card-gold p-6 max-w-xs w-full space-y-4 border-2 border-warmGold shadow-goldGlow relative animate-bounce-slow">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 rounded-full bg-warmGold/20 border border-warmGold/50 mx-auto flex items-center justify-center text-3xl shadow-goldGlow">
          {achievement.emoji}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warmGold/10 border border-warmGold/30 text-warmGold text-[10px] uppercase font-bold tracking-widest">
          <Sparkles size={12} />
          <span>Achievement Unlocked</span>
        </div>

        <h3 className="text-xl font-serif font-extrabold text-white">
          {achievement.title}
        </h3>

        <p className="text-xs text-white/80 font-light leading-relaxed">
          {achievement.description}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-gradient-to-r from-warmGold to-softPink text-[#0F0F10] font-bold text-xs tracking-wide shadow-goldGlow hover:scale-105 transition-all"
        >
          Continue Adventure ✨
        </button>
      </div>
    </div>
  );
};
