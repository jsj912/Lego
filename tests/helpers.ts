import type { Page } from "@playwright/test";

export const SECTION_IDS = ["start", "workshop", "builds", "lab", "journey", "stats", "trophies", "contact"];

/** Collect console errors and uncaught page errors. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

/** Wait until no page-turn animation is running. */
export async function waitForFlip(page: Page) {
  await page.waitForFunction(() => !document.querySelector("[data-leaf]"));
}
