import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
  ],
	resolve: {
		alias: {
			// @ts-ignore
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 4446,
		strictPort: true,
	}
});
