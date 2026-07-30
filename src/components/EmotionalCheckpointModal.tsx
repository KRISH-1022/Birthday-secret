import React, { useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

interface EmotionalCheckpointModalProps {
  completedCount: number;
  onContinue: () => void;
}

export const EmotionalCheckpointModal: React.FC<EmotionalCheckpointModalProps> = ({
  completedCount,
  onContinue
}) => {
  useEffect(() => {
    audioEngine.playHeartbeat();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-6 text-center text-white">
      <div className="glass-card-gold p-8 max-w-sm w-full space-y-6 border border-warmGold/40 shadow-goldGlow">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-softPink/10 border border-softPink/30 text-softPink text-xs tracking-widest uppercase font-semibold">
          <Sparkles size={14} />
          <span>Emotional Checkpoint</span>
        </div>

        <div className="text-4xl animate-pulse">❤️</div>

        <div className="space-y-3 font-serif">
          <h3 className="text-2xl font-bold text-white">
            You've completed {completedCount} memories
          </h3>
          <p className="text-sm text-warmGold font-light leading-relaxed italic">
            "Thank you for taking this journey with me, step by step. Every memory holds a piece of my heart."
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-full bg-gradient-to-r from-warmGold via-softPink to-warmGold text-[#0F0F10] font-bold text-sm shadow-goldGlow hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Journey</span>
          <Heart size={16} className="fill-current" />
        </button>
      </div>
    </div>
  );
};
