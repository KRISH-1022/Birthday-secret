import React, { useEffect, useRef, useState } from 'react';
import { Camera, Sparkles, Heart, SwitchCamera } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import { recorderService } from '../utils/RecorderService';
import { CameraFacingMode } from '../types';

interface LiveMirrorProps {
  onNext: () => void;
}

export const LiveMirror: React.FC<LiveMirrorProps> = ({ onNext }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<CameraFacingMode>(recorderService.getFacingMode());

  useEffect(() => {
    const unsub = recorderService.subscribeCameraChange((mode) => {
      setFacingMode(mode);
    });

    const startCamera = async () => {
      try {
        let stream = recorderService.getStream();
        if (!stream) {
          await recorderService.startRecording();
          stream = recorderService.getStream();
        }
        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        } else {
          setHasCamera(true);
        }
      } catch (e) {
        console.warn('Camera preview restricted. Showing simulated portrait frame.', e);
        setHasCamera(false);
      }
    };

        startCamera();

    return () => {
      unsub();
    };
  }, []);

  const handleFlipCamera = async () => {
    audioEngine.playClick();
    const newMode = await recorderService.switchCamera();
    setFacingMode(newMode);
    const stream = recorderService.getStream();
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const handleBeginAdventure = async () => {
    audioEngine.playClick();
    if (!recorderService.getIsRecording()) {
      await recorderService.startRecording();
    }
    onNext();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 pt-20 pb-12 text-center max-w-md mx-auto relative z-10">
      {/* Top Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-softPink/10 border border-softPink/30 text-softPink text-xs tracking-widest uppercase font-semibold">
        <Sparkles size={14} />
        <span>Live Mirror</span>
      </div>

      {/* Video Viewport Container */}
      <div className="my-auto w-full flex flex-col items-center">
        <div className="relative w-full max-w-[280px] h-[380px] rounded-3xl overflow-hidden border-2 border-warmGold/40 shadow-goldGlow bg-[#1A162B]">
          {/* Flip Camera Button */}
          <button
            onClick={handleFlipCamera}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0F0F10]/80 border border-white/20 text-white hover:text-warmGold hover:scale-110 active:scale-95 transition-all shadow-md"
            title={`Switch to ${facingMode === 'user' ? 'Rear (Back)' : 'Front'} Camera`}
          >
            <SwitchCamera size={18} />
          </button>

          {hasCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-b from-[#1A162B] to-[#0F0F10]">
              <Camera size={48} className="text-warmGold animate-pulse" />
              <p className="text-xs text-white/70">Camera Preview Ready</p>
            </div>
          )}

          {/* Mirror Overlay Tag */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="py-2 px-4 rounded-full bg-[#0F0F10]/80 backdrop-blur-md border border-white/10 text-white font-serif font-semibold text-sm shadow-lg text-center">
              You look beautiful <span className="text-softPink">❤️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleBeginAdventure}
        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-warmGold via-softPink to-warmGold text-[#0F0F10] font-bold text-base tracking-wide shadow-roseGlow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <span>Begin Adventure</span>
        <Heart size={18} className="fill-current text-[#0F0F10]" />
      </button>
    </div>
  );
};
