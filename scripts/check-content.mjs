#!/usr/bin/env node
// Content guard. Fails (exit 1) when UI code invents facts, leaks links or
// metrics outside content/, or uses the protected trademark outside the one
// footer disclaimer. Run: npm run check:content
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SOURCE_DIRS = ["app", "components", "content", "lib", "hooks"];
const UI_DIRS = ["app", "components", "lib", "hooks"]; // metrics + links may not live here
const SOURCE_EXT = /\.(tsx?|mjs|jsx?|css)$/;
const BUILD_HTML_DIR = join(".next", "server", "app");

const DISCLAIMER =
  "LEGO® is a trademark of the LEGO Group, which does not sponsor, authorize or endorse this site.";

const BANNED = [
  "lorem",
  "ipsum",
  "TensorFlow",
  "John Doe",
  "coming soon",
  "example.com",
  "Published in",
  "Accepted at",
  "PhD",
  "graduate research",
  "years of experience",
  'href="#"',
];

// digits not inside hex colours or identifiers, e.g. "96%", "0.932 mAP", "0.788 F1"
const METRIC = /(?<![\w#.])\d+(\.\d+)?\s?(%|mAP\b|F1\b)/;
const ALLOWED_URL_PREFIXES = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://schema.org",
];

const errors = [];
const warnings = [];

function walk(dir, filter) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const name of readdirSync(abs)) {
    const rel = join(dir, name);
    const st = statSync(join(ROOT, rel));
    if (st.isDirectory()) out.push(...walk(rel, filter));
    else if (filter.test(name)) out.push(rel);
  }
  return out;
}

// Comments never render, so they are not content. Strip block comments and
// line comments (a `//` preceded by start-of-line or whitespace, which keeps
// `https://` inside strings intact).
function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function checkBannedAndMark(file, text) {
  const lower = text.toLowerCase();
  for (const word of BANNED) {
    const i = lower.indexOf(word.toLowerCase());
    if (i !== -1) errors.push(`${file}:${lineOf(text, i)} banned string "${word}"`);
  }
  const withoutDisclaimer = text.split(DISCLAIMER).join("");
  const m = /\blego/i.exec(withoutDisclaimer);
  if (m) errors.push(`${file} protected word "${m[0]}" outside the footer disclaimer`);
}

// 1–4: source files
let disclaimerCount = 0;
for (const dir of SOURCE_DIRS) {
  for (const file of walk(dir, SOURCE_EXT)) {
    const text = stripComments(readFileSync(join(ROOT, file), "utf8"));
    disclaimerCount += text.split(DISCLAIMER).length - 1;
    checkBannedAndMark(file, text);

    const inUi = UI_DIRS.some((d) => file === d || file.startsWith(d + sep));
    if (!inUi) continue;

    if (!file.endsWith(".css")) {
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        const m = METRIC.exec(line);
        if (m) errors.push(`${file}:${i + 1} metric "${m[0]}" outside content/`);
      });
    }

    for (const m of text.matchAll(/https:\/\/[^\s"'`)<>]+/g)) {
      if (!ALLOWED_URL_PREFIXES.some((p) => m[0].startsWith(p))) {
        errors.push(`${file}:${lineOf(text, m.index)} URL "${m[0]}" outside content/`);
      }
    }
  }
}
if (disclaimerCount > 1) {
  errors.push(`footer disclaimer defined ${disclaimerCount} times in source (expected 1)`);
}

// 1–2: built HTML, when present
const htmlFiles = walk(BUILD_HTML_DIR, /\.html$/);
for (const file of htmlFiles) {
  checkBannedAndMark(relative(ROOT, join(ROOT, file)), readFileSync(join(ROOT, file), "utf8"));
}

// 5: resume
if (!existsSync(join(ROOT, "public", "resume.pdf"))) {
  warnings.push("public/resume.pdf is missing, so the Download Blueprint button will be hidden");
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
const scanned = `${SOURCE_DIRS.join(", ")}${htmlFiles.length ? ` + ${htmlFiles.length} built HTML files` : ""}`;
if (errors.length) {
  console.error(`\ncheck:content failed with ${errors.length} error(s) (scanned ${scanned})`);
  process.exit(1);
}
console.log(`check:content passed (scanned ${scanned}; ${warnings.length} warning(s))`);
