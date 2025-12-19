
class SoundService {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    this.resume();
  }

  async resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (val) this.init();
  }

  getIsEnabled() {
    return this.enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1, fadeOut: boolean = true) {
    if (!this.enabled || !this.audioCtx) return;
    
    this.resume(); // Đảm bảo context luôn active

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    if (fadeOut) {
      gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playClick() {
    // Tiếng click nhẹ, gọn
    this.playTone(800, 'sine', 0.05, 0.1);
  }

  playSuccess() {
    // Tiếng "Ting Ting" vui tai
    this.playTone(600, 'sine', 0.2, 0.1);
    setTimeout(() => this.playTone(900, 'sine', 0.3, 0.1), 80);
  }

  playLevelComplete() {
    // Giai điệu ngắn đi lên
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.08), i * 100);
    });
  }

  playFinish() {
    // Giai điệu chiến thắng hào hùng hơn
    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    arpeggio.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.5, 0.1);
        // Thêm một lớp âm thanh phụ cho dày tiếng
        this.playTone(freq * 1.005, 'triangle', 0.4, 0.03);
      }, i * 120);
    });
  }
}

export const soundService = new SoundService();
