import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "red" | "blue" | "green" | "yellow" | "outline" | "dark";

const TONES: Record<Tone, string> = {
  neutral: "bg-ink/[0.05] text-ink",
  red: "bg-brick-red text-white",
  blue: "bg-brick-blue text-white",
  green: "bg-brick-green text-white",
  yellow: "bg-brick-yellow text-ink",
  outline: "border border-current bg-transparent",
  dark: "bg-white/10 text-ink-inverse ring-1 ring-white/15",
};

export function Badge({ tone = "neutral", mono = true, children, className }: { tone?: Tone; mono?: boolean; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] leading-none",
        mono && "font-mono",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
