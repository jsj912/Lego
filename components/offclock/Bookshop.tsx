// The inside of the library house: a small bookshop. Pendant lamps, a tall
// bookcase with a labelled shelf per section, a rolling ladder, and a reading
// nook where the shopkeeper says the blurb. Everything but the books, labels
// and blurb is decoration.

import type { ReactNode } from "react";
import type { Book, Hobby } from "@/content/offTheClock";
import { Villager, type VillagerLook } from "./Villagers";

const SPINES = ["#7f1d1d", "#1e3a8a", "#14532d", "#581c87", "#9a3412", "#0f766e", "#831843", "#334155", "#713f12", "#155e75"];
const PER_ROW = 5;

type Row = { label: string | null; books: Book[] };

/** Group the books by their `shelf`, in first-seen order, then split long shelves into rows. */
function shelve(books: Book[]): Row[] {
  const order: string[] = [];
  const groups = new Map<string, Book[]>();
  for (const b of books) {
    const key = b.shelf ?? "";
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(b);
  }
  const rows: Row[] = [];
  for (const key of order) {
    const list = groups.get(key)!;
    for (let i = 0; i < list.length; i += PER_ROW) rows.push({ label: i === 0 && key ? key : null, books: list.slice(i, i + PER_ROW) });
  }
  return rows;
}

// ───────── things that sit on the shelves ─────────

function Plant() {
  return (
    <svg viewBox="0 0 44 72" width={44} height={72}>
      <path d="M22 44 C6 40 4 22 10 12 C14 24 20 30 22 44 Z" fill="#3f8f4a" />
      <path d="M22 44 C38 40 42 20 34 8 C30 22 24 30 22 44 Z" fill="#57a85f" />
      <path d="M22 46 C18 30 20 14 22 2 C26 14 26 30 22 46 Z" fill="#2f7a3c" />
      <path d="M9 44 h26 l-4 26 h-18 Z" fill="#c46a3c" />
      <rect x={7} y={42} width={30} height={7} rx={2} fill="#dc8250" />
    </svg>
  );
}

function Globe() {
  return (
    <svg viewBox="0 0 52 70" width={52} height={70}>
      <path d="M26 6 A24 24 0 0 1 26 54" fill="none" stroke="#b8913a" strokeWidth={3} />
      <circle cx={24} cy={30} r={20} fill="#3b7fc4" />
      <path d="M12 22 q6 -8 13 -4 q2 6 -4 8 q-2 8 -8 4 Z M28 32 q8 -2 10 4 q-2 8 -8 8 q-4 -4 -2 -12 Z" fill="#6fb86a" />
      <ellipse cx={17} cy={22} rx={5} ry={7} fill="#ffffff" opacity={0.18} />
      <rect x={23} y={52} width={4} height={10} fill="#b8913a" />
      <rect x={12} y={62} width={26} height={7} rx={3} fill="#7a5230" />
    </svg>
  );
}

function FlatStack({ cat = false }: { cat?: boolean }) {
  return (
    <svg viewBox="0 0 70 78" width={70} height={78}>
      {cat && (
        <g>
          <path d="M52 34 q14 -2 12 -14" fill="none" stroke="#d98a3a" strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={34} cy={30} rx={22} ry={11} fill="#e89b45" />
          <circle cx={15} cy={25} r={10} fill="#e89b45" />
          <path d="M7 19 l2 -9 l6 6 Z M17 15 l6 -6 l1 9 Z" fill="#d98a3a" />
          <path d="M10 26 q2 2 4 0 M17 26 q2 2 4 0" fill="none" stroke="#4a2c12" strokeWidth={1.4} strokeLinecap="round" />
          <path d="M28 22 q4 4 0 9 M38 21 q4 5 0 10" fill="none" stroke="#d98a3a" strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )}
      {[
        [6, 40, 58, "#9a3412"],
        [2, 52, 64, "#155e75"],
        [8, 65, 56, "#581c87"],
      ].map(([x, y, w, fill], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height={12} rx={2} fill={fill as string} />
          <rect x={(x as number) + 6} y={y as number} width={3} height={12} fill="#e3c26b" />
          <rect x={(x as number) + (w as number) - 5} y={(y as number) + 2} width={4} height={8} rx={1} fill="#f6ead2" />
        </g>
      ))}
    </svg>
  );
}

