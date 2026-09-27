"use client";

import { useRef } from "react";
import { Brick } from "@/components/ui/Brick";
import { Stud } from "@/components/ui/Stud";
import { useOffscreenPause } from "@/hooks/useOffscreenPause";
import type { BrickColor } from "@/lib/bricks";

// ≤ 8 decorative elements, CSS transforms only, paused off-screen.
const ITEMS: { kind: "brick" | "stud"; color: BrickColor; pos: string; r: string; delay: string; size: number }[] = [
  { kind: "brick", color: "yellow", pos: "left-[4vw] top-[22vh]", r: "-12deg", delay: "0s", size: 16 },
  { kind: "stud", color: "red", pos: "left-[38vw] top-[14vh]", r: "0deg", delay: "-2s", size: 22 },
  { kind: "brick", color: "blue", pos: "left-[44vw] bottom-[12vh]", r: "10deg", delay: "-4s", size: 12 },
  { kind: "stud", color: "green", pos: "right-[6vw] top-[16vh]", r: "0deg", delay: "-1s", size: 18 },
  { kind: "brick", color: "white", pos: "right-[3vw] bottom-[20vh]", r: "-8deg", delay: "-6s", size: 14 },
  { kind: "stud", color: "yellow", pos: "left-[12vw] bottom-[10vh]", r: "0deg", delay: "-3s", size: 16 },
];

export function FloatingBricks() {
  const ref = useRef<HTMLDivElement>(null);
  useOffscreenPause(ref);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      {ITEMS.map((it, i) => (
        <div
          key={i}
          className={`motion-float anim-pausable absolute animate-float ${it.pos} ${i > 3 ? "hidden md:block" : ""}`}
          style={{ ["--r" as string]: it.r, animationDelay: it.delay }}
        >
          {it.kind === "brick" ? (
            <Brick color={it.color} studs={{ w: 2, h: 1 }} size={it.size} isometric />
          ) : (
            <Stud color={it.color} size={it.size} />
          )}
        </div>
      ))}
    </div>
  );
}
