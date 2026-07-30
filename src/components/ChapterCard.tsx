import React from 'react';
import { Sparkles, QrCode } from 'lucide-react';
import { Chapter } from '../types';
import { audioEngine } from '../utils/AudioEngine';

interface ChapterCardProps {
  chapter: Chapter;
  onContinue: () => void;
  onOpenQRScanner: () => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onContinue, onOpenQRScanner }) => {
  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      audioEngine.playClick();
    } catch {}
    onContinue();
  };

  const handleScanQR = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      audioEngine.playClick();
    } catch {}
    onOpenQRScanner();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 text-left">
      {/* Chapter Title Badge */}
      <div className="glass-card-gold p-6 border border-warmGold/40 space-y-2 relative overflow-hidden">
        <span className="px-3.5 py-1 rounded-full bg-warmGold/20 text-warmGold font-serif text-sm font-bold tracking-wider border border-warmGold/30 inline-block">
          Task {chapter.id}
        </span>

        <h3 className="text-2xl font-serif font-bold text-white pt-2">
          Guess the Place 📍
        </h3>
      </div>

      {/* Hint Card */}
      <div className="glass-card p-6 border border-white/10 space-y-4">
        <div className="p-4 rounded-2xl bg-black/50 border border-warmGold/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-warmGold uppercase tracking-wider">
            <Sparkles size={14} className="text-warmGold" />
            <span>Hint:</span>
          </div>
          <p className="text-sm text-white/95 font-serif leading-relaxed whitespace-pre-line">
            {chapter.hint1}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-warmGold via-white to-warmGold text-[#0F0F10] font-bold text-base shadow-goldGlow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue →</span>
          </button>

          <button
            type="button"
            onClick={handleScanQR}
            className="w-full py-3 px-5 rounded-full bg-white/5 border border-white/15 text-white/90 font-medium text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode size={16} className="text-warmGold" />
            <span>Scan QR Code at Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
