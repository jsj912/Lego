import { expect, test } from "@playwright/test";
import { builds } from "../content/site";
import { trackErrors, waitForFlip } from "./helpers";

for (const b of builds) {
  test(`manual ${b.set} (${b.slug}): open → page to end → Esc → focus restored`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/#builds");
    const card = page.locator(`[data-set-card="${b.slug}"]`);
    await card.scrollIntoViewIfNeeded();
    await card.focus();
    await page.keyboard.press("Enter");

    const dialog = page.locator(`[data-manual-dialog="${b.slug}"]`);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(page).toHaveURL(new RegExp(`/builds/${b.slug}$`));

    const next = dialog.locator("[data-manual-next]");
    for (let i = 0; i < 20 && (await next.isEnabled()); i++) {
      await page.keyboard.press("ArrowRight");
      await waitForFlip(page);
    }
    await expect(next).toBeDisabled();
    await expect(dialog.locator("[data-page-indicator]")).toContainText(/\/ \d+$/);

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(/\/(#builds)?$/);
    await expect(card).toBeFocused();
    expect(errors).toEqual([]);
  });
}

test("every build route returns 200 and renders its manual", async ({ page, request }) => {
  for (const b of builds) {
    const res = await request.get(`/builds/${b.slug}`);
    expect(res.status(), b.slug).toBe(200);
  }
  await page.goto(`/builds/${builds[0].slug}`);
  await expect(page.locator("h1")).toHaveText(builds[0].title);
  await expect(page.locator("[data-booklet]")).toBeVisible();
});

test("manual pages turn with arrow keys on the standalone route", async ({ page }) => {
  await page.goto("/builds/amsdds");
  const indicator = page.locator("[data-page-indicator]");
  const before = await indicator.innerText();
  await page.keyboard.press("ArrowRight");
  await waitForFlip(page);
  await expect(indicator).not.toHaveText(before);
});
