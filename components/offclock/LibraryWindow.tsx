import type { Book } from "@/content/offTheClock";

// A candle-lit brick library seen through the shop window: floor-to-ceiling
// shelves of brick spines, a lit "Favourites" shelf with the books from the
// data file, candle sconces, ladders and stools. Decorative spines carry no titles.

const WARM = ["#7a2e1d", "#8c3b21", "#5b2a1a", "#a4552b", "#6b4f2a", "#3d4a2f", "#2f3b4f", "#7c5a2e", "#9b7b3e", "#4a2c2a", "#6e1f1f", "#35452c"];
const FAV = ["#8b1e1e", "#1e3a8a", "#14532d", "#5b21b6", "#9a3412", "#0f766e", "#831843", "#334155", "#713f12", "#155e75"];

/** Deterministic pseudo-random so the shelves look hand-filled but never change. */
const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function DecorShelf({ seed, h = 24 }: { seed: number; h?: number }) {
  return (
    <div className="relative" style={{ height: h }}>
      <div className="absolute inset-0 flex items-end gap-[1px] overflow-hidden px-[2px]">
        {Array.from({ length: 44 }, (_, i) => {
          const r = rnd(seed * 100 + i);
          if (r > 0.93) {
            // a short horizontal stack
            return (
              <span key={i} className="flex shrink-0 flex-col-reverse gap-[1px]">
                {[0, 1, 2].map((k) => (
                  <span key={k} className="block h-[3px] rounded-[1px]" style={{ width: 13 - k * 2, background: WARM[(i + k * 3) % WARM.length] }} />
                ))}
              </span>
            );
          }
          return (
            <span
              key={i}
              className="relative block shrink-0 rounded-t-[1px] shadow-[inset_-1px_0_0_rgba(0,0,0,0.35)]"
              style={{ width: 3 + Math.round(r * 3), height: h - 8 + Math.round(rnd(seed * 7 + i) * 6), background: WARM[Math.floor(r * WARM.length)] }}
            >
              <span className="absolute inset-x-0 top-[3px] h-px bg-[#d9b25a]/70" />
            </span>
          );
        })}
      </div>
      <div className="wood absolute inset-x-0 -bottom-[3px] h-[3px] shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
    </div>
  );
}

function Candle({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute ${className}`}>
      <span className="candle-glow absolute -left-5 -top-5 block h-12 w-12" />
      <span className="flame relative block h-[7px] w-[5px]" />
      <span className="mx-auto block h-[6px] w-[3px] bg-[#f3ead3]" />
      <span className="-ml-[2px] block h-[2px] w-[9px] rounded-sm bg-[#8a6a3a]" />
    </span>
  );
}

function Ladder({ className, h }: { className: string; h: number }) {
  return (
    <span aria-hidden className={`absolute block w-[12px] border-x-[2px] border-[#b0834e] ${className}`} style={{ height: h }}>
      {Array.from({ length: Math.floor(h / 9) }, (_, i) => (
        <span key={i} className="absolute inset-x-0 h-[1.5px] bg-[#b0834e]" style={{ top: 4 + i * 9 }} />
      ))}
    </span>
  );
}

export function LibraryWindow({ books, current }: { books: Book[]; current: string | null | undefined }) {
  return (
    <div className="library-stone relative h-full w-full overflow-hidden">
      {/* bookcase uprights */}
      <div aria-hidden className="wood-v pointer-events-none absolute inset-y-0 left-0 z-[2] w-[4px]" />
      <div aria-hidden className="wood-v pointer-events-none absolute inset-y-0 left-1/3 z-[2] w-[4px] -translate-x-1/2" />
      <div aria-hidden className="wood-v pointer-events-none absolute inset-y-0 left-2/3 z-[2] w-[4px] -translate-x-1/2" />
      <div aria-hidden className="wood-v pointer-events-none absolute inset-y-0 right-0 z-[2] w-[4px]" />

      {/* shelves */}
      <div className="absolute inset-x-[4px] top-[4px] flex flex-col gap-[5px]">
        <DecorShelf seed={1} />
        <DecorShelf seed={2} />

        {/* the favourites shelf, lit */}
        <div className="relative z-[3] h-[46px]">
          <div aria-hidden className="fav-glow absolute inset-0" />
          <div className="relative flex h-full items-end justify-center gap-[1.5px] px-1">
            {books.map((b, i) => (
              <span
                key={b.title}
                className="relative flex shrink-0 items-center justify-center rounded-t-[2px] shadow-[inset_-2px_0_0_rgba(0,0,0,0.3),inset_1px_0_0_rgba(255,255,255,0.15)]"
                style={{ width: 13, height: 36 + (i % 3) * 4, background: FAV[i % FAV.length] }}
                title={b.author ? `${b.title} · ${b.author}` : b.title}
              >
                <span aria-hidden className="absolute inset-x-0 top-[3px] h-px bg-[#e3c26b]" />
                <span aria-hidden className="absolute inset-x-0 bottom-[3px] h-px bg-[#e3c26b]" />
                <span className="max-h-[30px] overflow-hidden whitespace-nowrap text-[0.36rem] font-semibold leading-none text-white/90 [writing-mode:vertical-rl]">
                  {b.title}
                </span>
              </span>
            ))}
          </div>
          <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 rounded-[2px] bg-[#fbf3dc] px-1 py-px font-mono text-[0.38rem] font-bold uppercase tracking-[0.14em] text-[#5a3a23] shadow">
            Favourites
          </span>
          <div className="wood absolute inset-x-0 -bottom-[3px] h-[3px] shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
        </div>

        <DecorShelf seed={3} />
        <DecorShelf seed={4} />
      </div>

      {/* candles on the uprights */}
      <Candle className="left-1/3 top-[16px] z-[4] -ml-[2px]" />
      <Candle className="left-2/3 top-[44px] z-[4] -ml-[2px]" />
      <Candle className="left-[10px] top-[124px] z-[4]" />
      <Candle className="right-[12px] top-[18px] z-[4]" />

      {/* ladders */}
      <Ladder className="bottom-[10px] left-[46px] z-[4] rotate-[10deg]" h={112} />
      <Ladder className="bottom-[10px] right-[18px] z-[4] -rotate-[8deg]" h={96} />

      {/* carpet and stools */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-[3] h-[12px] bg-gradient-to-b from-[#4a1414] to-[#2b0b0b]" />
      {[30, 112, 170].map((l) => (
        <span key={l} aria-hidden className="absolute bottom-[4px] z-[4] block h-[7px] w-[12px]" style={{ left: l }}>
          <span className="wood block h-[3px] w-full rounded-[1px]" />
          <span className="absolute bottom-0 left-[1px] h-[4px] w-[2px] bg-[#54391f]" />
          <span className="absolute bottom-0 right-[1px] h-[4px] w-[2px] bg-[#54391f]" />
        </span>
      ))}

      {current && (
        <span className="absolute bottom-[14px] left-2 z-[5] rounded-[2px] bg-brick-yellow px-1.5 py-0.5 text-[0.5rem] font-semibold text-ink shadow">
          Reading: {current}
        </span>
      )}

      <span aria-hidden className="library-vignette pointer-events-none absolute inset-0 z-[5]" />
      <span aria-hidden className="window-glass pointer-events-none absolute inset-0 z-[6]" />
    </div>
  );
}
