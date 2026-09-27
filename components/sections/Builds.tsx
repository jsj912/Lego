import { builds } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { BuildGrid } from "./BuildGrid";

export function Builds() {
  return (
    <SectionShell id="builds" labelledBy="builds-title" className="bg-surface/60 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="builds-title"
          eyebrow="Builds"
          title="The collection"
          intro="Every set ships with its instruction manual. Open a box to see how it was put together."
        />
        <BuildGrid builds={builds} />
      </div>
    </SectionShell>
  );
}
