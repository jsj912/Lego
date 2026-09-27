import { expect, test } from "@playwright/test";
import { SECTIONS } from "../lib/sections";

test("each nav link lands on its section, and the progress rail follows", async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1280, "desktop nav and rail only");
  await page.goto("/");
  for (const s of SECTIONS.filter((x) => x.id !== "start")) {
    await page.locator(`nav[aria-label="Primary"] a[href="#${s.id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${s.id}$`));
    await expect(page.locator(`[data-tower-brick="${s.id}"]`)).toHaveAttribute("aria-current", "true", { timeout: 5000 });
    const top = await page.locator(`#${s.id} h2`).first().evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThan(60);
  }
});
