import React, { useState, useEffect, useRef } from 'react';
import memoriesData from '../data/memories.json';
import { Chapter, Achievement } from '../types';
import { ChapterCard } from './ChapterCard';
import { ProgressRing } from './ProgressRing';
import { QRScannerModal } from './QRScannerModal';
import { AchievementModal } from './AchievementModal';
import { EmotionalCheckpointModal } from './EmotionalCheckpointModal';
import { recorderService } from '../utils/RecorderService';
import { QrCode, Sparkles, X, Camera, HelpCircle } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

interface JourneyProps {
  onCompleteAll: () => void;
  onUpdateChapter: (ch: number) => void;
}

const ACHIEVEMENTS_DATA: Record<number, Achievement> = {
  1: { id: 'CH1', title: 'First Memory Unlocked', description: 'You have taken your first step into reliving our 18 memories.', emoji: '✨', unlockedAtChapter: 1 },
  5: { id: 'CH5', title: 'Five Memories Milestone', description: 'Five chapters completed! Your determination shines bright.', emoji: '🌟', unlockedAtChapter: 5 },
  9: { id: 'CH9', title: 'Halfway There!', description: 'Half of the 18 campus memories unlocked. Someone is waiting for you.', emoji: '💫', unlockedAtChapter: 9 },
  14: { id: 'CH14', title: 'Only Four Left', description: 'The final destination at the Main Gate draws closer with every step.', emoji: '🛣️', unlockedAtChapter: 14 },
  18: { id: 'CH18', title: 'Journey Complete', description: 'All 18 memories verified! Step forward to claim your real-life surprise.', emoji: '🎂', unlockedAtChapter: 18 }
};

