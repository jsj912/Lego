import { ArrowUpRight } from "lucide-react";
import type { Build, DocLink, Figure } from "@/content/types";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { BUILD_MODELS, boxModel } from "@/components/ui/models";
import { BoxArt } from "@/components/sections/SetCard";
import { cn } from "@/lib/cn";
import { KIND_COLOR, KIND_LABEL } from "@/lib/derive";
import { PAGE_TITLE, type ManualPage } from "./pages";

const LIFT = 7; // plates the incoming sub-assembly hovers above its spot

type Gear = Extract<IsoItem, { kind: "gear" }>;
const isGear = (i: IsoItem): i is Gear => i.kind === "gear";

/**
 * Split a model into a base (the ground plate, already down when building starts)
 * and `total` bottom-up sub-assemblies; gears go with the last one.
 */
function subAssemblies(model: IsoItem[], total: number): { base: IsoItem[]; groups: IsoItem[][] } {
  const raw = (i: IsoItem) => i as unknown as { z?: number; kind?: string };
  const zOf = (i: IsoItem) => raw(i).z ?? 0;
  const solids = model.filter((i) => !isGear(i)).sort((a, b) => zOf(a) - zOf(b));
  const first = solids[0];
  const hasBase = first && zOf(first) === 0 && (raw(first).kind === "plate" || raw(first).kind === "disc");
  const base = hasBase ? [first] : [];
  const rest = hasBase ? solids.slice(1) : solids;
  const gears = model.filter(isGear);
  // spread pieces as evenly as possible so every step adds something
  const baseSize = Math.floor(rest.length / total);
  const extra = rest.length % total;
  const groups: IsoItem[][] = [];
  let at = 0;
  for (let k = 0; k < total; k++) {
    const size = baseSize + (k < extra ? 1 : 0);
    groups.push(rest.slice(at, at + size));
    at += size;
  }
  groups[total - 1] = [...groups[total - 1], ...gears];
  return { base, groups };
}


function lift(item: IsoItem): IsoItem {
  if (isGear(item)) return { ...item, cz: item.cz + LIFT * 0.4 };
  const z = (item as unknown as { z?: number }).z ?? 0;
  return { ...item, z: z + LIFT } as unknown as IsoItem;
}

function ghost(item: IsoItem): IsoItem | null {
  if (isGear(item)) return null;
  return { ...item, outline: true, decals: undefined } as unknown as IsoItem;
}

type Part = { key: string; name: string; color: string; count: number; icon: IsoItem; span: number };

/** Parts inventory of a model: identical pieces grouped and counted, like a real manual. */
function partsInventory(model: IsoItem[]): Part[] {
  const parts = new Map<string, Part>();
  for (const it of model) {
    let key: string;
    let name: string;
    let icon: IsoItem;
    let span = 1;
    if (isGear(it)) {
      key = `gear-${it.teeth ?? Math.round(it.radius * 10)}-${it.color}`;
      name = `${it.teeth ?? Math.max(8, Math.round(it.radius * 10))}-tooth gear`;
      icon = { ...it, face: "front" as const, at: 0, cx: it.radius, cz: it.radius, spin: false, ratio: undefined };
    } else {
      const raw = it as unknown as { kind?: string; w?: number; h?: number; d?: number; color: string };
      const kind = raw.kind ?? "brick";
      const a = kind === "round" ? 1 : kind === "disc" ? (raw.d ?? 1) : Math.min(raw.w ?? 1, raw.h ?? 1);
      const b = kind === "round" ? 1 : kind === "disc" ? (raw.d ?? 1) : Math.max(raw.w ?? 1, raw.h ?? 1);
      key = `${kind}-${a}x${b}-${raw.color}`;
      span = b;
      name =
        kind === "round" ? "1×1 round" : kind === "disc" ? `${a}×${a} round plate` : kind === "beam" ? `${b}-hole beam` : `${a}×${b} ${kind}`;
      icon = { ...(it as object), x: 0, y: 0, z: 0, decals: undefined, outline: false } as unknown as IsoItem;
    }
    const color = (it as { color: string }).color;
    const existing = parts.get(key);
    if (existing) existing.count += 1;
    else parts.set(key, { key, name, color, count: 1, icon, span });
  }
  return [...parts.values()].sort((p, q) => q.count - p.count);
}

