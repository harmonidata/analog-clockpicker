/**
 * Core mathematical and trigonometric utilities for analog clock dial
 */

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

/**
 * Calculates clockwise angular delta from start to target.
 * Always sweeps forward in time.
 */
export function calculateClockwiseDelta(startAngle, targetAngle) {
  const startNorm = normalizeAngle(startAngle);
  const targetNorm = normalizeAngle(targetAngle);
  let delta = targetNorm - startNorm;
  if (targetNorm === startNorm) return 0;
  if (delta < 0) delta += 360;
  return delta;
}

/**
 * Calculates the shortest angular path (useful for direct taps on numbers).
 */
export function calculateShortestDelta(startAngle, targetAngle) {
  const startNorm = normalizeAngle(startAngle);
  const targetNorm = normalizeAngle(targetAngle);
  return (targetNorm - startNorm + 540) % 360 - 180;
}

/**
 * Converts mouse/touch event coordinates into dial-relative coordinates & angle.
 * 0 degrees = 12 o'clock, 90 degrees = 3 o'clock, etc.
 */
export function getDialCoordinates(clientX, clientY, dialRect, dialSize = 280) {
  const x = (clientX - dialRect.left) * (dialSize / dialRect.width);
  const y = (clientY - dialRect.top) * (dialSize / dialRect.height);
  const center = dialSize / 2;
  const dx = x - center;
  const dy = y - center;
  const dist = Math.hypot(dx, dy);

  let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (angleDeg < 0) angleDeg += 360;

  return { x, y, dx, dy, dist, angleDeg };
}

/**
 * Computes hour value from angle in degrees.
 */
export function getHourFromAngle(angleDeg, format24 = false, isInner = false) {
  const step = Math.round(angleDeg / 30) % 12;
  if (format24) {
    if (isInner) {
      return step === 0 ? 0 : step + 12;
    }
    return step === 0 ? 12 : step;
  }
  return step === 0 ? 12 : step;
}

/**
 * Computes minute value from angle in degrees (0..59).
 */
export function getMinuteFromAngle(angleDeg) {
  return Math.round(angleDeg / 6) % 60;
}

/**
 * Computes angle and needle length for a given hour.
 */
export function getHourParameters(hour, format24 = false, baseSize = 280) {
  const scale = baseSize / 280;
  const angle = (hour % 12) * 30;
  let length = 98 * scale;
  let isInner = false;

  if (format24) {
    if (hour === 0 || hour >= 13) {
      isInner = true;
      length = 68 * scale;
    } else {
      length = 104 * scale;
    }
  }

  return { angle, length, isInner };
}

/**
 * Computes angle and needle length for a given minute.
 */
export function getMinuteParameters(minute, baseSize = 280) {
  const scale = baseSize / 280;
  const angle = (minute % 60) * 6;
  const length = 98 * scale;
  const isBetween5 = minute % 5 !== 0;
  return { angle, length, isBetween5 };
}
