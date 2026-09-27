import { useId } from "react";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { BRICK_H, IsoStack } from "./IsoStack";

type BrickProps = {
  color?: BrickColor;
  /** studs across (w) and deep (h) */
  studs?: { w: number; h: number };
  /** pixel size of one stud cell */
  size?: number;
  isometric?: boolean;
  glow?: boolean;
  /** draw only an outline (an unplaced / upcoming brick) */
  outline?: boolean;
  className?: string;
  /** accessible name; omitted → decorative (aria-hidden) */
  label?: string;
};

const STUD_R = 0.3;
const STUD_H = 0.2;

const r = (n: number) => Math.round(n * 100) / 100;

/** Original brick-building graphic. Pure SVG, no images. */
export function Brick({
  color = "red",
  studs = { w: 2, h: 2 },
  size = 24,
  isometric = false,
  glow = false,
  outline = false,
  className,
  label,
}: BrickProps) {
  const uid = useId().replace(/:/g, "");
  const shade = BRICK_SHADES[color];
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const, focusable: "false" as const };

  const glowClass = glow ? "drop-shadow-[0_0_14px_rgba(255,213,0,0.55)]" : undefined;

  if (isometric) {
    return (
      <IsoStack
        items={[{ color, w: studs.w, h: studs.h, outline }]}
        size={size}
        glow={glow}
        shadow={!outline}
        className={className}
        label={label}
      />
    );
  }

  // Front (flat) view
  const w = studs.w;
  const u = size;
  const bodyH = BRICK_H * u;
  const studH = STUD_H * u * 1.1;
  const studW = STUD_R * 2 * u;
  const vbW = w * u;
  const vbH = bodyH + studH + u * 0.25;
  const rad = Math.min(u * 0.14, 5);
  const stroke = outline ? shade.dark : "none";

  return (
    <svg
      viewBox={`0 0 ${r(vbW)} ${r(vbH)}`}
      width={r(vbW)}
      height={r(vbH)}
      className={cn("overflow-visible", glowClass, className)}
      {...a11y}
    >
      <defs>
        <linearGradient id={`b${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade.light} />
          <stop offset="0.18" stopColor={shade.base} />
          <stop offset="1" stopColor={shade.dark} />
        </linearGradient>
      </defs>
      {!outline && (
        <ellipse
          cx={r(vbW / 2)}
          cy={r(studH + bodyH + u * 0.08)}
          rx={r(vbW * 0.46)}
          ry={r(u * 0.12)}
          fill="rgba(17,17,17,0.18)"
          style={{ filter: "blur(3px)" }}
        />
      )}
      {Array.from({ length: w }, (_, i) => (
        <rect
          key={i}
          x={r(i * u + (u - studW) / 2)}
          y={0}
          width={r(studW)}
          height={r(studH + rad)}
          rx={r(Math.min(studW * 0.18, 3))}
          fill={outline ? "none" : shade.base}
          stroke={outline ? stroke : "rgba(0,0,0,0.06)"}
          strokeWidth={outline ? 1.4 : 0.6}
          strokeDasharray={outline ? "3 3" : undefined}
        />
      ))}
      <rect
        x={0.5}
        y={r(studH)}
        width={r(vbW - 1)}
        height={r(bodyH)}
        rx={rad}
        fill={outline ? "none" : `url(#b${uid})`}
        stroke={outline ? stroke : "rgba(0,0,0,0.08)"}
        strokeWidth={outline ? 1.6 : 0.6}
        strokeDasharray={outline ? "5 4" : undefined}
      />
      {!outline && (
        <rect x={rad} y={r(studH + 1.5)} width={r(vbW - rad * 2)} height={1.2} rx={0.6} fill="rgba(255,255,255,0.5)" />
      )}
    </svg>
  );
}
