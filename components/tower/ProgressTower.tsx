"use client";

import { motion } from "motion/react";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { BRICK_SHADES } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { SECTIONS, type SectionId } from "@/lib/sections";

function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

/**
 * Progress as a liftarm: one pin hole per section. A pin snaps into its hole
 * once the section is half scrolled into view (it never un-builds); the active
 * section's pin glows. Shown only at ≥1280px, where sections reserve a gutter for it.
 */
export function ProgressTower() {
  const { placed, active, complete } = useSectionProgress();
  const { reduced } = useMotionSafe();

  const pin = (id: SectionId, color: (typeof SECTIONS)[number]["color"], size: number) => {
    const on = placed.has(id);
    const shade = BRICK_SHADES[color];
    return (
      <span aria-hidden className="relative block" style={{ width: size, height: size }}>
        {/* the hole */}
        <span className="absolute inset-0 rounded-full bg-[#3f4347] shadow-[inset_0_2px_3px_rgba(0,0,0,0.6)]" />
        {on && (
          <motion.span
            className="pin-head absolute inset-[1px] rounded-full"
            style={{ ["--pl" as string]: shade.light, ["--pb" as string]: shade.base, ["--pd" as string]: shade.dark }}
            initial={reduced ? { opacity: 0 } : { scale: 0.2, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { scale: [0.2, 1.15, 1], opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="pin-axle" />
          </motion.span>
        )}
      </span>
    );
  };

  return (
    <>
      {/* wide screens: vertical liftarm */}
      <nav aria-label="Section progress" className="fixed left-2 top-1/2 z-tower hidden -translate-y-1/2 xl:block" data-tower>
        <ol className="relative flex flex-col gap-1.5 rounded-full bg-gradient-to-r from-[#b9bdc1] to-[#8d9297] p-1.5 shadow-[0_6px_14px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.5)]">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToSection(s.id)}
                aria-label={s.label}
                aria-current={active === s.id ? "true" : undefined}
                data-tower-brick={s.id}
                data-placed={placed.has(s.id) ? "true" : "false"}
                className={cn(
                  "group relative block rounded-full transition-shadow",
                  active === s.id && "shadow-[0_0_0_2px_rgba(255,213,0,0.95),0_0_12px_rgba(255,213,0,0.7)]",
                )}
              >
                {pin(s.id, s.color, 20)}
                <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {s.label}
                </span>
              </button>
            </li>
          ))}
          {complete && (
            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-x-0 h-10 animate-shimmer bg-gradient-to-b from-transparent via-white/80 to-transparent" />
            </span>
          )}
        </ol>
      </nav>

    </>
  );
}
