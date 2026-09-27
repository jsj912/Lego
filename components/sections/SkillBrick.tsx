"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";

type Linked = { slug: string; set: string; title: string };

type Props = {
  name: string;
  /** stud count = linked builds + 1 */
  studs: number;
  color: BrickColor;
  tilt: number;
  builds: Linked[];
};

const STUD_PITCH = 22; // px

/** A skill as a brick in the bin. Linked builds open from it (hover, focus or tap). */
export function SkillBrick({ name, studs, color, tilt, builds }: Props) {
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const s = BRICK_SHADES[color];
  const linked = builds.length > 0;

  // close a pinned popover on outside click / Escape
  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setPinned(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPinned(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  const face = (
    <span
      className="relative block rounded-[6px] px-3.5 pb-3 pt-3.5 text-left text-[0.85rem] font-semibold leading-tight shadow-[0_6px_10px_-4px_rgba(0,0,0,0.5),inset_0_-3px_0_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.4)]"
      style={{
        background: `linear-gradient(180deg, ${s.light}, ${s.base} 10px, ${s.dark})`,
        color: s.text,
        minWidth: studs * STUD_PITCH + 12,
        maxWidth: 220,
      }}
      data-studs={studs}
    >
      <span aria-hidden className="absolute -top-[6px] left-2 flex" style={{ gap: STUD_PITCH - 16 }}>
        {Array.from({ length: studs }, (_, i) => (
          <span
            key={i}
            className="block h-[6px] w-4 rounded-t-[3px]"
            style={{ background: s.base, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)" }}
          />
        ))}
      </span>
      {name}
    </span>
  );

  if (!linked) {
    return (
      <div className="inline-block" style={{ transform: `rotate(${tilt}deg)` }}>
        {face}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("group relative inline-block", pinned && "z-20")} style={{ transform: `rotate(${tilt}deg)` }}>
      <button
        type="button"
        aria-expanded={pinned}
        aria-controls={id}
        onClick={() => setPinned((v) => !v)}
        className="block cursor-pointer rounded-[6px] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1"
      >
        {face}
        <span className="sr-only">: show builds</span>
      </button>
      <div
        className={cn(
          "absolute inset-x-0 bottom-full z-30 justify-center pb-3.5",
          pinned ? "flex" : "hidden group-hover:flex group-focus-within:flex",
        )}
      >
        <div
          id={id}
          className="relative w-60 shrink-0 rounded-xl bg-surface p-2 text-ink shadow-[var(--shadow-deep)] ring-1 ring-ink/10"
          style={{ transform: `rotate(${-tilt}deg)` }}
        >
          <p className="px-2 pb-1.5 pt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-2">Used in</p>
          <ul className="space-y-1">
            {builds.map((b) => (
              <li key={b.slug}>
                <a href={`/builds/${b.slug}`} className="block rounded-lg px-2 py-1.5 text-[0.82rem] leading-snug hover:bg-brick-yellow focus-visible:bg-brick-yellow">
                  <span className="font-mono text-[0.68rem] text-ink-2">SET {b.set}</span>
                  <span className="block font-medium">{b.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
