"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { BriefcaseBusiness, Trophy, Users } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { education, timeline } from "@/content/site";
import type { TimelineEntry, TimelineLane } from "@/content/types";
import { IsoStack } from "@/components/ui/IsoStack";
import { CAMPUS_HALL } from "@/components/ui/models";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { buildBySlug, experienceById } from "@/lib/derive";

const LANES: { id: TimelineLane; label: string; color: BrickColor; icon: ReactNode }[] = [
  { id: "work", label: "Work experience", color: "blue", icon: <BriefcaseBusiness size={16} aria-hidden /> },
  { id: "builds", label: "Projects & competitions", color: "red", icon: <Trophy size={16} aria-hidden /> },
  { id: "campus", label: "Campus & leadership", color: "green", icon: <Users size={16} aria-hidden /> },
];

function BeltBrick({ t, color, reduced }: { t: TimelineEntry; color: BrickColor; reduced: boolean }) {
  const shade = BRICK_SHADES[color];
  const exp = t.experience ? experienceById(t.experience) : undefined;
  const build = t.build ? buildBySlug(t.build) : undefined;
  const still = reduced || t.upcoming;
  return (
    <li data-timeline-item data-lane={t.lane} className="relative w-full shrink-0 md:w-[280px]">
      <div className="relative h-full">
        {/* the empty slot on the belt */}
        {!t.upcoming && (
          <div aria-hidden className="absolute inset-0 rounded-[var(--radius-brick)] border-2 border-dashed border-ink/20 bg-ink/[0.02]">
            <span className="absolute -top-[9px] left-4 flex gap-3">
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className="h-[7px] w-6 rounded-t-[4px] border-2 border-b-0 border-dashed border-ink/20" />
              ))}
            </span>
          </div>
        )}
        <motion.div
          initial={still ? { opacity: 0 } : { x: 120, y: -40, rotate: 14, opacity: 0 }}
          whileInView={still ? { opacity: 1 } : { x: [120, 0, 0, 0, 0], y: [-40, -40, 3, -1, 0], rotate: [14, -2, 0, 0, 0], scaleY: [1, 1, 0.94, 1.02, 1], opacity: [0, 1, 1, 1, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          transition={still ? { duration: 0.3 } : { duration: 0.95, times: [0, 0.5, 0.72, 0.86, 1], ease: "easeOut" }}
          className={cn(
            "relative flex h-full w-full origin-bottom flex-col rounded-[var(--radius-brick)] p-5 pt-6",
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
            <a href={`/builds/${build.slug}`} className="mt-3 w-fit text-sm font-semibold underline decoration-current/40 underline-offset-4">
              Open SET {build.set}
            </a>
          )}
        </motion.div>
      </div>
    </li>
  );
}

function Belt({ lane, entries, progress, reduced }: { lane: (typeof LANES)[number]; entries: TimelineEntry[]; progress: MotionValue<number>; reduced: boolean }) {
  const beltRef = useRef<HTMLOListElement>(null);
  const stripeX = useTransform(progress, [0, 1], [0, -480]);
  const shade = BRICK_SHADES[lane.color];

  // Vertical scroll nudges the belt's own horizontal offset. Nothing is pinned.
  useMotionValueEvent(progress, "change", (p) => {
    const belt = beltRef.current;
    if (!belt || reduced || !window.matchMedia("(min-width: 768px)").matches) return;
    const t = Math.min(1, Math.max(0, (p - 0.2) / 0.55));
    belt.scrollLeft = t * (belt.scrollWidth - belt.clientWidth);
  });

  return (
    <section aria-labelledby={`lane-${lane.id}`} data-lane-belt={lane.id}>
      <h3 id={`lane-${lane.id}`} className="flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-[0.18em]">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white shadow-sm" style={{ background: shade.base, color: shade.text }}>
          {lane.icon}
        </span>
        {lane.label}
      </h3>
      <div className="relative mt-5">
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-3 hidden h-5 rounded-full bg-[#2a2a28] md:block"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 40px)",
            backgroundPositionX: stripeX,
          }}
        />
        <ol
          ref={beltRef}
          className="relative flex flex-col gap-6 pl-8 md:flex-row md:gap-5 md:overflow-x-auto md:pb-12 md:pl-1 md:pr-1 md:pt-3 [scrollbar-width:thin]"
          aria-label={lane.label}
        >
          <span aria-hidden className="absolute bottom-0 left-2.5 top-0 w-1.5 rounded-full bg-[#2a2a28] md:hidden" />
          {entries.map((t) => (
            <BeltBrick key={t.label} t={t} color={t.upcoming ? "white" : lane.color} reduced={reduced} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Conveyor() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionSafe();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const college = education[0];

  return (
    <SectionShell id="journey" labelledBy="journey-title" className="overflow-hidden py-28 sm:py-36">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="journey-title"
          eyebrow="Conveyor"
          title="Off the production line"
          intro="It all starts at the workshop. Work, builds and campus life each ride their own belt; keep scrolling and every brick rolls into its slot."
        />

        <div className="mt-16">
          {/* start of the line */}
          <div className="flex max-w-xl items-center gap-5 overflow-hidden rounded-[var(--radius-card)] bg-surface pr-6 shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
            <div className="sky flex h-40 w-44 shrink-0 items-end justify-center pb-2 sm:w-56">
              <IsoStack items={CAMPUS_HALL} size={9} />
            </div>
            <div className="min-w-0 py-4">
              <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Start of the line</p>
              <p className="mt-1.5 font-display text-lg font-semibold leading-snug">{college.school}</p>
              <p className="mt-1 text-sm text-ink-2">{college.when}</p>
            </div>
          </div>
          {/* feeder from the workshop down to the belts */}
          <div aria-hidden className="ml-24 h-12 w-1.5 rounded-b-full bg-[#2a2a28] sm:ml-28" />

          <div className="min-w-0 space-y-14">
            {LANES.map((lane) => {
              const entries = timeline.filter((t) => t.lane === lane.id);
              if (!entries.length) return null;
              return <Belt key={lane.id} lane={lane} entries={entries} progress={scrollYProgress} reduced={reduced} />;
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
