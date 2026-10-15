import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-dts',
      closeBundle() {
        if (!existsSync('dist')) mkdirSync('dist', { recursive: true });
        if (existsSync('src/index.d.ts')) {
          copyFileSync('src/index.d.ts', 'dist/index.d.ts');
        }
        if (existsSync('src/vue/index.d.ts')) {
          copyFileSync('src/vue/index.d.ts', 'dist/vue.d.ts');
        }
        if (existsSync('dist/analog-clockpicker.css')) {
          copyFileSync('dist/analog-clockpicker.css', 'dist/style.css');
        }
      }
    }
  ],
  build: {
    lib: {
      entry: {
        'analog-clockpicker': resolve(import.meta.dirname, 'src/index.js'),
        'vue': resolve(import.meta.dirname, 'src/vue/index.js')
      },
      name: 'AnalogClockPicker'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    }
  }
});
