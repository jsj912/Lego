import { builds, featuredBuilds, researchBuilds } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { eyebrowOf } from "@/lib/sections";
import { BuildGrid } from "./BuildGrid";

export function Builds() {
  const featured = featuredBuilds.map((slug) => builds.find((b) => b.slug === slug)).filter((b) => b !== undefined);
  const more = builds.filter((b) => !featuredBuilds.includes(b.slug) && !researchBuilds.includes(b.slug));
  return (
    <SectionShell id="builds" labelledBy="builds-title" className="bg-surface/60 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="builds-title"
          eyebrow={eyebrowOf("builds")}
          title="Projects"
          intro="Every set ships with its instruction manual. The first spread is the TL;DR."
        />
        <BuildGrid featured={featured} more={more} />
      </div>
    </SectionShell>
  );
}
