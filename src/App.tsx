import React, { useState, useEffect } from 'react';
import { AppPhase, UserPermissions } from './types';
import { audioEngine } from './utils/AudioEngine';
import { recorderService } from './utils/RecorderService';
import { faceMonitorService } from './utils/FaceMonitorService';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Header } from './components/Header';
import { Landing } from './components/Landing';
import { Preparation } from './components/Preparation';
import { Permissions } from './components/Permissions';
import { LiveMirror } from './components/LiveMirror';
import { IntroCinematic } from './components/IntroCinematic';
import { Journey } from './components/Journey';
import { FinalWalk } from './components/FinalWalk';
import { SurpriseEnding } from './components/SurpriseEnding';
import { MemoryMode } from './components/MemoryMode';
import { AdminDashboard } from './components/AdminDashboard';
import { HostAuthModal } from './components/HostAuthModal';
import { Camera } from 'lucide-react';

export const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('LANDING');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<string>('00:00');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showHostAuth, setShowHostAuth] = useState<boolean>(false);
  const [isHostAuthenticated, setIsHostAuthenticated] = useState<boolean>(false);
  const [cameraBlocked, setCameraBlocked] = useState<boolean>(false);

  useEffect(() => {
    // Start ambient background music loop
    audioEngine.startAmbientBg();

    // Start face & camera feed monitoring
    faceMonitorService.startMonitoring((blocked) => {
      setCameraBlocked(blocked);
    });

    // Timer sync for REC badge
    const interval = setInterval(() => {
      if (recorderService.getIsRecording()) {
        setIsRecording(true);
        setRecordingTime(recorderService.getFormattedTime());
      } else {
        setIsRecording(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      audioEngine.stopAmbientBg();
      faceMonitorService.stopMonitoring();
    };
  }, []);

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleOpenAdminRequest = () => {
    if (isHostAuthenticated) {
      setShowAdmin(true);
    } else {
      setShowHostAuth(true);
    }
  };

  const handleHostAuthSuccess = () => {
    setIsHostAuthenticated(true);
    setShowHostAuth(false);
    setShowAdmin(true);
  };

  const handleLockHost = () => {
    setIsHostAuthenticated(false);
    setShowAdmin(false);
  };

  const handlePermissionsGranted = (_perms: UserPermissions) => {
    setPhase('LIVE_MIRROR');
  };

  const handleResetProgress = () => {
    localStorage.removeItem('18_memories_saved_chapter');
    setCurrentChapter(1);
    setShowAdmin(false);
    setPhase('LANDING');
  };

  return (
    <div className="relative min-h-screen bg-[#0F0F10] text-[#F3F0FF] selection:bg-[#E6C280] selection:text-[#0F0F10] overflow-x-hidden">
      {/* Dynamic Background Particles */}
      <ParticleCanvas />

      {/* Persistent App Header */}
      {phase !== 'INTRO_CINEMATIC' && (
        <Header
          currentChapter={phase === 'JOURNEY' ? currentChapter : undefined}
          totalChapters={18}
          isRecording={isRecording}
          recordingTime={recordingTime}
          isMuted={isMuted}
          isHostAuthenticated={isHostAuthenticated}
          onToggleMute={handleToggleMute}
          onOpenAdmin={handleOpenAdminRequest}
        />
      )}

      {/* Camera Blocked Gentle Warning Prompt */}
      {cameraBlocked && isRecording && (
        <div className="fixed top-16 inset-x-4 z-50 p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 backdrop-blur-md text-amber-200 text-xs text-center flex items-center justify-center gap-2 animate-bounce">
          <Camera size={16} className="text-amber-400" />
          <span>Camera feed obscured. Please hold device facing your beautiful smile! ❤️</span>
        </div>
      )}

      {/* Host Authorization Verification Modal */}
      {showHostAuth && (
        <HostAuthModal
          onSuccess={handleHostAuthSuccess}
          onClose={() => setShowHostAuth(false)}
        />
      )}

      {/* Admin Dashboard Modal */}
      {showAdmin && (
        <AdminDashboard
          onClose={() => setShowAdmin(false)}
          onResetProgress={handleResetProgress}
          onLockHost={handleLockHost}
        />
      )}

      {/* Screen Phase Controller */}
      <main className="relative z-10">
        {phase === 'LANDING' && (
          <Landing onNext={() => setPhase('PREPARATION')} />
        )}

        {phase === 'PREPARATION' && (
          <Preparation onNext={() => setPhase('PERMISSIONS')} />
        )}

        {phase === 'PERMISSIONS' && (
          <Permissions onNext={handlePermissionsGranted} />
        )}

        {phase === 'LIVE_MIRROR' && (
          <LiveMirror onNext={() => setPhase('INTRO_CINEMATIC')} />
        )}

        {phase === 'INTRO_CINEMATIC' && (
          <IntroCinematic onComplete={() => setPhase('JOURNEY')} />
        )}

        {phase === 'JOURNEY' && (
          <Journey
            onUpdateChapter={(ch) => setCurrentChapter(ch)}
            onCompleteAll={() => setPhase('FINAL_WALK')}
          />
        )}

        {phase === 'FINAL_WALK' && (
          <FinalWalk onGateOpened={() => setPhase('SURPRISE_ENDING')} />
        )}

        {phase === 'SURPRISE_ENDING' && (
          <SurpriseEnding
            onGoToMemoryMode={() => setPhase('MEMORY_MODE')}
            onRestart={handleResetProgress}
          />
        )}

        {phase === 'MEMORY_MODE' && (
          <MemoryMode onRestart={handleResetProgress} />
        )}
      </main>
    </div>
  );
};

export default App;