function Lantern() {
  return (
    <svg viewBox="0 0 34 64" width={34} height={64}>
      <circle cx={17} cy={36} r={17} fill="#ffd97a" opacity={0.25} className="shop-flicker" />
      <path d="M11 10 q6 -10 12 0" fill="none" stroke="#2b2b2b" strokeWidth={2.5} />
      <rect x={8} y={10} width={18} height={6} rx={2} fill="#2b2b2b" />
      <rect x={9} y={16} width={16} height={38} fill="#ffe9a8" />
      <path d="M17 26 q7 10 0 20 q-7 -10 0 -20 Z" fill="#ff9a2e" className="shop-flicker" />
      <path d="M9 16 v38 M25 16 v38 M17 16 v6" stroke="#2b2b2b" strokeWidth={2.5} />
      <rect x={6} y={54} width={22} height={8} rx={2} fill="#2b2b2b" />
    </svg>
  );
}

function Hourglass() {
  return (
    <svg viewBox="0 0 30 56" width={30} height={56}>
      <rect x={2} y={2} width={26} height={6} rx={2} fill="#7a5230" />
      <rect x={2} y={48} width={26} height={6} rx={2} fill="#7a5230" />
      <path d="M6 8 h18 q0 14 -9 20 q-9 -6 -9 -20 Z M6 48 h18 q0 -14 -9 -20 q-9 6 -9 20 Z" fill="#dff1f4" opacity={0.85} />
      <path d="M9 12 h12 q-1 8 -6 12 q-5 -4 -6 -12 Z M8 48 h14 q-1 -6 -7 -9 q-6 3 -7 9 Z" fill="#e3c26b" />
    </svg>
  );
}

const DECOR: ReactNode[][] = [
  [<FlatStack key="s" />, <Plant key="p" />],
  [<Globe key="g" />, <Lantern key="l" />, <FlatStack key="c" cat />],
  [<Hourglass key="h" />, <Plant key="p" />, <Lantern key="l" />],
];

// ───────── fixtures ─────────

function PendantLamp() {
  return (
    <span className="relative flex flex-col items-center">
      <span className="h-6 w-[2px] bg-[#0f1f1e]" />
      <span className="h-4 w-10 rounded-t-full bg-[#d9b65a] shadow-[inset_0_-3px_0_rgb(0_0_0/0.2)]" />
      <span className="h-2 w-4 rounded-b-full bg-[#fff3c4]" />
      <span className="shop-glow shop-flicker pointer-events-none absolute left-1/2 top-6 h-40 w-40 -translate-x-1/2 rounded-full" />
    </span>
  );
}

function Ladder() {
  return (
    <svg viewBox="0 0 60 400" preserveAspectRatio="none" className="h-full w-full">
      <path d="M14 400 L26 6 M46 400 L52 6" stroke="#c98f5a" strokeWidth={6} strokeLinecap="round" />
      <path d="M14 400 L26 6" stroke="#8a5a3c" strokeWidth={2} transform="translate(3 0)" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 40 + i * 40;
        const t = y / 400;
        return <path key={i} d={`M${26 - 12 * t} ${y} L${52 - 6 * t} ${y}`} stroke="#b07a48" strokeWidth={5} strokeLinecap="round" />;
      })}
    </svg>
  );
}

