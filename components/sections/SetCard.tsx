import type { Build } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { BRICK_SHADES, brickColorAt } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { KIND_COLOR, KIND_LABEL } from "@/lib/derive";

type Layer = { w: number; h: number; x: number; y: number; z: number };

// Each set's box art: a small original stack, varied per set.
const ART: Layer[][] = [
  [{ w: 2, h: 2, x: 0, y: 0, z: 0 }, { w: 2, h: 1, x: 0, y: 0, z: 1 }],
  [{ w: 4, h: 2, x: 0, y: 0, z: 0 }, { w: 2, h: 2, x: 1, y: 0, z: 1 }],
  [{ w: 2, h: 4, x: 0, y: 0, z: 0 }, { w: 1, h: 2, x: 0, y: 1, z: 1 }, { w: 1, h: 1, x: 0, y: 1, z: 2 }],
  [{ w: 3, h: 2, x: 0, y: 0, z: 0 }, { w: 2, h: 2, x: 0, y: 0, z: 1 }],
];

/** Box art: original stacked bricks, varied per set. */
export function BoxArt({ build, index }: { build: Build; index: number }) {
  const kind = KIND_COLOR[build.kind];
  const accent = brickColorAt(index + 1) === kind ? "white" : brickColorAt(index + 1);
  const items: IsoItem[] = ART[index % ART.length].map((l, i) => ({ ...l, color: i % 2 ? accent : kind === "yellow" && i === 0 ? "white" : kind }));
  return (
    <div aria-hidden className="relative flex h-40 items-end justify-center">
      <IsoStack items={items} size={24} />
    </div>
  );
}

type Props = {
  build: Build;
  index: number;
  /** rendered inside the card, above everything, as the real interactive element */
  action: React.ReactNode;
  lidOpen?: boolean;
};

/** Set-box card. Purely presentational; the parent supplies the interactive element. */
export function SetCard({ build, index, action, lidOpen }: Props) {
  const color = KIND_COLOR[build.kind];
  const shade = BRICK_SHADES[color];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[var(--shadow-deep)] focus-within:shadow-[var(--shadow-deep)]">
      {/* lid */}
      <div
        className={cn(
          "relative origin-top px-6 pb-2 pt-5 transition-transform duration-500 [transform-style:preserve-3d] ease-[var(--ease-settle)]",
          lidOpen && "[transform:perspective(900px)_rotateX(70deg)]",
        )}
        style={{ background: `linear-gradient(160deg, ${shade.light}, ${shade.base} 40px, ${shade.dark})`, color: shade.text }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.78rem] font-semibold tracking-[0.18em]">SET {build.set}</span>
          <Badge tone={color === "yellow" ? "neutral" : "outline"} className={color === "yellow" ? "bg-ink/10" : "border-current/40"}>
            {KIND_LABEL[build.kind]}
          </Badge>
        </div>
        <div className="relative -mb-6 mt-1 transition-transform duration-500 group-hover:-translate-y-1.5">
          <BoxArt build={build} index={index} />
        </div>
      </div>

      {/* box body */}
      <div className="bp-dots flex flex-1 flex-col px-6 pb-6 pt-10">
        <div className="flex flex-1 flex-col">
          <h3 className="text-xl font-semibold leading-snug">{build.title}</h3>
          {build.context && <p className="mt-1.5 text-sm text-ink-2">{build.context}</p>}
          <p className="mt-4 leading-relaxed">{build.outcome}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Key pieces">
            {build.pieces.slice(0, 4).map((p) => (
              <li key={p} className="rounded-md bg-bg px-2 py-1 font-mono text-[0.72rem] text-ink ring-1 ring-ink/8">
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <p className="min-w-0 font-mono text-xs text-ink-2">
              {build.pieces.length} pieces{build.when ? ` · ${build.when}` : ""}
            </p>
            {action}
          </div>
        </div>
      </div>
    </article>
  );
}
