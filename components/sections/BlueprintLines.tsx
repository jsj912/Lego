"use client";

import { motion } from "motion/react";
import { useMotionSafe } from "@/hooks/useMotionSafe";

const PATHS = [
  "M0 120 H260 V40 H520",
  "M1200 60 H940 V180 H700",
  "M80 420 H300 V300 H460",
  "M1180 460 H1000 V340 H820",
  "M600 0 V70",
];

/** Blueprint lines that draw in as the lab scrolls into view. Decorative. */
export function BlueprintLines() {
  const { reduced } = useMotionSafe();
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 520" preserveAspectRatio="none" fill="none">
      {PATHS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="rgba(120,170,255,0.35)"
          strokeWidth={1.2}
          strokeDasharray={i % 2 ? "6 6" : undefined}
          vectorEffect="non-scaling-stroke"
          initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {[[260, 120], [520, 40], [940, 180], [300, 300], [1000, 340]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3} fill="rgba(255,213,0,0.7)" />
      ))}
    </svg>
  );
}
