import { defineConfig } from 'vite';
// @ts-ignore
import react from '@vitejs/plugin-react';
// @ts-ignore
import * as path from 'path';
import { VitePluginRadar } from 'vite-plugin-radar';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
    VitePluginRadar({
      gtm: {
        // @ts-ignore
        id: process.env.VITE_APP_GTM_ANALYTICS_ID,
      },
    }),
    // @ts-ignore
    process.env.NODE_ENV === 'production' &&
      sentryVitePlugin({
        // @ts-ignore
        org: process.env.SENTRY_ORG_NAME,
        // @ts-ignore
        project: process.env.SENTRY_PROJECT_NAME,
        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and need `project:releases` and `org:read` scopes
        // @ts-ignore
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
      }),
  ],
  resolve: {
    alias: {
      // @ts-ignore
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4491,
    strictPort: true,
  },
});
