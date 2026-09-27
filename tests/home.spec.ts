import { expect, test } from "@playwright/test";
import { SECTION_IDS, trackErrors } from "./helpers";

test("home loads with one H1, all sections, and no errors", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Joan Sara Joe");
  for (const id of SECTION_IDS) await expect(page.locator(`section#${id}`)).toHaveCount(1);
  // scroll the whole page so lazy / in-view code runs
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});
