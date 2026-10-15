/**
 * Vue 3 Composable: useClockPicker
 */

import { ref, computed } from 'vue';
import {
  formatTime12,
  formatTime24,
  parseTimeString,
  getIndonesianTimeWord
} from '../core/i18n.js';

export function useClockPicker(options = {}) {
  const initial = parseTimeString(options.initialTime || '10:30 AM');

  const hours = ref(initial.hours);
  const minutes = ref(initial.minutes);
  const period = ref(initial.period);
  const format24 = ref(options.format24 ?? false);
  const mode = ref('hours'); // 'hours' | 'minutes'
  const isOpen = ref(false);

  const time12 = computed(() => formatTime12(hours.value, minutes.value, period.value));
  const time24 = computed(() => formatTime24(hours.value, minutes.value, period.value, format24.value));
  const timeIndo = computed(() => getIndonesianTimeWord(hours.value, minutes.value, period.value, format24.value));
  const formattedTime = computed(() => (format24.value ? time24.value : time12.value));

  function setTime(h, m, p = null) {
    hours.value = h;
    minutes.value = m;
    if (p) period.value = p;
  }

  function setNow() {
    const now = new Date();
    const currH = now.getHours();
    minutes.value = now.getMinutes();

    if (format24.value) {
      hours.value = currH;
    } else {
      period.value = currH >= 12 ? 'PM' : 'AM';
      hours.value = currH % 12 === 0 ? 12 : currH % 12;
    }
  }

  function reset(defaultTime = '10:30 AM') {
    const parsed = parseTimeString(defaultTime);
    hours.value = parsed.hours;
    minutes.value = parsed.minutes;
    period.value = parsed.period;
    mode.value = 'hours';
  }

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function setMode(newMode) {
    if (newMode === 'hours' || newMode === 'minutes') {
      mode.value = newMode;
    }
  }

  function togglePeriod() {
    period.value = period.value === 'AM' ? 'PM' : 'AM';
  }

  function toggleFormat() {
    format24.value = !format24.value;
  }

  return {
    hours,
    minutes,
    period,
    format24,
    mode,
    isOpen,
    time12,
    time24,
    timeIndo,
    formattedTime,
    setTime,
    setNow,
    reset,
    open,
    close,
    toggle,
    setMode,
    togglePeriod,
    toggleFormat
  };
}
