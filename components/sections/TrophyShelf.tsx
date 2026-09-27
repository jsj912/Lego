import { awards, leadership } from "@/content/site";
import { IsoStack } from "@/components/ui/IsoStack";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { brickColorAt } from "@/lib/bricks";
import { awardBuild } from "@/lib/derive";
import { eyebrowOf } from "@/lib/sections";
import { Trophy } from "./Trophy";

export function TrophyShelf() {
  return (
    <SectionShell id="trophies" labelledBy="trophies-title" className="overflow-hidden bg-surface/60 py-24 sm:py-28">
      <div data-cursor-light className="cursor-light pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="trophies-title" eyebrow={eyebrowOf("trophies")} title="Awards & Leadership" />

        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {awards.map((a, i) => {
            const related = awardBuild(i);
            return (
              <li key={a.title} className="flex items-end gap-6">
                <div className="relative flex h-56 w-40 shrink-0 items-end justify-center [perspective:800px]">
                  <div aria-hidden className="absolute bottom-0 h-40 w-44 rounded-full bg-[radial-gradient(closest-side,rgba(255,213,0,0.28),transparent)] blur-xl" />
                  <div className="animate-sway relative origin-bottom scale-[0.8]" style={{ animationDelay: i ? "-4.5s" : "0s" }}>
                    <Trophy variant={i === 0 ? 0 : 1} />
                  </div>
                </div>
                <div className="pb-4">
                  <h3 className="text-xl font-semibold leading-snug">{a.title}</h3>
                  {a.detail && <p className="mt-2 leading-relaxed text-ink-2">{a.detail}</p>}
                  {related && (
                    <a href={`/builds/${related.slug}`} className="mt-3 inline-block text-sm font-semibold text-brick-blue underline-offset-4 hover:underline">
                      See the project: SET {related.set} · {related.title}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-16">
          <h3 className="font-mono text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-ink-2">Leadership &amp; communities</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((l, i) => (
              <li key={`${l.org}-${l.role}`} className="flex gap-3.5 rounded-2xl bg-surface p-4 shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
                <div className="shrink-0 pt-1">
                  <IsoStack items={[{ color: brickColorAt(i), w: 2, h: 2 }]} size={9} shadow={false} />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[0.98rem] font-semibold leading-snug">{l.role}</p>
                  <p className="text-sm text-ink-2">{l.org}</p>
                  <p className="mt-1.5 inline-block rounded bg-bg px-1.5 py-0.5 font-mono text-[0.72rem] text-ink ring-1 ring-ink/10">{l.when}</p>
                  {l.detail && <p className="mt-2 text-[0.86rem] leading-snug text-ink-2">{l.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
