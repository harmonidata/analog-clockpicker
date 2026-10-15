/**
 * Tactile Mechanical Audio & Haptic Feedback using Web Audio API
 */

let audioCtx = null;

export function playTick(options = {}) {
  const { sound = true, haptics = true } = options;

  // Haptic feedback for touch devices
  if (haptics && typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(6);
    } catch (_) {}
  }

  if (!sound || typeof window === 'undefined') return;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.018);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.018);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.018);
  } catch (_) {
    // Silently ignore audio playback restrictions (e.g. before initial user interaction)
  }
}
