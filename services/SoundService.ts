
class SoundService {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;
  private synth = window.speechSynthesis;

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
    if (val) {
      this.resume();
      this.speak("Âm thanh đã bật", "vi-VN");
    } else {
      this.synth.cancel();
    }
  }

  getIsEnabled() {
    return this.enabled;
  }

  /**
   * Phát giọng nói (TTS)
   */
  speak(text: string, lang: 'vi-VN' | 'en-US' = 'vi-VN') {
    if (!this.enabled || !text) return;
    
    // Ngắt các câu đang nói dở để tránh chồng chéo
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Đọc chậm một chút cho bé dễ nghe
    utterance.pitch = 1.2; // Giọng cao hơn một chút cho thân thiện
    
    this.synth.speak(utterance);
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
    this.playTone(600, 'sine', 0.1, 0.1);
  }

  playIncorrect() {
    this.playTone(150, 'triangle', 0.3, 0.2);
    this.speak("Bé thử lại nhé", "vi-VN");
  }

  playSuccess(praise: string, isEnglish: boolean = false) {
    this.playTone(600, 'sine', 0.2, 0.15);
    setTimeout(() => this.playTone(900, 'sine', 0.3, 0.15), 100);
    // Đọc lời khen
    this.speak(praise, isEnglish ? 'en-US' : 'vi-VN');
  }

  playLevelComplete() {
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.1), i * 150);
    });
  }

  playFinish() {
    this.speak("Chúc mừng bé đã hoàn thành bài học!", "vi-VN");
    const melody = [523, 659, 783, 1046];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.5, 0.1), i * 200);
    });
  }
}

export const soundService = new SoundService();
