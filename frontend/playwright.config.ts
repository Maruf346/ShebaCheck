import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "5173";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  outputDir: "../.runtime/playwright-results",
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL,
    ...devices["Desktop Chrome"],
    channel: "chrome",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
