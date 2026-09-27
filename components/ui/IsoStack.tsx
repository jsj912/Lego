import { useId } from "react";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";

export const C30 = Math.cos(Math.PI / 6); // 0.866
export const BRICK_H = 1.2; // brick height in stud units
const STUD_R = 0.3;
const STUD_H = 0.2;

const r = (n: number) => Math.round(n * 100) / 100;

export type IsoItem = {
  color: BrickColor;
  w: number;
  h: number;
  /** position in stud units; z counts whole bricks (1 = sitting on a brick) */
  x?: number;
  y?: number;
  z?: number;
  outline?: boolean;
};

type Props = {
  items: IsoItem[];
  /** pixel size of one stud cell */
  size?: number;
  glow?: boolean;
  shadow?: boolean;
  className?: string;
  label?: string;
};

/**
 * One or more original isometric bricks drawn in a shared 3D space, so stacked
 * bricks sit exactly on each other's studs. Pure SVG.
 */
export function IsoStack({ items, size = 24, glow, shadow = true, className, label }: Props) {
  const uid = useId().replace(/:/g, "");
  const u = size;
  const P = (x: number, y: number, z: number) => [r((x - y) * C30 * u), r(((x + y) * 0.5 - z) * u)] as const;
  const pts = (...p: (readonly [number, number])[]) => p.map((q) => q.join(",")).join(" ");

  const norm = items.map((it) => ({ ...it, x: it.x ?? 0, y: it.y ?? 0, zb: (it.z ?? 0) * BRICK_H }));

  // bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const it of norm) {
    const top = it.zb + BRICK_H + STUD_H;
    for (const [x, y] of [[it.x, it.y], [it.x + it.w, it.y], [it.x, it.y + it.h], [it.x + it.w, it.y + it.h]]) {
      for (const z of [it.zb, top]) {
        const [sx, sy] = P(x, y, z);
        minX = Math.min(minX, sx); maxX = Math.max(maxX, sx);
        minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
      }
    }
  }
  minY -= 2;
  maxY += shadow ? u * 0.4 : 2;
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  // painter's order: lower first, then further back first
  const order = [...norm].sort((a, b) => a.zb - b.zb || a.x + a.y - (b.x + b.y));
  const ground = norm.filter((it) => it.zb === 0);

  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const, focusable: "false" as const };

  return (
    <svg
      viewBox={`${r(minX)} ${r(minY)} ${r(vbW)} ${r(vbH)}`}
      width={r(vbW)}
      height={r(vbH)}
      className={cn("overflow-visible", glow && "drop-shadow-[0_0_14px_rgba(255,213,0,0.55)]", className)}
      {...a11y}
    >
      {shadow &&
        ground.map((it, i) => {
          const [cx, cy] = P(it.x + it.w / 2, it.y + it.h / 2, 0);
          return (
            <ellipse
              key={`s${i}`}
              cx={cx}
              cy={r(cy + u * 0.12)}
              rx={r(((it.w + it.h) / 2) * C30 * u)}
              ry={r(((it.w + it.h) / 4) * u * 0.55)}
              fill="rgba(17,17,17,0.14)"
              style={{ filter: "blur(6px)" }}
            />
          );
        })}
      {order.map((it, idx) => {
        const s = BRICK_SHADES[it.color];
        const { x, y, w, h, zb, outline } = it;
        const zt = zb + BRICK_H;
        const top = pts(P(x, y, zt), P(x + w, y, zt), P(x + w, y + h, zt), P(x, y + h, zt));
        const left = pts(P(x, y + h, zt), P(x + w, y + h, zt), P(x + w, y + h, zb), P(x, y + h, zb));
        const right = pts(P(x + w, y, zt), P(x + w, y + h, zt), P(x + w, y + h, zb), P(x + w, y, zb));
        const stroke = outline ? s.dark : "rgba(0,0,0,0.08)";
        const sw = outline ? 1.5 : 0.6;
        const dash = outline ? "4 3" : undefined;
        const fill = (c: string) => (outline ? "none" : c);
        const rx = r(STUD_R * Math.SQRT2 * C30 * u);
        const ry = r(STUD_R * Math.SQRT2 * 0.5 * u);
        const studs: { cx: number; t: number; b: number; k: number }[] = [];
        for (let i = 0; i < w; i++)
          for (let j = 0; j < h; j++) {
            const [cx, b] = P(x + i + 0.5, y + j + 0.5, zt);
            const [, t] = P(x + i + 0.5, y + j + 0.5, zt + STUD_H);
            studs.push({ cx, t, b, k: i + j });
          }
        studs.sort((a, b) => a.k - b.k);
        return (
          <g key={idx}>
            <defs>
              <linearGradient id={`t${uid}${idx}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={s.light} />
                <stop offset="1" stopColor={s.base} />
              </linearGradient>
            </defs>
            <polygon points={left} fill={fill(s.base)} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" strokeDasharray={dash} />
            <polygon points={right} fill={fill(s.dark)} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" strokeDasharray={dash} />
            <polygon points={top} fill={outline ? "none" : `url(#t${uid}${idx})`} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" strokeDasharray={dash} />
            {!outline && (
              <polyline points={pts(P(x, y + h, zt), P(x, y, zt), P(x + w, y, zt))} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1} strokeLinecap="round" />
            )}
            {studs.map((c, i) => (
              <g key={i}>
                <path
                  d={`M${r(c.cx - rx)},${c.t} L${r(c.cx - rx)},${c.b} A${rx},${ry} 0 0 0 ${r(c.cx + rx)},${c.b} L${r(c.cx + rx)},${c.t} Z`}
                  fill={fill(s.dark)}
                  stroke={outline ? stroke : "none"}
                  strokeWidth={outline ? 1.2 : 0}
                />
                <ellipse cx={c.cx} cy={c.t} rx={rx} ry={ry} fill={fill(s.light)} stroke={outline ? stroke : "rgba(255,255,255,0.35)"} strokeWidth={outline ? 1.2 : 0.6} />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
