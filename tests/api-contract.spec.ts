import { test, expect } from "@playwright/test";
import { loadJsonFixture } from "./helpers/load-fixture";

const METRICS_URL = "https://ledger-contract.test/metrics";

test.describe("API response handling", () => {

  test("dashboard shows correct teams, clients and due amount from API", async ({ page }) => {
    await page.route(METRICS_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: loadJsonFixture("dashboard-success.json"),
      });
    });

    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /></head>
        <body>
          <main>
            <p id="teams">Teams: —</p>
            <p id="clients">Clients: —</p>
            <p id="due">Total Due: —</p>
          </main>
          <script>
            fetch(${JSON.stringify(METRICS_URL)})
              .then((r) => r.json())
              .then((d) => {
                document.getElementById("teams").textContent = "Teams: " + d.teams;
                document.getElementById("clients").textContent = "Clients: " + d.clients;
                document.getElementById("due").textContent = "Total Due: ₹" + d.totalDue;
              });
          </script>
        </body>
      </html>
    `);

    await expect(page.locator("#teams")).toHaveText("Teams: 2");
    await expect(page.locator("#clients")).toHaveText("Clients: 5");
    await expect(page.locator("#due")).toHaveText("Total Due: ₹45000");
  });

  test("dashboard handles missing data without breaking", async ({ page }) => {
    await page.route(METRICS_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: loadJsonFixture("dashboard-partial-bug.json"),
      });
    });

    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /></head>
        <body>
          <main>
            <p id="teams">Teams: —</p>
            <p id="today">Today sales: —</p>
          </main>
          <script>
            fetch(${JSON.stringify(METRICS_URL)})
              .then((r) => r.json())
              .then((d) => {
                document.getElementById("teams").textContent = "Teams: " + d.teams;
                const raw = d.todaySales;
                document.getElementById("today").textContent =
                  "Today sales: " + (raw === undefined ? "n/a" : "₹" + raw);
              });
          </script>
        </body>
      </html>
    `);

    await expect(page.locator("#teams")).toHaveText("Teams: 1");
    await expect(page.locator("#today")).toHaveText("Today sales: n/a");
  });

  test("shows retry message when server returns too many requests error", async ({ page }) => {
    let hits = 0;
    await page.route(METRICS_URL, async (route) => {
      hits += 1;
      await route.fulfill({ status: 429, body: "slow down" });
    });

    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /></head>
        <body>
          <p id="status">loading</p>
          <script>
            fetch(${JSON.stringify(METRICS_URL)})
              .then(async (r) => {
                document.getElementById("status").textContent =
                  r.status === 429 ? "rate limited — retry later" : "ok";
              })
              .catch(() => {
                document.getElementById("status").textContent = "network busted";
              });
          </script>
        </body>
      </html>
    `);

    await expect(page.locator("#status")).toHaveText("rate limited — retry later");
    expect(hits).toBeGreaterThanOrEqual(1);
  });

});