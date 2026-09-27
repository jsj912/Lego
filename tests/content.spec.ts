import { expect, test } from "@playwright/test";
import { awards, builds, publications } from "../content/site";

test("every project, paper and award from content is on the page", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("#main").innerText();
  for (const b of builds) expect(text, b.title).toContain(b.title);
  for (const p of publications) expect(text, p.title).toContain(p.title);
  for (const a of awards) expect(text, a.title).toContain(a.title);
});

test("research papers are all 'In preparation' and nothing claims 'Published'", async ({ page }) => {
  await page.goto("/");
  const lab = (await page.locator("#lab").textContent()) ?? "";
  expect(lab.match(/In preparation/g)?.length).toBe(publications.length);
  const all = await page.locator("body").innerText();
  expect(all).not.toMatch(/\bPublished\b/);
});
