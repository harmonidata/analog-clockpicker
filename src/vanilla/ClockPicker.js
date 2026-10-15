/**
 * Vanilla JavaScript ClockPicker Component
 */

import { ClockHandAnimator } from '../core/animator.js';
import {
  getDialCoordinates,
  getHourFromAngle,
  getMinuteFromAngle,
  getHourParameters,
  getMinuteParameters
} from '../core/math.js';
import {
  formatTime12,
  formatTime24,
  parseTimeString,
  getIndonesianTimeWord
} from '../core/i18n.js';
import { playTick } from '../core/audio.js';
import { renderDialNumbers, createDialElement } from '../ui/render.js';

const DEFAULT_PRESETS = [
  { label: '🌅 Pagi Hari', hours: 7, minutes: 0, period: 'AM' },
  { label: '☀️ Siang / Istirahat', hours: 12, minutes: 30, period: 'PM' },
  { label: '🌇 Sore Pulang Kerja', hours: 5, minutes: 15, period: 'PM' },
  { label: '🌙 Malam Hari', hours: 9, minutes: 45, period: 'PM' }
];

export class ClockPicker {
  constructor(target, options = {}) {
    this.target = typeof target === 'string' ? document.querySelector(target) : target;
    this.options = {
      mode: 'dropdown', // 'dropdown' | 'modal' | 'inline'
      format24: false,
      sound: true,
      autoAdvance: true,
      dialSize: 240,
      presets: DEFAULT_PRESETS,
      initialTime: null,
      onChange: null,
      onApply: null,
      ...options
    };

    const initial = parseTimeString(this.options.initialTime || (this.target && this.target.value) || '10:30 AM');
    this.state = {
      hours: initial.hours,
      minutes: initial.minutes,
      period: initial.period,
      mode: 'hours', // 'hours' | 'minutes'
      isOpen: false,
      isDragging: false,
      format24: this.options.format24
    };

    this.listeners = {};
    this.animator = null;
    this.elements = {};
    this.autoAdvanceTimer = null;
    this.presetTimer = null;

    this.init();
  }

  init() {
    this.buildUI();
    this.bindEvents();
    this.updateUI(false);
    this.syncTargetValue();
  }

