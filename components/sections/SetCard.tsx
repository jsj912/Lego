import { FileText, Globe } from "lucide-react";
import type { ReactNode } from "react";
import type { Build } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { IsoStack } from "@/components/ui/IsoStack";
import { BUILD_MODELS, boxModel } from "@/components/ui/models";
import { BRICK_SHADES, brickColorAt } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { KIND_COLOR, KIND_LABEL } from "@/lib/derive";

/** Box art: an original brick model of what the project is. */
export function BoxArt({ build, index, size = 17, className }: { build: Build; index: number; size?: number; className?: string }) {
  const main = KIND_COLOR[build.kind];
  const next = brickColorAt(index + 1);
  const accent = next === main ? "white" : next;
  return (
    <div aria-hidden className={cn("relative flex h-44 items-end justify-center", className)}>
      <IsoStack items={BUILD_MODELS[build.slug] ?? boxModel(index, main, accent)} size={size} />
    </div>
  );
}

/** Real outbound links from content (GitHub / report / demo). */
export function BuildLinks({ build, dark }: { build: Build; dark?: boolean }) {
  const items: { href: string; label: string; icon: ReactNode }[] = [];
  if (build.links.github) items.push({ href: build.links.github, label: "Code", icon: <GithubIcon size={14} /> });
  if (build.links.report) items.push({ href: build.links.report, label: "Report", icon: <FileText size={14} aria-hidden /> });
  if (build.links.demo) items.push({ href: build.links.demo, label: "Demo", icon: <Globe size={14} aria-hidden /> });
  if (!items.length) return null;
  return (
    <ul className="relative z-[2] flex flex-wrap gap-2" aria-label={`Links for ${build.title}`}>
      {items.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.8rem] font-semibold ring-1",
              dark ? "text-white ring-white/25 hover:bg-white/10" : "bg-surface text-ink ring-ink/15 hover:bg-brick-yellow",
            )}
          >
            {l.icon} {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  build: Build;
  index: number;
  /** the stretched "open manual" link supplied by the parent */
  action: ReactNode;
  lidOpen?: boolean;
  variant?: "featured" | "compact";
};

export function SetCard({ build, index, action, lidOpen, variant = "featured" }: Props) {
  const color = KIND_COLOR[build.kind];
  const shade = BRICK_SHADES[color];
  const band = (
    <div className="relative z-[1] [perspective:900px]">
      <div
        className={cn(
          "origin-top px-5 py-3 transition-transform duration-500 ease-[var(--ease-settle)] [transform-style:preserve-3d]",
          lidOpen && "[transform:rotateX(-75deg)]",
        )}
        style={{ background: `linear-gradient(160deg, ${shade.light}, ${shade.base} 40px, ${shade.dark})`, color: shade.text }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.8rem] font-bold tracking-[0.16em]">SET {build.set}</span>
          <Badge tone={color === "yellow" ? "neutral" : "outline"} className={color === "yellow" ? "bg-ink/10" : "border-current/40"}>
            {KIND_LABEL[build.kind]}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (variant === "compact") {
    return (
      <article className="group relative flex h-full overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
        <div aria-hidden className="w-1.5 shrink-0" style={{ background: shade.base }} />
        <div className="bp-dots flex w-28 shrink-0 items-center justify-center bg-[#f1efe7]">
          <IsoStack items={BUILD_MODELS[build.slug] ?? boxModel(index, color, "white")} size={9} shadow={false} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <p className="font-mono text-[0.72rem] font-semibold tracking-[0.14em] text-ink-2">
            SET {build.set}
            {build.when ? ` · ${build.when}` : ""}
          </p>
          <h3 className="mt-1 font-display text-[1.02rem] font-semibold leading-snug">{build.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-ink-2">{build.outcome}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
            <BuildLinks build={build} />
            {action}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-deep)] focus-within:shadow-[var(--shadow-deep)]">
      {band}
      <div className="relative overflow-hidden border-b border-ink/5 bg-[#f1efe7]">
        <div className="bp-lines pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div className={cn("relative px-6 pt-3 transition-transform duration-500 ease-[var(--ease-settle)] group-hover:-translate-y-1.5", lidOpen && "-translate-y-3 scale-[1.04]")}>
          <BoxArt build={build} index={index} size={18} className="h-52" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <h3 className="text-xl font-semibold leading-snug">{build.title}</h3>
        {build.context && <p className="mt-1 text-sm text-ink-2">{build.context}</p>}
        <p className="mt-3 font-medium leading-relaxed">{build.outcome}</p>
        {build.ownership && <p className="mt-2 text-sm leading-snug text-ink-2">{build.ownership}</p>}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
          {build.pieces.slice(0, 5).map((p) => (
            <li key={p} className="rounded-md bg-bg px-2 py-1 font-mono text-[0.74rem] text-ink ring-1 ring-ink/10">
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <BuildLinks build={build} />
          {action}
        </div>
      </div>
    </article>
  );
}
