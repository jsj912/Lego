"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Brick } from "@/components/ui/Brick";
import { useMotionSafe } from "@/hooks/useMotionSafe";

/** Footer egg: one outlined, unfinished brick. Clicking it places the piece. */
export function UnfinishedBrick() {
  const [placed, setPlaced] = useState(false);
  const { place } = useMotionSafe();
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setPlaced(true)}
        aria-pressed={placed}
        aria-label={placed ? "Brick placed" : "Place the last brick"}
        data-unfinished-brick
        className="relative rounded-md p-1 hover:bg-white/5"
      >
        <Brick color="yellow" studs={{ w: 2, h: 1 }} size={22} outline className="opacity-60" />
        {placed && (
          <motion.span className="absolute inset-1" initial={place.initial} animate={place.animate} transition={place.transition}>
            <Brick color="yellow" studs={{ w: 2, h: 1 }} size={22} />
          </motion.span>
        )}
      </button>
      <p aria-live="polite" className="min-h-5 text-sm text-ink-inverse-2" data-egg-message>
        {placed ? "Every masterpiece starts with one brick." : ""}
      </p>
    </div>
  );
}
