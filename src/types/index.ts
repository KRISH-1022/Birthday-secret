export type AppPhase =
  | 'LANDING'
  | 'PREPARATION'
  | 'PERMISSIONS'
  | 'LIVE_MIRROR'
  | 'INTRO_CINEMATIC'
  | 'JOURNEY'
  | 'FINAL_WALK'
  | 'SURPRISE_ENDING'
  | 'MEMORY_MODE';

export interface Chapter {
  id: number;
  title: string;
  location: string;
  hint1: string; // Cryptic
  hint2: string; // Shared memory
  hint3: string; // Easy
  memory: string;
  personalMessage: string;
  year: string;
  secretCode?: string;
  riddleQuestion?: string;
  riddleAnswer?: string;
  puzzleType: 'LOCATION_CHECKIN' | 'SCRATCH_CARD' | 'SECRET_CODE' | 'PHOTO_REVEAL' | 'RIDDLE';
  emoji: string;
  qrToken: string;
  lat: number;
  lng: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAtChapter: number;
}

export interface RecordingTimestamp {
  chapterId: number;
  chapterTitle: string;
  timestamp: string;
  secondsElapsed: number;
}

export interface UserPermissions {
  camera: boolean;
  microphone: boolean;
  location: boolean;
}
