import { ArrowUpRight } from "lucide-react";
import type { Build } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { Brick } from "@/components/ui/Brick";
import { BoxArt } from "@/components/sections/SetCard";
import { brickColorAt } from "@/lib/bricks";
import { KIND_COLOR, KIND_LABEL } from "@/lib/derive";
import { PAGE_TITLE, type ManualPage } from "./pages";

/** Generic exploded view: n-1 placed bricks, the n-th hovering above with a guide. */
function ExplodedView({ n }: { n: number }) {
  const placed = Math.min(n - 1, 4);
  return (
    <div aria-hidden className="relative flex h-64 flex-col items-center justify-end">
      <div className="mb-3 flex flex-col items-center">
        <Brick color={brickColorAt(n)} studs={{ w: 2, h: 2 }} size={26} isometric />
        <svg width="2" height="46" className="my-1 overflow-visible">
          <line x1="1" y1="0" x2="1" y2="46" stroke="#0055BF" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M-4 38 L1 46 L6 38" fill="none" stroke="#0055BF" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="flex flex-col-reverse items-center">
        {Array.from({ length: placed }, (_, i) => (
          <div key={i} className={i ? "-mb-[30px]" : ""}>
            <Brick color={brickColorAt(i)} studs={{ w: 2, h: 2 }} size={26} isometric />
          </div>
        ))}
      </div>
    </div>
  );
}

function PageLabel({ page, build }: { page: ManualPage; build: Build }) {
  return (
    <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-2">
      <span>SET {build.set}</span>
      <span>{PAGE_TITLE[page.kind]}</span>
    </div>
  );
}

/** One page of the instruction manual. Shared by the overlay and the standalone route. */
export function ManualPageView({ page, build, index }: { page: ManualPage; build: Build; index: number }) {
  const color = KIND_COLOR[build.kind];

  const body = (() => {
    switch (page.kind) {
      case "cover":
        return (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3">
              <Badge tone={color === "yellow" ? "yellow" : color}>{KIND_LABEL[build.kind]}</Badge>
              {build.when && <span className="font-mono text-xs text-ink-2">{build.when}</span>}
            </div>
            <p className="mt-8 font-mono text-sm font-semibold tracking-[0.2em] text-ink-2">INSTRUCTION MANUAL · SET {build.set}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.05] sm:text-5xl">{build.title}</h2>
            {build.context && <p className="mt-4 text-lg text-ink-2">{build.context}</p>}
            <div className="mt-auto pt-8">
              <BoxArt build={build} index={index} />
            </div>
          </div>
        );
      case "challenge":
        return (
          <div className="flex h-full flex-col justify-center">
            <p className="font-mono text-sm text-brick-red">!</p>
            <h2 className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-ink-2">The Challenge</h2>
            <p className="mt-6 font-display text-2xl font-medium leading-snug sm:text-3xl">{page.text}</p>
          </div>
        );
      case "pieces":
        return (
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Pieces Used</h2>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {page.pieces.map((p, i) => (
                <li key={p} className="flex items-center gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-ink/8">
                  <Brick color={brickColorAt(i)} studs={{ w: 1, h: 1 }} size={14} isometric className="shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-mono text-xs font-semibold text-ink-2">1x</span>
                    <span className="block text-sm leading-snug">{p}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "step":
        return (
          <div className="grid h-full gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-display text-7xl font-semibold leading-none text-brick-blue sm:text-8xl">{page.n}</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-2">
                Step {page.n} of {page.total}
              </p>
              <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">{page.step.title}</h2>
              <p className="mt-4 text-lg leading-relaxed">{page.step.body}</p>
            </div>
            <div className="hidden sm:block">
              <ExplodedView n={page.n} />
            </div>
          </div>
        );
      case "final":
        return (
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-2">Final Model</h2>
            <p className="mt-6 font-display text-2xl font-medium leading-snug sm:text-3xl">{page.outcome}</p>
            {page.finalModel && page.finalModel !== page.outcome && <p className="mt-6 text-lg leading-relaxed text-ink-2">{page.finalModel}</p>}
          </div>
        );
      case "lessons":
        return (
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Lessons Learned</h2>
            <ol className="mt-8 space-y-5">
              {page.lessons.map((l, i) => (
                <li key={l} className="flex gap-4">
                  <span className="font-mono text-sm font-semibold text-brick-red">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-lg leading-relaxed">{l}</p>
                </li>
              ))}
            </ol>
          </div>
        );
      case "back":
        return (
          <div className="flex h-full flex-col justify-center">
            {page.note && <p className="font-display text-xl leading-snug sm:text-2xl">{page.note}</p>}
            {page.links.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-3">
                {page.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-brick-blue"
                    >
                      {l.label} <ArrowUpRight size={15} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
    }
  })();

  return (
    <div className="relative flex h-full flex-col gap-6 overflow-y-auto rounded-[var(--radius-card)] bg-paper p-6 sm:p-10">
      <div className="bp-dots pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative">
        <PageLabel page={page} build={build} />
      </div>
      <div className="relative flex-1">{body}</div>
    </div>
  );
}