  buildUI() {
    const isInline = this.options.mode === 'inline';
    const isModal = this.options.mode === 'modal';

    // Main Card Wrapper
    const card = document.createElement('div');
    card.className = isInline
      ? 'tw-clockpicker-card w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg'
      : isModal
        ? 'tw-clockpicker-card w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden'
        : 'tw-clockpicker-card absolute left-0 top-full mt-2 z-50 w-full sm:w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden hidden';

    this.elements.card = card;

    // Notch for dropdown
    if (this.options.mode === 'dropdown') {
      const notch = document.createElement('div');
      notch.className = 'absolute -top-1.5 left-7 w-3 h-3 bg-indigo-50/80 dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700 rotate-45 z-10';
      card.appendChild(notch);
    }

    // Header with Digital Display
    const header = document.createElement('div');
    header.className = 'p-4 bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-800/70 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between';

    const digitalGroup = document.createElement('div');
    digitalGroup.className = 'flex items-center gap-1.5 font-mono-num font-bold select-none';

    const hourBtn = document.createElement('button');
    hourBtn.type = 'button';
    hourBtn.className = 'text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer transition';
    hourBtn.textContent = '10';

    const colon = document.createElement('span');
    colon.className = 'text-slate-400 text-2xl';
    colon.textContent = ':';

    const minuteBtn = document.createElement('button');
    minuteBtn.type = 'button';
    minuteBtn.className = 'text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition';
    minuteBtn.textContent = '30';

    const ampmGroup = document.createElement('div');
    ampmGroup.className = 'flex flex-col gap-1 ml-2';

    const btnAM = document.createElement('button');
    btnAM.type = 'button';
    btnAM.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer';
    btnAM.textContent = 'AM';

    const btnPM = document.createElement('button');
    btnPM.type = 'button';
    btnPM.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer';
    btnPM.textContent = 'PM';

    ampmGroup.appendChild(btnAM);
    ampmGroup.appendChild(btnPM);

    digitalGroup.appendChild(hourBtn);
    digitalGroup.appendChild(colon);
    digitalGroup.appendChild(minuteBtn);
    digitalGroup.appendChild(ampmGroup);

    // Format 12/24 switcher button
    const formatBtn = document.createElement('button');
    formatBtn.type = 'button';
    formatBtn.className = 'text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 cursor-pointer';
    formatBtn.textContent = this.state.format24 ? '24H' : '12H';

    header.appendChild(digitalGroup);
    header.appendChild(formatBtn);
    card.appendChild(header);

    // Dial Container
    const dialSection = document.createElement('div');
    dialSection.className = 'p-4 flex flex-col items-center justify-center';

    const dialSize = this.options.dialSize || 240;
    const { dialWrapper, handGroup, handLine, handBubble, handDot, numbersContainer } = createDialElement(dialSize);

    dialSection.appendChild(dialWrapper);

    const modeText = document.createElement('p');
    modeText.className = 'mt-2 text-[11px] text-slate-400 dark:text-slate-500 text-center select-none';
    modeText.textContent = 'Klik atau geser angka jam';
    dialSection.appendChild(modeText);

    card.appendChild(dialSection);

    // Quick Presets (if provided)
    if (this.options.presets && this.options.presets.length > 0) {
      const presetsBox = document.createElement('div');
      presetsBox.className = 'px-4 pb-3 grid grid-cols-2 gap-1.5';

      this.options.presets.forEach(p => {
        const pBtn = document.createElement('button');
        pBtn.type = 'button';
        pBtn.className = 'text-left px-2.5 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 text-xs transition cursor-pointer';
        pBtn.innerHTML = `
          <span class="block font-medium text-slate-700 dark:text-slate-200 text-[11px]">${p.label}</span>
          <span class="block text-[10px] text-slate-400 font-mono-num">${p.hours.toString().padStart(2, '0')}:${p.minutes.toString().padStart(2, '0')} ${p.period}</span>
        `;
        pBtn.addEventListener('click', () => {
          this.animatePreset(p.hours, p.minutes, p.period);
        });
        presetsBox.appendChild(pBtn);
      });

      card.appendChild(presetsBox);
    }

    // Footer actions
    const footer = document.createElement('div');
    footer.className = 'px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs';

    const nowBtn = document.createElement('button');
    nowBtn.type = 'button';
    nowBtn.className = 'font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer';
    nowBtn.textContent = 'Sekarang';

    const btnActions = document.createElement('div');
    btnActions.className = 'flex items-center gap-1.5';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer';
    closeBtn.textContent = 'Batal';

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'px-3.5 py-1 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer';
    applyBtn.textContent = 'Terapkan';

    btnActions.appendChild(closeBtn);
    btnActions.appendChild(applyBtn);

    footer.appendChild(nowBtn);
    footer.appendChild(btnActions);
    card.appendChild(footer);

    // Save elements reference
    this.elements = {
      ...this.elements,
      hourBtn,
      minuteBtn,
      ampmGroup,
      btnAM,
      btnPM,
      formatBtn,
      dialWrapper,
      handGroup,
      handLine,
      handBubble,
      handDot,
      numbersContainer,
      modeText,
      nowBtn,
      closeBtn,
      applyBtn
    };

    // Initialize Animator
    this.animator = new ClockHandAnimator({
      handGroup,
      handLine,
      handBubble,
      handDot
    }, { sound: this.options.sound });
    this.animator.center = dialSize / 2;

    // Attach to DOM
    if (isInline) {
      this.target.appendChild(card);
    } else if (isModal) {
      const backdrop = document.createElement('div');
      backdrop.className = 'tw-clockpicker-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-200';
      backdrop.appendChild(card);
      document.body.appendChild(backdrop);
      this.elements.backdrop = backdrop;
    } else {
      // Dropdown Popover
      if (this.target && this.target.parentNode) {
        // Ensure relative wrapper
        if (getComputedStyle(this.target.parentNode).position === 'static') {
          this.target.parentNode.style.position = 'relative';
        }
        this.target.parentNode.appendChild(card);
      } else {
        document.body.appendChild(card);
      }
    }
  }

