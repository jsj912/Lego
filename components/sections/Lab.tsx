import { FileText } from "lucide-react";
import { focusAreas, publications } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { BlueprintGrid } from "@/components/ui/BlueprintGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { publicationBuild, venueLabel } from "@/lib/derive";
import { BlueprintLines } from "./BlueprintLines";

export function Lab() {
  return (
    <SectionShell id="lab" labelledBy="lab-title" dark className="overflow-hidden py-28 sm:py-36">
      <BlueprintGrid variant="dark" fade={false} />
      <BlueprintLines />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="lab-title"
          eyebrow="Innovation Lab"
          title="Drafts on the drawing board"
          intro="Research sheets pinned to the blueprint wall. Each one is still being drafted."
          dark
        />

        <ol className="mt-16 grid gap-6 lg:grid-cols-3">
          {publications.map((p, i) => {
            const venue = venueLabel(p);
            const related = publicationBuild(p);
            return (
              <li key={p.title} className="relative flex flex-col rounded-[var(--radius-card)] bg-[#262624] p-7 ring-1 ring-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                <div aria-hidden className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-brick-yellow/90 shadow" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.18em] text-ink-inverse-2">SHEET {String(i + 1).padStart(2, "0")}</span>
                  <FileText size={18} className="text-ink-inverse-2" aria-hidden />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge tone="dark">{p.authorship}</Badge>
                  <Badge tone="yellow">
                    {p.status}
                  </Badge>
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-ink-inverse">{p.title}</h3>
                {venue && <p className="mt-3 font-mono text-[0.8rem] text-ink-inverse-2">{venue}</p>}
                {p.detail && <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-inverse-2">{p.detail}</p>}
                {related && (
                  <a
                    href={`/builds/${related.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brick-yellow underline-offset-4 hover:underline"
                  >
                    Related build: SET {related.set} · {related.title}
                  </a>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-20">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-inverse-2">Research threads</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {focusAreas.map((area, i) => (
              <li key={area} className="flex items-center gap-4 rounded-2xl border border-white/10 px-5 py-4">
                <span className="font-mono text-xs text-brick-yellow">T{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className="h-px flex-1 max-w-10 bg-white/20" />
                <span className="text-ink-inverse">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
