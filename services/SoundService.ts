
class SoundService {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.enabled || !this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playClick() {
    this.playTone(600, 'sine', 0.1);
  }

  playSuccess() {
    this.playTone(800, 'triangle', 0.3);
    setTimeout(() => this.playTone(1200, 'triangle', 0.4), 100);
  }

  playLevelComplete() {
    this.playTone(523.25, 'square', 0.2, 0.05); // C5
    setTimeout(() => this.playTone(659.25, 'square', 0.2, 0.05), 150); // E5
    setTimeout(() => this.playTone(783.99, 'square', 0.4, 0.05), 300); // G5
  }

  playFinish() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'sine', 0.6, 0.1), i * 150);
    });
  }
}

export const soundService = new SoundService();
