import { ArrowDown, FileDown, MapPin } from "lucide-react";
import { person } from "@/content/site";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { SectionShell } from "@/components/ui/SectionShell";
import { SnapButton } from "@/components/ui/SnapButton";
import { BuiltAtStrip } from "./BuiltAtStrip";
import { HeroMinifig } from "./HeroMinifig";

// The previous hero build (gear-train machine) lives on in ./HeroTower.tsx.

export function Hero({ resumeHref }: { resumeHref: string | null }) {
  return (
    <SectionShell id="start" labelledBy="start-title" className="overflow-hidden pt-[var(--nav-h)]">
      <div data-cursor-light className="cursor-light pointer-events-none absolute inset-0" aria-hidden />
      <BlueprintGrid variant="lines" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-12 pt-8 sm:px-6 md:grid-cols-[1.25fr_1fr] lg:px-8 lg:pt-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm font-semibold shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
            <span aria-hidden className="h-2 w-2 rounded-[2px] bg-brick-red" />
            {person.roles.join(" · ")}
          </p>

          <h1 id="start-title" className="mt-4 text-[clamp(2.5rem,5.6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            {person.name}
          </h1>

          <p className="mt-4 max-w-xl font-display text-xl leading-snug text-ink sm:text-2xl">{person.tagline}</p>

          <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-2">
            <MapPin size={15} aria-hidden /> {person.location}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SnapButton href="#builds" size="lg" variant="red">
              Explore my builds <ArrowDown size={18} aria-hidden />
            </SnapButton>
            {resumeHref && (
              <SnapButton href={resumeHref} external size="lg" variant="ghost" dataTestId="resume-button">
                Download résumé <FileDown size={18} aria-hidden />
              </SnapButton>
            )}
          </div>

          <BuiltAtStrip />
        </div>

        <div className="relative">
          <HeroMinifig />
        </div>
      </div>
    </SectionShell>
  );
}
