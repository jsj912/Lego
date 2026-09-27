import type { Book } from "@/content/offTheClock";

const COLORS = ["#7f1d1d", "#1e3a8a", "#14532d", "#581c87", "#9a3412", "#0f766e", "#831843", "#334155", "#713f12", "#155e75"];

function Spine({ book, i, h }: { book: Book; i: number; h: number }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-t-[2px] shadow-[inset_-2px_0_0_rgba(0,0,0,0.25),inset_2px_0_0_rgba(255,255,255,0.12)]"
      style={{ width: 17, height: h, background: COLORS[i % COLORS.length] }}
      title={book.author ? `${book.title} · ${book.author}` : book.title}
    >
      <span aria-hidden className="absolute inset-x-0 top-1 h-px bg-[#e3c26b]" />
      <span aria-hidden className="absolute inset-x-0 bottom-1 h-px bg-[#e3c26b]" />
      <span className="max-h-[44px] overflow-hidden whitespace-nowrap text-[0.46rem] font-semibold leading-none text-white/90 [writing-mode:vertical-rl]">{book.title}</span>
    </span>
  );
}

/** A small library seen through the shop window: lamp, two shelves of books, a ladder. */
export function LibraryWindow({ books, current }: { books: Book[]; current: string | null | undefined }) {
  const top = books.slice(0, 5);
  const rest = books.slice(5);
  const standing = rest.slice(0, Math.max(0, rest.length - 2));
  const stacked = rest.slice(-2);

  return (
    <div className="library-interior relative h-full w-full overflow-hidden">
      {/* hanging lamp */}
      <span aria-hidden className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-black/50" />
      <span aria-hidden className="absolute left-1/2 top-3 h-2.5 w-6 -translate-x-1/2 rounded-t-full bg-[#1f2d24]" />
      <span aria-hidden className="lamp-glow absolute left-1/2 top-[22px] h-1.5 w-2.5 -translate-x-1/2 rounded-full bg-[#ffe7a8]" />

      {/* ladder leaning on the shelves */}
      <span aria-hidden className="absolute bottom-0 right-2 h-[88px] w-5 rotate-[8deg] border-x-2 border-[#c89b62]">
        {[12, 30, 48, 66].map((t) => (
          <span key={t} className="absolute inset-x-0 h-0.5 bg-[#c89b62]" style={{ top: t }} />
        ))}
      </span>

      {/* top shelf */}
      <div className="absolute inset-x-2 top-[34px]">
        <div className="flex items-end gap-[2px] pl-1">
          {top.map((b, i) => (
            <Spine key={b.title} book={b} i={i} h={52 + ((i * 11) % 12)} />
          ))}
          <span className="mb-1 ml-1.5 rounded-[2px] bg-[#fbf3dc] px-1 py-0.5 font-mono text-[0.42rem] font-bold uppercase tracking-[0.12em] text-[#5a3a23] shadow">Favourites</span>
        </div>
        <div className="library-shelf h-1.5 rounded-[1px]" />
      </div>

      {/* bottom shelf */}
      <div className="absolute inset-x-2 top-[104px]">
        <div className="flex items-end gap-[2px] pl-1">
          {standing.map((b, i) => (
            <Spine key={b.title} book={b} i={i + 5} h={48 + ((i * 13) % 12)} />
          ))}
          {/* a leaning one and a small horizontal stack */}
          {stacked[0] && (
            <span className="ml-1 origin-bottom-left rotate-[14deg]">
              <Spine book={stacked[0]} i={8} h={50} />
            </span>
          )}
          {stacked[1] && (
            <span
              className="ml-3 flex h-[14px] w-[46px] items-center justify-center rounded-[2px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.25)]"
              style={{ background: COLORS[9] }}
              title={stacked[1].author ? `${stacked[1].title} · ${stacked[1].author}` : stacked[1].title}
            >
              <span className="truncate px-1 text-[0.42rem] font-semibold text-white/90">{stacked[1].title}</span>
            </span>
          )}
        </div>
        <div className="library-shelf h-1.5 rounded-[1px]" />
      </div>

      {current && (
        <span className="absolute bottom-1.5 left-2 rounded-[2px] bg-brick-yellow px-1.5 py-0.5 text-[0.5rem] font-semibold text-ink shadow">
          Reading: {current}
        </span>
      )}

      {/* glass reflection */}
      <span aria-hidden className="window-glass pointer-events-none absolute inset-0" />
    </div>
  );
}
