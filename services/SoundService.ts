
class SoundService {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  private getCtx(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    return this.audioCtx!;
  }

  async resume() {
    const ctx = this.getCtx();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn("AudioContext resume failed:", e);
      }
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (val) this.resume();
  }

  getIsEnabled() {
    return this.enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.2, fadeOut: boolean = true) {
    if (!this.enabled) return;
    
    const ctx = this.getCtx();
    this.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    if (fadeOut) {
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playClick() {
    // Tiếng click gỗ nhẹ nhàng
    this.playTone(600, 'sine', 0.1, 0.15);
  }

  playIncorrect() {
    // Tiếng "thump" trầm khi chọn sai
    this.playTone(150, 'triangle', 0.3, 0.2);
    setTimeout(() => this.playTone(100, 'triangle', 0.3, 0.15), 50);
  }

  playSuccess() {
    // Tiếng "Ting Ting" vui tai đa âm
    this.playTone(600, 'sine', 0.3, 0.2);
    setTimeout(() => this.playTone(800, 'sine', 0.4, 0.2), 100);
    setTimeout(() => this.playTone(1200, 'sine', 0.5, 0.1), 200);
  }

  playLevelComplete() {
    // Giai điệu ngắn vui nhộn
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.15), i * 150);
    });
  }

  playFinish() {
    // Giai điệu chiến thắng hoành tráng
    const melody = [523, 523, 659, 783, 1046, 783, 1046];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.6, 0.1);
        this.playTone(freq * 1.5, 'sine', 0.4, 0.05);
      }, i * 150);
    });
  }
}

export const soundService = new SoundService();
