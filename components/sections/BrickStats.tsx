import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { IsoStack } from "@/components/ui/IsoStack";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { skillWalls } from "@/lib/derive";
import { SkillBrick } from "./SkillBrick";

const LIP: BrickColor[] = ["blue", "red", "green", "yellow"];
const PALETTE: BrickColor[] = ["red", "yellow", "blue", "green", "white"];
const TILT = [-5, 3, -2, 6, -4, 2, 5, -3, 1, -6];
const LIFT = [0, 6, 2, 8, 4, 0, 5, 3];

/** Loose decorative pieces scattered in each bin. */
function LooseBits({ seed }: { seed: number }) {
  const c1 = PALETTE[(seed + 1) % PALETTE.length];
  const c2 = PALETTE[(seed + 3) % PALETTE.length];
  return (
    <>
      <li aria-hidden className="pointer-events-none self-end" style={{ transform: `rotate(${TILT[seed % TILT.length]}deg)` }}>
        <IsoStack items={[{ color: c1, w: 2, h: 1 }]} size={11} shadow={false} />
      </li>
      <li aria-hidden className="pointer-events-none self-end">
        <IsoStack items={[{ kind: "round", color: c2 }]} size={12} shadow={false} />
      </li>
    </>
  );
}

export function BrickStats() {
  const groups = skillWalls();
  return (
    <SectionShell id="stats" labelledBy="stats-title" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="stats-title"
          eyebrow="Brick Stats"
          title="The parts bin"
          intro="Every tool is a brick in the bin. It gets one stud for each build it was used in, plus one. Tap a brick to see those builds."
        />

        <div className="mt-16 grid gap-x-10 gap-y-16 lg:grid-cols-2">
          {groups.map((g, gi) => {
            const lip = BRICK_SHADES[LIP[gi % LIP.length]];
            let k = 0;
            return (
              <section key={g.category} aria-labelledby={`bin-${gi}`} className="relative" data-bin>
                {/* tub */}
                <div className="relative rounded-b-[2.25rem] rounded-t-2xl bg-[#262624] px-4 pb-20 pt-10 shadow-[0_40px_60px_-30px_rgba(17,17,17,0.45)] sm:px-6">
                  {/* back rim + inner shading */}
                  <div aria-hidden className="absolute inset-x-0 top-0 h-3 rounded-t-2xl bg-[#3a3a37]" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 rounded-b-[2.25rem] rounded-t-2xl bin-sheen" />

                  <ul className="relative flex flex-wrap items-end justify-center gap-x-2.5 gap-y-5">
                    {g.walls.map((w, wi) => {
                      const color = PALETTE[(gi * 2 + wi) % PALETTE.length];
                      const i = k++;
                      return (
                        <li key={w.name} className="relative" style={{ transform: `translateY(${LIFT[i % LIFT.length]}px)` }}>
                          <SkillBrick
                            name={w.name}
                            studs={w.height}
                            color={color}
                            tilt={TILT[(gi + i) % TILT.length]}
                            builds={w.builds.map((b) => ({ slug: b.slug, set: b.set, title: b.title }))}
                          />
                        </li>
                      );
                    })}
                    <LooseBits seed={gi} />
                  </ul>
                </div>

                {/* front lip with label plate */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex h-16 items-center justify-center rounded-b-[2.25rem] rounded-t-md shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]"
                  style={{ background: `linear-gradient(180deg, ${lip.light}, ${lip.base} 18px, ${lip.dark})` }}
                >
                  <h3 id={`bin-${gi}`} className="rounded-md bg-white/95 px-3 py-1 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink shadow-sm">
                    {g.category}
                  </h3>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
