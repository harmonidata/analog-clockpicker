<template>
  <div class="tw-clockpicker-vue relative inline-block">
    <!-- Input Trigger (when in dropdown or modal mode) -->
    <div v-if="mode !== 'inline'" class="relative">
      <input
        type="text"
        readonly
        :value="displayValue"
        class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono-num text-sm rounded-2xl px-4 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-indigo-400 transition"
        :placeholder="placeholder"
        @click="toggle"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    </div>

    <!-- Dropdown / Modal Backdrop -->
    <teleport to="body" :disabled="mode === 'inline' || mode === 'dropdown'">
      <div
        v-if="isOpen || mode === 'inline'"
        :class="containerClass"
        @click.self="onBackdropClick"
      >
        <!-- Popover / Dialog Card -->
        <div
          ref="cardRef"
          :class="cardClass"
          @click.stop
        >
          <!-- Notch Caret for dropdown -->
          <div
            v-if="mode === 'dropdown'"
            class="absolute -top-1.5 left-7 w-3 h-3 bg-indigo-50/80 dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700 rotate-45 z-10"
          ></div>

          <!-- Digital Header -->
          <div class="p-4 bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-800/70 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-1.5 font-mono-num font-bold select-none">
              <button
                type="button"
                :class="currentMode === 'hours' ? 'text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer' : 'text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer'"
                @click="transitionToMode('hours')"
              >
                {{ currentHours.toString().padStart(2, '0') }}
              </button>
              <span class="text-slate-400 text-2xl">:</span>
              <button
                type="button"
                :class="currentMode === 'minutes' ? 'text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer' : 'text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer'"
                @click="transitionToMode('minutes')"
              >
                {{ currentMinutes.toString().padStart(2, '0') }}
              </button>

              <div v-if="!is24Format" class="flex flex-col gap-1 ml-2">
                <button
                  type="button"
                  :class="currentPeriod === 'AM' ? 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer' : 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer'"
                  @click="setPeriod('AM')"
                >
                  AM
                </button>
                <button
                  type="button"
                  :class="currentPeriod === 'PM' ? 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer' : 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer'"
                  @click="setPeriod('PM')"
                >
                  PM
                </button>
              </div>
            </div>

            <button
              type="button"
              class="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 cursor-pointer transition"
              @click="toggleFormat"
            >
              {{ is24Format ? '24H' : '12H' }}
            </button>
          </div>

          <!-- Analog Dial -->
          <div class="p-4 flex flex-col items-center justify-center">
            <div
              ref="dialRef"
              class="relative rounded-full bg-slate-50 dark:bg-slate-800/80 border-4 border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center no-select cursor-pointer touch-none select-none"
              :style="{ width: `${dialSize}px`, height: `${dialSize}px` }"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
            >
              <!-- Center Pivot -->
              <div class="absolute z-30 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900 pointer-events-none"></div>

              <!-- SVG Needle -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none z-10" :viewBox="`0 0 ${dialSize} ${dialSize}`">
                <g ref="handGroupRef" :transform="`rotate(300, ${dialSize/2}, ${dialSize/2})`">
                  <line
                    ref="handLineRef"
                    :x1="dialSize/2"
                    :y1="dialSize/2"
                    :x2="dialSize/2"
                    :y2="dialSize/2 - 98"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-indigo-600 dark:text-indigo-500"
                  />
                  <circle
                    ref="handBubbleRef"
                    :cx="dialSize/2"
                    :cy="dialSize/2 - 98"
                    r="16"
                    class="fill-indigo-600 dark:fill-indigo-500 shadow-md"
                  />
                  <circle
                    ref="handDotRef"
                    :cx="dialSize/2"
                    :cy="dialSize/2 - 98"
                    r="2.5"
                    class="fill-white hidden"
                  />
                </g>
              </svg>

              <!-- Numbers Container -->
              <div ref="numbersRef" class="absolute inset-0 z-20 pointer-events-none dial-fade-enter"></div>
            </div>

            <p class="mt-2 text-[11px] text-slate-400 dark:text-slate-500 text-center select-none">
              {{ currentMode === 'hours' ? (is24Format ? 'Klik atau geser angka jam (00-23)' : 'Klik atau geser angka jam (1-12)') : 'Klik atau geser angka menit (00-59)' }}
            </p>
          </div>

          <!-- Presets -->
          <div v-if="presets && presets.length" class="px-4 pb-3 grid grid-cols-2 gap-1.5">
            <button
              v-for="(p, idx) in presets"
              :key="idx"
              type="button"
              class="text-left px-2.5 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 text-xs transition cursor-pointer"
              @click="animatePreset(p.hours, p.minutes, p.period)"
            >
              <span class="block font-medium text-slate-700 dark:text-slate-200 text-[11px]">{{ p.label }}</span>
              <span class="block text-[10px] text-slate-400 font-mono-num">{{ p.hours.toString().padStart(2, '0') }}:{{ p.minutes.toString().padStart(2, '0') }} {{ p.period }}</span>
            </button>
          </div>

          <!-- Footer Actions -->
          <div v-if="mode !== 'inline'" class="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button type="button" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer" @click="setNow">
              Sekarang
            </button>
            <div class="flex items-center gap-1.5">
              <button type="button" class="px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer" @click="close">
                Batal
              </button>
              <button type="button" class="px-3.5 py-1 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer" @click="apply">
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
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
import { renderDialNumbers } from '../ui/render.js';

