import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, X, ShieldAlert, Sparkles, Key, SwitchCamera, FlashlightOff, Flashlight } from 'lucide-react';
import { Chapter, CameraFacingMode } from '../types';
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
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('environment');
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Start camera with given facing mode
  const startCamera = useCallback(async (mode: CameraFacingMode) => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Check if torch is supported
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities?.() as any;
        if (capabilities?.torch) {
          setTorchSupported(true);
        } else {
          setTorchSupported(false);
          setTorchOn(false);
        }
      }

      setCameraReady(true);
    } catch (e) {
      console.warn('Camera access failed for QR scanner:', e);
      setCameraReady(false);
    }
  }, []);

  // Initialize camera on mount
  useEffect(() => {
    startCamera(facingMode);

    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, []);

  // Toggle front/rear camera
  const handleFlipCamera = async () => {
    audioEngine.playClick();
    const newMode: CameraFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    setTorchOn(false);
    await startCamera(newMode);
  };

  // Toggle torch/flashlight
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      try {
        const newTorchState = !torchOn;
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: newTorchState } as any]
        });
        setTorchOn(newTorchState);
        audioEngine.playClick();
      } catch (e) {
        console.warn('Torch toggle failed:', e);
      }
    }
  };

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
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 text-center text-white">
      {/* Header */}
      <div className="w-full flex items-center justify-between pt-1">
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
        /* Camera Viewfinder + Controls */
        <div className="my-auto w-full max-w-sm space-y-4 flex-1 flex flex-col justify-center">
          {/* Camera Viewport */}
          <div className="relative w-full aspect-[3/4] max-h-[55vh] rounded-3xl overflow-hidden border-2 border-warmGold/60 bg-black shadow-goldGlow">
            {/* Live Camera Feed */}
            {cameraReady ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-3 bg-gradient-to-b from-[#1A162B] to-[#0F0F10]">
                <Camera size={48} className="text-warmGold/50 animate-pulse" />
                <p className="text-xs text-white/60">Camera initializing...</p>
              </div>
            )}

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Corner Targeting Guides (Overlay on camera) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dim border area to highlight scan zone */}
              <div className="absolute inset-0 border-[40px] border-black/40" />

              {/* Corner brackets */}
              <div className="absolute top-6 left-6 w-10 h-10 border-t-[3px] border-l-[3px] border-warmGold rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-10 h-10 border-t-[3px] border-r-[3px] border-warmGold rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-[3px] border-l-[3px] border-warmGold rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-[3px] border-r-[3px] border-warmGold rounded-br-lg" />

              {/* Animated scan line */}
              <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-warmGold to-transparent shadow-goldGlow animate-qr-scan" />
            </div>

            {/* Camera Controls Overlay */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
              {/* Flip Camera Button */}
              <button
                onClick={handleFlipCamera}
                className="p-2.5 rounded-full bg-[#0F0F10]/80 border border-white/20 text-white hover:text-warmGold hover:scale-110 active:scale-95 transition-all shadow-md backdrop-blur-sm"
                title={`Switch to ${facingMode === 'user' ? 'Rear' : 'Front'} Camera`}
              >
                <SwitchCamera size={18} />
              </button>

              {/* Torch Button (only on rear camera if supported) */}
              {torchSupported && facingMode === 'environment' && (
                <button
                  onClick={handleToggleTorch}
                  className={`p-2.5 rounded-full border shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${
                    torchOn
                      ? 'bg-warmGold/90 border-warmGold text-[#0F0F10]'
                      : 'bg-[#0F0F10]/80 border-white/20 text-white hover:text-warmGold'
                  }`}
                  title={torchOn ? 'Turn Off Flashlight' : 'Turn On Flashlight'}
                >
                  {torchOn ? <Flashlight size={18} /> : <FlashlightOff size={18} />}
                </button>
              )}
            </div>

            {/* Camera Mode Label */}
            <div className="absolute top-3 left-3 z-20">
              <span className="px-2.5 py-1 rounded-full bg-[#0F0F10]/80 border border-white/15 text-white/80 text-[10px] font-mono backdrop-blur-sm">
                {facingMode === 'user' ? '📸 Front' : '📷 Rear'}
              </span>
            </div>

            {/* Bottom instruction */}
            <div className="absolute bottom-3 inset-x-3 z-20">
              <div className="py-1.5 px-3 rounded-full bg-[#0F0F10]/80 backdrop-blur-md border border-white/10 text-white/80 text-[11px] text-center">
                Align QR code for Chapter #{chapter.id} inside frame
              </div>
            </div>
          </div>

          {/* Incorrect QR Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 animate-bounce">
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Manual Input or Simulator Controls */}
          <div className="space-y-3">
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
