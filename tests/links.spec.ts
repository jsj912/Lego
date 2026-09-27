import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// every URL written in the content files
const allowed = new Set(
  ["content/site.ts", "content/offTheClock.ts"].flatMap((f) => readFileSync(f, "utf8").match(/https?:\/\/[^\s"'`]+/g) ?? []),
);

for (const path of ["/", "/off-the-clock", "/builds/smart-glasses"]) {
  test(`external links on ${path} all come from content`, async ({ page }) => {
    await page.goto(path);
    const hrefs = await page.locator("a[href^='http']").evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
    const stray = hrefs.filter((h) => !allowed.has(h) && !h.startsWith("http://localhost"));
    expect(stray).toEqual([]);
  });
}