const props = defineProps({
  modelValue: { type: String, default: '10:30 AM' },
  mode: { type: String, default: 'dropdown' }, // 'dropdown' | 'modal' | 'inline'
  format24: { type: Boolean, default: false },
  sound: { type: Boolean, default: true },
  autoAdvance: { type: Boolean, default: true },
  dialSize: { type: Number, default: 240 },
  placeholder: { type: String, default: 'Pilih waktu...' },
  presets: {
    type: Array,
    default: () => [
      { label: '🌅 Pagi Hari', hours: 7, minutes: 0, period: 'AM' },
      { label: '☀️ Siang / Istirahat', hours: 12, minutes: 30, period: 'PM' },
      { label: '🌇 Sore Pulang Kerja', hours: 5, minutes: 15, period: 'PM' },
      { label: '🌙 Malam Hari', hours: 9, minutes: 45, period: 'PM' }
    ]
  }
});

const emit = defineEmits(['update:modelValue', 'change', 'apply', 'open', 'close']);

const parsed = parseTimeString(props.modelValue);
const currentHours = ref(parsed.hours);
const currentMinutes = ref(parsed.minutes);
const currentPeriod = ref(parsed.period);
const is24Format = ref(props.format24);
const currentMode = ref('hours');
const isOpen = ref(props.mode === 'inline');

const dialRef = ref(null);
const handGroupRef = ref(null);
const handLineRef = ref(null);
const handBubbleRef = ref(null);
const handDotRef = ref(null);
const numbersRef = ref(null);
const cardRef = ref(null);

let animator = null;
let autoAdvanceTimer = null;
let presetTimer = null;

const displayValue = computed(() => {
  return is24Format.value
    ? formatTime24(currentHours.value, currentMinutes.value, currentPeriod.value, true)
    : formatTime12(currentHours.value, currentMinutes.value, currentPeriod.value);
});

const containerClass = computed(() => {
  if (props.mode === 'inline') return 'relative inline-block';
  if (props.mode === 'modal') return 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm';
  return 'absolute left-0 top-full mt-2 z-50';
});

const cardClass = computed(() => {
  const base = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden';
  if (props.mode === 'inline') return `${base} w-full max-w-sm p-4`;
  if (props.mode === 'modal') return `${base} w-full max-w-sm`;
  return `${base} w-full sm:w-[320px]`;
});