  bindEvents() {
    const { hourBtn, minuteBtn, btnAM, btnPM, formatBtn, dialWrapper, nowBtn, closeBtn, applyBtn } = this.elements;

    hourBtn.addEventListener('click', () => this.transitionToMode('hours'));
    minuteBtn.addEventListener('click', () => this.transitionToMode('minutes'));

    btnAM.addEventListener('click', () => {
      this.state.period = 'AM';
      this.updateUI(false);
      this.emitChange();
    });

    btnPM.addEventListener('click', () => {
      this.state.period = 'PM';
      this.updateUI(false);
      this.emitChange();
    });

    formatBtn.addEventListener('click', () => {
      this.state.format24 = !this.state.format24;
      formatBtn.textContent = this.state.format24 ? '24H' : '12H';
      this.updateUI(false);
      this.emitChange();
    });

    nowBtn.addEventListener('click', () => this.setNow());
    closeBtn.addEventListener('click', () => this.close());
    applyBtn.addEventListener('click', () => {
      this.syncTargetValue();
      if (typeof this.options.onApply === 'function') {
        this.options.onApply(this.getTime());
      }
      this.close();
    });

    // Pointer events on Dial
    let isPointerDown = false;
    let hasDragged = false;
    let startX = 0;
    let startY = 0;

    dialWrapper.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      this.animator.cancel();
      clearTimeout(this.autoAdvanceTimer);
      dialWrapper.setPointerCapture(e.pointerId);
    });

    dialWrapper.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const moveDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (!hasDragged && moveDist > 6) {
        hasDragged = true;
        this.state.isDragging = true;
      }
      if (hasDragged) {
        this.handlePointerDrag(e);
      }
    });

    const onPointerEnd = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      try { dialWrapper.releasePointerCapture(e.pointerId); } catch (_) {}

      if (hasDragged) {
        this.state.isDragging = false;
        this.updateUI(false);
        if (this.state.mode === 'hours' && this.options.autoAdvance) {
          clearTimeout(this.autoAdvanceTimer);
          this.autoAdvanceTimer = setTimeout(() => {
            this.transitionToMode('minutes');
          }, 300);
        }
      } else {
        this.handleDialTap(e);
      }
    };

    dialWrapper.addEventListener('pointerup', onPointerEnd);
    dialWrapper.addEventListener('pointercancel', onPointerEnd);

    // Target input clicks
    if (this.target && this.options.mode !== 'inline') {
      this.target.addEventListener('click', () => this.toggle());
    }

    // Click outside to close (dropdown)
    if (this.options.mode === 'dropdown') {
      document.addEventListener('click', (e) => {
        if (this.state.isOpen && !this.elements.card.contains(e.target) && e.target !== this.target) {
          this.close();
        }
      });
    }

    // Modal backdrop click
    if (this.options.mode === 'modal' && this.elements.backdrop) {
      this.elements.backdrop.addEventListener('click', (e) => {
        if (e.target === this.elements.backdrop) this.close();
      });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isOpen) {
        this.close();
      }
    });
  }

  handlePointerDrag(e) {
    const rect = this.elements.dialWrapper.getBoundingClientRect();
    const size = this.options.dialSize || 240;
    const { dist, angleDeg } = getDialCoordinates(e.clientX, e.clientY, rect, size);
    if (dist < 15) return;

    let changed = false;
    if (this.state.mode === 'hours') {
      const isInner = this.state.format24 && dist < (size / 2) * 0.6;
      const newHour = getHourFromAngle(angleDeg, this.state.format24, isInner);
      if (newHour !== this.state.hours) {
        this.state.hours = newHour;
        changed = true;
      }
    } else {
      const newMin = getMinuteFromAngle(angleDeg);
      if (newMin !== this.state.minutes) {
        this.state.minutes = newMin;
        changed = true;
      }
    }

    if (changed) {
      if (this.options.sound) playTick({ sound: true });
      this.updateUI(false);
      this.emitChange();
    }
  }

  handleDialTap(e) {
    const rect = this.elements.dialWrapper.getBoundingClientRect();
    const size = this.options.dialSize || 240;
    const { dist, angleDeg } = getDialCoordinates(e.clientX, e.clientY, rect, size);
    if (dist < 15) return;

    if (this.state.mode === 'hours') {
      const isInner = this.state.format24 && dist < (size / 2) * 0.6;
      const newHour = getHourFromAngle(angleDeg, this.state.format24, isInner);
      const { angle, length } = getHourParameters(newHour, this.state.format24, size);

      this.animator.animateTo({
        targetAngle: angle,
        targetLength: length,
        duration: 240,
        clockwiseOnly: false,
        onComplete: () => {
          this.state.hours = newHour;
          this.updateUI(false);
          this.emitChange();

          if (this.options.autoAdvance) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = setTimeout(() => {
              this.transitionToMode('minutes');
            }, 280);
          }
        }
      });
    } else {
      const newMin = getMinuteFromAngle(angleDeg);
      const { angle, length } = getMinuteParameters(newMin, size);

      this.animator.animateTo({
        targetAngle: angle,
        targetLength: length,
        duration: 220,
        clockwiseOnly: false,
        onComplete: () => {
          this.state.minutes = newMin;
          this.updateUI(false);
          this.emitChange();
        }
      });
    }
  }

  transitionToMode(newMode) {
    if (this.state.mode === newMode) return;
    this.animator.cancel();
    this.state.mode = newMode;
    const size = this.options.dialSize || 240;

    if (newMode === 'minutes') {
      const { angle, length } = getMinuteParameters(this.state.minutes, size);
      this.updateUI(true);
      this.animator.animateTo({
        targetAngle: angle,
        targetLength: length,
        duration: 280,
        clockwiseOnly: true,
        onComplete: () => this.updateUI(false)
      });
    } else {
      const { angle, length } = getHourParameters(this.state.hours, this.state.format24, size);
      this.updateUI(true);
      this.animator.animateTo({
        targetAngle: angle,
        targetLength: length,
        duration: 280,
        clockwiseOnly: true,
        onComplete: () => this.updateUI(false)
      });
    }
  }

  animatePreset(targetHour, targetMinute, targetPeriod) {
    this.animator.cancel();
    clearTimeout(this.presetTimer);

    if (!this.state.format24 && targetPeriod) {
      this.state.period = targetPeriod;
    }

    const size = this.options.dialSize || 240;
    const hourParams = getHourParameters(targetHour, this.state.format24, size);
    const minParams = getMinuteParameters(targetMinute, size);

    // Phase 1: Hours
    this.state.mode = 'hours';
    this.updateUI(true);

    this.animator.animateTo({
      targetAngle: hourParams.angle,
      targetLength: hourParams.length,
      duration: 360,
      clockwiseOnly: true,
      onComplete: () => {
        this.state.hours = targetHour;
        this.emitChange();

        // Phase 2: Minutes
        this.presetTimer = setTimeout(() => {
          this.state.mode = 'minutes';
          this.updateUI(true);

          this.animator.animateTo({
            targetAngle: minParams.angle,
            targetLength: minParams.length,
            duration: 360,
            clockwiseOnly: true,
            onComplete: () => {
              this.state.minutes = targetMinute;
              this.updateUI(false);
              this.syncTargetValue();
              this.emitChange();
            }
          });
        }, 140);
      }
    });
  }

  setNow() {
    const now = new Date();
    const currH = now.getHours();
    const currM = now.getMinutes();

    let targetH, targetP;
    if (this.state.format24) {
      targetH = currH;
      targetP = currH >= 12 ? 'PM' : 'AM';
    } else {
      targetP = currH >= 12 ? 'PM' : 'AM';
      targetH = currH % 12;
      if (targetH === 0) targetH = 12;
    }

    this.animatePreset(targetH, currM, targetP);
  }

  updateUI(skipNeedle = false) {
    const { hourBtn, minuteBtn, ampmGroup, btnAM, btnPM, numbersContainer, modeText, handDot } = this.elements;
    const size = this.options.dialSize || 240;

    hourBtn.textContent = this.state.hours.toString().padStart(2, '0');
    minuteBtn.textContent = this.state.minutes.toString().padStart(2, '0');

    if (this.state.format24) {
      ampmGroup.classList.add('hidden');
    } else {
      ampmGroup.classList.remove('hidden');
      if (this.state.period === 'AM') {
        btnAM.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer';
        btnPM.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer';
      } else {
        btnPM.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer';
        btnAM.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer';
      }
    }

    if (this.state.mode === 'hours') {
      hourBtn.className = 'text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer transition';
      minuteBtn.className = 'text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition';
      modeText.textContent = this.state.format24 ? 'Klik atau geser angka jam (00-23)' : 'Klik atau geser angka jam (1-12)';
    } else {
      minuteBtn.className = 'text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer transition';
      hourBtn.className = 'text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition';
      modeText.textContent = 'Klik atau geser angka menit (00-59)';
    }

    // Dial numbers
    const selectedVal = this.state.mode === 'hours' ? this.state.hours : this.state.minutes;
    renderDialNumbers(numbersContainer, this.state.mode, this.state.format24, selectedVal, size);

    if (!skipNeedle) {
      if (this.state.mode === 'hours') {
        const { angle, length } = getHourParameters(this.state.hours, this.state.format24, size);
        this.animator.snapTo(angle, length);
        if (handDot) handDot.classList.add('hidden');
      } else {
        const { angle, length, isBetween5 } = getMinuteParameters(this.state.minutes, size);
        this.animator.snapTo(angle, length);
        if (handDot) {
          if (isBetween5) handDot.classList.remove('hidden');
          else handDot.classList.add('hidden');
        }
      }
    }
  }

  syncTargetValue() {
    if (!this.target) return;
    const time = this.getTime();
    this.target.value = this.state.format24 ? time.time24 : time.time12;
  }

  getTime() {
    return {
      hours: this.state.hours,
      minutes: this.state.minutes,
      period: this.state.period,
      format24: this.state.format24,
      time12: formatTime12(this.state.hours, this.state.minutes, this.state.period),
      time24: formatTime24(this.state.hours, this.state.minutes, this.state.period, this.state.format24),
      timeIndo: getIndonesianTimeWord(this.state.hours, this.state.minutes, this.state.period, this.state.format24)
    };
  }

  open() {
    this.state.isOpen = true;
    if (this.options.mode === 'dropdown') {
      this.elements.card.classList.remove('hidden');
    } else if (this.options.mode === 'modal' && this.elements.backdrop) {
      this.elements.backdrop.classList.remove('opacity-0', 'pointer-events-none');
      this.elements.backdrop.classList.add('opacity-100');
    }
    this.updateUI(false);
    this.emit('open', this.getTime());
  }

  close() {
    this.state.isOpen = false;
    if (this.options.mode === 'dropdown') {
      this.elements.card.classList.add('hidden');
    } else if (this.options.mode === 'modal' && this.elements.backdrop) {
      this.elements.backdrop.classList.remove('opacity-100');
      this.elements.backdrop.classList.add('opacity-0', 'pointer-events-none');
    }
    this.emit('close', this.getTime());
  }

  toggle() {
    if (this.state.isOpen) this.close();
    else this.open();
  }

  emitChange() {
    const time = this.getTime();
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(time);
    }
    this.emit('change', time);
  }

  on(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
    return this;
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn(data));
    }
  }

  destroy() {
    this.animator.cancel();
    clearTimeout(this.autoAdvanceTimer);
    clearTimeout(this.presetTimer);
    if (this.elements.card && this.elements.card.parentNode) {
      this.elements.card.parentNode.removeChild(this.elements.card);
    }
    if (this.elements.backdrop && this.elements.backdrop.parentNode) {
      this.elements.backdrop.parentNode.removeChild(this.elements.backdrop);
    }
    this.listeners = {};
  }
}

export function createClockPicker(target, options) {
  return new ClockPicker(target, options);
}
