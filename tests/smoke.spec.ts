import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {

  test("homepage shows the app name", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /RAJ ELECTRONICS/i })
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      page.getByText(/(Raj Electronics Ledger|RAJ ELECTRONICS)/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("Refresh Data button and sync warning are visible on load", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: /Refresh Data/i })
    ).toBeVisible();

    await expect(
      page.getByText(/SYNC YOUR DATA/i).first()
    ).toBeVisible();
  });

  test("Total Sale and Total Due labels are shown on the page", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText(/Total Sale:/i).first()
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      page.getByText(/Total Due:/i).first()
    ).toBeVisible();
  });

});