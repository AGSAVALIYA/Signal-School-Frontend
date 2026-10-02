import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// End-to-end tests run against a real API (seeded with `npm run db:seed` in Signal-School-Backend) and the Vite dev server.
const localChromium = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const launchOptions = existsSync(localChromium) && !process.env.PW_USE_BUNDLED ? { executablePath: localChromium } : {};

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  outputDir: 'e2e-results',
  use: { baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173', trace: 'retain-on-failure', launchOptions },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 5'], viewport: { width: 360, height: 740 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: process.env.E2E_BASE_URL ? undefined : { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true },
});
