import type { Hobby } from "@/content/offTheClock";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { BrickBouquet } from "./BrickBouquet";
import { FlowerDisplay, HangingBasket } from "./FlowerDisplay";
import { LibraryWindow } from "./LibraryWindow";

export const HOBBY_COLOR: Record<Hobby["id"], BrickColor> = {
  books: "red",
  running: "blue",
  flowers: "green",
  scrapbook: "yellow",
  "build-table": "grey",
};

/** A tiny trail with a finish-line arch. Stats only from data. */
function Track({ stats }: { stats: Hobby["runStats"] }) {
  return (
    <div className="flex h-full flex-col justify-end">
      {stats && stats.length > 0 && (
        <dl className="mb-2 grid grid-cols-2 gap-1.5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-md bg-white/90 px-2 py-1 shadow-sm">
              <dt className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ink-2">{s.label}</dt>
              <dd className="text-[0.8rem] font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <svg viewBox="0 0 220 110" className="w-full" aria-hidden>
        <path d="M0 100 C 50 70, 80 105, 120 80 S 190 60, 220 72" fill="none" stroke="#c2703d" strokeWidth="14" strokeLinecap="round" />
        <path d="M0 100 C 50 70, 80 105, 120 80 S 190 60, 220 72" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="6 7" />
        {/* finish arch */}
        <rect x="150" y="18" width="7" height="58" rx="2" fill="#0055BF" />
        <rect x="203" y="14" width="7" height="58" rx="2" fill="#0055BF" />
        <rect x="146" y="10" width="68" height="16" rx="3" fill="#fff" stroke="#111" strokeWidth="1" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={148 + i * 8} y={i % 2 ? 12 : 18} width="8" height="6" fill="#111" />
        ))}
      </svg>
    </div>
  );
}

const TABLE: IsoItem[] = [
  { kind: "plate", color: "white", w: 5, h: 3, x: 0, y: 0, z: 3 },
  { kind: "round", color: "dark", x: 0, y: 0, z: 0, studs: false },
  { kind: "round", color: "dark", x: 4, y: 0, z: 0, studs: false },
  { kind: "round", color: "dark", x: 0, y: 2, z: 0, studs: false },
  { kind: "round", color: "dark", x: 4, y: 2, z: 0, studs: false },
  { color: "red", w: 2, h: 2, x: 0.5, y: 0.5, z: 4 },
  { color: "yellow", w: 2, h: 1, x: 0.5, y: 0.5, z: 7 },
  { kind: "tile", color: "blue", w: 2, h: 2, x: 2.7, y: 0.6, z: 4 },
];

function Display({ hobby }: { hobby: Hobby }) {
  switch (hobby.id) {
    case "books":
      return <LibraryWindow books={hobby.books ?? []} current={hobby.currentlyReading} />;
    case "running":
      return <Track stats={hobby.runStats} />;
    case "flowers":
      return (
        <div className="flex h-full items-end justify-center">
          <BrickBouquet className="h-full max-h-[170px] w-auto drop-shadow-[0_6px_6px_rgba(0,0,0,0.18)]" />
        </div>
      );
    case "scrapbook":
      return (
        <div className="flex h-full items-end justify-center">
          <div className="relative flex h-[120px] w-[190px] rotate-[-3deg] rounded-sm bg-[#fdf6e3] shadow-md">
            {[0, 1].map((p) => (
              <div key={p} className="relative m-2 flex-1 rounded-[2px] bg-white shadow-inner">
                <span className="washi absolute -left-2 -top-1.5 h-3 w-8 -rotate-[30deg]" />
                <span className="washi absolute -right-2 -top-1.5 h-3 w-8 rotate-[30deg]" />
                <div className="m-3 h-[60px] rounded-[2px] bg-[#e7e5dd]" />
              </div>
            ))}
            <span aria-hidden className="absolute inset-y-2 left-1/2 w-px bg-ink/15" />
          </div>
        </div>
      );
    case "build-table":
      return (
        <div className="flex h-full items-end justify-center">
          <IsoStack items={TABLE} size={18} />
        </div>
      );
  }
}

/** One shop on the street. The whole front is a button that opens the hobby's panel. */
export function Shopfront({ hobby, photoCount, onOpen }: { hobby: Hobby; photoCount: number; onOpen: (el: HTMLElement) => void }) {
  const shade = BRICK_SHADES[HOBBY_COLOR[hobby.id]];
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      data-shopfront={hobby.id}
      aria-label={`${hobby.title}: open`}
      className="group relative flex w-[330px] shrink-0 flex-col text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 sm:w-[360px]"
    >
      {/* roof + awning */}
      <div aria-hidden className="roof-studs h-2.5 px-2" style={{ ["--rs" as string]: shade.base }} />
      <div className="h-4 rounded-t-md" style={{ background: shade.dark }} />
      <div className="awning h-9" style={{ ["--aw" as string]: shade.base }} />
      {/* sign */}
      <div className="mx-4 -mt-1 rounded-md bg-surface-dark px-3 py-2 text-center shadow-md">
        <span className="font-display text-[0.95rem] font-semibold text-white">{hobby.title}</span>
      </div>
      {/* facade */}
      <div className="relative mt-2 flex flex-1 gap-3 rounded-b-md bg-[#efe7d6] p-4 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.06)]">
        <div className="brick-wall pointer-events-none absolute inset-0 rounded-b-md opacity-60" aria-hidden />
        {/* shop window */}
        <div
          className={
            hobby.id === "books"
              ? "relative h-[190px] flex-1 overflow-hidden rounded-b-md rounded-t-[80px] border-[6px]"
              : "relative h-[190px] flex-1 overflow-hidden rounded-md border-[6px] bg-gradient-to-b from-[#dbeafe] to-[#f8fafc] p-3"
          }
          style={{ borderColor: shade.dark }}
        >
          <Display hobby={hobby} />
        </div>
        {/* door */}
        <div className="relative flex w-16 flex-col justify-end">
          <div className="relative h-[150px] rounded-t-md border-[5px] bg-[#6b4f35]" style={{ borderColor: shade.dark }}>
            <span className="absolute right-1.5 top-1/2 h-2 w-2 rounded-full bg-brick-yellow" />
            <span className="absolute inset-x-1.5 top-2 h-8 rounded-sm bg-[#dbeafe]/70" />
            {hobby.id === "flowers" && (
              <span aria-hidden className="absolute left-1/2 top-12 -translate-x-1/2 rounded-[2px] bg-[#fbf3dc] px-1 py-0.5 font-mono text-[0.46rem] font-bold tracking-[0.12em] text-brick-red shadow">
                OPEN
              </span>
            )}
          </div>
        </div>
      </div>
      {hobby.id === "flowers" && (
        <>
          <HangingBasket className="pointer-events-none absolute left-2 top-[126px] z-[2] h-[58px] w-[44px]" />
          <FlowerDisplay className="pointer-events-none absolute inset-x-0 bottom-[38px] z-[2] w-full" />
        </>
      )}
      {/* sidewalk */}
      <div className="h-3 rounded-b bg-[#b8b3a7]" />
      <span className="mt-3 inline-flex items-center gap-1.5 self-center rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Step inside{photoCount > 0 ? ` · ${photoCount} photo${photoCount === 1 ? "" : "s"}` : ""}
      </span>
    </button>
  );
}
