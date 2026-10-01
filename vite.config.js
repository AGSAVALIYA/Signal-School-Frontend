import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'sslogo.png'],
      manifest: {
        name: 'Signal School',
        short_name: 'Signal School',
        description: 'Attendance, students and syllabus for Signal School teachers',
        theme_color: '#0b5f72',
        background_color: '#f4f7f7',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/logo192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,woff2,png,ico}'],
        runtimeCaching: [
          {
            // Lets a teacher reopen today's attendance sheet without network.
            urlPattern: ({ url }) => /\/api\/v1\/(today|me|attendance\/sections|sections|academic-years)/.test(url.pathname),
            handler: 'NetworkFirst',
            options: { cacheName: 'api-read', networkTimeoutSeconds: 5, expiration: { maxEntries: 200, maxAgeSeconds: 7 * 86400 } },
          },
        ],
      },
    }),
  ],
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000', '/files': 'http://localhost:3000' } },
  build: { chunkSizeWarningLimit: 600 },
  test: { environment: 'jsdom', setupFiles: './src/test/setup.js', globals: true },
});
