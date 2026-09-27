import { expect, test } from "@playwright/test";

test("intro plays once per session and never hides the hero from the DOM", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Joan Sara Joe");
  await expect(page.locator("[data-intro]")).toBeVisible();
  await page.locator("[data-intro-skip]").click();
  await expect(page.locator("[data-intro]")).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(500);
  await expect(page.locator("[data-intro]")).toHaveCount(0);
});

test("intro is skipped when the URL has a hash", async ({ page }) => {
  await page.goto("/#builds");
  await page.waitForTimeout(500);
  await expect(page.locator("[data-intro]")).toHaveCount(0);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("intro never mounts and content is visible immediately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(600);
    await expect(page.locator("[data-intro]")).toHaveCount(0);
  });
});
