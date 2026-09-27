import type { Build } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { IsoStack } from "@/components/ui/IsoStack";
import { boxModel } from "@/components/ui/models";
import { BRICK_SHADES, brickColorAt } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { KIND_COLOR, KIND_LABEL } from "@/lib/derive";

/** Box art: an original brick model, different for each set. */
export function BoxArt({ build, index, size = 17 }: { build: Build; index: number; size?: number }) {
  const main = KIND_COLOR[build.kind];
  const next = brickColorAt(index + 1);
  const accent = next === main ? "white" : next;
  return (
    <div aria-hidden className="relative flex h-44 items-end justify-center">
      <IsoStack items={boxModel(index, main, accent)} size={size} />
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-deep)] focus-within:shadow-[var(--shadow-deep)]">
      {/* lid band */}
      <div className="relative z-[1] [perspective:900px]">
        <div
          className={cn(
            "origin-top px-6 py-4 transition-transform duration-500 ease-[var(--ease-settle)] [transform-style:preserve-3d]",
            lidOpen && "[transform:rotateX(-75deg)]",
          )}
          style={{ background: `linear-gradient(160deg, ${shade.light}, ${shade.base} 40px, ${shade.dark})`, color: shade.text }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[0.78rem] font-semibold tracking-[0.18em]">SET {build.set}</span>
            <Badge tone={color === "yellow" ? "neutral" : "outline"} className={color === "yellow" ? "bg-ink/10" : "border-current/40"}>
              {KIND_LABEL[build.kind]}
            </Badge>
          </div>
        </div>
      </div>

      {/* box window with the model */}
      <div className="relative overflow-hidden border-b border-ink/5 bg-[#f1efe7]">
        <div className="bp-lines pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/[0.04] to-transparent" />
        <div className={cn("relative px-6 pt-4 transition-transform duration-500 ease-[var(--ease-settle)] group-hover:-translate-y-1.5", lidOpen && "-translate-y-3 scale-[1.04]")}>
          <BoxArt build={build} index={index} />
        </div>
      </div>

      {/* box body */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
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
    </article>
  );
}
