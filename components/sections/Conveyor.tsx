"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, BriefcaseBusiness, Trophy, Users } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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

const BELT_START = 190; // px from the left where the belt leaves the factory
const ROLLERS = [0, 1, 2, 3, 4, 5, 6, 7];

/** A brick riding the belt. Compact: date + label. */
function BeltBrick({ t, color, selected, onSelect }: { t: TimelineEntry; color: BrickColor; selected: boolean; onSelect: () => void }) {
  const shade = BRICK_SHADES[t.upcoming ? "white" : color];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-timeline-item
      data-lane={t.lane}
      className={cn(
        "relative flex h-[122px] w-[214px] shrink-0 flex-col rounded-[8px] p-4 pt-5 text-left transition-transform duration-200 hover:-translate-y-1.5 focus-visible:-translate-y-1.5",
        t.upcoming
          ? "border-2 border-dashed border-ink/30 bg-bg/80"
          : "shadow-[0_10px_18px_-8px_rgba(0,0,0,0.55),inset_0_-4px_0_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]",
        selected && "-translate-y-1.5 ring-4 ring-brick-yellow",
      )}
      style={t.upcoming ? undefined : { background: `linear-gradient(180deg, ${shade.light}, ${shade.base} 16px, ${shade.dark})`, color: shade.text }}
    >
      <span aria-hidden className="absolute -top-[7px] left-3 flex gap-2.5">
        {[0, 1, 2, 3].map((k) => (
          <span
            key={k}
            className={cn("h-[7px] w-7 rounded-t-[4px]", t.upcoming && "border-2 border-b-0 border-dashed border-ink/30")}
            style={t.upcoming ? undefined : { background: shade.base, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}
          />
        ))}
      </span>
      <span className="font-mono text-[0.7rem] font-semibold tracking-[0.06em] opacity-90">{t.when}</span>
      <span className="mt-1.5 line-clamp-3 font-display text-[0.95rem] font-semibold leading-snug">{t.label}</span>
      {t.upcoming && <span className="mt-auto font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-2">Not yet placed</span>}
    </button>
  );
}

/** Details for the selected brick. */
function Manifest({ t, color }: { t: TimelineEntry; color: BrickColor }) {
  const exp = t.experience ? experienceById(t.experience) : undefined;
  const build = t.build ? buildBySlug(t.build) : undefined;
  const shade = BRICK_SHADES[color];
  return (
    <div className="rounded-[var(--radius-card)] bg-surface p-6 shadow-[var(--shadow-soft)] ring-1 ring-ink/5" aria-live="polite" data-manifest>
      <div className="flex flex-wrap items-center gap-3">
        <span
          aria-hidden
          className={cn("h-3 w-6 rounded-[3px]", t.upcoming && "border-2 border-dashed border-ink/30")}
          style={t.upcoming ? undefined : { background: shade.base }}
        />
        <span className="font-mono text-xs font-semibold tracking-[0.1em] text-ink-2">MANIFEST · {t.when}</span>
      </div>
      <p className="mt-3 font-display text-xl font-semibold leading-snug">{t.label}</p>
      {exp && (
        <>
          <p className="mt-1 text-ink-2">
            {exp.role} · {exp.where}
          </p>
          <ul className="mt-4 grid gap-2.5 md:grid-cols-2">
            {exp.bullets.map((b) => (
              <li key={b} className="flex gap-2.5 text-[0.93rem] leading-relaxed">
                <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-[2px]" style={{ background: shade.base }} />
                {b}
              </li>
            ))}
          </ul>
        </>
      )}
      {build && (
        <a href={`/builds/${build.slug}`} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brick-blue">
          Open the manual · SET {build.set} <ArrowUpRight size={15} aria-hidden />
        </a>
      )}
      {t.upcoming && <p className="mt-2 text-ink-2">This brick is still waiting for its slot.</p>}
    </div>
  );
}

function Roller({ size, rotate }: { size: number; rotate: ReturnType<typeof useTransform<number, number>> }) {
  return (
    <motion.svg aria-hidden width={size} height={size} viewBox="0 0 22 22" style={{ rotate }}>
      <circle cx="11" cy="11" r="10" fill="#9ea3a8" stroke="#5c6166" strokeWidth="1.5" />
      <path d="M11 3 V19 M3 11 H19" stroke="#5c6166" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="2.5" fill="#3a3a3a" />
    </motion.svg>
  );
}

