"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { timeline } from "@/content/site";
import { Brick } from "@/components/ui/Brick";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { BRICK_SHADES, brickColorAt } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { buildBySlug, experienceById } from "@/lib/derive";

export function Conveyor() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLOListElement>(null);
  const { reduced, place } = useMotionSafe();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const stripeX = useTransform(scrollYProgress, [0, 1], [0, -480]);

  // Vertical scroll drives the horizontal belt (desktop). Nothing is pinned
  // and nothing blocks the wheel: we only nudge the belt's own scroll offset.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const belt = beltRef.current;
    if (!belt || reduced || !window.matchMedia("(min-width: 768px)").matches) return;
    const t = Math.min(1, Math.max(0, (p - 0.2) / 0.55));
    belt.scrollLeft = t * (belt.scrollWidth - belt.clientWidth);
  });

  return (
    <SectionShell id="journey" labelledBy="journey-title" className="overflow-hidden py-28 sm:py-36">
      <div ref={sectionRef}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="journey-title"
            eyebrow="Conveyor"
            title="Off the production line"
            intro="Keep scrolling. Each brick rolls in and snaps into its slot."
          />
        </div>

        <div className="relative mt-16">
          {/* belt track (desktop) */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-3 hidden h-6 bg-[#2a2a28] md:block"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 40px)",
              backgroundPositionX: stripeX,
            }}
          />
          <div aria-hidden className="absolute bottom-0 left-0 hidden h-1.5 w-full bg-[#1b1b1a] md:block" />

          <ol
            ref={beltRef}
            className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 md:max-w-none md:flex-row md:gap-6 md:overflow-x-auto md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] md:pb-12 md:pt-4 [scrollbar-width:thin]"
            aria-label="Timeline"
          >
            {/* mobile belt line */}
            <span aria-hidden className="absolute bottom-0 left-[calc(1rem+11px)] top-0 w-1.5 rounded-full bg-[#2a2a28] sm:left-[calc(1.5rem+11px)] md:hidden" />
            {timeline.map((t, i) => {
              const color = brickColorAt(i);
              const shade = BRICK_SHADES[color];
              const exp = t.experience ? experienceById(t.experience) : undefined;
              const build = t.build ? buildBySlug(t.build) : undefined;
              return (
                <motion.li
                  key={t.label}
                  data-timeline-item
                  className="relative flex shrink-0 gap-4 pl-10 md:w-[300px] md:flex-col md:pl-0"
                  initial={place.initial}
                  whileInView={place.animate}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={place.transition}
                >
                  <span aria-hidden className="absolute left-[3px] top-5 md:hidden">
                    <Brick color={t.upcoming ? "white" : color} studs={{ w: 1, h: 1 }} size={16} isometric outline={t.upcoming} />
                  </span>
                  <div
                    className={cn(
                      "relative flex h-full w-full flex-col rounded-[var(--radius-brick)] p-5 pt-6",
                      t.upcoming ? "border-2 border-dashed border-ink/25 bg-transparent" : "shadow-[var(--shadow-lift)]",
                    )}
                    style={t.upcoming ? undefined : { background: `linear-gradient(180deg, ${shade.light}, ${shade.base} 18px, ${shade.dark})`, color: shade.text }}
                  >
                    <span aria-hidden className="absolute -top-[7px] left-4 flex gap-3">
                      {[0, 1, 2, 3].map((k) => (
                        <span
                          key={k}
                          className={cn("h-[7px] w-6 rounded-t-[4px]", t.upcoming && "border-2 border-b-0 border-dashed border-ink/25")}
                          style={t.upcoming ? undefined : { background: shade.base, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)" }}
                        />
                      ))}
                    </span>
                    <p className="font-mono text-xs font-semibold tracking-[0.08em] opacity-90">{t.when}</p>
                    <p className="mt-2 font-display text-lg font-semibold leading-snug">{t.label}</p>
                    {t.upcoming && <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-2">Not yet placed</p>}
                    {exp && (
                      <details className="group mt-3 text-sm">
                        <summary className="cursor-pointer list-none font-semibold underline decoration-current/40 underline-offset-4 [&::-webkit-details-marker]:hidden">
                          <span className="group-open:hidden">Show role details</span>
                          <span className="hidden group-open:inline">Hide role details</span>
                        </summary>
                        <p className="mt-2 opacity-90">
                          {exp.role} · {exp.where}
                        </p>
                        <ul className="mt-2 list-disc space-y-1.5 pl-4 leading-snug opacity-95">
                          {exp.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                    {build && (
                      <a href={`/builds/${build.slug}`} className="mt-3 text-sm font-semibold underline decoration-current/40 underline-offset-4">
                        Open SET {build.set}
                      </a>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}
