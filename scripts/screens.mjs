#!/usr/bin/env node
// Screenshot every home section at 1440px and 390px into ./.screens/.
// Needs a running server: npm run build && npx next start -p 3100
// Usage: node scripts/screens.mjs [baseUrl]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3100";
const IDS = ["start", "workshop", "builds", "lab", "journey", "stats", "trophies", "contact"];
mkdirSync(".screens", { recursive: true });

const browser = await chromium.launch();
const errors = [];
const written = [];
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("console", (m) => m.type() === "error" && errors.push(`${w}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${w}: ${e}`));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  // scroll once so in-view animations settle
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.addStyleTag({ content: "[data-site-nav] { visibility: hidden !important; }" });
  for (const id of IDS) {
    const el = page.locator(`#${id}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const path = `.screens/${id}-${w}.png`;
    await el.screenshot({ path });
    written.push(path);
  }
  const path = `.screens/footer-${w}.png`;
  await page.locator("[data-site-footer]").screenshot({ path });
  written.push(path);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`${w}px horizontal overflow: ${overflow}`);
  await page.close();
}
await browser.close();
console.log(written.join("\n"));
console.log(`console/page errors: ${errors.length}`, errors);
process.exit(errors.length ? 1 : 0);
