import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Video, RotateCcw, Download } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import { recorderService } from '../utils/RecorderService';

interface SurpriseEndingProps {
  onGoToMemoryMode: () => void;
  onRestart: () => void;
}

export const SurpriseEnding: React.FC<SurpriseEndingProps> = ({
  onGoToMemoryMode,
  onRestart,
}) => {
  const [candleBlown, setCandleBlown] = useState(false);

  useEffect(() => {
    try {
      audioEngine.playCelebrationFanfare();
    } catch {}

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    recorderService.stopRecording().catch(() => {});
  }, []);

  const handleBlowCandle = () => {
    setCandleBlown(true);

    try {
      audioEngine.playSuccess();
    } catch {}

    try {
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {}
  };

  const handleDownloadVlog = () => {
    audioEngine.playSuccess();
    recorderService.downloadVideo('My_Birthday_Journey');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-6 pt-20 pb-10 text-center max-w-md mx-auto relative z-10">
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-warmGold/10 border border-warmGold/30 text-warmGold text-xs tracking-widest uppercase font-semibold">
        <Sparkles size={14} />
        <span>18 Years • 18 Memories</span>
      </div>

      <div className="space-y-6 w-full my-auto">
        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white via-warmGold to-softPink bg-clip-text text-transparent">
          Happy Birthday Samiksha ❤️
        </h1>

        <div className="rounded-3xl overflow-hidden border border-warmGold/40 shadow-goldGlow">
          <img
            src="/assets/surprise.png"
            alt="Birthday Surprise"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Interactive Candle */}
        <div
          onClick={handleBlowCandle}
          className="cursor-pointer rounded-2xl border border-warmGold/30 p-5 bg-white/5 hover:bg-white/10 transition-all"
        >
          <div className="text-6xl animate-bounce">
            {candleBlown ? '🎂' : '🕯️'}
          </div>

          <p className="mt-3 text-xs font-serif text-white/90">
            {candleBlown ? 'Happy 19th Birthday ❤️' : 'Tap the candle to make a wish'}
          </p>
        </div>

        {/* Ending Letter */}
        <div className="glass-card-gold p-6 space-y-3 text-left border border-warmGold/40 text-sm leading-relaxed">
          <h2 className="text-warmGold font-serif font-bold text-lg border-b border-warmGold/20 pb-2">
            The 19th Memory ❤️
          </h2>

          <p className="text-white/90">
            The first eighteen memories were from our past.
          </p>

          <p className="text-white/90">
            The nineteenth memory begins today.
          </p>

          <p className="text-white/90">
            Thank you for walking through every chapter with me.
          </p>

          <p className="text-warmGold font-serif font-semibold text-base pt-1">
            Happy 19th Birthday.
          </p>

          <p className="text-right text-warmGold font-serif text-base pt-2">
            — Krish ❤️
          </p>
        </div>
      </div>

      <div className="w-full space-y-3 mt-6">
        <button
          onClick={handleDownloadVlog}
          className="w-full py-4 rounded-full bg-gradient-to-r from-warmGold via-white to-warmGold text-[#0F0F10] font-bold text-base shadow-goldGlow hover:scale-105 transition-all flex justify-center items-center gap-2"
        >
          <Download size={20} />
          <span>Download My Birthday Journey</span>
        </button>

        <button
          onClick={onGoToMemoryMode}
          className="w-full py-3 rounded-full bg-white/10 border border-white/15 text-white font-medium text-xs hover:bg-white/20 transition-all flex justify-center items-center gap-2"
        >
          <Video size={16} />
          <span>Watch Recorded Journey</span>
        </button>

        <button
          onClick={onRestart}
          className="w-full py-3 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium text-xs hover:bg-white/10 transition-all flex justify-center items-center gap-2"
        >
          <RotateCcw size={14} />
          <span>Replay Adventure</span>
        </button>
      </div>
    </div>
  );
};