import { ArrowDown, FileText, Mail, MapPin } from "lucide-react";
import { highlights, person } from "@/content/site";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { SectionShell } from "@/components/ui/SectionShell";
import { SnapButton } from "@/components/ui/SnapButton";
import { FloatingBricks } from "./FloatingBricks";
import { HeroTower } from "./HeroTower";

export function Hero({ resumeHref }: { resumeHref: string | null }) {
  return (
    <SectionShell id="start" labelledBy="start-title" className="overflow-hidden pt-[var(--nav-h)]">
      <div data-cursor-light className="cursor-light pointer-events-none absolute inset-0" aria-hidden />
      <BlueprintGrid variant="lines" />
      <FloatingBricks />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pb-16 lg:pt-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm font-semibold shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
            <span aria-hidden className="h-2 w-2 rounded-[2px] bg-brick-red" />
            {person.roles.join(" · ")}
          </p>

          <h1 id="start-title" className="mt-5 text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            {person.name}
          </h1>

          <p className="mt-5 max-w-xl font-display text-xl leading-snug text-ink sm:text-2xl">{person.tagline}</p>

          {highlights.length > 0 && (
            <ul className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.95rem] font-semibold text-ink" aria-label="Highlights" data-proof-line>
              <li className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-2">Previously</li>
              {highlights.map((h, i) => (
                <li key={h} className="flex items-center gap-2.5">
                  {i > 0 && <span aria-hidden className="h-1.5 w-1.5 rounded-[2px] bg-brick-yellow" />}
                  {h}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-2">
            <MapPin size={15} aria-hidden /> {person.location}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SnapButton href="#journey" size="lg" variant="red">
              See my experience <ArrowDown size={18} aria-hidden />
            </SnapButton>
            {resumeHref && (
              <SnapButton href={resumeHref} external size="lg" variant="ghost" dataTestId="resume-button">
                Résumé <FileText size={18} aria-hidden />
              </SnapButton>
            )}
            <a href={`mailto:${person.email}`} className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
              <Mail size={16} aria-hidden /> {person.email}
            </a>
          </div>
        </div>

        <div className="relative hidden md:block">
          <HeroTower />
        </div>
      </div>
    </SectionShell>
  );
}
