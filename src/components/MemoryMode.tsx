import React from 'react';
import { Video, Clock, Award, RotateCcw, Download } from 'lucide-react';
import { recorderService } from '../utils/RecorderService';
import { audioEngine } from '../utils/AudioEngine';

interface MemoryModeProps {
  onRestart: () => void;
}

export const MemoryMode: React.FC<MemoryModeProps> = ({ onRestart }) => {
  const videoUrl = recorderService.getVideoUrl();
  const timestamps = recorderService.getTimestamps();

  const handleDownloadCertificate = () => {
    audioEngine.playSuccess();
    const text = `18 YEARS • 18 MEMORIES • ONE SURPRISE\nOfficial Journey Certificate\n\nCompleted 18 Campus Memories with Love.\nTimestamps:\n` +
      timestamps.map(t => `#${t.chapterId} ${t.chapterTitle} @ ${t.timestamp}`).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '18th_Birthday_Memory_Certificate.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVlog = () => {
    audioEngine.playSuccess();
    recorderService.downloadVideo('My_Birthday_Journey');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 pt-24 pb-12 text-center max-w-md mx-auto relative z-10">
      {/* Top Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warmGold/10 border border-warmGold/30 text-warmGold text-xs tracking-widest uppercase font-semibold">
        <Award size={14} />
        <span>Memory Preservation Mode</span>
      </div>

      {/* Main Content */}
      <div className="my-auto space-y-6 w-full">
        <h2 className="text-3xl font-serif font-bold text-white">
          Your Recorded Journey
        </h2>

        {/* Video Player */}
        <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/20 bg-black shadow-lg">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-white/5">
              <Video size={48} className="text-warmGold opacity-60" />
              <p className="text-xs text-white/70">Recorded Journey Video Saved</p>
            </div>
          )}
        </div>

        {/* Timestamps Log Container */}
        <div className="glass-card p-4 border border-white/10 space-y-3 text-left max-h-56 overflow-y-auto">
          <h4 className="text-xs font-semibold text-warmGold uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={14} />
            <span>Chapter Completion Timestamps</span>
          </h4>

          <div className="space-y-2 text-xs">
            {timestamps.length > 0 ? (
              timestamps.map((t) => (
                <div
                  key={t.chapterId}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
                >
                  <span className="text-white/90 font-medium">
                    #{t.chapterId} {t.chapterTitle}
                  </span>
                  <span className="text-warmGold font-mono text-[11px]">
                    {t.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/50 italic">All 18 chapters logged continuously.</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <button
          onClick={handleDownloadVlog}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-warmGold via-white to-warmGold text-[#0F0F10] font-bold text-base shadow-goldGlow hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Download size={18} />
          <span>Download My Birthday Journey</span>
        </button>

        <button
          onClick={handleDownloadCertificate}
          className="w-full py-3 px-6 rounded-full bg-white/10 border border-white/15 text-white font-medium text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-2"
        >
          <Award size={14} />
          <span>Download Memory Certificate</span>
        </button>

        <button
          onClick={onRestart}
          className="w-full py-3 px-6 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          <span>Replay Adventure</span>
        </button>
      </div>
    </div>
  );
};
