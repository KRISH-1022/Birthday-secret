import React, { useState, useEffect } from 'react';
import { Camera, X, ShieldAlert, Sparkles, Key } from 'lucide-react';
import { Chapter } from '../types';
import { QRVerificationEngine } from '../utils/QRVerificationEngine';
import { audioEngine } from '../utils/AudioEngine';

interface QRScannerModalProps {
  chapter: Chapter;
  onSuccess: () => void;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ chapter, onSuccess, onClose }) => {
  const [manualToken, setManualToken] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [verificationStage, setVerificationStage] = useState<string | null>(null);

  const handleVerifyToken = (tokenToVerify: string) => {
    setErrorMsg('');
    const isValid = QRVerificationEngine.verifyToken(tokenToVerify, chapter.id, chapter.qrToken);

    if (isValid) {
      setVerificationStage('❤️ Memory Found');
      audioEngine.playSuccess();

      setTimeout(() => {
        onSuccess();
      }, 750);
    } else {
      audioEngine.playTone(180, 'sawtooth', 0.3);
      setErrorMsg("❤️ That isn't today's memory. Keep looking.");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim()) {
      handleVerifyToken(manualToken.trim());
    }
  };

  const handleSimulateScanCurrentQR = () => {
    handleVerifyToken(chapter.qrToken);
  };

  const handleSimulateScanWrongQR = () => {
    handleVerifyToken('WRONG_QR_TOKEN_9999');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-6 text-center text-white">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-warmGold font-semibold uppercase tracking-wider">
          <Camera size={16} />
          <span>QR Verification Scanner</span>
        </div>
        <button onClick={onClose} className="p-2 text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Verification Animation Overlay */}
      {verificationStage ? (
        <div className="my-auto space-y-4 glass-card-gold p-8 max-w-xs w-full border border-warmGold shadow-goldGlow animate-pulse">
          <Sparkles size={40} className="text-warmGold mx-auto animate-spin" />
          <h3 className="text-2xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-warmGold via-white to-softPink">
            {verificationStage}
          </h3>
        </div>
      ) : (
        /* Camera Viewfinder Container */
        <div className="my-auto w-full max-w-sm space-y-6">
          <div className="relative w-full h-72 rounded-3xl overflow-hidden border-2 border-warmGold/60 bg-black shadow-goldGlow flex flex-col items-center justify-center p-4">
            {/* Corner Targeting Guides */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-warmGold" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-warmGold" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-warmGold" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-warmGold" />

            {/* Scanning Line Animation */}
            <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-warmGold to-transparent animate-pulse shadow-goldGlow top-1/2" />

            <Camera size={44} className="text-warmGold/40 animate-pulse mb-2" />
            <p className="text-xs text-white/80 font-medium max-w-[200px]">
              Align hidden QR code for Chapter #{chapter.id} inside frame
            </p>
          </div>

          {/* Incorrect QR Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 animate-bounce">
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Manual Input or Simulator Controls */}
          <div className="space-y-3 pt-2">
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Enter QR Code Token..."
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-warmGold"
              />
              <button
                type="submit"
                className="py-3 px-5 rounded-full bg-warmGold text-[#0F0F10] font-bold text-xs flex items-center gap-1 hover:scale-105 transition-all"
              >
                <Key size={14} />
                <span>Verify</span>
              </button>
            </form>

            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={handleSimulateScanCurrentQR}
                className="py-2 px-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px] hover:bg-emerald-500/30"
              >
                Scan Correct QR
              </button>
              <button
                onClick={handleSimulateScanWrongQR}
                className="py-2 px-4 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold text-[11px] hover:bg-rose-500/30"
              >
                Scan Wrong QR
              </button>
            </div>
          </div>
        </div>
      )}

      <div />
    </div>
  );
};
