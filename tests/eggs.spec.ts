import { expect, test } from "@playwright/test";

test("finding all five hidden studs builds the castle", async ({ page }) => {
  await page.goto("/");
  const studs = page.getByRole("button", { name: "Hidden stud" });
  await expect(studs).toHaveCount(5);
  for (let i = 0; i < 5; i++) {
    const s = studs.nth(i);
    await s.focus();
    await page.keyboard.press("Enter");
    await expect(s).toHaveAttribute("aria-pressed", "true");
  }
  await page.locator("[data-eggs-ready]").waitFor({ state: "attached" });
  await expect(page.locator("[data-castle-panel]")).toBeVisible();
});

test("typing BUILD rains bricks, then cleans up", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-eggs-ready]").waitFor({ state: "attached" });
  await page.keyboard.type("build");
  await expect(page.locator("[data-brick-rain]")).toBeAttached();
  await expect(page.locator("[data-brick-rain]")).toHaveCount(0, { timeout: 8000 });
});

test("typing BUILD inside the contact form does nothing", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-eggs-ready]").waitFor({ state: "attached" });
  await page.locator("#contact-message").fill("I want to BUILD things");
  await page.locator("#contact-message").press("End");
  await page.keyboard.type(" BUILD");
  await expect(page.locator("[data-brick-rain]")).toHaveCount(0);
});

test("the footer's unfinished brick can be placed", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-unfinished-brick]").click();
  await expect(page.locator("[data-egg-message]")).toHaveText("Every masterpiece starts with one brick.");
});
