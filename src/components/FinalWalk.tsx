import React, { useEffect, useState } from 'react';
import { audioEngine } from '../utils/AudioEngine';

interface FinalWalkProps {
  onGateOpened: () => void;
}

export const FinalWalk: React.FC<FinalWalkProps> = ({ onGateOpened }) => {
  const [countdown, setCountdown] = useState<number>(3);
  const gateOpenedRef = React.useRef(onGateOpened);
  gateOpenedRef.current = onGateOpened;

  useEffect(() => {
    try {
      audioEngine.playHeartbeat();
      audioEngine.playCountdownTick(3);
    } catch {}

    let current = 3;
    const timer = setInterval(() => {
      current--;
      if (current > 0) {
        setCountdown(current);
        try {
          audioEngine.playCountdownTick(current);
        } catch {}
      } else {
        clearInterval(timer);
        try {
          audioEngine.playGateOpen();
        } catch {}
        gateOpenedRef.current();
      }
    }, 900);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="space-y-4">
        <div className="text-8xl md:text-9xl font-serif font-black text-warmGold animate-bounce">
          {countdown}
        </div>
      </div>
    </div>
  );
};
