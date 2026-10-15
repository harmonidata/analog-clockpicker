import { Ref, ComputedRef, DefineComponent, Plugin } from 'vue';
import { ClockTime, ClockPickerPreset } from '../index.d';

export interface UseClockPickerOptions {
  initialTime?: string;
  format24?: boolean;
}

export interface UseClockPickerReturn {
  hours: Ref<number>;
  minutes: Ref<number>;
  period: Ref<'AM' | 'PM'>;
  format24: Ref<boolean>;
  mode: Ref<'hours' | 'minutes'>;
  isOpen: Ref<boolean>;
  time12: ComputedRef<string>;
  time24: ComputedRef<string>;
  timeIndo: ComputedRef<string>;
  formattedTime: ComputedRef<string>;
  setTime(h: number, m: number, p?: 'AM' | 'PM'): void;
  setNow(): void;
  reset(defaultTime?: string): void;
  open(): void;
  close(): void;
  toggle(): void;
  setMode(mode: 'hours' | 'minutes'): void;
  togglePeriod(): void;
  toggleFormat(): void;
}

export declare function useClockPicker(options?: UseClockPickerOptions): UseClockPickerReturn;

export interface ClockPickerProps {
  modelValue?: string;
  mode?: 'dropdown' | 'modal' | 'inline';
  format24?: boolean;
  sound?: boolean;
  autoAdvance?: boolean;
  dialSize?: number;
  placeholder?: string;
  presets?: ClockPickerPreset[];
}

export declare const ClockPicker: DefineComponent<ClockPickerProps>;

declare const plugin: Plugin;
export default plugin;
