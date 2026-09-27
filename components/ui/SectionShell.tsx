"use client";

import { useCallback, type ReactNode } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { cn } from "@/lib/cn";
import type { SectionId } from "@/lib/sections";

type Props = {
  id: SectionId;
  /** accessible heading id for aria-labelledby */
  labelledBy?: string;
  dark?: boolean;
  className?: string;
  children: ReactNode;
};

/** A page section that registers itself with the progress tower. */
export function SectionShell({ id, labelledBy, dark, className, children }: Props) {
  const { register } = useSectionProgress();
  const ref = useCallback((el: HTMLElement | null) => register(id, el), [id, register]);
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={labelledBy}
      className={cn("relative scroll-mt-24", dark && "on-dark bg-surface-dark text-ink-inverse", className)}
    >
      {children}
    </section>
  );
}