/**
 * Instruction-manual exploded view that builds the set's own model: everything
 * from earlier steps is placed, this step's pieces hover above a dashed outline
 * of where they go. The last step completes the Final Model.
 */
function ExplodedView({ build, index, n, total }: { build: Build; index: number; n: number; total: number }) {
  const model = BUILD_MODELS[build.slug] ?? boxModel(index, KIND_COLOR[build.kind], "white");
  const { base, groups } = subAssemblies(model, total);
  const placed = [...base, ...groups.slice(0, n - 1).flat()];
  const incoming = groups[n - 1] ?? [];
  const items: IsoItem[] = [
    ...placed,
    ...(incoming.map(ghost).filter(Boolean) as IsoItem[]),
    ...incoming.map(lift),
  ];
  return (
    <div aria-hidden className="relative flex h-72 w-60 flex-col items-center justify-end">
      <span className="absolute right-0 top-2 rounded-md bg-white/80 px-2 py-1 font-mono text-[0.62rem] font-semibold text-ink-2 ring-1 ring-ink/10">
        {incoming.length} piece{incoming.length === 1 ? "" : "s"} this step
      </span>
      <IsoStack items={items} size={20} />
    </div>
  );
}

/** A figure that always fits its page: full width, natural aspect ratio, never overflowing. */
function FigureView({ figure }: { figure: Figure }) {
  return (
    <figure className="min-w-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full max-w-full rounded-lg bg-white ring-1 ring-ink/10"
      />
      {figure.caption && <figcaption className="mt-2 text-[0.85rem] leading-snug text-ink-2">{figure.caption}</figcaption>}
    </figure>
  );
}

