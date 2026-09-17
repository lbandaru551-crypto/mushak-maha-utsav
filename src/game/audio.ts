// ============================================================
// AUDIO — Lightweight procedural sound effects via the Web Audio API.
// No external audio files needed; every sound is synthesized at runtime.
// A single AudioContext is lazily created on first user interaction
// (browsers block audio before a user gesture).
// ============================================================

let ctx: AudioContext | null = null;
let muted = false;

/** Lazily create the AudioContext (must be called from a user gesture). */
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function initAudio(): void {
  getCtx();
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

/**
 * Play a single tone with a given frequency, duration, and type.
 * All festival SFX are built from this primitive.
 */
function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  delay = 0,
): void {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const now = audio.currentTime + delay;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  // Envelope: quick attack, gentle decay
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + duration);
}

// ---- Named sound effects ----

export function sfxClick(): void {
  playTone(600, 0.08, 'sine', 0.1);
}

export function sfxCorrect(): void {
  playTone(523, 0.1, 'sine', 0.12);
  playTone(659, 0.1, 'sine', 0.1, 0.06);
  playTone(784, 0.15, 'sine', 0.1, 0.12);
}

export function sfxMistake(): void {
  playTone(200, 0.15, 'sawtooth', 0.08);
  playTone(150, 0.2, 'sawtooth', 0.06, 0.05);
}

export function sfxPerfect(): void {
  playTone(523, 0.1, 'sine', 0.12);
  playTone(659, 0.1, 'sine', 0.12, 0.08);
  playTone(784, 0.1, 'sine', 0.12, 0.16);
  playTone(1047, 0.2, 'sine', 0.14, 0.24);
}

export function sfxCombo(): void {
  playTone(880, 0.08, 'triangle', 0.1);
  playTone(1100, 0.1, 'triangle', 0.08, 0.05);
}

export function sfxDrum(): void {
  playTone(150, 0.12, 'sine', 0.18);
  playTone(80, 0.15, 'sine', 0.12, 0.01);
}

export function sfxComplete(): void {
  // Ascending arpeggio
  playTone(523, 0.12, 'sine', 0.12);
  playTone(659, 0.12, 'sine', 0.12, 0.1);
  playTone(784, 0.12, 'sine', 0.12, 0.2);
  playTone(1047, 0.3, 'sine', 0.14, 0.3);
}

export function sfxAarti(): void {
  // Calm bell-like tones for the finale
  playTone(440, 0.5, 'sine', 0.1);
  playTone(554, 0.5, 'sine', 0.08, 0.15);
  playTone(659, 0.8, 'sine', 0.1, 0.3);
}

export function sfxEco(): void {
  playTone(587, 0.1, 'sine', 0.1);
  playTone(880, 0.15, 'sine', 0.1, 0.08);
}
