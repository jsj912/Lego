"use client";

import { motion } from "motion/react";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { useMotionSafe } from "@/hooks/useMotionSafe";

// A small original house, one brick per piece, used by the 404 page.
const HOUSE: IsoItem[] = [
  { kind: "plate", color: "green", w: 5, h: 4, x: 0, y: 0, z: 0 },
  { color: "white", w: 4, h: 3, x: 0.5, y: 0.5, z: 1, decals: [{ face: "front", a: 1.5, z: 0, w: 1, h: 1.05, fill: "#6b4f35" }] },
  { color: "white", w: 4, h: 3, x: 0.5, y: 0.5, z: 4, decals: [{ face: "front", a: 0.4, z: 0.25, w: 0.8, h: 0.6, mullions: true, fill: "#2d5a86" }, { face: "front", a: 2.8, z: 0.25, w: 0.8, h: 0.6, mullions: true, fill: "#2d5a86" }] },
  { kind: "plate", color: "red", w: 4, h: 3, x: 0.5, y: 0.5, z: 7 },
  { color: "red", w: 4, h: 2, x: 0.5, y: 1, z: 8 },
  { color: "red", w: 4, h: 1, x: 0.5, y: 1.5, z: 11 },
  { kind: "round", color: "dark", x: 3.5, y: 1, z: 11 },
];

// where each piece starts, scattered on the floor (px offsets and rotation)
const SCATTER = [
  { x: 0, y: 0, r: 0 },
  { x: -160, y: 120, r: -24 },
  { x: 170, y: 100, r: 18 },
  { x: -120, y: -40, r: 30 },
  { x: 140, y: -60, r: -20 },
  { x: -60, y: 150, r: 40 },
  { x: 90, y: 160, r: -35 },
];

/** Scattered bricks that fly together into a little house. */
export function HouseAssembly() {
  const { reduced } = useMotionSafe();
  return (
    <div aria-hidden className="relative mx-auto h-[260px] w-[260px]" data-house>
      {HOUSE.map((piece, i) => {
        // each piece is its own stack (so it can travel) sharing the house's viewBox
        const s = SCATTER[i];
        return (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-end justify-center"
            initial={reduced ? { opacity: 0 } : { x: s.x, y: s.y, rotate: s.r, opacity: i === 0 ? 1 : 0.9 }}
            animate={reduced ? { opacity: 1 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={reduced ? { duration: 0.2 } : { type: "spring", stiffness: 160, damping: 16, delay: 0.35 + i * 0.18 }}
            style={{ zIndex: i }}
          >
            <IsoStack items={[piece]} boundsItems={HOUSE} size={30} shadow={i === 0} />
          </motion.div>
        );
      })}
    </div>
  );
}
