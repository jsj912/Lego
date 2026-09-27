import { expect, test } from "@playwright/test";
import { trackErrors } from "./helpers";

test("hero bubble is keyboard reachable and links to /off-the-clock", async ({ page }) => {
  await page.goto("/");
  const figure = page.getByRole("button", { name: "Joan as a brick-built minifigure" });
  await figure.focus();
  const bubble = page.locator("[data-offclock-link]");
  await expect(bubble).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(bubble).toBeFocused();
  await expect(bubble).toHaveAttribute("href", "/off-the-clock");
});

test("tapping the figure toggles the bubble", async ({ page }) => {
  await page.goto("/");
  const figure = page.getByRole("button", { name: "Joan as a brick-built minifigure" });
  await figure.click();
  await expect(figure).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-offclock-link]")).toBeVisible();
});

test("where-I've-built tiles show role and dates on focus", async ({ page }) => {
  await page.goto("/");
  const tiles = page.locator("[data-built-tile]");
  await expect(tiles).toHaveCount(4);
  await tiles.first().focus();
  await expect(tiles.first()).toContainText("Research Intern");
});

test("footer links to off the clock; the page is not in the nav", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-footer-offclock]")).toHaveAttribute("href", "/off-the-clock");
  await expect(page.locator('nav[aria-label="Primary"] a[href="/off-the-clock"]')).toHaveCount(0);
});

test("off the clock: shopfront opens its panel, Esc returns focus, back link works", async ({ page }) => {
  const errors = trackErrors(page);
  const res = await page.goto("/off-the-clock");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("Off the clock");
  await expect(page.locator("[data-shopfront]")).toHaveCount(5);
  await expect(page.locator("[data-disclaimer]")).toBeVisible();

  const shop = page.locator('[data-shopfront="flowers"]');
  await shop.scrollIntoViewIfNeeded();
  await shop.focus();
  await page.keyboard.press("Enter");
  const panel = page.locator('[data-hobby-panel="flowers"]');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("I make bouquets.");
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(shop).toBeFocused();

  await expect(page.locator("[data-back-link]")).toHaveAttribute("href", "/");
  expect(errors).toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("figure does not bob and the street is not scroll-driven", async ({ page }) => {
    await page.goto("/");
    const anim = await page.locator(".figure-bob").evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("none");
    await page.goto("/off-the-clock");
    await expect(page.locator('[data-street-mode="scroll"]')).toHaveCount(0);
  });
});
