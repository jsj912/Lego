# Joan Sara Joe · Portfolio

A brick-building-themed personal portfolio: experience on a factory conveyor, projects as boxed sets with page-turning instruction manuals, research drafted as blueprints, and a hidden "Off the clock" street of hobbies.

Built with **Next.js 16** (App Router, static), **React 19**, **Tailwind CSS 4**, **motion** for animation and **lucide-react** icons. Every brick, model and building is original SVG/CSS. Tested with **Playwright** and **axe-core**.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Check it

```bash
npm run verify
```

This runs, in order: `lint` → `typecheck` → `check:content` → `build` → `test:e2e`. The same command runs in GitHub Actions on every push and pull request (`.github/workflows/ci.yml`). A failed run uploads the Playwright report as an artifact.

- `check:content` (`scripts/check-content.mjs`) fails the build if UI code contains invented metrics, stray URLs, placeholder text, banned phrases, or the protected trademark outside the footer disclaimer.
- `node scripts/layout-audit.mjs` (needs a running server on port 3100) checks rail clearance, hero overlap, nav-jump headings and horizontal overflow at 375/1366/1440/1920px.
- `node scripts/screens.mjs` screenshots every section at 1440px and 390px into `.screens/`.

## How to update content

**Edit `content/site.ts` only.** Every fact on the site (name, roles, experience, projects, papers, awards, leadership, skills) lives there. Components render it and never hardcode facts. A `null` field or empty list simply hides that piece of UI.

- **Projects:** `builds[]`. The big cards are chosen by `featuredBuilds`, the rest appear as "More sets". Set numbers follow display order, and each build gets a manual at `/builds/<slug>`.
- **Skills:** `skills`. Stud counts are computed from the projects' `pieces` tags plus `skillAliases`.
- **"Where I've built" logos:** add `samsung`, `fidelity`, `bmsce` or `iitm` (`.svg`, `.png`, `.webp` or `.jpg`) to `public/logos/`. Without a logo, the tile shows the name.
- **Off the clock:** `content/offTheClock.ts` holds the books, blurbs, run stats and photo captions. Photos go in `public/interests/<folder>/`.
- **Résumé:** replace `public/resume.pdf`. The Résumé links hide themselves if the file is missing.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The production URL (used for metadata). Set it after the first deploy. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Optional. A Formspree/Web3Forms-style endpoint that accepts JSON `{ name, email, message }`. When unset, the contact form's submit button is a `mailto:` link. |

## Deploy (Vercel)

1. vercel.com → **Add New → Project** → import this repo. Next.js is detected automatically → **Deploy**.
2. After the first deploy: **Settings → Environment Variables** → set `NEXT_PUBLIC_SITE_URL` (and `NEXT_PUBLIC_FORM_ENDPOINT` if you use a form service) → **Redeploy**.
3. Every push to `main` deploys to production, and every pull request gets a preview URL.

## Hidden extras

- An unboxing intro plays once per browser session on the home page. It's skipped for reduced motion or when the URL has a `#hash`, and never blocks clicks.
- Five hidden studs are tucked into sections. Find them all for a surprise.
- Type `BUILD` anywhere outside a text field.
- The footer has one unfinished brick.
- Unknown URLs show a "BUILD INCOMPLETE" page.

All motion respects `prefers-reduced-motion`.

## Docs

- `DECISIONS.md`: choices made and why.
- `OPEN_QUESTIONS.md`: things that need the owner's input.

---

LEGO® is a trademark of the LEGO Group, which does not sponsor, authorize or endorse this site.
