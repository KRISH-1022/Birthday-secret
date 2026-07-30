import React, { useEffect, useState } from 'react';
import { audioEngine } from '../utils/AudioEngine';

interface IntroCinematicProps {
  onComplete: () => void;
}

export const IntroCinematic: React.FC<IntroCinematicProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    // Step 0: "18 Years..."
    audioEngine.playHeartbeat();
    const t1 = setTimeout(() => {
      setStep(1); // "18 Memories..."
      audioEngine.playHeartbeat();
    }, 700);

    const t2 = setTimeout(() => {
      setStep(2); // "18 Destinations..."
      audioEngine.playHeartbeat();
    }, 1400);

    const t3 = setTimeout(() => {
      setStep(3); // "One unforgettable surprise..."
      audioEngine.playTone(300, 'triangle', 0.8);
    }, 2100);

    const t4 = setTimeout(() => {
      setStep(4);
      setCountdown(3);
      audioEngine.playCountdownTick(3);
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 1) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev ? prev - 1 : null));
        audioEngine.playCountdownTick((countdown || 1) - 1);
      }, 600);
      return () => clearTimeout(timer);
    } else if (countdown === 1) {
      const timer = setTimeout(() => {
        setCountdown(0); // "Adventure Begins"
        audioEngine.playSuccess();
      }, 600);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [countdown, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F10] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md space-y-6">
        {step === 0 && (
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white tracking-widest animate-pulse">
            18 Years...
          </h2>
        )}
        {step === 1 && (
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-warmGold tracking-widest animate-pulse">
            18 Memories...
          </h2>
        )}
        {step === 2 && (
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-softPink tracking-widest animate-pulse">
            18 Destinations...
          </h2>
        )}
        {step === 3 && (
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            One unforgettable surprise...
          </h2>
        )}

        {step === 4 && (
          <div className="space-y-4">
            {countdown && countdown > 0 ? (
              <div className="text-8xl md:text-9xl font-serif font-black text-warmGold animate-bounce">
                {countdown}
              </div>
            ) : (
              <div className="text-4xl md:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-warmGold via-white to-softPink tracking-wider">
                Adventure Begins ✨
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
