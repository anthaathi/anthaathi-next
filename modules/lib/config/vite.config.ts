import * as path from 'path';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import * as process from 'process';

if (!process.env.VITE_APP_ROOT_PATH) {
  process.env.VITE_APP_ROOT_PATH = path.resolve('../../..');
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/public.ts'),
      name: 'Config',
      fileName: 'main',
    },
    rollupOptions: {
      external: ['fs', 'util', 'path'],
      output: {
        globals: (id) => id.split('/').join('_'),
      },
    },
  },
});