function initAnimator() {
  if (!handGroupRef.value || !handLineRef.value) return;
  animator = new ClockHandAnimator({
    handGroup: handGroupRef.value,
    handLine: handLineRef.value,
    handBubble: handBubbleRef.value,
    handDot: handDotRef.value
  }, { sound: props.sound });
  animator.center = props.dialSize / 2;
  syncDialNumbers();
  snapNeedle();
}

function syncDialNumbers() {
  if (!numbersRef.value) return;
  const val = currentMode.value === 'hours' ? currentHours.value : currentMinutes.value;
  renderDialNumbers(numbersRef.value, currentMode.value, is24Format.value, val, props.dialSize);
}

function snapNeedle() {
  if (!animator) return;
  if (currentMode.value === 'hours') {
    const { angle, length } = getHourParameters(currentHours.value, is24Format.value, props.dialSize);
    animator.snapTo(angle, length);
    if (handDotRef.value) handDotRef.value.classList.add('hidden');
  } else {
    const { angle, length, isBetween5 } = getMinuteParameters(currentMinutes.value, props.dialSize);
    animator.snapTo(angle, length);
    if (handDotRef.value) {
      if (isBetween5) handDotRef.value.classList.remove('hidden');
      else handDotRef.value.classList.add('hidden');
    }
  }
}

function transitionToMode(mode) {
  if (currentMode.value === mode) return;
  animator?.cancel();
  currentMode.value = mode;
  syncDialNumbers();

  if (mode === 'minutes') {
    const { angle, length } = getMinuteParameters(currentMinutes.value, props.dialSize);
    animator?.animateTo({
      targetAngle: angle,
      targetLength: length,
      duration: 280,
      clockwiseOnly: true
    });
  } else {
    const { angle, length } = getHourParameters(currentHours.value, is24Format.value, props.dialSize);
    animator?.animateTo({
      targetAngle: angle,
      targetLength: length,
      duration: 280,
      clockwiseOnly: true
    });
  }
}

function animatePreset(h, m, p) {
  animator?.cancel();
  clearTimeout(presetTimer);

  if (!is24Format.value && p) {
    currentPeriod.value = p;
  }

  const hourParams = getHourParameters(h, is24Format.value, props.dialSize);
  const minParams = getMinuteParameters(m, props.dialSize);

  currentMode.value = 'hours';
  syncDialNumbers();

  animator?.animateTo({
    targetAngle: hourParams.angle,
    targetLength: hourParams.length,
    duration: 360,
    clockwiseOnly: true,
    onComplete: () => {
      currentHours.value = h;
      emitChanges();

      presetTimer = setTimeout(() => {
        currentMode.value = 'minutes';
        syncDialNumbers();

        animator?.animateTo({
          targetAngle: minParams.angle,
          targetLength: minParams.length,
          duration: 360,
          clockwiseOnly: true,
          onComplete: () => {
            currentMinutes.value = m;
            emitChanges();
          }
        });
      }, 140);
    }
  });
}

function setNow() {
  const now = new Date();
  const currH = now.getHours();
  const currM = now.getMinutes();

  let targetH, targetP;
  if (is24Format.value) {
    targetH = currH;
    targetP = currH >= 12 ? 'PM' : 'AM';
  } else {
    targetP = currH >= 12 ? 'PM' : 'AM';
    targetH = currH % 12 === 0 ? 12 : currH % 12;
  }

  animatePreset(targetH, currM, targetP);
}

function setPeriod(p) {
  currentPeriod.value = p;
  emitChanges();
}

function toggleFormat() {
  is24Format.value = !is24Format.value;
  syncDialNumbers();
  snapNeedle();
  emitChanges();
}

// Pointer Events
let isPointerDown = false;
let hasDragged = false;
let startX = 0;
let startY = 0;

function onPointerDown(e) {
  isPointerDown = true;
  hasDragged = false;
  startX = e.clientX;
  startY = e.clientY;
  animator?.cancel();
  clearTimeout(autoAdvanceTimer);
  dialRef.value?.setPointerCapture(e.pointerId);
}

