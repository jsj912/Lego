"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IsoStack } from "@/components/ui/IsoStack";
import { Stud } from "@/components/ui/Stud";
import { cn } from "@/lib/cn";

const BUBBLE = "Off the clock I run, read fantasy and make bouquets →";

/**
 * The builder: Joan's minifigure standing on a round brick display base with
 * a printed nameplate. Hover, keyboard focus or a tap shows a speech bubble
 * linking to the hidden /off-the-clock page.
 */
export function HeroMinifig() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const id = useId();

  // close a tapped-open bubble on outside tap or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="group relative mx-auto flex w-[300px] flex-col items-center pt-16" data-hero-minifig>
      {/* the figure */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="relative z-[1] block rounded-2xl"
      >
        <picture>
          <source srcSet="/minifig.webp" type="image/webp" />
          <img
            src="/minifig.png"
            width={210}
            height={400}
            alt="Joan as a brick-built minifigure"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="figure-bob block h-[400px] w-[210px] select-none"
            draggable={false}
          />
        </picture>
      </button>

      {/* speech bubble */}
      <div
        id={id}
        className={cn(
          "absolute left-1/2 top-0 z-10 w-[250px] transition-[opacity,transform] duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100",
        )}
      >
        <a
          href="/off-the-clock"
          className="speech-bubble relative block rounded-2xl bg-surface px-4 py-3 text-[0.92rem] font-semibold leading-snug text-ink shadow-[var(--shadow-lift)] ring-1 ring-ink/10 hover:bg-brick-yellow focus-visible:bg-brick-yellow"
          data-offclock-link
        >
          {BUBBLE}
        </a>
      </div>

      {/* loose bricks on the table, beside the base (wide screens only, never over text) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block" data-hero-deco>
        <span className="motion-float anim-pausable absolute -left-16 bottom-14 animate-float" style={{ ["--r" as string]: "-10deg" }}>
          <IsoStack items={[{ color: "yellow", w: 2, h: 1 }]} size={14} shadow={false} />
        </span>
        <span className="motion-float anim-pausable absolute -left-8 top-40 animate-float" style={{ animationDelay: "-3s" }}>
          <Stud color="red" size={18} />
        </span>
        <span className="motion-float anim-pausable absolute -right-14 bottom-20 animate-float" style={{ ["--r" as string]: "8deg", animationDelay: "-5s" }}>
          <IsoStack items={[{ color: "blue", w: 2, h: 1 }]} size={12} shadow={false} />
        </span>
        <span className="motion-float anim-pausable absolute -right-6 top-28 animate-float" style={{ animationDelay: "-1.5s" }}>
          <Stud color="green" size={15} />
        </span>
      </div>

      {/* round display base */}
      <div aria-hidden className="-mt-[46px]">
        <IsoStack
          items={[
            { kind: "disc", color: "dark", d: 6, x: 0, y: 0, z: 0, studs: false },
            { kind: "disc", color: "grey", d: 5, x: 0.5, y: 0.5, z: 1, studs: false },
          ]}
          size={24}
        />
      </div>

      {/* printed 1×4 nameplate tile */}
      <p className="nameplate relative -mt-7 rounded-[5px] px-4 py-1.5 font-mono text-[0.72rem] font-bold tracking-[0.16em] text-ink">
        SET 000 · THE BUILDER
      </p>
    </div>
  );
}
