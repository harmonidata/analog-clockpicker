/**
 * Vue 3 Adapter for @harmonidata/analog-clockpicker
 */

import ClockPicker from './ClockPicker.vue';
export { ClockPicker };
export { useClockPicker } from './useClockPicker.js';

export default {
  install(app) {
    app.component('ClockPicker', ClockPicker);
  }
};
