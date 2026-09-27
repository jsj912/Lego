import { expect, test } from "@playwright/test";

test("unknown routes show BUILD INCOMPLETE with a 404 status", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("BUILD INCOMPLETE");
  await expect(page.locator("[data-house]")).toBeVisible();
  await expect(page.getByRole("link", { name: /back to the workshop/i })).toHaveAttribute("href", "/");
});
