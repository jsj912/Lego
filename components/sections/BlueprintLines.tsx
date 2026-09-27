"use client";

import { motion } from "motion/react";
import { useMotionSafe } from "@/hooks/useMotionSafe";

// Construction lines drawn inside their own empty box (never over cards or text).
const SETS = {
  header: {
    view: "0 0 400 160",
    paths: ["M0 130 H150 V40 H330", "M400 20 H300 V110 H200", "M60 160 V100 H120"],
    dots: [[150, 130], [330, 40], [300, 110], [120, 100]],
  },
  table: {
    view: "0 0 400 220",
    paths: ["M0 30 H180 V150 H360", "M400 200 H260 V80 H120", "M40 220 V120"],
    dots: [[180, 30], [360, 150], [260, 80], [40, 120]],
  },
} as const;

export function BlueprintLines({ variant }: { variant: keyof typeof SETS }) {
  const { reduced } = useMotionSafe();
  const set = SETS[variant];
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox={set.view} preserveAspectRatio="none" fill="none">
      {set.paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="rgba(220,233,255,0.35)"
          strokeWidth={1.2}
          strokeDasharray={i % 2 ? "6 6" : undefined}
          vectorEffect="non-scaling-stroke"
          initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {set.dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3} fill="rgba(255,213,0,0.7)" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
