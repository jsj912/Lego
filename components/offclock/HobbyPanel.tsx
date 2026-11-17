"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import type { Hobby } from "@/content/offTheClock";
import type { Photo } from "@/lib/assets";
import { ROOF_TONES, type RoofTone } from "./Buildings";
import { LOOKS, Villager, type VillagerLook } from "./Villagers";

const SPINES = ["#7f1d1d", "#1e3a8a", "#14532d", "#581c87", "#9a3412", "#0f766e", "#831843", "#334155", "#713f12", "#155e75"];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** How each house looks inside: its roof colour, walls, who greets you, and how photos hang. */
type Room = { tone: RoofTone; wall: string; accent: string; host: VillagerLook; photos: "framed" | "pegged" | "taped"; wallpaper: string };
const ROOMS: Record<Hobby["id"], Room> = {
  books: { tone: ROOF_TONES.teal, wall: "#f6ead2", accent: "#2f6f6c", host: LOOKS.reader, photos: "framed", wallpaper: "room-stripes" },
  running: { tone: ROOF_TONES.pink, wall: "#fdf1f4", accent: "#b85c75", host: LOOKS.runner, photos: "framed", wallpaper: "room-lanes" },
  flowers: { tone: ROOF_TONES.lavender, wall: "#f8f3ea", accent: "#7a5aa6", host: LOOKS.florist, photos: "pegged", wallpaper: "room-dots" },
  scrapbook: { tone: ROOF_TONES.yellow, wall: "#fdf5d6", accent: "#b8862b", host: LOOKS.kid, photos: "taped", wallpaper: "room-kraft" },
  "build-table": { tone: ROOF_TONES.mint, wall: "#eef3e6", accent: "#4f8a4a", host: LOOKS.farmer, photos: "framed", wallpaper: "room-pegboard" },
};

const TILTS = [-2, 1.5, -1, 2.2, -1.6, 1];