/** Prominent link to a document, opened in a new tab. */
function DocButton({ link }: { link: DocLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-doc-link
      className="inline-flex w-fit items-center gap-2 rounded-full bg-brick-blue px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-brick-red"
    >
      <FileText size={16} aria-hidden /> {link.label}
    </a>
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
export function ManualPageView({ page, build, index, className }: { page: ManualPage; build: Build; index: number; className?: string }) {
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
      case "tldr":
        return (
          <div className="flex h-full flex-col gap-4 text-[0.95rem]">
            <h2 className="text-2xl font-semibold sm:text-3xl">TL;DR</h2>
            {page.problem && (
              <div>
                <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brick-red">Problem</p>
                <p className="mt-1 leading-snug">{page.problem}</p>
              </div>
            )}
            {page.approach.length > 0 && (
              <div>
                <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brick-blue">Approach</p>
                <ol className="mt-1 flex flex-wrap gap-x-2 gap-y-1 leading-snug">
                  {page.approach.map((a, i) => (
                    <li key={a} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden className="text-ink-2">→</span>}
                      {a}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div>
              <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brick-green">Result</p>
              <p className="mt-1 font-semibold leading-snug">{page.result}</p>
            </div>
            {page.ownership && <p className="leading-snug text-ink-2">{page.ownership}</p>}
            {page.writeup && <DocButton link={page.writeup} />}
            <div>
              <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-2">Stack</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {page.stack.map((p) => (
                  <li key={p} className="rounded-md bg-white px-2 py-0.5 font-mono text-[0.74rem] ring-1 ring-ink/10">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            {page.links.length > 0 && (
              <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                {page.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white hover:bg-brick-blue">
                      {l.label} <ArrowUpRight size={14} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
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
      case "pieces": {
        const model = BUILD_MODELS[build.slug] ?? boxModel(index, KIND_COLOR[build.kind], "white");
        const inventory = partsInventory(model);
        const total = inventory.reduce((n, p) => n + p.count, 0);
        return (
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-semibold sm:text-3xl">Pieces Used</h2>
              <p className="font-mono text-xs font-semibold text-ink-2">{total} pieces</p>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {inventory.map((p) => (
                <li key={p.key} className="flex items-center gap-3 rounded-xl bg-white/80 p-2.5 ring-1 ring-ink/8">
                  <span className="flex h-11 w-12 shrink-0 items-end justify-center">
                    <IsoStack items={[p.icon]} size={isGear(p.icon) ? 14 : p.span <= 2 ? 15 : p.span <= 4 ? 10 : 6} shadow={false} className="max-h-11 max-w-12 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block font-mono text-sm font-bold">{p.count}×</span>
                    <span className="block text-[0.8rem]">{p.name}</span>
                    <span className="block font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-2">{p.color}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-2">Built with</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {page.pieces.map((t) => (
                  <li key={t} className="rounded-md bg-white px-2 py-0.5 font-mono text-[0.72rem] ring-1 ring-ink/10">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
      case "step": {
        const st = page.step;
        const heading = (
          <>
            <p className="font-display text-7xl font-semibold leading-none text-brick-blue sm:text-8xl">{page.n}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-2">
              Step {page.n} of {page.total}
            </p>
            <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">{st.title}</h2>
          </>
        );
        if (st.figure) {
          return (
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>{heading}</div>
                {st.pieceCount !== undefined && (
                  <span className="mt-2 shrink-0 rounded-md bg-white/80 px-2 py-1 font-mono text-[0.62rem] font-semibold text-ink-2 ring-1 ring-ink/10">
                    {st.pieceCount} piece{st.pieceCount === 1 ? "" : "s"} this step
                  </span>
                )}
              </div>
              <p className="leading-relaxed">{st.body}</p>
              {st.sections?.map((sec) => (
                <div key={sec.heading}>
                  <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brick-blue">{sec.heading}</p>
                  <p className="mt-1 leading-relaxed">{sec.text}</p>
                </div>
              ))}
              <FigureView figure={st.figure} />
              {st.link && <DocButton link={st.link} />}
            </div>
          );
        }
        // the model is split across the steps that build it (figure steps don't add bricks)
        const modelSteps = build.steps.filter((x) => !x.figure).length;
        return (
          <div className="grid h-full gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              {heading}
              <p className="mt-4 text-lg leading-relaxed">{st.body}</p>
              {st.sections?.map((sec) => (
                <div key={sec.heading} className="mt-3">
                  <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brick-blue">{sec.heading}</p>
                  <p className="mt-1 leading-relaxed">{sec.text}</p>
                </div>
              ))}
              {st.link && (
                <div className="mt-4">
                  <DocButton link={st.link} />
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <ExplodedView build={build} index={index} n={page.n} total={modelSteps} />
            </div>
          </div>
        );
      }
      case "figures":
        return (
          <div className="flex min-w-0 flex-col gap-5">
            <h2 className="text-2xl font-semibold sm:text-3xl">{page.title}</h2>
            {page.figures.map((f) => (
              <FigureView key={f.src} figure={f} />
            ))}
          </div>
        );
      case "final":
        return (
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-2">Final Model</h2>
            <BoxArt build={build} index={index} size={16} className="my-4 h-40" />
            <p className="font-display text-2xl font-medium leading-snug sm:text-3xl">{page.outcome}</p>
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
    <div className={cn("relative flex h-full flex-col gap-6 overflow-y-auto bg-paper p-6 text-ink sm:p-10", className ?? "rounded-[var(--radius-card)]")}>
      <div className="bp-dots pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative">
        <PageLabel page={page} build={build} />
      </div>
      <div className="relative flex-1">{body}</div>
    </div>
  );
}
