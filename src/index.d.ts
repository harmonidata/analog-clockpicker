export interface ClockTime {
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
  format24: boolean;
  time12: string;
  time24: string;
  timeIndo: string;
}

export interface ClockPickerPreset {
  label: string;
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
}

export interface ClockPickerOptions {
  mode?: 'dropdown' | 'modal' | 'inline';
  format24?: boolean;
  sound?: boolean;
  autoAdvance?: boolean;
  dialSize?: number;
  presets?: ClockPickerPreset[];
  initialTime?: string;
  onChange?: (time: ClockTime) => void;
  onApply?: (time: ClockTime) => void;
}

export declare class ClockPicker {
  constructor(target: string | HTMLElement, options?: ClockPickerOptions);
  open(): void;
  close(): void;
  toggle(): void;
  getTime(): ClockTime;
  setNow(): void;
  animatePreset(hours: number, minutes: number, period: 'AM' | 'PM'): void;
  transitionToMode(mode: 'hours' | 'minutes'): void;
  on(event: 'change' | 'open' | 'close', handler: (data: ClockTime) => void): this;
  destroy(): void;
}

export declare function createClockPicker(target: string | HTMLElement, options?: ClockPickerOptions): ClockPicker;

export declare function playTick(options?: { sound?: boolean; haptics?: boolean }): void;
export declare function formatTime12(hours: number, minutes: number, period: 'AM' | 'PM'): string;
export declare function formatTime24(hours: number, minutes: number, period?: string, is24Mode?: boolean): string;
export declare function parseTimeString(timeStr: string): { hours: number; minutes: number; period: 'AM' | 'PM'; format24: boolean };
export declare function getIndonesianTimeWord(hours: number, minutes: number, period: 'AM' | 'PM', is24?: boolean): string;
