import { useId } from "react";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";

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

const C30 = Math.cos(Math.PI / 6); // 0.866
const BRICK_H = 1.2; // brick height in stud units
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
    const { w, h } = studs;
    const u = size;
    // isometric projection of (x, y, z) in stud units
    const P = (x: number, y: number, z: number) => [r((x - y) * C30 * u), r(((x + y) * 0.5 - z) * u)] as const;
    const pts = (...p: (readonly [number, number])[]) => p.map((q) => q.join(",")).join(" ");

    const minX = -h * C30 * u;
    const maxX = w * C30 * u;
    const minY = -(BRICK_H + STUD_H) * u - 2;
    const maxY = ((w + h) * 0.5) * u + u * 0.35; // room for contact shadow
    const vbW = maxX - minX;
    const vbH = maxY - minY;

    const top = pts(P(0, 0, BRICK_H), P(w, 0, BRICK_H), P(w, h, BRICK_H), P(0, h, BRICK_H));
    const left = pts(P(0, h, BRICK_H), P(w, h, BRICK_H), P(w, h, 0), P(0, h, 0));
    const right = pts(P(w, 0, BRICK_H), P(w, h, BRICK_H), P(w, h, 0), P(w, 0, 0));

    const rx = r(STUD_R * Math.SQRT2 * C30 * u);
    const ry = r(STUD_R * Math.SQRT2 * 0.5 * u);
    const cells: { cx: number; cyTop: number; cyBot: number; k: number }[] = [];
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        const [cx, cyBot] = P(i + 0.5, j + 0.5, BRICK_H);
        const [, cyTop] = P(i + 0.5, j + 0.5, BRICK_H + STUD_H);
        cells.push({ cx, cyTop, cyBot, k: i + j });
      }
    }
    cells.sort((a, b) => a.k - b.k);
    const [shX, shY] = P(w / 2, h / 2, 0);

    const stroke = outline ? shade.dark : "rgba(0,0,0,0.08)";
    const fill = (c: string) => (outline ? "none" : c);

    return (
      <svg
        viewBox={`${r(minX)} ${r(minY)} ${r(vbW)} ${r(vbH)}`}
        width={r(vbW)}
        height={r(vbH)}
        className={cn("overflow-visible", glowClass, className)}
        {...a11y}
      >
        <defs>
          <linearGradient id={`t${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shade.light} />
            <stop offset="1" stopColor={shade.base} />
          </linearGradient>
        </defs>
        {!outline && (
          <ellipse
            cx={shX}
            cy={r(shY + u * 0.12)}
            rx={r(((w + h) / 2) * C30 * u)}
            ry={r(((w + h) / 4) * u * 0.55)}
            fill="rgba(17,17,17,0.14)"
            style={{ filter: "blur(6px)" }}
          />
        )}
        <polygon points={left} fill={fill(shade.base)} stroke={stroke} strokeWidth={outline ? 1.5 : 0.6} strokeLinejoin="round" strokeDasharray={outline ? "4 3" : undefined} />
        <polygon points={right} fill={fill(shade.dark)} stroke={stroke} strokeWidth={outline ? 1.5 : 0.6} strokeLinejoin="round" strokeDasharray={outline ? "4 3" : undefined} />
        <polygon points={top} fill={outline ? "none" : `url(#t${uid})`} stroke={stroke} strokeWidth={outline ? 1.5 : 0.6} strokeLinejoin="round" strokeDasharray={outline ? "4 3" : undefined} />
        {!outline && (
          <polyline
            points={pts(P(0, h, BRICK_H), P(0, 0, BRICK_H), P(w, 0, BRICK_H))}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1}
            strokeLinecap="round"
          />
        )}
        {cells.map((c, i) => (
          <g key={i}>
            <path
              d={`M${r(c.cx - rx)},${c.cyTop} L${r(c.cx - rx)},${c.cyBot} A${rx},${ry} 0 0 0 ${r(c.cx + rx)},${c.cyBot} L${r(c.cx + rx)},${c.cyTop} Z`}
              fill={fill(shade.dark)}
              stroke={outline ? stroke : "none"}
              strokeWidth={outline ? 1.2 : 0}
            />
            <ellipse cx={c.cx} cy={c.cyTop} rx={rx} ry={ry} fill={fill(shade.light)} stroke={outline ? stroke : "rgba(255,255,255,0.35)"} strokeWidth={outline ? 1.2 : 0.6} />
          </g>
        ))}
      </svg>
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