/** Armchair, side table with a mug, floor lamp and rug. */
function Nook() {
  return (
    <svg viewBox="0 0 250 150" className="block h-auto w-full">
      <ellipse cx={120} cy={138} rx={118} ry={11} fill="#b85c75" />
      <ellipse cx={120} cy={138} rx={98} ry={7.5} fill="none" stroke="#f9d3dc" strokeWidth={2} strokeDasharray="6 5" />
      {/* floor lamp */}
      <circle cx={214} cy={38} r={33} fill="#ffd97a" opacity={0.2} className="shop-flicker" />
      <rect x={212} y={40} width={4} height={94} fill="#2b2b2b" />
      <rect x={200} y={132} width={28} height={6} rx={3} fill="#2b2b2b" />
      <path d="M196 44 l8 -30 h20 l8 30 Z" fill="#f3d36b" />
      <path d="M196 44 h36" stroke="#d2ad3c" strokeWidth={3} />
      {/* armchair */}
      <rect x={66} y={128} width={8} height={10} rx={2} fill="#5a3a20" />
      <rect x={150} y={128} width={8} height={10} rx={2} fill="#5a3a20" />
      <path d="M70 44 q42 -22 84 0 v62 h-84 Z" fill="#2f8a86" />
      <path d="M82 52 q30 -14 60 0 v40 h-60 Z" fill="#3aa39e" />
      <circle cx={97} cy={66} r={2.5} fill="#1f6663" />
      <circle cx={127} cy={66} r={2.5} fill="#1f6663" />
      <circle cx={112} cy={80} r={2.5} fill="#1f6663" />
      <rect x={76} y={92} width={72} height={22} rx={8} fill="#f3d36b" />
      <rect x={54} y={78} width={24} height={52} rx={11} fill="#267a76" />
      <rect x={146} y={78} width={24} height={52} rx={11} fill="#267a76" />
      <rect x={62} y={112} width={100} height={18} rx={6} fill="#267a76" />
      {/* an open book left on the cushion */}
      <path d="M94 96 q9 -5 18 0 q9 -5 18 0 v8 q-9 -5 -18 0 q-9 -5 -18 0 Z" fill="#fbf3dc" stroke="#7a5230" strokeWidth={1.2} />
      {/* side table, mug with steam, a few books */}
      <rect x={6} y={96} width={40} height={6} rx={2} fill="#a8744f" />
      <rect x={23} y={102} width={6} height={32} fill="#7a5230" />
      <rect x={12} y={132} width={28} height={5} rx={2.5} fill="#7a5230" />
      <rect x={8} y={88} width={22} height={8} rx={1.5} fill="#831843" />
      <rect x={10} y={81} width={18} height={7} rx={1.5} fill="#1e3a8a" />
      <rect x={32} y={84} width={11} height={12} rx={2} fill="#ffffff" />
      <path d="M43 87 q5 3 0 6" fill="none" stroke="#ffffff" strokeWidth={2} />
      <path d="M35 80 q-3 -5 0 -9 M40 80 q3 -5 0 -9" fill="none" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" opacity={0.6} className="shop-steam" />
    </svg>
  );
}

