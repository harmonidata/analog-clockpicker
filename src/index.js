/**
 * @harmonidata/analog-clockpicker
 * Analog Clock Picker with smooth rotational animation for Tailwind CSS
 */

import './style.css';

export { ClockPicker, createClockPicker } from './vanilla/ClockPicker.js';
export { ClockHandAnimator } from './core/animator.js';
export { playTick } from './core/audio.js';
export {
  easeOutCubic,
  normalizeAngle,
  calculateClockwiseDelta,
  calculateShortestDelta,
  getDialCoordinates,
  getHourFromAngle,
  getMinuteFromAngle,
  getHourParameters,
  getMinuteParameters
} from './core/math.js';
export {
  formatTime12,
  formatTime24,
  parseTimeString,
  getIndonesianTimeWord
} from './core/i18n.js';
export { renderDialNumbers, createDialElement } from './ui/render.js';
