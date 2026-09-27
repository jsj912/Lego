import { GraduationCap } from "lucide-react";
import { education, focusAreas, leadership } from "@/content/site";
import { IsoStack } from "@/components/ui/IsoStack";
import { CAMPUS_HALL, CAMPUS_TOWER, FOCUS_MODELS } from "@/components/ui/models";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { BRICK_SHADES, brickColorAt } from "@/lib/bricks";

const CAMPUS = [CAMPUS_HALL, CAMPUS_TOWER];

export function Workshop() {
  return (
    <SectionShell id="workshop" labelledBy="workshop-title" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="workshop-title"
          eyebrow="Workshop"
          title="The workbench"
          intro="Where the foundations were laid: the campuses, the focus areas, and the crews along the way."
        />

        {/* Education: campus dioramas */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {education.map((ed, i) => (
            <article key={ed.school} className="group overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[var(--shadow-deep)]">
              <div className="sky relative flex h-72 items-end justify-center overflow-hidden px-6 pb-4 sm:h-80">
                <div className="bp-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink shadow-sm">
                  <GraduationCap size={14} aria-hidden /> Milestone {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative transition-transform duration-500 ease-[var(--ease-settle)] group-hover:-translate-y-1.5">
                  <IsoStack items={CAMPUS[i % CAMPUS.length]} size={17} />
                </div>
              </div>
              <div className="p-7 sm:p-8">
                <h3 className="text-2xl font-semibold leading-tight">{ed.school}</h3>
                <p className="mt-2 leading-relaxed text-ink">{ed.degree}</p>
                <dl className="mt-6 flex flex-wrap gap-2 font-mono text-[0.78rem]">
                  <div className="rounded-md bg-bg px-2.5 py-1 ring-1 ring-ink/8">
                    <dt className="sr-only">When</dt>
                    <dd>{ed.when}</dd>
                  </div>
                  {ed.where && (
                    <div className="rounded-md bg-bg px-2.5 py-1 ring-1 ring-ink/8">
                      <dt className="sr-only">Where</dt>
                      <dd>{ed.where}</dd>
                    </div>
                  )}
                  {ed.detail && (
                    <div className="rounded-md bg-brick-yellow px-2.5 py-1 font-semibold text-ink">
                      <dt className="sr-only">Detail</dt>
                      <dd>{ed.detail}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </article>
          ))}
        </div>

        {/* Focus areas: parts on a pegboard */}
        <div className="mt-24">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">Focus areas · the parts I keep reaching for</h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area, i) => {
              const shade = BRICK_SHADES[brickColorAt(i)];
              return (
                <li key={area} className="group relative overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <div aria-hidden className="h-1.5" style={{ background: shade.base }} />
                  <div className="bp-dots relative flex h-40 items-center justify-center bg-[#f1efe7]">
                    <IsoStack items={FOCUS_MODELS[i % FOCUS_MODELS.length]} size={20} />
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[0.7rem] font-semibold tracking-[0.18em] text-ink-2">PART {String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-2 font-display text-lg font-semibold leading-snug">{area}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pull quote on a baseplate */}
        <figure className="baseplate relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-[var(--radius-card)] px-4 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-9">
          <blockquote className="relative mx-auto max-w-xl rounded-xl bg-surface px-5 py-5 text-center shadow-[0_2px_0_rgba(0,0,0,0.08),0_14px_28px_-16px_rgba(0,0,0,0.5)] sm:px-8 sm:py-6">
            <span aria-hidden className="absolute -top-1.5 left-1/2 flex -translate-x-1/2 gap-2.5">
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className="h-1.5 w-5 rounded-t bg-surface" />
              ))}
            </span>
            <p className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] sm:text-2xl">
              Great systems aren&rsquo;t discovered.
              <span className="block text-brick-red">They&rsquo;re assembled.</span>
            </p>
          </blockquote>
        </figure>

        {/* Leadership: crew tiles */}
        <div className="mt-16">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">The crew · leadership &amp; communities</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((l, i) => {
              const color = brickColorAt(i);
              return (
                <li key={`${l.org}-${l.role}`} className="flex gap-3.5 rounded-2xl bg-surface p-4 shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
                  <div className="shrink-0 pt-1">
                    <IsoStack items={[{ color, w: 2, h: 2 }]} size={9} shadow={false} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-[0.95rem] font-semibold leading-snug">{l.role}</p>
                    <p className="text-sm text-ink-2">{l.org}</p>
                    <p className="mt-1.5 inline-block rounded bg-bg px-1.5 py-0.5 font-mono text-[0.68rem] ring-1 ring-ink/8">{l.when}</p>
                    {l.detail && <p className="mt-2 text-[0.82rem] leading-snug text-ink-2">{l.detail}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
