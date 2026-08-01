import React, { useState } from 'react';
import { Lock, Key, X, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

interface HostAuthModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const HostAuthModal: React.FC<HostAuthModalProps> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);

  // Retrieve host PIN from localStorage or default to '1818'
  const getStoredPin = () => {
    return localStorage.getItem('18_memories_host_pin') || '1818';
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const updated = pin + num;
      setPin(updated);
      setErrorMsg('');
      audioEngine.playClick();
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMsg('');
      audioEngine.playClick();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentHostPin = getStoredPin();

    if (pin === currentHostPin) {
      audioEngine.playSuccess();
      onSuccess();
    } else {
      audioEngine.playTone(180, 'sawtooth', 0.3);
      setErrorMsg('Incorrect Host Passcode. Access restricted to Host only.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 text-center text-white">
      <div className="glass-card-gold p-6 max-w-sm w-full space-y-5 border-2 border-warmGold shadow-goldGlow relative animate-bounce-slow text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-warmGold/20 text-warmGold border border-warmGold/40">
            <Lock size={22} />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-warmGold">Host Verification</h3>
            <p className="text-xs text-white/70">Enter Host PIN to access settings & QR codes</p>
          </div>
        </div>

        {/* Informational Warning */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed">
          🔒 <span className="font-semibold text-warmGold">Host-Only Access:</span> QR codes & hint details are hidden from participants to prevent spoilers.
        </div>

        {/* PIN Display Input */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div className="relative flex items-center">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter PIN (Default: 1818)"
              className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-black/60 border border-warmGold/40 text-center font-mono text-lg tracking-widest text-warmGold focus:outline-none focus:border-warmGold focus:ring-1 focus:ring-warmGold placeholder-white/30"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 text-white/50 hover:text-white p-1"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2 animate-bounce">
              <ShieldAlert size={15} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Numeric Keypad Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-mono text-lg font-semibold transition-all border border-white/5"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-300 text-xs font-semibold transition-all border border-rose-500/20"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-mono text-lg font-semibold transition-all border border-white/5"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPin('1818')}
              className="py-3 rounded-xl bg-warmGold/20 hover:bg-warmGold/30 active:scale-95 text-warmGold text-[11px] font-semibold transition-all border border-warmGold/30"
              title="Use Default PIN"
            >
              1818
            </button>
          </div>

          {/* Verify Unlock Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-warmGold via-white to-warmGold text-[#0F0F10] font-bold text-sm shadow-goldGlow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mt-3"
          >
            <Key size={16} />
            <span>Unlock Host Control Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
