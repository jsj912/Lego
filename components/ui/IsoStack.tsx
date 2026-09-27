import { useId, type ReactNode } from "react";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";

export const C30 = Math.cos(Math.PI / 6); // 0.866
export const PLATE = 0.4; // one plate in stud units; a brick is 3 plates
export const BRICK_H = 3 * PLATE;
const STUD_R = 0.3;
const STUD_H = 0.18;

const r = (n: number) => Math.round(n * 100) / 100;

type Base = {
  color: BrickColor;
  /** position in stud units (x, y) and plates (z) */
  x?: number;
  y?: number;
  z?: number;
  outline?: boolean;
};

export type IsoItem =
  | (Base & { kind?: "brick" | "plate" | "tile"; w: number; h: number; studs?: boolean })
  /** 1×1 round column piece */
  | (Base & { kind: "round"; w?: 1; h?: 1; studs?: boolean })
  /** beam with pin holes on its visible faces, no studs */
  | (Base & { kind: "beam"; w: number; h: number })
  /** gear standing on a visible face: "front" is the plane y = at, "side" is x = at; cx/cz/radius in stud units */
  | { kind: "gear"; color: BrickColor; face: "front" | "side"; at: number; cx: number; cz: number; radius: number; teeth?: number; spin?: boolean };

type Props = {
  items: IsoItem[];
  /** pixel size of one stud cell */
  size?: number;
  glow?: boolean;
  shadow?: boolean;
  className?: string;
  label?: string;
};

type Solid = Exclude<IsoItem, { kind: "gear" }>;
type Gear = Extract<IsoItem, { kind: "gear" }>;

const heightOf = (it: Solid) => (it.kind === "plate" || it.kind === "tile" ? PLATE : BRICK_H);
const hasStuds = (it: Solid) => it.kind !== "tile" && it.kind !== "beam" && ("studs" in it ? it.studs !== false : true);
const dims = (it: Solid) => ({ w: it.kind === "round" ? 1 : it.w, h: it.kind === "round" ? 1 : it.h });

function gearPath(cx: number, cy: number, radius: number, teeth: number) {
  const inner = radius * 0.8;
  const pts: string[] = [];
  const steps = teeth * 4;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = i % 4 === 0 || i % 4 === 1 ? radius : inner;
    pts.push(`${r(cx + Math.cos(a) * rr)},${r(cy + Math.sin(a) * rr)}`);
  }
  return `M${pts.join(" L")} Z`;
}

/**
 * Original brick models drawn in a shared isometric space: bricks, plates,
 * tiles, round columns, beams with pin holes and gears. Pure SVG.
 */
