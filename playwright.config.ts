import { defineConfig } from '@playwright/test';
 
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 1, // run tests in parallel
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
});