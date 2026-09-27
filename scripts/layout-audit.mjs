#!/usr/bin/env node
// Layout audit: rail overlap, hero decoration overlap, nav-jump headings, conveyor offset.
// Needs a running server. Usage: node scripts/layout-audit.mjs [baseUrl]
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:3100";
const SIZES = [[375, 812], [1366, 768], [1440, 900], [1920, 1080]];
const b = await chromium.launch();
let problems = 0;
const errors = [];

for (const [w, h] of SIZES) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("console", (m) => m.type() === "error" && errors.push(`${w}: ${m.text()}`));
  p.on("pageerror", (e) => errors.push(`${w}: ${e}`));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });

  // 1. rail vs content
  const rail = await p.evaluate(() => {
    const r = document.querySelector("[data-tower]");
    if (!r || getComputedStyle(r).display === "none") return null;
    const b = r.getBoundingClientRect();
    return { right: b.right };
  });
  if (rail) {
    const minLeft = await p.evaluate(() => {
      const els = [...document.querySelectorAll("#main section h1, #main section h2, #main section h3, #main section p, #main section a, #main section button, #main section li, #main section article, body > footer a, body > footer p")];
      let min = Infinity, who = "";
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (el.closest("[data-tower]") || el.closest("[data-conveyor-machine]")) continue;
        if (r.left < min) { min = r.left; who = el.tagName + " " + (el.textContent || "").trim().slice(0, 30); }
      }
      return { min, who };
    });
    const ok = minLeft.min >= rail.right + 24;
    if (!ok) problems++;
    console.log(`${w}: rail right ${Math.round(rail.right)}px, nearest content left ${Math.round(minLeft.min)}px (${minLeft.who}) ${ok ? "OK" : "OVERLAP"}`);
  } else {
    console.log(`${w}: rail hidden`);
  }

  // 2. hero decorations vs content
  const deco = await p.evaluate(() => {
    const decos = [...document.querySelectorAll("[data-hero-deco] > span")].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0);
    const targets = [...document.querySelectorAll("#start h1, #start p, #start a, #start [data-built-tile], #start img[alt]")].map((e) => [e, e.getBoundingClientRect()]);
    const hits = [];
    for (const d of decos) for (const [e, t] of targets) {
      if (d.left < t.right && d.right > t.left && d.top < t.bottom && d.bottom > t.top) hits.push((e.textContent || e.getAttribute("alt") || e.tagName).trim().slice(0, 30));
    }
    return { count: decos.length, hits };
  });
  if (deco.hits.length) problems++;
  console.log(`${w}: hero decorations ${deco.count}, overlaps: ${deco.hits.length ? deco.hits.join(" | ") : "none"}`);

  // 3. nav jumps: heading fully below the sticky nav
  if (w >= 1024) {
    const ids = ["journey", "builds", "lab", "stats", "trophies", "workshop", "contact"];
    const bad = [];
    for (const id of ids) {
      await p.click(`nav[aria-label="Primary"] a[href="#${id}"]`);
      await p.waitForTimeout(250);
      const r = await p.evaluate((id) => {
        const nav = document.querySelector("body > header").getBoundingClientRect().bottom;
        const sec = document.getElementById(id);
        const eyebrow = sec.querySelector("header p") || sec.querySelector("h2");
        return { nav, top: eyebrow.getBoundingClientRect().top };
      }, id);
      if (r.top < r.nav) bad.push(`${id} (${Math.round(r.top)} < ${Math.round(r.nav)})`);
    }
    if (bad.length) problems++;
    console.log(`${w}: nav jumps ${bad.length ? "HIDDEN: " + bad.join(", ") : "all 7 headings visible"}`);

    // 4. conveyor: first brick clear of the building
    await p.evaluate(() => document.getElementById("journey").scrollIntoView());
    await p.waitForTimeout(200);
    await p.evaluate(() => window.scrollBy(0, 300));
    await p.waitForTimeout(500);
    const conv = await p.evaluate(() => {
      const m = document.querySelector("[data-conveyor-machine]");
      if (!m || getComputedStyle(m).display === "none") return null;
      const bld = m.querySelector("svg").getBoundingClientRect();
      const first = m.querySelector("[data-timeline-item]").getBoundingClientRect();
      return { bldRight: bld.right, firstLeft: first.left };
    });
    if (conv) {
      const ok = conv.firstLeft >= conv.bldRight + 12;
      if (!ok) problems++;
      console.log(`${w}: conveyor building right ${Math.round(conv.bldRight)}, first brick left ${Math.round(conv.firstLeft)} ${ok ? "OK" : "OVERLAP"}`);
    }
  }

  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) problems++;
  console.log(`${w}: horizontal overflow ${overflow}`);
  await p.close();
}

// back link from /off-the-clock lands at the top of home
const p = await b.newPage({ viewport: { width: 1366, height: 768 } });
await p.goto(BASE + "/off-the-clock", { waitUntil: "networkidle" });
await p.click("[data-back-link]");
await p.waitForURL(BASE + "/");
await p.waitForTimeout(300);
const h1 = await p.evaluate(() => {
  const nav = document.querySelector("body > header").getBoundingClientRect().bottom;
  return { nav, top: document.querySelector("h1").getBoundingClientRect().top };
});
console.log(`back link: h1 top ${Math.round(h1.top)} vs nav ${Math.round(h1.nav)} ${h1.top >= h1.nav ? "OK" : "HIDDEN"}`);
if (h1.top < h1.nav) problems++;

console.log(`console/page errors: ${errors.length}`, errors);
console.log(problems ? `${problems} problem(s)` : "audit clean");
await b.close();
process.exit(problems || errors.length ? 1 : 0);
