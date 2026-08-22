/**
 * WebAudio Synthesizer & Procedural Sound Effects Engine for VisFlow VPL
 */

class AudioService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playTone(freq: number, durationMs: number = 200, type: OscillatorType = 'sine', volume: number = 0.2): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.getContext();
      if (!ctx || isNaN(freq) || freq <= 0) {
        resolve();
        return;
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);

      setTimeout(() => {
        resolve();
      }, durationMs);
    });
  }

  public playNote(noteStr: string, durationMs: number = 250, waveType: OscillatorType = 'triangle'): Promise<void> {
    const noteFrequencies: Record<string, number> = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
      C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99,
      G4: 392.0, 'G#4': 415.3, A4: 440.0, 'A#4': 466.16, B4: 493.88,
      C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99,
      G5: 783.99, 'G#5': 830.61, A5: 880.0, 'A#5': 932.33, B5: 987.77,
      C6: 1046.5,
    };

    const cleanNote = String(noteStr).trim().toUpperCase();
    const freq = noteFrequencies[cleanNote] || 440;
    return this.playTone(freq, durationMs, waveType);
  }

  public playSound(name: string): Promise<void> {
    const ctx = this.getContext();
    if (!ctx) return Promise.resolve();

    const norm = String(name).toLowerCase().trim();

    if (norm === 'coin') {
      return this.playTone(987.77, 80, 'square', 0.15).then(() =>
        this.playTone(1318.51, 200, 'square', 0.15)
      );
    }

    if (norm === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      return new Promise((res) => setTimeout(res, 150));
    }

    if (norm === 'jump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      return new Promise((res) => setTimeout(res, 150));
    }

    if (norm === 'win') {
      return this.playTone(523.25, 100, 'triangle')
        .then(() => this.playTone(659.25, 100, 'triangle'))
        .then(() => this.playTone(783.99, 100, 'triangle'))
        .then(() => this.playTone(1046.5, 300, 'triangle'));
    }

    if (norm === 'explosion') {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
      return new Promise((res) => setTimeout(res, 300));
    }

    if (norm === 'pop' || norm === 'snap') {
      return this.playTone(600, 40, 'sine', 0.15);
    }

    return this.playTone(440, 150, 'sine');
  }
}

export const audioService = new AudioService();
