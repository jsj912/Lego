import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  className?: string;
  titleClassName?: string;
};

/** Eyebrow (mono blueprint label) + H2 + optional intro line. */
export function SectionHeading({ id, eyebrow, title, intro, dark, className, titleClassName }: Props) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <p className={cn("font-mono text-[0.8rem] font-semibold uppercase tracking-[0.18em]", dark ? "text-ink-inverse-2" : "text-ink-2")}>
        <span aria-hidden className="mr-2 inline-block h-2 w-2 translate-y-[-1px] rounded-[2px] bg-brick-red" />
        {eyebrow}
      </p>
      <h2 id={id} className={cn("mt-3 text-4xl font-semibold leading-[1.05] sm:text-5xl", titleClassName)}>
        {title}
      </h2>
      {intro && <p className={cn("mt-5 max-w-2xl text-lg leading-relaxed", dark ? "text-ink-inverse-2" : "text-ink-2")}>{intro}</p>}
    </header>
  );
}
