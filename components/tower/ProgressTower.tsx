"use client";

import { motion } from "motion/react";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { BRICK_SHADES } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { SECTIONS, type SectionId } from "@/lib/sections";

const DUST = [
  { dx: "-14px", dy: "-4px" },
  { dx: "-8px", dy: "6px" },
  { dx: "10px", dy: "-6px" },
  { dx: "15px", dy: "3px" },
  { dx: "2px", dy: "8px" },
];

function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

/**
 * The brick progress tower. A brick drops onto the tower when its section is
 * half scrolled into view; the tower never un-builds, the glow follows the
 * active section. Desktop: fixed at the left edge. Mobile: a row under the nav.
 */
export function ProgressTower() {
  const { placed, active, complete } = useSectionProgress();
  const { place, reduced } = useMotionSafe();

  return (
    <>
      {/* desktop tower */}
      <nav aria-label="Build progress" className="fixed left-1.5 top-1/2 z-tower hidden -translate-y-1/2 lg:block" data-tower>
        <ol className="relative flex flex-col-reverse gap-[5px] overflow-visible pt-2">
          {SECTIONS.map((s) => {
            const on = placed.has(s.id);
            const isActive = active === s.id;
            const shade = BRICK_SHADES[s.color];
            return (
              <li key={s.id} className="relative">
                <button
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  aria-label={s.label}
                  aria-current={isActive ? "true" : undefined}
                  data-tower-brick={s.id}
                  data-placed={on ? "true" : "false"}
                  className="group relative block h-[18px] w-[28px] rounded-[4px]"
                >
                  {/* empty slot */}
                  <span aria-hidden className="absolute inset-0 rounded-[4px] border border-dashed border-ink/25" />
                  {on && (
                    <motion.span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-[4px] transition-shadow duration-300",
                        isActive && "shadow-[0_0_0_2px_rgba(255,213,0,0.9),0_0_14px_rgba(255,213,0,0.7)]",
                      )}
                      style={{ background: `linear-gradient(180deg, ${shade.light}, ${shade.base} 5px, ${shade.dark})` }}
                      initial={place.initial}
                      animate={place.animate}
                      transition={place.transition}
                    >
                      <span className="absolute -top-[4px] left-[4px] flex gap-[6px]">
                        {[0, 1].map((k) => (
                          <span key={k} className="block h-[4px] w-[7px] rounded-t-[2px]" style={{ background: shade.base }} />
                        ))}
                      </span>
                    </motion.span>
                  )}
                  {on && !reduced &&
                    DUST.map((d, i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="pointer-events-none absolute bottom-0 left-1/2 h-1 w-1 animate-dust rounded-full bg-ink/30 opacity-0 [animation-delay:420ms]"
                        style={{ ["--dx" as string]: d.dx, ["--dy" as string]: d.dy }}
                      />
                    ))}
                  {/* tooltip */}
                  <span className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
          {complete && (
            <span aria-hidden className="tower-shimmer pointer-events-none absolute inset-0 overflow-hidden rounded-md">
              <span className="absolute inset-x-0 h-10 animate-shimmer bg-gradient-to-b from-transparent via-white/80 to-transparent" />
            </span>
          )}
        </ol>
      </nav>

      {/* mobile row */}
      <nav aria-label="Build progress" className="fixed inset-x-0 top-[var(--nav-h)] z-tower lg:hidden" data-tower-mobile>
        <ol className="flex gap-[3px] px-2">
          {SECTIONS.map((s) => {
            const on = placed.has(s.id);
            const isActive = active === s.id;
            const shade = BRICK_SHADES[s.color];
            return (
              <li key={s.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  aria-label={s.label}
                  aria-current={isActive ? "true" : undefined}
                  className="block h-5 w-full pt-1"
                >
                  <span
                    aria-hidden
                    className={cn("block h-[6px] w-full rounded-[2px] transition-[background,box-shadow] duration-300", !on && "bg-ink/10", isActive && "shadow-[0_0_0_1.5px_rgba(255,213,0,0.95)]")}
                    style={on ? { background: shade.base } : undefined}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