function onPointerMove(e) {
  if (!isPointerDown) return;
  const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
  if (!hasDragged && dist > 6) hasDragged = true;
  if (hasDragged) {
    const rect = dialRef.value.getBoundingClientRect();
    const { angleDeg, dist: dialDist } = getDialCoordinates(e.clientX, e.clientY, rect, props.dialSize);
    if (dialDist < 15) return;

    if (currentMode.value === 'hours') {
      const isInner = is24Format.value && dialDist < (props.dialSize / 2) * 0.6;
      const newHour = getHourFromAngle(angleDeg, is24Format.value, isInner);
      if (newHour !== currentHours.value) {
        currentHours.value = newHour;
        if (props.sound) playTick({ sound: true });
        snapNeedle();
        syncDialNumbers();
        emitChanges();
      }
    } else {
      const newMin = getMinuteFromAngle(angleDeg);
      if (newMin !== currentMinutes.value) {
        currentMinutes.value = newMin;
        if (props.sound) playTick({ sound: true });
        snapNeedle();
        syncDialNumbers();
        emitChanges();
      }
    }
  }
}

function onPointerUp(e) {
  if (!isPointerDown) return;
  isPointerDown = false;
  try { dialRef.value?.releasePointerCapture(e.pointerId); } catch (_) {}

  if (hasDragged) {
    if (currentMode.value === 'hours' && props.autoAdvance) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = setTimeout(() => {
        transitionToMode('minutes');
      }, 300);
    }
  } else {
    // Tap on dial
    const rect = dialRef.value.getBoundingClientRect();
    const { angleDeg, dist: dialDist } = getDialCoordinates(e.clientX, e.clientY, rect, props.dialSize);
    if (dialDist < 15) return;

    if (currentMode.value === 'hours') {
      const isInner = is24Format.value && dialDist < (props.dialSize / 2) * 0.6;
      const newHour = getHourFromAngle(angleDeg, is24Format.value, isInner);
      const { angle, length } = getHourParameters(newHour, is24Format.value, props.dialSize);

      animator?.animateTo({
        targetAngle: angle,
        targetLength: length,
        duration: 240,
        clockwiseOnly: false,
        onComplete: () => {
          currentHours.value = newHour;
          syncDialNumbers();
          emitChanges();
          if (props.autoAdvance) {
            clearTimeout(autoAdvanceTimer);
            autoAdvanceTimer = setTimeout(() => transitionToMode('minutes'), 280);
          }
        }
      });
    } else {
      const newMin = getMinuteFromAngle(angleDeg);
      const { angle, length } = getMinuteParameters(newMin, props.dialSize);
      animator?.animateTo({
        targetAngle: angle,
        targetLength: length,
        duration: 220,
        clockwiseOnly: false,
        onComplete: () => {
          currentMinutes.value = newMin;
          syncDialNumbers();
          emitChanges();
        }
      });
    }
  }
}

function emitChanges() {
  const val = displayValue.value;
  emit('update:modelValue', val);
  emit('change', {
    hours: currentHours.value,
    minutes: currentMinutes.value,
    period: currentPeriod.value,
    format24: is24Format.value,
    value: val,
    indo: getIndonesianTimeWord(currentHours.value, currentMinutes.value, currentPeriod.value, is24Format.value)
  });
}

function open() {
  isOpen.value = true;
  nextTick(() => {
    initAnimator();
  });
  emit('open');
}

function close() {
  if (props.mode === 'inline') return;
  isOpen.value = false;
  emit('close');
}

function toggle() {
  if (isOpen.value) close();
  else open();
}

function apply() {
  emit('apply', displayValue.value);
  close();
}

function onBackdropClick() {
  close();
}

onMounted(() => {
  if (props.mode === 'inline') {
    nextTick(initAnimator);
  }
});

onBeforeUnmount(() => {
  animator?.cancel();
  clearTimeout(autoAdvanceTimer);
  clearTimeout(presetTimer);
});
</script>
