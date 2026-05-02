import { defineConfig, devices } from "@playwright/test";

/**
 * Base config for Raj Electronics Ledger (Netlify).
 * Keeping timeouts slightly higher than default - cold starts on
 * the Netlify edge took longer than expected during local testing.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? "https://rajdbg1971.netlify.app",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
