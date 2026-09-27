import { IsoStack } from "@/components/ui/IsoStack";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { BrickColor } from "@/lib/bricks";
import { skillWalls } from "@/lib/derive";
import { eyebrowOf } from "@/lib/sections";
import { SkillBrick } from "./SkillBrick";

const TRAY: BrickColor[] = ["blue", "red", "green", "yellow"];

export function BrickStats() {
  const groups = skillWalls();
  return (
    <SectionShell id="stats" labelledBy="stats-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="stats-title"
          eyebrow={eyebrowOf("stats")}
          title="Skills"
          intro="Sorted like a parts organizer. Each brick gets one stud for every build it was used in, plus one; tap a brick to see those builds."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {groups.map((g, gi) => {
            const color = TRAY[gi % TRAY.length];
            return (
              <section
                key={g.category}
                aria-labelledby={`tray-${gi}`}
                data-bin
                className="rounded-[var(--radius-card)] bg-[#ecebe5] p-5 shadow-[inset_0_2px_8px_rgba(17,17,17,0.08)] ring-1 ring-ink/5 sm:p-6"
              >
                <header className="mb-6 flex items-center gap-3">
                  <IsoStack items={[{ color, w: 2, h: 1 }]} size={9} shadow={false} />
                  <h3 id={`tray-${gi}`} className="font-mono text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-ink">
                    {g.category}
                  </h3>
                  <span className="ml-auto rounded-full bg-white px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold text-ink-2 ring-1 ring-ink/10">
                    {g.walls.length} parts
                  </span>
                </header>
                <ul className="flex flex-wrap gap-x-3 gap-y-5">
                  {g.walls.map((w) => (
                    <li key={w.name}>
                      <SkillBrick
                        name={w.name}
                        studs={w.height}
                        color={color}
                        tilt={0}
                        builds={w.builds.map((b) => ({ slug: b.slug, set: b.set, title: b.title }))}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
