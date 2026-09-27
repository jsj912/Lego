import { education } from "@/content/site";
import { IsoStack } from "@/components/ui/IsoStack";
import { CAMPUS_HALL, CAMPUS_TOWER } from "@/components/ui/models";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { eyebrowOf } from "@/lib/sections";

const CAMPUS = [CAMPUS_HALL, CAMPUS_TOWER];

export function Workshop() {
  return (
    <SectionShell id="workshop" labelledBy="workshop-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="workshop-title" eyebrow={eyebrowOf("workshop")} title="Education" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {education.map((ed, i) => (
            <article key={ed.school} className="group flex overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
              <div className="sky hidden w-48 shrink-0 items-end justify-center pb-3 sm:flex">
                <div className="transition-transform duration-500 group-hover:-translate-y-1">
                  <IsoStack items={CAMPUS[i % CAMPUS.length]} size={9} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold leading-tight">{ed.school}</h3>
                <p className="mt-2 leading-relaxed">{ed.degree}</p>
                <dl className="mt-4 flex flex-wrap gap-2 font-mono text-[0.78rem]">
                  <div className="rounded-md bg-bg px-2.5 py-1 ring-1 ring-ink/10">
                    <dt className="sr-only">When</dt>
                    <dd>{ed.when}</dd>
                  </div>
                  {ed.where && (
                    <div className="rounded-md bg-bg px-2.5 py-1 ring-1 ring-ink/10">
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
      </div>
    </SectionShell>
  );
}
