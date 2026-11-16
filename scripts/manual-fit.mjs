#!/usr/bin/env node
// Manual fit audit: every page of every instruction manual must fit its page
// (no inner scrolling, no sideways overflow) at common screen sizes.
// Needs a running server. Usage: node scripts/manual-fit.mjs [baseUrl] [--shots]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3100";
const SHOTS = process.argv.includes("--shots");
const SIZES = [[1920, 1080], [1440, 900], [1366, 768], [390, 844]];
const SLUGS = ["moe-appliance-detection", "amsdds", "ringshield", "network-anomaly-detection", "smart-glasses", "homomorphic-iot"];

if (SHOTS) mkdirSync(".screens/manual", { recursive: true });
const b = await chromium.launch();
let problems = 0;

for (const [w, h] of SIZES) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/builds/${slug}`, { waitUntil: "networkidle" });
    for (let guard = 0; guard < 40; guard++) {
      await p.waitForTimeout(150);
      const state = await p.evaluate(() => {
        const book = document.querySelector("[data-booklet]");
        const pages = [...book.querySelectorAll("[data-manual-page]")].map((e) => ({
          kind: e.getAttribute("data-manual-page"),
          over: e.scrollHeight - e.clientHeight,
          wide: e.scrollWidth - e.clientWidth,
        }));
        return { pos: book.getAttribute("data-page-pos"), pages, last: document.querySelector("[data-manual-next]").disabled };
      });
      for (const pg of state.pages) {
        if (pg.over > 2 || pg.wide > 2) {
          problems++;
          console.log(`${w}x${h} ${slug} @${state.pos} ${pg.kind}: overflows by ${pg.over}px tall, ${pg.wide}px wide`);
        }
      }
      if (SHOTS) await p.screenshot({ path: `.screens/manual/${w}-${slug}-${String(state.pos).padStart(2, "0")}.png` });
      if (state.last) break;
      await p.click("[data-manual-next]");
    }
  }
  await p.close();
}
await b.close();
console.log(problems ? `\n${problems} page(s) do not fit` : "\nevery manual page fits");
process.exit(problems ? 1 : 0);
