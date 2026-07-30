// Web Audio API Synthesizer & Soundscape Engine

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgInterval: number | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.4, gainVal: number = 0.1, delay: number = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start();
        osc.stop(this.ctx!.currentTime + duration);
      } catch (e) {}
    }, delay * 1000);
  }

  // Soft Ambient Piano Chord Loop
  public startAmbientBg() {
    if (this.bgInterval) return;
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [220.00, 261.63, 329.63], // A minor
      [174.61, 220.00, 261.63], // F major
      [196.00, 246.94, 293.66]  // G major
    ];
    let chordIdx = 0;

    this.bgInterval = window.setInterval(() => {
      if (this.isMuted) return;
      const currentChord = chords[chordIdx];
      currentChord.forEach((freq, idx) => {
        this.playTone(freq, 'triangle', 2.5, 0.04, idx * 0.15);
      });
      chordIdx = (chordIdx + 1) % chords.length;
    }, 4000);
  }

  public stopAmbientBg() {
    if (this.bgInterval) {
      clearInterval(this.bgInterval);
      this.bgInterval = null;
    }
  }

  public playClick() {
    this.playTone(523.25, 'sine', 0.15, 0.08);
  }

  public playSuccess() {
    this.playTone(523.25, 'triangle', 0.2, 0.1, 0);
    this.playTone(659.25, 'triangle', 0.2, 0.1, 0.1);
    this.playTone(783.99, 'triangle', 0.3, 0.1, 0.2);
  }

  public playHeartbeat() {
    this.playTone(70, 'sine', 0.2, 0.15, 0);
    this.playTone(55, 'sine', 0.3, 0.15, 0.18);
  }

  public playCountdownTick(num: number) {
    const pitch = 400 + (4 - num) * 150;
    this.playTone(pitch, 'sine', 0.25, 0.15);
  }

  public playGateOpen() {
    this.playTone(150, 'sawtooth', 1.8, 0.1);
    this.playTone(300, 'sine', 1.5, 0.08, 0.2);
  }

  public playCelebrationFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.8, 0.12, idx * 0.15);
    });
  }
}

export const audioEngine = new AudioEngine();
