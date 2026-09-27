"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Brick } from "@/components/ui/Brick";
import { SnapButton } from "@/components/ui/SnapButton";
import { useMotionSafe } from "@/hooks/useMotionSafe";

export function PlaceDemo() {
  const [n, setN] = useState(0);
  const { place } = useMotionSafe();
  return (
    <div className="flex items-end gap-6">
      <div className="flex h-28 items-end">
        <motion.div key={n} {...place}>
          <Brick color="blue" studs={{ w: 2, h: 2 }} size={30} isometric />
        </motion.div>
      </div>
      <SnapButton variant="ghost" size="sm" onClick={() => setN((v) => v + 1)}>
        Replay place
      </SnapButton>
    </div>
  );
}
