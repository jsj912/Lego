"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SectionProgressProvider } from "@/components/tower/SectionProgress";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SectionProgressProvider>{children}</SectionProgressProvider>
    </MotionConfig>
  );
}
