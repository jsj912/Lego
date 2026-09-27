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
- **One isometric renderer (`components/ui/IsoStack.tsx`).** Several pieces share one 3D space, so stacked pieces sit exactly on each other's studs. It draws bricks, plates, tiles, round columns, beams with pin holes, and gears. Gears are drawn on a face's plane with an affine matrix and spin in that plane. `Brick isometric` is a single-item `IsoStack`.
- **Campus dioramas** on the education cards are generic brick buildings (a hall with a clock tower; a research block with a tower). They're original designs and are not presented as replicas of either campus.
- **Innovation Lab as a blueprint.** Line-art mode in `IsoStack` (white strokes, fills in the sheet colour so hidden lines are occluded), lettered callouts, a dimension line with no numbers, and an engineering title block. Research threads render as a parts list.
- **Models (`components/ui/models.ts`).** An original monument for the hero and seven generic box-art models. They're decorative and imply nothing about the builds. The style is inspired by technical construction sets, but no set is copied and no trademarked name is used.
- **Motion policy.** `MotionConfig reducedMotion="user"` at the root, `useMotionSafe()` in components (swaps `place` for a fade and the spring for an instant change), and a CSS `prefers-reduced-motion` block that stops every CSS animation.
- **Conveyor is one machine with belt tabs** (Joan picked this from four options). A drawn belt with rails, moving treads, rollers and legs runs out of the college building. Tabs switch between the Work / Projects & competitions / Campus & leadership belts. Each timeline entry has an explicit `lane` field in `content/site.ts`. Vertical scroll drives the ride (row translateX, tread position and roller rotation all come from one scroll progress value), and switching tabs replays the ride from the factory. Selecting a brick shows its details in a manifest card. Below 1024px it's a vertical belt. Nothing is pinned, and reduced motion shows everything already in place.
- **Brick Stats is a parts bin** (changed at Joan's request from stacked walls). Each category is a tub, and each skill is a brick whose **stud count = linked builds + 1**, the same mapping the spec used for wall height. No levels, no percentages. Linked builds show on hover and focus-within, and a tap pins them open (`aria-expanded`, Esc or an outside click closes).
- **Experience bullets** have no dedicated section in the spec. They appear in the Conveyor manifest when a work brick is selected, and the internship builds (001, 004) carry the same facts in their manuals.
- **Brand icons.** This lucide version ships no brand marks, so LinkedIn/GitHub use generic glyphs with text labels or `aria-label`s.
- **Trophy rotation is a slow ±22° sway**, not a full 360° turn. A flat SVG turned edge-on disappears.

## Signature features (Phase 5)
- **Manual URL: History API, not intercepting routes.** One document click listener on the home page intercepts any same-origin link to `/builds/[slug]`. The box lid lifts (~340ms), the manual opens as a dialog, and `history.pushState` sets `/builds/[slug]` (Next 16 integrates native pushState with its router). Back, Esc, the close button, or a backdrop click all close it via `history.back()`. A direct visit renders the standalone statically generated route with the same `Booklet` and `ManualPageView` components. This avoided parallel-route slot and back-navigation edge cases, and every build link on the page (Lab, Conveyor, Brick Stats, Trophy Shelf) gets the manual for free.
- **Focus return.** Focus goes back to the link that opened the manual. It's re-asserted for a few frames because Next's router runs its own hash scroll/focus after Back to `/#…`.
- **Booklet.** ≥1024px shows two-page spreads (the cover sits alone on the right, like a real book); below that it shows single pages. A page turn is one leaf with front and back faces, rotated with `rotateY` around the spine under CSS perspective, plus a moving shade gradient. Reduced motion turns it into a crossfade. The standalone route adds a "Read the whole manual as text" disclosure, so every page's text is in the HTML.
- **The manual overlay is lazy-loaded** with `next/dynamic` (`ssr: false`).
- **Progress tower.** Driven by the single `SectionProgressProvider` scroll source. Unplaced sections show as dashed slots that are still clickable. On completion a one-shot shimmer runs.
