# Decisions

Choices made while building, and why.

## Tooling
- **Next.js 16.3 / React 19.2 / Tailwind 4 / motion 13.** Installed by `create-next-app@latest` and `npm install motion`. Tailwind 4 has no JS config; tokens live in `@theme` in `app/globals.css`.
- **`typecheck` = `next typegen && tsc --noEmit`.** Next 16's global route types (`PageProps`, `LayoutProps`) are generated into `.next/`. Without `typegen`, a clean checkout (CI) fails typecheck before the first build.
- **Scaffolded in `../portfolio-tmp` and moved in.** The folder name (`Lego`) isn't a valid npm package name. `package.json` name is `portfolio`.
- **`.gitattributes` forces LF** so Windows checkouts and CI see identical files.

## Content guard (`scripts/check-content.mjs`)
- **Comments are stripped before scanning.** The verbatim content block has a comment in `content/site.ts` that quotes a banned phrase, telling future editors not to use it. Comments never render, so they aren't content.
- **Metric regex ignores hex colours and identifiers.** `\d+(\.\d+)?\s?(%|mAP|F1)` flagged `#F2F1EC` as "2F1". It now requires the number not to follow a word character, `#` or `.`, and `mAP`/`F1` to end on a word boundary.
- **No percentages in TSX at all.** This keeps the metric rule strict. CSS percentages live in `globals.css` (CSS files are exempt from the metric rule, not from the others). Layout uses Tailwind fractions (`left-1/2`).
- `hooks/` is scanned as well as the four required folders.
- Built HTML is scanned for banned strings and the trademark word. The disclaimer string is defined once, in `components/sections/Footer.tsx`.

## Design
- **One isometric renderer (`components/ui/IsoStack.tsx`).** Several bricks share one 3D space, so stacked bricks sit exactly on each other's studs. `Brick isometric` is a single-item `IsoStack`.
- **Motion policy.** `MotionConfig reducedMotion="user"` at the root, `useMotionSafe()` in components (swaps `place` for a fade and the spring for an instant change), and a CSS `prefers-reduced-motion` block that stops every CSS animation.
- **Conveyor: no pinning.** The belt is a real horizontal scroll container, so keyboard focus and touch scrolling work. On ≥768px, vertical page scroll sets the belt's `scrollLeft`. Nothing intercepts the wheel. On mobile it's a vertical list.
- **Brick Stats disclosure.** Linked builds show on hover and focus-within (CSS), and a tap/click pins them open (`aria-expanded`). Skills with no links are plain text at height 1.
- **Experience bullets** have no dedicated section in the spec. They appear as "role details" on the matching Conveyor bricks, and the internship builds (001, 004) carry the same facts in their manuals.
- **Brand icons.** This lucide version ships no brand marks, so LinkedIn/GitHub use generic glyphs with text labels or `aria-label`s.
- **Trophy rotation is a slow ±22° sway**, not a full 360° turn. A flat SVG turned edge-on disappears.
