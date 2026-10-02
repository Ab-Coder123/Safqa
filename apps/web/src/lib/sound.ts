/**
 * Sound utility for UI feedback (Web Audio API Synthesizer)
 * Produces zero-latency, lightweight, and modern sound effects without requiring external audio files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
}

/**
 * Plays a pleasant, modern, subtle "pop/swoosh" tone when sending a chat message.
 * Inspired by Telegram & Apple iMessage send feedback.
 */
export function playMessageSentSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Primary ascending pop (soft sine wave)
    const primaryOsc = ctx.createOscillator();
    const primaryGain = ctx.createGain();

    primaryOsc.type = 'sine';
    primaryOsc.frequency.setValueAtTime(520, now);
    primaryOsc.frequency.exponentialRampToValueAtTime(940, now + 0.08);

    primaryGain.gain.setValueAtTime(0.14, now);
    primaryGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    primaryOsc.connect(primaryGain);
    primaryGain.connect(ctx.destination);

    primaryOsc.start(now);
    primaryOsc.stop(now + 0.12);

    // 2. Harmonic sparkle (gentle chime layer)
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();

    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(940, now + 0.03);
    sparkleOsc.frequency.exponentialRampToValueAtTime(1320, now + 0.14);

    sparkleGain.gain.setValueAtTime(0.08, now + 0.03);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);

    sparkleOsc.start(now + 0.03);
    sparkleOsc.stop(now + 0.16);
  } catch {
    // Fail gracefully if audio autoplay is restricted
  }
}
