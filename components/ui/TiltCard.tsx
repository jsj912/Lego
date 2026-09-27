"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { usePointerFine } from "@/hooks/usePointerFine";
import { cn } from "@/lib/cn";

const MAX_TILT = 6; // degrees

/** Card that tilts up to ~6° toward a fine pointer. Static on touch / reduced motion. */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const { reduced } = useMotionSafe();
  const fine = usePointerFine();
  const enabled = fine && !reduced;
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 2 * MAX_TILT);
    rx.set(-py * 2 * MAX_TILT);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div className="[perspective:1000px]">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={enabled ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } : undefined}
        className={cn("h-full", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
