import { defineConfig, devices } from '@playwright/test';

const defaultDatabaseUrl = 'postgresql://postgres:postgres@localhost:5432/todo';

export default defineConfig({
  testDir: './tests',
  // One shared DB + beforeEach cleanup: parallel workers can race and flake.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run dev -w backend',
      cwd: '..',
      url: 'http://localhost:3001/todos',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL ?? defaultDatabaseUrl,
      },
    },
    {
      command: 'npm run dev -w frontend',
      cwd: '..',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
