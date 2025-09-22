import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  timeout: 30000,
  expect: { timeout: 5000 },
  
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
  },

  projects: [
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },
    // {
    //   name: 'webkit',
    //   testDir: './tests/ui',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //   },
    // },
  ],
});
