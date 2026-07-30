import React from 'react';
import { Volume2, VolumeX, Radio, Settings } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

interface HeaderProps {
  currentChapter?: number;
  totalChapters?: number;
  isRecording?: boolean;
  recordingTime?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentChapter,
  totalChapters = 18,
  isRecording = false,
  recordingTime = '00:00',
  isMuted,
  onToggleMute,
  onOpenAdmin
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-[#0F0F10]/85 backdrop-blur-md border-b border-white/5 flex items-center justify-between text-xs tracking-wider">
      {/* Sound Toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-warmGold transition-all"
          title="Toggle Sound"
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        <span
          onClick={onOpenAdmin}
          className="font-serif font-bold text-warmGold tracking-widest text-sm cursor-pointer hover:opacity-80 transition-opacity"
          title="Click to open Admin Panel"
        >
          18 YEARS
        </span>
      </div>

      {/* Chapter Indicator */}
      {currentChapter && (
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium">
          Chapter <span className="text-warmGold font-bold">{currentChapter}</span> of {totalChapters}
        </div>
      )}

      {/* Live Recording Badge & Admin */}
      <div className="flex items-center gap-2">
        {isRecording && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] animate-pulse">
            <Radio size={12} className="text-red-500" />
            <span>REC {recordingTime}</span>
          </div>
        )}
        <button
          onClick={onOpenAdmin}
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-warmGold transition-all"
          title="Open Admin Dashboard"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
};
