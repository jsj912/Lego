import { expect, test } from "@playwright/test";
import { person } from "../content/site";

const escaped = person.email.replace(/[.+]/g, (m) => `\\${m}`);

test("contact form validates and falls back to a mailto link", async ({ page }) => {
  await page.goto("/#contact");
  const submit = page.locator("[data-testid='contact-submit']");
  await expect(submit).toHaveAttribute("href", new RegExp(`^mailto:${escaped}`));
  await submit.click();
  await expect(page.locator("[data-error='name']")).toBeVisible();
  await expect(page.locator("[data-error='email']")).toBeVisible();
  await expect(page.locator("[data-error='message']")).toBeVisible();
  await page.locator("#contact-name").fill("Ada");
  await page.locator("#contact-email").fill("ada@test.dev");
  await page.locator("#contact-message").fill("Hello there, looking forward to it.");
  await expect(page.locator("[data-error]")).toHaveCount(0);
  await expect(submit).toHaveAttribute("href", /body=Hello/);
});

test("copy email button is present", async ({ page }) => {
  await page.goto("/#contact");
  await expect(page.locator("[data-copy-email]")).toBeVisible();
});