export function IsoStack({ items, size = 24, glow, shadow = true, className, label }: Props) {
  const uid = useId().replace(/:/g, "");
  const u = size;
  const P = (x: number, y: number, z: number) => [r((x - y) * C30 * u), r(((x + y) * 0.5 - z) * u)] as const;
  const pts = (...p: (readonly [number, number])[]) => p.map((q) => q.join(",")).join(" ");
  // affine maps from a face's local (a, z) coords to the screen
  const frontM = (Y: number) => `matrix(${r(C30 * u)} ${r(0.5 * u)} 0 ${-u} ${r(-C30 * u * Y)} ${r(0.5 * u * Y)})`;
  const sideM = (X: number) => `matrix(${r(-C30 * u)} ${r(0.5 * u)} 0 ${-u} ${r(C30 * u * X)} ${r(0.5 * u * X)})`;

  const solids = items.filter((i): i is Solid => i.kind !== "gear").map((it) => ({ it, x: it.x ?? 0, y: it.y ?? 0, zb: (it.z ?? 0) * PLATE, ...dims(it) }));
  const gears = items.filter((i): i is Gear => i.kind === "gear");

  // bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const grow = (sx: number, sy: number) => {
    minX = Math.min(minX, sx); maxX = Math.max(maxX, sx);
    minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
  };
  for (const s of solids) {
    const top = s.zb + heightOf(s.it) + STUD_H;
    for (const [x, y] of [[s.x, s.y], [s.x + s.w, s.y], [s.x, s.y + s.h], [s.x + s.w, s.y + s.h]])
      for (const z of [s.zb, top]) grow(...P(x, y, z));
  }
  for (const g of gears) {
    for (const [da, dz] of [[-1, -1], [1, 1], [-1, 1], [1, -1]]) {
      const a = g.cx + da * g.radius, z = g.cz + dz * g.radius;
      grow(...(g.face === "front" ? P(a, g.at + 0.3, z) : P(g.at + 0.3, a, z)));
    }
  }
  minY -= 2; minX -= 2; maxX += 2;
  maxY += shadow ? u * 0.4 : 2;
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  // painter's order: lower first, then further back first
  const order = [...solids].sort((a, b) => a.zb - b.zb || a.x + a.y - (b.x + b.y));
  const ground = solids.filter((s) => s.zb === 0);

  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const, focusable: "false" as const };

  const hole = (key: string, transform: string, a: number, z: number) => (
    <g key={key} transform={transform}>
      <circle cx={a} cy={z} r={0.3} fill="rgba(0,0,0,0.28)" vectorEffect="non-scaling-stroke" />
      <circle cx={a} cy={z} r={0.19} fill="rgba(0,0,0,0.55)" />
    </g>
  );

  const stud = (key: string, cx: number, cyTop: number, cyBot: number, s: (typeof BRICK_SHADES)[BrickColor], outline?: boolean) => {
    const rx = r(STUD_R * Math.SQRT2 * C30 * u);
    const ry = r(STUD_R * Math.SQRT2 * 0.5 * u);
    const stroke = outline ? s.dark : "none";
    return (
      <g key={key}>
        <path
          d={`M${r(cx - rx)},${cyTop} L${r(cx - rx)},${cyBot} A${rx},${ry} 0 0 0 ${r(cx + rx)},${cyBot} L${r(cx + rx)},${cyTop} Z`}
          fill={outline ? "none" : s.dark}
          stroke={stroke}
          strokeWidth={outline ? 1.2 : 0}
        />
        <ellipse cx={cx} cy={cyTop} rx={rx} ry={ry} fill={outline ? "none" : s.light} stroke={outline ? s.dark : "rgba(255,255,255,0.35)"} strokeWidth={outline ? 1.2 : 0.6} />
      </g>
    );
  };

  function renderSolid({ it, x, y, zb, w, h }: (typeof solids)[number], idx: number): ReactNode {
    const s = BRICK_SHADES[it.color];
    const outline = it.outline;
    const zt = zb + heightOf(it);
    const stroke = outline ? s.dark : "rgba(0,0,0,0.1)";
    const sw = outline ? 1.5 : 0.6;
    const dash = outline ? "4 3" : undefined;
    const fill = (c: string) => (outline ? "none" : c);

    if (it.kind === "round") {
      const cx0 = x + 0.5, cy0 = y + 0.5, rad = 0.46;
      const rx = r(rad * Math.SQRT2 * C30 * u), ry = r(rad * Math.SQRT2 * 0.5 * u);
      const [cx, bot] = P(cx0, cy0, zb);
      const [, top] = P(cx0, cy0, zt);
      return (
        <g key={idx}>
          <defs>
            <linearGradient id={`r${uid}${idx}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor={s.base} />
              <stop offset="0.35" stopColor={s.light} />
              <stop offset="1" stopColor={s.dark} />
            </linearGradient>
          </defs>
          <path
            d={`M${r(cx - rx)},${top} L${r(cx - rx)},${bot} A${rx},${ry} 0 0 0 ${r(cx + rx)},${bot} L${r(cx + rx)},${top} Z`}
            fill={outline ? "none" : `url(#r${uid}${idx})`}
            stroke={stroke}
            strokeWidth={sw}
            strokeDasharray={dash}
          />
          <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={fill(s.light)} stroke={stroke} strokeWidth={sw} />
          {hasStuds(it) && stud("s", cx, r(top - STUD_H * u), top, s, outline)}
        </g>
      );
    }

    const top = pts(P(x, y, zt), P(x + w, y, zt), P(x + w, y + h, zt), P(x, y + h, zt));
    const left = pts(P(x, y + h, zt), P(x + w, y + h, zt), P(x + w, y + h, zb), P(x, y + h, zb));
    const right = pts(P(x + w, y, zt), P(x + w, y + h, zt), P(x + w, y + h, zb), P(x + w, y, zb));

    const studs: ReactNode[] = [];
    if (hasStuds(it)) {
      const cells: { cx: number; t: number; b: number; k: number }[] = [];
      for (let i = 0; i < w; i++)
        for (let j = 0; j < h; j++) {
          const [cx, b] = P(x + i + 0.5, y + j + 0.5, zt);
          const [, t] = P(x + i + 0.5, y + j + 0.5, zt + STUD_H);
          cells.push({ cx, t, b, k: i + j });
        }
      cells.sort((a, b) => a.k - b.k).forEach((c, i) => studs.push(stud(`s${i}`, c.cx, c.t, c.b, s, outline)));
    }

    const holes: ReactNode[] = [];
    if (it.kind === "beam") {
      const zc = zb + heightOf(it) / 2;
      for (let i = 0; i < w; i++) holes.push(hole(`hf${i}`, frontM(y + h), x + i + 0.5, zc));
      for (let j = 0; j < h; j++) holes.push(hole(`hs${j}`, sideM(x + w), y + j + 0.5, zc));
    }

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
        {holes}
        {studs}
      </g>
    );
  }

  function renderGear(g: Gear, idx: number) {
    const s = BRICK_SHADES[g.color];
    const teeth = g.teeth ?? Math.max(8, Math.round(g.radius * 10));
    const m = (d: number) => (g.face === "front" ? frontM(g.at + d) : sideM(g.at + d));
    // local coords: (a, z) with z up; the matrix flips z, so draw with y = z
    const body = (d: number, fillC: string) => (
      <g transform={m(d)}>
        <g className={g.spin ? "gear-spin" : undefined}>
          <path d={gearPath(g.cx, g.cz, g.radius, teeth)} fill={fillC} stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          {d > 0 && (
            <>
              <circle cx={g.cx} cy={g.cz} r={g.radius * 0.55} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
              {[0, 1, 2, 3].map((k) => {
                const a = (k * Math.PI) / 2 + Math.PI / 4;
                return <circle key={k} cx={g.cx + Math.cos(a) * g.radius * 0.45} cy={g.cz + Math.sin(a) * g.radius * 0.45} r={g.radius * 0.12} fill="rgba(0,0,0,0.25)" />;
              })}
              <rect x={g.cx - 0.2} y={g.cz - 0.06} width={0.4} height={0.12} fill="rgba(0,0,0,0.6)" />
              <rect x={g.cx - 0.06} y={g.cz - 0.2} width={0.12} height={0.4} fill="rgba(0,0,0,0.6)" />
            </>
          )}
        </g>
      </g>
    );
    return (
      <g key={`g${idx}`}>
        {body(0.08, s.dark)}
        {body(0.22, s.light)}
      </g>
    );
  }

  return (
    <svg
      viewBox={`${r(minX)} ${r(minY)} ${r(vbW)} ${r(vbH)}`}
      width={r(vbW)}
      height={r(vbH)}
      className={cn("overflow-visible", glow && "drop-shadow-[0_0_14px_rgba(255,213,0,0.55)]", className)}
      {...a11y}
    >
      {shadow &&
        ground.map((g, i) => {
          const [cx, cy] = P(g.x + g.w / 2, g.y + g.h / 2, 0);
          return (
            <ellipse
              key={`sh${i}`}
              cx={cx}
              cy={r(cy + u * 0.12)}
              rx={r(((g.w + g.h) / 2) * C30 * u)}
              ry={r(((g.w + g.h) / 4) * u * 0.55)}
              fill="rgba(17,17,17,0.14)"
              style={{ filter: "blur(6px)" }}
            />
          );
        })}
      {order.map(renderSolid)}
      {gears.map(renderGear)}
    </svg>
  );
}