export function Conveyor() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionSafe();
  const [laneId, setLaneId] = useState<TimelineLane>("work");
  const [selected, setSelected] = useState(0);
  const [rowW, setRowW] = useState(900);
  const lane = LANES.find((l) => l.id === laneId) ?? LANES[0];
  const entries = timeline.filter((t) => t.lane === laneId);
  const college = education[0];

  // scroll → belt travel (0..1). Nothing is pinned; the page scrolls normally.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const travel = useTransform(scrollYProgress, [0.1, 0.42], [0, 1], { clamp: true });
  // "kick" replays the ride out of the factory when the belt changes
  const kick = useMotionValue(0);
  const progress = useTransform(() => (reduced ? 1 : Math.min(1, Math.max(0, travel.get() + kick.get()))));
  const rowX = useTransform(() => -rowW + progress.get() * rowW);
  const treadX = useTransform(() => progress.get() * 700);
  const rollerRot = useTransform(() => progress.get() * 1080);

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => setRowW(el.scrollWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [laneId]);

  useEffect(() => {
    if (reduced) return;
    const done = travel.get();
    if (done <= 0) return;
    kick.set(-done);
    const controls = animate(kick, 0, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [laneId, reduced, travel, kick]);

  function pick(id: TimelineLane) {
    setLaneId(id);
    setSelected(0);
  }

  return (
    <SectionShell id="journey" labelledBy="journey-title" className="overflow-hidden py-28 sm:py-36">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="journey-title"
          eyebrow="Conveyor"
          title="Off the production line"
          intro="Everything rolls out of the workshop. Pick a belt, keep scrolling and watch the bricks ride out. Tap one to read its manifest."
        />

        <div role="tablist" aria-label="Conveyor belts" className="mt-12 flex flex-wrap gap-2">
          {LANES.map((l) => {
            const on = l.id === laneId;
            const shade = BRICK_SHADES[l.color];
            return (
              <button
                key={l.id}
                role="tab"
                type="button"
                id={`tab-${l.id}`}
                aria-selected={on}
                aria-controls="belt-panel"
                onClick={() => pick(l.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors",
                  on ? "ring-transparent" : "bg-surface text-ink ring-ink/10 hover:bg-bg",
                )}
                style={on ? { background: shade.base, color: shade.text } : undefined}
              >
                {l.icon}
                {l.label}
              </button>
            );
          })}
        </div>

        <div id="belt-panel" role="tabpanel" aria-labelledby={`tab-${laneId}`} className="mt-8">
          {/* ───────── desktop: the machine ───────── */}
          <div className="relative hidden h-[320px] lg:block" data-conveyor-machine>
            {/* bricks riding the belt, clipped so they emerge from the factory */}
            <div className="absolute bottom-[98px] right-0 top-0 overflow-hidden" style={{ left: BELT_START }}>
              <motion.div ref={rowRef} className="absolute bottom-0 left-0 flex items-end gap-5 pl-16 pr-2" style={{ x: rowX }}>
                {entries.map((t, i) => (
                  <BeltBrick key={`${laneId}-${t.label}`} t={t} color={lane.color} selected={i === selected} onSelect={() => setSelected(i)} />
                ))}
              </motion.div>
            </div>

            {/* the belt */}
            <div aria-hidden className="absolute bottom-[60px] right-3 h-[38px]" style={{ left: BELT_START - 10 }}>
              <div className="absolute inset-x-0 top-0 h-[6px] rounded-full bg-gradient-to-b from-[#c9ccd0] to-[#8d9297]" />
              <motion.div
                className="absolute inset-x-0 top-[6px] h-[18px] bg-[#232322]"
                style={{
                  backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 3px, transparent 3px 28px)",
                  backgroundPositionX: treadX,
                }}
              />
              <div className="absolute inset-x-0 top-[24px] h-[10px] rounded-b-md bg-gradient-to-b from-[#6c7176] to-[#4a4e52]" />
              <div className="absolute inset-x-8 top-[22px] flex justify-between">
                {ROLLERS.map((k) => (
                  <Roller key={k} size={20} rotate={rollerRot} />
                ))}
              </div>
            </div>
            <div className="absolute bottom-[55px] right-0">
              <Roller size={46} rotate={rollerRot} />
            </div>

            {/* legs */}
            <div aria-hidden className="absolute bottom-0 right-6 flex h-[60px] justify-around" style={{ left: BELT_START + 60 }}>
              {[0, 1, 2, 3].map((k) => (
                <div key={k} className="flex flex-col items-center">
                  <div className="w-2.5 flex-1 bg-gradient-to-r from-[#9ea3a8] to-[#5c6166]" />
                  <div className="h-2 w-12 rounded-sm bg-[#4a4e52]" />
                </div>
              ))}
            </div>

            {/* the factory (college) at the start of the line, drawn over the belt start */}
            <div className="absolute bottom-[40px] left-0 z-10 flex w-[260px] justify-center">
              <IsoStack items={CAMPUS_HALL} size={13} />
            </div>
            <div className="absolute bottom-0 left-0 z-10 w-[260px] text-center">
              <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Start of the line</p>
              <p className="mt-0.5 text-sm font-semibold leading-tight">{college.school}</p>
            </div>
          </div>

          {/* ───────── below lg: a vertical belt ───────── */}
          <div className="lg:hidden">
            <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-surface p-3 pr-5 shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
              <div className="sky flex h-24 w-28 shrink-0 items-end justify-center rounded-xl pb-1">
                <IsoStack items={CAMPUS_HALL} size={6} shadow={false} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Start of the line</p>
                <p className="mt-0.5 font-semibold leading-tight">{college.school}</p>
              </div>
            </div>
            <div className="relative ml-8 border-l-[12px] border-[#232322] pb-2 pl-6 pt-8" style={{ borderImage: "repeating-linear-gradient(180deg, #232322 0 22px, #3a3a38 22px 26px) 12" }}>
              <ol className="space-y-7">
                {entries.map((t, i) => (
                  <motion.li
                    key={`${laneId}-${t.label}`}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: -30, rotate: -6 }}
                    whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 380, damping: 22 }}
                  >
                    <BeltBrick t={t} color={lane.color} selected={i === selected} onSelect={() => setSelected(i)} />
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-8">{entries[selected] && <Manifest t={entries[selected]} color={lane.color} />}</div>
        </div>
      </div>
    </SectionShell>
  );
}
