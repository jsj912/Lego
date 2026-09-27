import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";

/** A single round stud seen from above-ish. Decorative. */
export function Stud({ color = "red", size = 16, className }: { color?: BrickColor; size?: number; className?: string }) {
  const s = BRICK_SHADES[color];
  return (
    <svg viewBox="0 0 20 16" width={size} height={size * 0.8} className={cn("overflow-visible", className)} aria-hidden focusable="false">
      <path d="M2 6 L2 10 A8 4 0 0 0 18 10 L18 6 Z" fill={s.dark} />
      <ellipse cx="10" cy="6" rx="8" ry="4" fill={s.light} />
      <ellipse cx="8.5" cy="5.2" rx="3.5" ry="1.4" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
