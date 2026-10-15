/**
 * Rotational Animation Engine for SVG Clock Hand
 */

import { easeOutCubic, normalizeAngle } from './math.js';
import { playTick } from './audio.js';

export class ClockHandAnimator {
  constructor(elements = {}, options = {}) {
    this.elements = elements; // { handGroup, handLine, handBubble, handDot }
    this.options = { sound: true, ...options };
    this.currentAngle = 300;
    this.currentLength = 98;
    this.center = 140;
    this.animId = null;
  }

  setElements(elements) {
    this.elements = { ...this.elements, ...elements };
  }

  cancel() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  /**
   * Sets needle position immediately without animation
   */
  snapTo(angle, length = 98) {
    this.cancel();
    this.currentAngle = normalizeAngle(angle);
    this.currentLength = length;
    this.renderNeedle(this.currentAngle, this.currentLength);
  }

  renderNeedle(angle, length) {
    const { handGroup, handLine, handBubble, handDot } = this.elements;
    if (!handGroup || !handLine) return;

    const y = this.center - length;
    handLine.setAttribute('y2', y);
    if (handBubble) handBubble.setAttribute('cy', y);
    if (handDot) handDot.setAttribute('cy', y);
    handGroup.setAttribute('transform', `rotate(${angle}, ${this.center}, ${this.center})`);
  }

  /**
   * Smoothly animates hand to targetAngle and targetLength
   */
  animateTo({
    targetAngle,
    targetLength = 98,
    duration = null,
    clockwiseOnly = true,
    onComplete = null
  }) {
    this.cancel();

    const { handGroup } = this.elements;
    if (handGroup) {
      handGroup.classList.remove('hand-transition');
    }

    const startNorm = normalizeAngle(this.currentAngle);
    const targetNorm = normalizeAngle(targetAngle);

    let delta;
    if (clockwiseOnly) {
      delta = targetNorm - startNorm;
      if (targetNorm === startNorm) {
        delta = 0;
      } else if (delta < 0) {
        delta += 360;
      }
    } else {
      delta = (targetNorm - startNorm + 540) % 360 - 180;
    }

    const startLen = this.currentLength;
    const deltaLen = targetLength - startLen;

    if (delta === 0 && deltaLen === 0) {
      this.currentAngle = targetNorm;
      this.currentLength = targetLength;
      this.renderNeedle(targetNorm, targetLength);
      if (onComplete) onComplete();
      return;
    }

    const step = Math.abs(delta) < 30 ? 6 : 30;
    let lastTickStep = Math.floor(startNorm / step);

    const animDuration = duration !== null
      ? duration
      : Math.max(260, Math.min(460, (Math.abs(delta) / 360) * 400 + 200));

    const startTime = performance.now();

    const frame = (now) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / animDuration);
      const progress = easeOutCubic(rawProgress);

      const curAngle = startNorm + delta * progress;
      const curLen = startLen + deltaLen * progress;
      const normAngle = normalizeAngle(curAngle);

      this.currentAngle = normAngle;
      this.currentLength = curLen;
      this.renderNeedle(normAngle, curLen);

      // Audio tick on interval crossing
      const currentStep = Math.floor(curAngle / step);
      if (currentStep !== lastTickStep) {
        if (this.options.sound) {
          playTick({ sound: true });
        }
        lastTickStep = currentStep;
      }

      if (rawProgress < 1) {
        this.animId = requestAnimationFrame(frame);
      } else {
        this.animId = null;
        this.currentAngle = targetNorm;
        this.currentLength = targetLength;
        this.renderNeedle(targetNorm, targetLength);
        if (onComplete) onComplete();
      }
    };

    this.animId = requestAnimationFrame(frame);
  }
}
