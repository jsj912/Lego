import { ArrowDown, FileDown, MapPin } from "lucide-react";
import { person } from "@/content/site";
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

      <div className="relative mx-auto grid min-h-[calc(100svh-var(--nav-h))] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-ink-2">
            <span aria-hidden className="mr-2 inline-block h-2 w-2 rounded-[2px] bg-brick-red" />
            Set 000 · Build start
          </p>

          <h1 id="start-title" className="mt-6 text-[clamp(3rem,9vw,7.25rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            {person.name}
          </h1>

          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Roles">
            {person.roles.map((role) => (
              <li key={role} className="rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
                {role}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-xl font-display text-2xl leading-snug text-ink sm:text-3xl">{person.tagline}</p>

          <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-2">
            <MapPin size={15} aria-hidden /> {person.location}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <SnapButton href="#builds" size="lg" variant="red">
              Explore My Builds <ArrowDown size={18} aria-hidden />
            </SnapButton>
            {resumeHref && (
              <SnapButton href={resumeHref} size="lg" variant="ghost" download dataTestId="resume-button">
                Download Blueprint <FileDown size={18} aria-hidden />
              </SnapButton>
            )}
          </div>
        </div>

        <div className="relative hidden sm:block">
          <HeroTower />
        </div>
      </div>
    </SectionShell>
  );
}
