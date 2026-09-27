import { cn } from "@/lib/cn";

type Props = {
  variant?: "dots" | "lines" | "dark";
  fade?: boolean;
  className?: string;
};

/** Decorative dotted / ruled blueprint background. Place inside a relative parent. */
export function BlueprintGrid({ variant = "lines", fade = true, className }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "dots" && "bp-dots",
        variant === "lines" && "bp-lines",
        variant === "dark" && "bp-dark",
        fade && "bp-fade",
        className,
      )}
    />
  );
}
