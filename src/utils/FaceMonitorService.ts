// Live Camera Feed & Face/Luminance Monitor Service

class FaceMonitorService {
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private monitorInterval: number | null = null;
  private isBlocked: boolean = false;
  private blockedCounter: number = 0;
  private onBlockedCallback: ((blocked: boolean) => void) | null = null;

  public startMonitoring(onBlockedStateChange: (blocked: boolean) => void) {
    this.onBlockedCallback = onBlockedStateChange;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 64;
    this.canvas.height = 64;

    this.monitorInterval = window.setInterval(() => {
      this.checkCameraLuminance();
    }, 2000);
  }

  public stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }

  private checkCameraLuminance() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Simulate inspection of video frame
    try {
      if (this.videoElement && this.videoElement.readyState === 4) {
        ctx.drawImage(this.videoElement, 0, 0, 64, 64);
        const imgData = ctx.getImageData(0, 0, 64, 64);
        let totalBrightness = 0;
        for (let i = 0; i < imgData.data.length; i += 4) {
          totalBrightness += (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        }
        const avgBrightness = totalBrightness / (64 * 64);

        if (avgBrightness < 15) { // Dark / covered camera
          this.blockedCounter++;
          if (this.blockedCounter >= 3 && !this.isBlocked) {
            this.isBlocked = true;
            if (this.onBlockedCallback) this.onBlockedCallback(true);
          }
        } else {
          this.blockedCounter = 0;
          if (this.isBlocked) {
            this.isBlocked = false;
            if (this.onBlockedCallback) this.onBlockedCallback(false);
          }
        }
      }
    } catch (e) {}
  }
}

export const faceMonitorService = new FaceMonitorService();
