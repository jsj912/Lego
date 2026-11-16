import { expect, test } from "@playwright/test";
import { trackErrors } from "./helpers";

test("free-build baseplate: place, undo, auto-build and clear", async ({ page }) => {
  const errors = trackErrors(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#playground");
  const count = page.locator("[data-plate-count]");
  await expect(count).toHaveText("5 bricks");

  // click a stud on the front edge (retry until the page has hydrated)
  await expect(async () => {
    await page.locator('[data-cell="1-8"] polygon').first().click({ force: true });
    await expect(count).toHaveText("6 bricks", { timeout: 1000 });
  }).toPass();

  // keyboard: Enter places on the cursor stud, Backspace takes it back
  const board = page.locator("[data-plate-board]");
  await board.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(count).toHaveText("7 bricks");
  await page.keyboard.press("Backspace");
  await expect(count).toHaveText("6 bricks");

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(count).toHaveText("5 bricks");

  await page.locator("[data-plate-auto]").click();
  await expect(count).not.toHaveText("5 bricks");

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(count).toHaveText("0 bricks");
  await expect(page.getByRole("button", { name: "Undo" })).toBeDisabled();
  expect(errors).toEqual([]);
});

test("cards below the fold snap in when scrolled to", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("#builds [data-reveal]").first();
  await expect(card).toHaveAttribute("data-reveal", "pending");
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-reveal", "done");
  await expect(card).toHaveCSS("opacity", "1");
});
