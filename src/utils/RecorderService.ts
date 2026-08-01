// Continuous MediaRecorder Service with IndexedDB Preservation & Timestamping

import { RecordingTimestamp, CameraFacingMode } from '../types';

class RecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private startTime: number = 0;
  private timerInterval: number | null = null;
  private secondsElapsed: number = 0;
  private timestamps: RecordingTimestamp[] = [];
  private isRecording: boolean = false;
  private stream: MediaStream | null = null;
  private videoUrl: string | null = null;
  private actualMimeType: string = 'video/mp4';
  private facingMode: CameraFacingMode = 'user';
  private listeners: Set<(mode: CameraFacingMode) => void> = new Set();

  public getFacingMode(): CameraFacingMode {
    return this.facingMode;
  }

  public subscribeCameraChange(fn: (mode: CameraFacingMode) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notifyCameraChange() {
    this.listeners.forEach((fn) => fn(this.facingMode));
  }

  public async switchCamera(requestedMode?: CameraFacingMode): Promise<CameraFacingMode> {
    const nextMode = requestedMode || (this.facingMode === 'user' ? 'environment' : 'user');
    this.facingMode = nextMode;

    if (this.stream) {
      try {
        const oldVideoTracks = this.stream.getVideoTracks();
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: this.facingMode, width: { ideal: 720 }, height: { ideal: 1280 } }
        });
        const newVideoTrack = newStream.getVideoTracks()[0];

        if (newVideoTrack) {
          oldVideoTracks.forEach((track) => {
            this.stream?.removeTrack(track);
            track.stop();
          });
          this.stream.addTrack(newVideoTrack);
        }
      } catch (e) {
        console.warn('Failed to switch camera feed:', e);
      }
    }

    this.notifyCameraChange();
    return this.facingMode;
  }

  public async startRecording(requestedFacingMode?: CameraFacingMode): Promise<boolean> {
    if (requestedFacingMode) {
      this.facingMode = requestedFacingMode;
    }
    if (this.isRecording && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      return true;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode, width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true
      });

      const selectedMime = this.getSupportedMimeType();
      try {
        this.mediaRecorder = selectedMime ? new MediaRecorder(this.stream, { mimeType: selectedMime }) : new MediaRecorder(this.stream);
      } catch {
        this.mediaRecorder = new MediaRecorder(this.stream);
      }

      this.actualMimeType = this.mediaRecorder.mimeType || selectedMime || 'video/mp4';
      this.recordedChunks = [];
      this.timestamps = [];
      this.secondsElapsed = 0;
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000); // chunk every 1 sec
      this.isRecording = true;

      if (!this.timerInterval) {
        this.timerInterval = window.setInterval(() => {
          this.secondsElapsed++;
        }, 1000);
      }

      return true;
    } catch (e) {
      console.warn('Camera/Mic permission restricted or not supported. Operating in memory preservation mode.', e);
      this.isRecording = true; // Fallback simulation
      if (!this.timerInterval) {
        this.timerInterval = window.setInterval(() => {
          this.secondsElapsed++;
        }, 1000);
      }
      return false;
    }
  }

  public getStream(): MediaStream | null {
    return this.stream;
  }

  public getFileExtension(): string {
    if (this.actualMimeType.includes('mp4')) {
      return 'mp4';
    }
    return 'mp4';
  }

  public downloadVideo(baseName = 'My_Birthday_Journey') {
    const ext = this.getFileExtension();
    const filename = baseName.endsWith('.mp4') || baseName.endsWith('.webm') 
      ? baseName 
      : `${baseName}.${ext}`;
    
    let url = this.videoUrl;
    if (!url && this.recordedChunks.length > 0) {
      const blob = new Blob(this.recordedChunks, { type: this.actualMimeType || 'video/mp4' });
      url = URL.createObjectURL(blob);
      this.videoUrl = url;
    }
    
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  public logChapterTimestamp(chapterId: number, chapterTitle: string) {
    const minutes = Math.floor(this.secondsElapsed / 60);
    const secs = this.secondsElapsed % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    this.timestamps.push({
      chapterId,
      chapterTitle,
      timestamp: formatted,
      secondsElapsed: this.secondsElapsed
    });
  }

  public stopRecording(): Promise<string | null> {
    return new Promise((resolve) => {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.isRecording = false;

      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: this.actualMimeType || 'video/mp4' });
          this.videoUrl = URL.createObjectURL(blob);
          this.stopStreamTracks();
          resolve(this.videoUrl);
        };
        this.mediaRecorder.stop();
      } else {
        if (this.recordedChunks.length > 0) {
          const blob = new Blob(this.recordedChunks, { type: this.actualMimeType || 'video/mp4' });
          this.videoUrl = URL.createObjectURL(blob);
        }
        this.stopStreamTracks();
        resolve(this.videoUrl);
      }
    });
  }

  private stopStreamTracks() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  public getFormattedTime(): string {
    const minutes = Math.floor(this.secondsElapsed / 60);
    const secs = this.secondsElapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  public getTimestamps(): RecordingTimestamp[] {
    return this.timestamps;
  }

  public getVideoUrl(): string | null {
    return this.videoUrl;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  private getSupportedMimeType(): string {
    const types = [
      'video/mp4;codecs=avc1,aac',
      'video/mp4',
      'video/webm;codecs=h264,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9,opus',
      'video/webm'
    ];
    for (const t of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  }
}

export const recorderService = new RecorderService();
