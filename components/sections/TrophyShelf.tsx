import { awards } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { awardBuild } from "@/lib/derive";
import { Trophy } from "./Trophy";

export function TrophyShelf() {
  return (
    <SectionShell id="trophies" labelledBy="trophies-title" className="overflow-hidden bg-surface/60 py-28 sm:py-36">
      <div data-cursor-light className="cursor-light pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="trophies-title" eyebrow="Trophy Shelf" title="On the shelf" intro="Pieces earned along the way." />

        <ul className="mt-16 grid gap-10 md:grid-cols-2">
          {awards.map((a, i) => {
            const related = awardBuild(i);
            return (
              <li key={a.title} className="flex flex-col items-center text-center">
                <div className="relative flex h-72 w-full items-end justify-center [perspective:800px]">
                  <div aria-hidden className="absolute bottom-0 h-48 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(255,213,0,0.28),transparent)] blur-xl" />
                  <div className="animate-sway relative" style={{ animationDelay: i ? "-4.5s" : "0s" }}>
                    <Trophy variant={i === 0 ? 0 : 1} />
                  </div>
                </div>
                {/* the shelf */}
                <div aria-hidden className="h-3 w-full max-w-sm rounded-sm bg-[#d9d4c4] shadow-[0_10px_20px_-8px_rgba(17,17,17,0.25)]" />
                <h3 className="mt-8 max-w-md text-xl font-semibold leading-snug">{a.title}</h3>
                {a.detail && <p className="mt-3 max-w-md leading-relaxed text-ink-2">{a.detail}</p>}
                {related && (
                  <a href={`/builds/${related.slug}`} className="mt-4 text-sm font-semibold text-brick-blue underline-offset-4 hover:underline">
                    Related build: SET {related.set}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
}
