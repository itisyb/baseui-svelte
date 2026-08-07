import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const systemChromium = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find(existsSync);

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    colorScheme: 'dark',
    launchOptions: systemChromium
      ? { executablePath: systemChromium, args: ['--hide-scrollbars'] }
      : { args: ['--hide-scrollbars'] },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'desktop-dark',
      use: { viewport: { width: 1440, height: 1100 } },
    },
    {
      name: 'mobile-dark',
      use: { viewport: { width: 390, height: 844 }, colorScheme: 'dark', isMobile: true, hasTouch: true },
    },
  ],
});
