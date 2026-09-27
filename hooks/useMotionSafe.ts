"use client";

import { useReducedMotion } from "motion/react";
import { fade, place, snap } from "@/lib/motion";

/**
 * Global motion policy. When the user prefers reduced motion, transforms
 * become opacity fades (or nothing). Every animated component reads this.
 */
export function useMotionSafe() {
  const reduced = useReducedMotion() ?? false;
  return {
    reduced,
    snap: reduced ? { duration: 0 } : snap,
    place: reduced ? fade : place,
  };
}
