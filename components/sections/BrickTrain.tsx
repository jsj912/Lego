"use client";

import { useRef } from "react";
import { useOffscreenPause } from "@/hooks/useOffscreenPause";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";

const RAIL_Y = 62;

function Wheel({ x, r = 8 }: { x: number; r?: number }) {
  const y = RAIL_Y - r;
  return (
    <g className="wheel-spin anim-pausable">
      <circle cx={x} cy={y} r={r} fill="#1c1c1c" />
      <circle cx={x} cy={y} r={r - 2.5} fill="none" stroke="#9ea3a8" strokeWidth={1.5} />
      <line x1={x - r + 2} y1={y} x2={x + r - 2} y2={y} stroke="#9ea3a8" strokeWidth={1.5} />
      <line x1={x} y1={y - r + 2} x2={x} y2={y + r - 2} stroke="#9ea3a8" strokeWidth={1.5} />
      <circle cx={x} cy={y} r={2.2} fill="#ffd500" />
    </g>
  );
}

/** a side-on brick: body plus studs along the top */
function SideBrick({ x, y, w, h = 14, color }: { x: number; y: number; w: number; h?: number; color: BrickColor }) {
  const s = BRICK_SHADES[color];
  const studs = Math.max(1, Math.round(w / 12));
  const gap = w / studs;
  return (
    <g>
      {Array.from({ length: studs }, (_, i) => (
        <rect key={i} x={x + gap * i + gap / 2 - 3.5} y={y - 3} width={7} height={3.5} rx={1} fill={s.dark} />
      ))}
      <rect x={x} y={y} width={w} height={h} rx={1.5} fill={s.base} />
      <rect x={x} y={y} width={w} height={2.5} rx={1.2} fill={s.light} />
      <rect x={x} y={y + h - 2.5} width={w} height={2.5} fill={s.dark} />
    </g>
  );
}

function Wagon({ x, cargo }: { x: number; cargo: [BrickColor, BrickColor, BrickColor] }) {
  return (
    <g>
      <rect x={x + 84} y={48} width={14} height={3} fill="#5c6166" />
      <rect x={x} y={44} width={86} height={8} rx={2} fill="#2a2a2a" />
      <SideBrick x={x + 5} y={30} w={36} color={cargo[0]} />
      <SideBrick x={x + 45} y={30} w={36} color={cargo[1]} />
      <SideBrick x={x + 24} y={16} w={36} color={cargo[2]} />
      <Wheel x={x + 18} r={7} />
      <Wheel x={x + 68} r={7} />
    </g>
  );
}

/** A brick freight train that trundles along the top of the footer. Decorative. */
export function BrickTrain() {
  const ref = useRef<HTMLDivElement>(null);
  useOffscreenPause(ref);
  return (
    <div ref={ref} aria-hidden className="train-yard relative h-24 overflow-hidden" data-brick-train>
      <div className="train-run anim-pausable absolute bottom-[10px] left-0">
        <svg viewBox="0 0 470 66" width={470} height={66} className="block overflow-visible" focusable="false">
          <Wagon x={4} cargo={["yellow", "blue", "red"]} />
          <Wagon x={102} cargo={["green", "red", "yellow"]} />
          <Wagon x={200} cargo={["blue", "yellow", "green"]} />
          {/* engine */}
          <g>
            <rect x={300} y={44} width={150} height={9} rx={2} fill="#2a2a2a" />
            <polygon points="450,53 464,53 450,36" fill="#9ea3a8" />
            <SideBrick x={352} y={22} w={92} h={22} color="red" />
            <rect x={352} y={36} width={92} height={3} fill="#ffd500" />
            <SideBrick x={306} y={8} w={46} h={36} color="blue" />
            <rect x={314} y={15} width={30} height={15} rx={2} fill="#dcecff" />
            <rect x={314} y={15} width={30} height={5} rx={2} fill="#ffffff" opacity={0.7} />
            <rect x={300} y={3} width={58} height={6} rx={2} fill="#1c1c1c" />
            <rect x={416} y={6} width={13} height={16} fill="#2a2a2a" />
            <rect x={412} y={1} width={21} height={6} rx={2} fill="#ffd500" />
            <circle cx={440} cy={30} r={3.5} fill="#ffe34d" />
            <g fill="#c9cdd1">
              <circle className="smoke-puff anim-pausable" cx={422} cy={-6} r={6} opacity={0} />
              <circle className="smoke-puff anim-pausable" cx={422} cy={-6} r={5} opacity={0} style={{ animationDelay: "-1.2s" }} />
              <circle className="smoke-puff anim-pausable" cx={422} cy={-6} r={4} opacity={0} style={{ animationDelay: "-2.4s" }} />
            </g>
            <Wheel x={322} />
            <Wheel x={372} r={10} />
            <Wheel x={400} r={10} />
            <Wheel x={432} />
          </g>
        </svg>
      </div>
      <div className="train-rail absolute inset-x-0 bottom-0 h-[10px]" />
    </div>
  );
}
