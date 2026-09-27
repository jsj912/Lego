import { GraduationCap } from "lucide-react";
import { education, focusAreas, leadership } from "@/content/site";
import { Brick } from "@/components/ui/Brick";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { brickColorAt } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { BRICK_SHADES } from "@/lib/bricks";

export function Workshop() {
  return (
    <SectionShell id="workshop" labelledBy="workshop-title" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="workshop-title"
          eyebrow="Workshop"
          title="The workbench"
          intro="Where the foundations were laid: study, focus, and the teams along the way."
        />

        {/* Education: milestone bricks */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {education.map((ed, i) => (
            <article
              key={ed.school}
              className="group relative overflow-hidden rounded-[var(--radius-card)] bg-surface p-8 shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bg ring-1 ring-ink/5">
                    <GraduationCap size={20} aria-hidden />
                  </span>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-2">Milestone {String(i + 1).padStart(2, "0")}</p>
                </div>
                <Brick color={i === 0 ? "red" : "blue"} studs={{ w: 2, h: 2 }} size={18} isometric className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold leading-tight">{ed.school}</h3>
              <p className="mt-2 leading-relaxed text-ink">{ed.degree}</p>
              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.8rem] text-ink-2">
                <div>
                  <dt className="sr-only">When</dt>
                  <dd>{ed.when}</dd>
                </div>
                {ed.where && (
                  <div>
                    <dt className="sr-only">Where</dt>
                    <dd>{ed.where}</dd>
                  </div>
                )}
                {ed.detail && (
                  <div>
                    <dt className="sr-only">Detail</dt>
                    <dd className="font-semibold text-ink">{ed.detail}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>

        {/* Focus areas: collectible bricks */}
        <div className="mt-20">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">Collectible bricks · focus areas</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area, i) => {
              const color = brickColorAt(i);
              const shade = BRICK_SHADES[color];
              return (
                <li
                  key={area}
                  className="relative rounded-[var(--radius-brick)] px-5 pb-5 pt-7 shadow-[var(--shadow-soft)]"
                  style={{ background: `linear-gradient(180deg, ${shade.light}, ${shade.base} 22px, ${shade.dark})`, color: shade.text }}
                >
                  <span aria-hidden className="absolute -top-[7px] left-4 flex gap-3">
                    {[0, 1, 2, 3].map((k) => (
                      <span key={k} className="h-[7px] w-6 rounded-t-[4px]" style={{ background: shade.base, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)" }} />
                    ))}
                  </span>
                  <p className="font-display text-lg font-semibold leading-snug">{area}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pull quote + leadership shelf */}
        <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <figure className="relative">
            <blockquote className="font-display text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl">
              <span aria-hidden className="mb-4 block h-1.5 w-14 rounded-full bg-brick-yellow" />
              Great systems aren&rsquo;t discovered. They&rsquo;re assembled.
            </blockquote>
          </figure>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">The shelf · leadership</h3>
            <ul className="mt-6 space-y-0">
              {leadership.map((l, i) => (
                <li key={`${l.org}-${l.role}`} className="relative border-b-[6px] border-[#d9d4c4] pb-5 pt-5 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="flex items-center gap-2.5 font-semibold">
                      <span aria-hidden className={cn("inline-block h-3 w-5 rounded-[3px]", ["bg-brick-red", "bg-brick-blue", "bg-brick-green", "bg-brick-yellow"][i % 4])} />
                      {l.role}
                      <span className="font-normal text-ink-2">· {l.org}</span>
                    </p>
                    <p className="font-mono text-xs text-ink-2">{l.when}</p>
                  </div>
                  {l.detail && <p className="mt-2 max-w-2xl pl-[1.875rem] text-[0.95rem] leading-relaxed text-ink-2">{l.detail}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
