import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { BRICK_SHADES, brickColorAt } from "@/lib/bricks";
import { skillWalls, type SkillWall } from "@/lib/derive";
import { SkillToggle } from "./SkillToggle";

function Wall({ wall, color }: { wall: SkillWall; color: ReturnType<typeof brickColorAt> }) {
  const shade = BRICK_SHADES[color];
  return (
    <div aria-hidden className="flex flex-col-reverse items-center gap-[3px]" data-wall-height={wall.height}>
      {Array.from({ length: wall.height }, (_, i) => (
        <span
          key={i}
          className="relative block h-6 w-16 rounded-[4px]"
          style={{ background: `linear-gradient(180deg, ${shade.light}, ${shade.base} 7px, ${shade.dark})` }}
        >
          {i === wall.height - 1 && (
            <span className="absolute -top-[5px] left-2 right-2 flex justify-between">
              {[0, 1].map((k) => (
                <span key={k} className="h-[5px] w-4 rounded-t-[2px]" style={{ background: shade.base }} />
              ))}
            </span>
          )}
        </span>
      ))}
    </div>
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
          intro="Each tool is a small wall. A wall grows one brick for every build it was used in. Select a wall to see those builds."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          {groups.map((g, gi) => (
            <section key={g.category} aria-labelledby={`cat-${gi}`} className="rounded-[var(--radius-card)] bg-surface p-7 shadow-[var(--shadow-soft)] ring-1 ring-ink/5">
              <h3 id={`cat-${gi}`} className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                {g.category}
              </h3>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                {g.walls.map((w, wi) => (
                  <li key={w.name} className="flex flex-col items-center text-center">
                    <div className="flex h-[5.5rem] items-end">
                      <Wall wall={w} color={brickColorAt(gi + wi)} />
                    </div>
                    <SkillToggle
                      name={w.name}
                      builds={w.builds.map((b) => ({ slug: b.slug, set: b.set, title: b.title }))}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
