/**
 * Vue 3 Adapter for @rsi-ibnusina/analog-clockpicker
 */

import ClockPicker from './ClockPicker.vue';
export { ClockPicker };
export { useClockPicker } from './useClockPicker.js';

export default {
  install(app) {
    app.component('ClockPicker', ClockPicker);
  }
};
