import { test, expect } from "@playwright/test";

test.describe("Offline banner", () => {
  test("offline warning message appears when there is no internet", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator("#offline-banner")
    ).toContainText(/currently offline/i, { timeout: 15_000 });
  });
});