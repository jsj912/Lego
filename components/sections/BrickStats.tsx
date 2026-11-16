import { HiddenStud } from "@/components/eggs/HiddenStud";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { skillWalls } from "@/lib/derive";
import { eyebrowOf } from "@/lib/sections";
import { SkillBrick } from "./SkillBrick";

const TRAY: BrickColor[] = ["blue", "red", "green", "yellow"];
// the pile in each basket is mixed, like a real parts bin
const PILE: BrickColor[] = ["red", "blue", "yellow", "green", "white", "blue", "red", "green", "yellow"];
const TILT = [-3, 2, -1.5, 3, 0, -2.5, 1.5];

export function BrickStats() {
  const groups = skillWalls();
  return (
    <SectionShell id="stats" labelledBy="stats-title" className="py-24 sm:py-28">
      <HiddenStud id="stats" className="bottom-8 right-8" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="stats-title"
          eyebrow={eyebrowOf("stats")}
          title="Skills"
          intro="One basket per kind of part. Each brick gets one stud for every build it was used in, plus one; tap a brick to see those builds."
        />

        <div className="mt-14 grid gap-x-6 gap-y-12 lg:grid-cols-2">
          {groups.map((g, gi) => {
            const shade = BRICK_SHADES[TRAY[gi % TRAY.length]];
            return (
              <section key={g.category} aria-labelledby={`tray-${gi}`} data-bin data-reveal className="basket relative flex flex-col" style={{ ["--bk" as string]: shade.base, ["--bk-l" as string]: shade.light, ["--bk-d" as string]: shade.dark }}>
                {/* inside of the basket: the bricks are piled in it */}
                <div className="basket-inside relative flex-1">
                  <ul className="flex flex-wrap-reverse items-end gap-x-2.5 gap-y-3.5">
                    {g.walls.map((w, wi) => (
                      <li key={w.name}>
                        <SkillBrick
                          name={w.name}
                          studs={w.height}
                          color={PILE[(gi + wi) % PILE.length]}
                          tilt={TILT[(gi * 2 + wi) % TILT.length]}
                          builds={w.builds.map((b) => ({ slug: b.slug, set: b.set, title: b.title }))}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                {/* front wall of the basket, with its label plate */}
                <header className="basket-front relative z-10 flex items-center gap-3">
                  <span aria-hidden className="basket-weave absolute inset-0" />
                  <h3 id={`tray-${gi}`} className="nameplate relative rounded-[5px] px-3 py-1.5 font-mono text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink">
                    {g.category}
                  </h3>
                  <span aria-hidden className="basket-handle relative mx-auto hidden sm:block" />
                  <span className="relative ml-auto rounded-full bg-white px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold text-ink ring-1 ring-ink/10">
                    {g.walls.length} parts
                  </span>
                </header>
              </section>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