export default function Bookshop({ hobby, host }: { hobby: Hobby; host: VillagerLook }) {
  const rows = shelve(hobby.books ?? []);
  let n = 0;

  return (
    <div className="bookshop relative mt-5 overflow-hidden rounded-2xl px-3 pt-0 sm:px-6" data-bookshop>
      {/* pendant lamps */}
      <div aria-hidden className="flex justify-around">
        <PendantLamp />
        <PendantLamp />
        <PendantLamp />
      </div>

      {/* the bookcase */}
      <div className="bookcase relative mt-5 rounded-t-[28px] px-3 pb-3 pt-3 sm:pr-16">
        <div aria-hidden className="mb-3 flex items-center justify-center gap-3">
          <span className="h-[3px] w-12 rounded bg-[#d4a72c]/70 sm:w-20" />
          <span className="flame shop-flicker h-3.5 w-2.5" />
          <span className="h-[3px] w-12 rounded bg-[#d4a72c]/70 sm:w-20" />
        </div>

        <div className="flex flex-col gap-3">
          {rows.map((row, r) => {
            const decor = DECOR[r % DECOR.length];
            const spare = Math.max(0, PER_ROW - row.books.length);
            return (
              <div key={r} className="bookcase-back relative rounded-md pt-3">
                {row.label && (
                  <h3 className="brass-plate absolute left-1/2 top-0 z-[1] -translate-x-1/2 -translate-y-1/3 whitespace-nowrap rounded px-2.5 py-0.5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em]">
                    {row.label}
                  </h3>
                )}
                <ul className={`flex items-end gap-x-1 px-2 sm:gap-x-1.5 sm:px-3 ${r % 2 ? "flex-row-reverse" : ""}`} aria-label={row.label ? `${row.label} books` : "Books"}>
                  {row.books.map((b, i) => {
                    const k = n++;
                    const leaning = spare > 0 && i === row.books.length - 1;
                    return (
                      <li key={b.title} className={`flex h-[196px] items-end ${leaning ? (r % 2 ? "mr-3 origin-bottom-right -rotate-[5deg]" : "ml-3 origin-bottom-left rotate-[5deg]") : ""}`}>
                        <div
                          className="spine relative flex w-[46px] flex-col items-center justify-between rounded-t-[4px] rounded-b-[2px] px-1 py-3 text-white transition-transform duration-200 hover:-translate-y-2 sm:w-[var(--w)]"
                          style={{ background: SPINES[k % SPINES.length], ["--w" as string]: `${50 + ((k * 7) % 3) * 7}px`, height: 164 + ((k * 23) % 24) }}
                          title={b.author ? `${b.title} · ${b.author}` : b.title}
                        >
                          <span aria-hidden className="spine-band absolute inset-x-0 top-2 h-[3px]" />
                          <span aria-hidden className="spine-band absolute inset-x-0 top-[14px] h-px" />
                          <span className="mt-3 max-h-[92px] overflow-hidden font-display text-[0.74rem] font-semibold leading-tight [writing-mode:vertical-rl]">{b.title}</span>
                          {b.author && (
                            <span className="mb-1 max-h-[54px] overflow-hidden text-[0.5rem] font-medium uppercase leading-[1.15] tracking-[0.04em] text-white/80 [writing-mode:vertical-rl]">
                              {b.author.split(" · ")[0]}
                            </span>
                          )}
                          <span aria-hidden className="spine-band absolute inset-x-0 bottom-2 h-[3px]" />
                        </div>
                      </li>
                    );
                  })}
                  {/* the rest of the shelf: props (fewer on a phone) */}
                  <li aria-hidden className={`flex min-w-0 flex-1 items-end justify-evenly ${r % 2 ? "flex-row-reverse" : ""}`}>
                    {decor.map((d, i) => (
                      <span key={i} className={i < spare ? "block shrink-0" : "hidden shrink-0 sm:block"}>
                        {d}
                      </span>
                    ))}
                  </li>
                </ul>
                <div aria-hidden className="shop-plank h-3 rounded-b-md" />
              </div>
            );
          })}
        </div>

        {/* brass rail and rolling ladder */}
        <div aria-hidden className="pointer-events-none absolute inset-x-3 top-[52px] hidden h-[3px] rounded bg-[#d9b65a] sm:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-2 top-[46px] hidden w-14 sm:block">
          <Ladder />
        </div>
      </div>
      <div aria-hidden className="shop-plank h-2" />

      {/* the reading nook */}
      <div className="flex flex-wrap items-end gap-x-3 pt-6">
        <span aria-hidden className="shrink-0">
          <Villager look={host} height={118} />
        </span>
        <div className="order-first mb-3 min-w-0 basis-full sm:order-none sm:mb-8 sm:flex-1 sm:basis-40">
          {hobby.blurb && (
            <p className="room-bubble relative rounded-2xl bg-surface px-4 py-3 text-base font-medium leading-snug text-ink shadow-[var(--shadow-soft)] ring-1 ring-ink/10 sm:text-lg">{hobby.blurb}</p>
          )}
          {hobby.currentlyReading && (
            <p className="mt-3 inline-block rounded-lg bg-brick-yellow px-3 py-2 text-sm font-semibold text-ink">
              <span className="mr-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]">Currently reading</span>
              {hobby.currentlyReading}
            </p>
          )}
        </div>
        <div aria-hidden className="ml-auto w-[180px] shrink-0 sm:w-[250px]">
          <Nook />
        </div>
      </div>
      <div aria-hidden className="shop-boards -mx-3 h-4 sm:-mx-6" />
    </div>
  );
}