/** The inside of one house: a furnished room with its host, the hobby's extras and its photos. */
export default function HobbyPanel({ hobby, photos, onClose }: { hobby: Hobby; photos: Photo[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const room = ROOMS[hobby.id];

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const vars = { ["--rt" as string]: room.tone.base, ["--rt-d" as string]: room.tone.dark, ["--rt-l" as string]: room.tone.light, background: room.wall } as CSSProperties;

  return (
    <div className="fixed inset-0 z-modal flex items-end justify-center bg-ink/60 p-3 backdrop-blur-sm sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hobby-title"
        data-hobby-panel={hobby.id}
        className="room-shell relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-panel)] shadow-2xl"
        style={vars}
      >
        {/* the roof you walked in under, then the ceiling beam */}
        <div aria-hidden className="room-roof h-9 shrink-0" />
        <div aria-hidden className="h-2.5 shrink-0 bg-[#7a5230]" />

        <div className={`relative min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-8 ${room.wallpaper}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Off the clock</p>
              <h2 id="hobby-title" className="wood-sign mt-2 inline-block rounded-md px-4 py-1.5 text-2xl font-semibold sm:text-3xl" style={{ color: room.accent }}>
                {hobby.title}
              </h2>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-ink/10 hover:bg-brick-yellow">
              <X size={20} aria-hidden />
            </button>
          </div>

          {/* the host, with the blurb as what they say */}
          <div className="mt-5 flex items-end gap-3">
            <span aria-hidden className="shrink-0">
              <Villager look={room.host} height={124} />
            </span>
            {hobby.blurb && (
              <p className="room-bubble relative mb-8 rounded-2xl bg-surface px-4 py-3 text-lg font-medium leading-snug text-ink shadow-[var(--shadow-soft)] ring-1 ring-ink/10">
                {hobby.blurb}
              </p>
            )}
          </div>

          {hobby.currentlyReading && (
            <p className="mt-5 inline-block rounded-lg bg-brick-yellow px-3 py-2 text-sm font-semibold">
              <span className="mr-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]">Currently reading</span>
              {hobby.currentlyReading}
            </p>
          )}

          {hobby.books && hobby.books.length > 0 && (
            <div className="mt-6">
              <h3 className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-2">On the shelf</h3>
              {/* a real bookcase: carved top, dark back, a plank under every row */}
              <div className="bookcase mt-3 rounded-t-[26px] p-3 pb-2">
                <div aria-hidden className="mb-2 flex items-center justify-center gap-3">
                  <span className="h-[3px] w-16 rounded bg-[#d4a72c]/70" />
                  <span className="flame h-3.5 w-2.5" />
                  <span className="h-[3px] w-16 rounded bg-[#d4a72c]/70" />
                </div>
                <ul className="bookcase-back shelf-rows flex flex-wrap justify-center gap-x-1.5 rounded-md px-3 pb-[20px] pt-1" aria-label="Books">
                  {hobby.books.map((b, i) => {
                    const color = SPINES[i % SPINES.length];
                    return (
                      <li key={b.title} className="flex h-[206px] items-end">
                        <div
                          className="spine relative flex flex-col items-center justify-between rounded-t-[4px] rounded-b-[2px] px-1 py-3 text-white transition-transform duration-200 hover:-translate-y-2"
                          style={{ background: color, width: 52 + ((i * 7) % 3) * 8, height: 170 + ((i * 23) % 28) }}
                          title={b.author ? `${b.title} · ${b.author}` : b.title}
                        >
                          <span aria-hidden className="spine-band absolute inset-x-0 top-2 h-[3px]" />
                          <span aria-hidden className="spine-band absolute inset-x-0 top-[14px] h-px" />
                          <span className="mt-3 max-h-[100px] overflow-hidden font-display text-[0.78rem] font-semibold leading-tight [writing-mode:vertical-rl]">
                            {b.title}
                          </span>
                          {b.author && (
                            <span className="mb-1 max-h-[70px] overflow-hidden text-[0.52rem] font-medium uppercase leading-[1.15] tracking-[0.04em] text-white/80 [writing-mode:vertical-rl]">
                              {b.author.split(" · ")[0]}
                            </span>
                          )}
                          <span aria-hidden className="spine-band absolute inset-x-0 bottom-2 h-[3px]" />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {hobby.runStats && hobby.runStats.length > 0 && (
            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl border-[3px] border-[#1f2d3a] bg-[#101418] p-3 sm:grid-cols-4">
              {hobby.runStats.map((s) => (
                <div key={s.label} className="px-1">
                  <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/70">{s.label}</dt>
                  <dd className="mt-1 font-mono text-lg font-bold text-brick-yellow">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {photos.length > 0 ? (
            <ul className={`mt-7 grid grid-cols-2 gap-x-5 gap-y-7 ${room.photos === "pegged" ? "room-twine pt-5" : ""} ${photos.length === 2 || photos.length === 4 ? "" : "sm:grid-cols-3"}`}>
              {photos.map((p, i) => (
                <li key={p.src} className="relative" style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}>
                  {room.photos === "framed" && <span aria-hidden className="absolute -top-2 left-1/2 z-[1] h-3 w-3 -translate-x-1/2 rounded-full bg-[#3f4347] ring-2 ring-white/60" />}
                  {room.photos === "pegged" && <span aria-hidden className="absolute -top-3 left-1/2 z-[1] h-6 w-2.5 -translate-x-1/2 rounded-sm bg-[#c98f5a] ring-1 ring-[#5a3a20]" />}
                  {room.photos === "taped" && (
                    <>
                      <span aria-hidden className="washi absolute -left-2 -top-1.5 z-[1] h-3.5 w-10 -rotate-[28deg]" />
                      <span aria-hidden className="washi absolute -right-2 -top-1.5 z-[1] h-3.5 w-10 rotate-[28deg]" />
                    </>
                  )}
                  <figure className={room.photos === "framed" ? "photo-frame p-2.5" : "bg-white p-2 pb-3 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.45)] ring-1 ring-ink/10"}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.alt || `${hobby.title}, photo ${i + 1}`} loading="lazy" decoding="async" className="aspect-square w-full bg-white object-cover" />
                    {p.caption && (
                      <figcaption className={`px-1 pt-2 text-[0.78rem] leading-snug ${room.photos === "framed" ? "text-[#fbf3dc]" : "text-ink-2"}`}>{p.caption}</figcaption>
                    )}
                  </figure>
                </li>
              ))}
            </ul>
          ) : hobby.books && hobby.books.length > 0 ? null : (
            <div className="mt-7" data-photos-placeholder>
              {/* empty frames waiting on the wall */}
              <div aria-hidden className="grid grid-cols-3 gap-4">
                {[-2, 1.5, -1].map((t, i) => (
                  <div key={i} className="photo-frame relative p-2.5" style={{ rotate: `${t}deg` }}>
                    <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#3f4347] ring-2 ring-white/60" />
                    <div className="aspect-square w-full bg-[#fbf3dc]/90" />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center font-semibold">Photos on the way</p>
              <p className="text-center text-sm text-ink-2">These frames are waiting for their first snapshots.</p>
            </div>
          )}
        </div>

        {/* floorboards */}
        <div aria-hidden className="room-floor h-5 shrink-0" />
      </div>
    </div>
  );
}