export const Journey: React.FC<JourneyProps> = ({ onCompleteAll, onUpdateChapter }) => {
  const chapters: Chapter[] = memoriesData as Chapter[];

  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    const saved = localStorage.getItem('18_memories_saved_chapter');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < chapters.length) {
        return parsed;
      }
    }
    return 0;
  });

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [showEmotionalCheckpoint, setShowEmotionalCheckpoint] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentChapter = chapters[currentIdx];

  useEffect(() => {
    onUpdateChapter(currentIdx + 1);
    localStorage.setItem('18_memories_saved_chapter', currentIdx.toString());
  }, [currentIdx, onUpdateChapter]);

  // Connect front camera live stream whenever in camera view mode
  useEffect(() => {
    if (isMinimized) {
      const timer = setTimeout(() => {
        const stream = recorderService.getStream();
        if (videoRef.current) {
          if (stream) {
            videoRef.current.srcObject = stream;
          } else {
            navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
              audio: true
            }).then((s) => {
              if (videoRef.current) {
                videoRef.current.srcObject = s;
              }
            }).catch(() => {});
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isMinimized, currentIdx]);

  const handleQRVerifiedSuccess = () => {
    setShowQRScanner(false);
    setShowHintModal(false);
    recorderService.logChapterTimestamp(currentChapter.id, currentChapter.title);

    const completedNumber = currentIdx + 1;

    if (ACHIEVEMENTS_DATA[completedNumber]) {
      setActiveAchievement(ACHIEVEMENTS_DATA[completedNumber]);
    }

    if (completedNumber % 4 === 0 && completedNumber < 18) {
      setShowEmotionalCheckpoint(true);
    }

    advanceChapter();
  };

  const advanceChapter = () => {
    if (currentIdx < chapters.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
    } else {
      onCompleteAll();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 pt-20 pb-10 max-w-md mx-auto relative z-10">
      {/* Top Banner when recording on camera page */}
      {isMinimized && (
        <div className="fixed top-16 inset-x-4 z-40 p-3 rounded-2xl bg-[#0F0F10]/90 border border-warmGold/40 backdrop-blur-md text-warmGold text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-goldGlow animate-bounce">
          <Camera size={16} className="text-red-400 animate-pulse" />
          <span>🎥 Record your fun till you reach the location.</span>
        </div>
      )}

      {/* Progress Ring Bar */}
      <div className="w-full">
        <ProgressRing currentChapter={currentIdx + 1} totalChapters={chapters.length} />
      </div>

      {/* Main Viewport: Initial Task Card OR Full Camera Recording Page */}
      {!isMinimized ? (
        <div className="my-auto w-full">
          <ChapterCard
            key={currentChapter.id}
            chapter={currentChapter}
            onContinue={() => setIsMinimized(true)}
            onOpenQRScanner={() => setShowQRScanner(true)}
          />
        </div>
      ) : (
        <div className="my-auto w-full flex flex-col items-center space-y-6 pt-6">
          {/* Full Camera Viewport for continuous recording & selfie walking */}
          <div className="relative w-full max-w-[320px] h-[420px] rounded-3xl overflow-hidden border-2 border-warmGold/50 shadow-goldGlow bg-[#1A162B] flex flex-col items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {/* Live Vlog Overlay Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>REC ● Camera Active</span>
            </div>

            {/* Floating Task / Hint Bubble inside Camera Viewport */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setShowHintModal(true);
              }}
              className="absolute top-4 right-4 z-30 px-3.5 py-1.5 rounded-full bg-warmGold text-[#0F0F10] font-bold text-xs shadow-goldGlow hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 animate-pulse"
              title="Open Task Hint Bubble"
            >
              <HelpCircle size={15} />
              <span>Task {currentChapter.id} • Hint 💡</span>
            </button>

            <div className="absolute bottom-4 inset-x-4 text-center">
              <div className="py-2 px-4 rounded-full bg-[#0F0F10]/85 backdrop-blur-md border border-white/10 text-white text-xs font-serif italic shadow-lg">
                Task {currentChapter.id} Active • Record your journey!
              </div>
            </div>
          </div>

          {/* Primary Action Button: Scan QR Code */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setShowQRScanner(true);
            }}
            className="w-full max-w-xs py-4 px-6 rounded-full bg-gradient-to-r from-warmGold via-white to-warmGold text-[#0F0F10] font-bold text-base shadow-goldGlow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <QrCode size={20} />
            <span>Scan QR Code at Location</span>
          </button>
        </div>
      )}

      {/* Floating Task Bubble when minimized (Fixed Bottom Right) */}
      {isMinimized && (
        <button
          onClick={() => {
            audioEngine.playClick();
            setShowHintModal(true);
          }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-br from-warmGold to-[#B8860B] text-[#0F0F10] font-bold text-xs shadow-goldGlow hover:scale-110 active:scale-95 transition-transform flex items-center gap-2"
          title="Open Task Hint"
        >
          <span>Task {currentChapter.id} Hint 💡</span>
        </button>
      )}

      {/* Task & Hint Bubble Overlay Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 text-white text-left">
          <div className="glass-card-gold p-6 max-w-sm w-full space-y-4 border-2 border-warmGold shadow-goldGlow relative animate-bounce-slow">
            <button
              onClick={() => setShowHintModal(false)}
              className="absolute top-4 right-4 p-1 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-warmGold/20 text-warmGold font-serif text-xs font-bold border border-warmGold/30">
                Task {currentChapter.id}
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Guess the Place 📍
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-warmGold/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-warmGold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Hint:</span>
              </div>
              <p className="text-sm text-white/95 font-serif leading-relaxed whitespace-pre-line">
                {currentChapter.hint1}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowHintModal(false);
                  setShowQRScanner(true);
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-warmGold via-white to-warmGold text-[#0F0F10] font-bold text-xs shadow-goldGlow hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <QrCode size={16} />
                <span>Scan QR Code at Location</span>
              </button>

              <button
                onClick={() => setShowHintModal(false)}
                className="w-full py-3 rounded-full bg-white/10 border border-white/15 text-white/80 font-medium text-xs hover:bg-white/20 transition-all text-center"
              >
                Close & Resume Recording 🎥
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          chapter={currentChapter}
          onSuccess={handleQRVerifiedSuccess}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* Milestone Achievement Modal */}
      {activeAchievement && (
        <AchievementModal
          achievement={activeAchievement}
          onClose={() => setActiveAchievement(null)}
        />
      )}

      {/* Emotional Checkpoint Modal */}
      {showEmotionalCheckpoint && (
        <EmotionalCheckpointModal
          completedCount={currentIdx + 1}
          onContinue={() => setShowEmotionalCheckpoint(false)}
        />
      )}
    </div>
  );
};
