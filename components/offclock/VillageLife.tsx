import type { CSSProperties } from "react";
import { IsoStack, type IsoItem } from "@/components/ui/IsoStack";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";

// Village life for the /off-the-clock street: sky, far houses, traffic and a
// meadow in front. All original, all decorative (callers mark it aria-hidden).

// ───────── sky ─────────

/** A round-plate sun with slowly turning rays. */
export function BrickSun({ size = 110 }: { size?: number }) {
  return (
    <svg viewBox="-60 -60 120 120" width={size} height={size} aria-hidden>
      <g className="sun-rays">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={-4} y={-56} width={8} height={16} rx={2} fill="#ffd500" opacity={0.85} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r={34} fill="#ddb400" cy={3} />
      <circle r={34} fill="#ffd500" />
      <circle r={34} fill="none" stroke="#fff3a6" strokeWidth={3} opacity={0.7} />
      {[[-13, -10], [13, -10], [-13, 12], [13, 12]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 2} rx={8} ry={6} fill="#ddb400" />
          <ellipse cx={x} cy={y} rx={8} ry={6} fill="#ffe34d" />
        </g>
      ))}
    </svg>
  );
}

/** A striped hot-air balloon built from bricks. */
export function Balloon({ size = 70 }: { size?: number }) {
  const rows: [number, string][] = [[18, "#d01012"], [28, "#ffd500"], [32, "#d01012"], [32, "#ffffff"], [28, "#0055bf"], [20, "#ffd500"], [12, "#d01012"]];
  return (
    <svg viewBox="0 0 70 110" width={size} height={(size * 110) / 70} aria-hidden>
      {rows.map(([w, fill], i) => (
        <rect key={i} x={35 - w} y={6 + i * 10} width={w * 2} height={10} rx={2} fill={fill} stroke="rgba(0,0,0,0.12)" />
      ))}
      <path d="M24 76 L29 92 M46 76 L41 92" stroke="#5c4a36" strokeWidth={1.5} />
      <rect x={27} y={92} width={16} height={11} rx={2} fill="#8a5a3c" />
      <rect x={27} y={92} width={16} height={3} rx={1.5} fill="#a8744f" />
    </svg>
  );
}

/** Three birds crossing the sky. */
export function Birds() {
  return (
    <svg viewBox="0 0 90 40" width={90} height={40} aria-hidden>
      {[[10, 22, 1], [38, 10, 0.8], [62, 26, 0.9]].map(([x, y, s], i) => (
        <path key={i} d={`M${x} ${y} q${6 * s} ${-8 * s} ${12 * s} 0 q${6 * s} ${-8 * s} ${12 * s} 0`} fill="none" stroke="#3f4a57" strokeWidth={2.2} strokeLinecap="round" />
      ))}
    </svg>
  );
}

// ───────── far village on the hills ─────────

const WALLS = ["#ecdcbd", "#e2b49a", "#cfdbe6", "#f1e3a6", "#e6c9c0"];
const ROOFS = ["#b5523b", "#6f7f8c", "#4f7d5a", "#8a5a3c"];
const BASE = 100;

/** Houses, windmills and a church standing on the far hill. Drawn inside the hills SVG. */
export function FarVillage({ width }: { width: number }) {
  const n = Math.floor(width / 150);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = 50 + i * 150 + ((i * 53) % 60);
        if (i % 7 === 3) {
          // windmill
          return (
            <g key={i}>
              <path d={`M${x} ${BASE} L${x + 8} ${BASE - 48} H${x + 22} L${x + 30} ${BASE} Z`} fill="#f3efe4" stroke="#cfc8b6" />
              <path d={`M${x + 5} ${BASE - 48} L${x + 15} ${BASE - 60} L${x + 25} ${BASE - 48} Z`} fill="#b5523b" />
              <rect x={x + 12} y={BASE - 14} width={6} height={14} fill="#8a5a3c" />
              <rect x={x + 12} y={BASE - 34} width={6} height={6} fill="#9cc8ee" />
              <g className="windmill-spin">
                {[0, 90, 180, 270].map((a) => (
                  <g key={a} transform={`rotate(${a} ${x + 15} ${BASE - 48})`}>
                    <rect x={x + 14} y={BASE - 76} width={2} height={28} fill="#7a6a52" />
                    <rect x={x + 16} y={BASE - 76} width={8} height={20} fill="#fbfaf4" stroke="#cfc8b6" />
                  </g>
                ))}
                <circle cx={x + 15} cy={BASE - 48} r={3} fill="#5c4a36" />
              </g>
            </g>
          );
        }
        if (i % 9 === 5) {
          // church with a clock
          return (
            <g key={i}>
              <rect x={x} y={BASE - 30} width={44} height={30} fill="#f3efe4" stroke="#cfc8b6" />
              <path d={`M${x - 3} ${BASE - 30} L${x + 22} ${BASE - 46} L${x + 47} ${BASE - 30} Z`} fill="#6f7f8c" />
              <rect x={x + 44} y={BASE - 54} width={16} height={54} fill="#f3efe4" stroke="#cfc8b6" />
              <path d={`M${x + 42} ${BASE - 54} L${x + 52} ${BASE - 76} L${x + 62} ${BASE - 54} Z`} fill="#b5523b" />
              <circle cx={x + 52} cy={BASE - 42} r={5} fill="#fff" stroke="#5c4a36" />
              <path d={`M${x + 52} ${BASE - 42} v-3.5 M${x + 52} ${BASE - 42} h2.5`} stroke="#5c4a36" strokeWidth={1} />
              <path d={`M${x + 18} ${BASE} v-12 a4 4 0 0 1 8 0 v12 Z`} fill="#8a5a3c" />
              {[8, 32].map((dx) => (
                <rect key={dx} x={x + dx} y={BASE - 22} width={5} height={9} rx={2.5} fill="#ffe9a8" />
              ))}
            </g>
          );
        }
        const w = 34 + ((i * 17) % 22);
        const h = 24 + ((i * 11) % 16);
        const wall = WALLS[i % WALLS.length];
        const roof = ROOFS[(i * 3) % ROOFS.length];
        return (
          <g key={i}>
            {i % 4 === 1 && <rect x={x + w - 12} y={BASE - h - 16} width={6} height={12} fill="#a4552b" />}
            <rect x={x} y={BASE - h} width={w} height={h} fill={wall} stroke="rgba(0,0,0,0.12)" />
            <path d={`M${x - 4} ${BASE - h} L${x + w / 2} ${BASE - h - 15} L${x + w + 4} ${BASE - h} Z`} fill={roof} />
            <rect x={x + 6} y={BASE - h + 7} width={7} height={7} fill="#ffe9a8" stroke="rgba(0,0,0,0.2)" />
            <rect x={x + w - 13} y={BASE - h + 7} width={7} height={7} fill="#ffe9a8" stroke="rgba(0,0,0,0.2)" />
            <rect x={x + w / 2 - 3.5} y={BASE - 12} width={7} height={12} fill="#8a5a3c" />
            {/* a round tree beside every other house */}
            {i % 2 === 0 && (
              <>
                <rect x={x + w + 9} y={BASE - 10} width={3} height={10} fill="#6b4c2f" />
                <circle cx={x + w + 10.5} cy={BASE - 16} r={9} fill="#2f7f45" />
                <circle cx={x + w + 8} cy={BASE - 19} r={3} fill="#4ea463" />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ───────── street furniture ─────────

const FOUNTAIN: IsoItem[] = [
  { kind: "disc", color: "grey", d: 5, x: 0, y: 0, z: 0, studs: false },
  { kind: "disc", color: "blue", d: 4, x: 0.5, y: 0.5, z: 1, studs: false },
  { kind: "round", color: "white", x: 2, y: 2, z: 2, studs: false },
  { kind: "disc", color: "white", d: 2, x: 1.5, y: 1.5, z: 5, studs: false },
  { kind: "round", color: "blue", x: 2, y: 2, z: 6 },
];

const MAILBOX: IsoItem[] = [
  { kind: "round", color: "dark", x: 0, y: 0, z: 0, studs: false },
  { color: "red", w: 1, h: 1, x: 0, y: 0, z: 3, studs: false, decals: [{ face: "front", a: 0.15, z: 0.75, w: 0.7, h: 0.14, fill: "#111111" }] },
  { kind: "plate", color: "red", w: 1, h: 1, x: 0, y: 0, z: 6 },
];

/** The village fountain, with water drops. */
export function Fountain() {
  return (
    <div className="relative">
      <IsoStack items={FOUNTAIN} size={18} />
      {[0, 1, 2].map((i) => (
        <span key={i} className="fountain-drop absolute left-1/2 top-1 h-2 w-2 rounded-full bg-[#8ec5ff]" style={{ ["--dx" as string]: `${(i - 1) * 16}px`, animationDelay: `${-i * 0.5}s` } as CSSProperties} />
      ))}
    </div>
  );
}

export function Mailbox() {
  return <IsoStack items={MAILBOX} size={15} />;
}

/** A side-on park bench. */
export function Bench() {
  return (
    <svg viewBox="0 0 70 40" width={70} height={40} aria-hidden>
      <rect x={6} y={4} width={58} height={6} rx={2} fill="#8a5a3c" />
      <rect x={6} y={13} width={58} height={6} rx={2} fill="#a8744f" />
      <rect x={2} y={22} width={66} height={6} rx={2} fill="#8a5a3c" />
      <rect x={8} y={4} width={4} height={34} fill="#3f4347" />
      <rect x={58} y={4} width={4} height={34} fill="#3f4347" />
    </svg>
  );
}

/** A string of flags, hung between two buildings. */
export function Bunting({ width = 260 }: { width?: number }) {
  const n = Math.max(5, Math.round(width / 26));
  const sag = 26;
  const colors = ["#d01012", "#ffd500", "#0055bf", "#237841", "#ffffff"];
  const at = (t: number) => [t * width, 4 + sag * 4 * t * (1 - t)] as const;
  return (
    <svg viewBox={`0 0 ${width} ${sag + 30}`} width={width} height={sag + 30} aria-hidden className="bunting-sway block overflow-visible">
      <path d={`M0 4 Q${width / 2} ${4 + sag * 2} ${width} 4`} fill="none" stroke="#5c4a36" strokeWidth={1.5} />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = at((i + 0.5) / n);
        return <path key={i} d={`M${x - 8} ${y} L${x + 8} ${y} L${x} ${y + 17} Z`} fill={colors[i % colors.length]} stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} />;
      })}
    </svg>
  );
}

// ───────── road ─────────

/** A little brick car, side on. Wheels turn. */
export function BrickCar({ color = "red", flip }: { color?: BrickColor; flip?: boolean }) {
  const s = BRICK_SHADES[color];
  return (
    <svg viewBox="0 0 110 54" width={110} height={54} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {[22, 44, 66].map((x) => (
        <rect key={x} x={x} y={5} width={10} height={5} rx={1.5} fill={s.dark} />
      ))}
      <rect x={16} y={9} width={66} height={18} rx={3} fill={s.base} />
      <rect x={24} y={13} width={22} height={12} rx={2} fill="#dcecff" />
      <rect x={52} y={13} width={22} height={12} rx={2} fill="#dcecff" />
      <rect x={4} y={26} width={102} height={16} rx={4} fill={s.base} />
      <rect x={4} y={26} width={102} height={4} rx={2} fill={s.light} />
      <rect x={4} y={38} width={102} height={4} fill={s.dark} />
      <rect x={100} y={30} width={6} height={5} rx={1} fill="#ffe34d" />
      <rect x={4} y={30} width={5} height={5} rx={1} fill="#a60b0d" />
      {[26, 84].map((x) => (
        <g key={x} className="wheel-spin">
          <circle cx={x} cy={43} r={9} fill="#1c1c1c" />
          <circle cx={x} cy={43} r={4} fill="#c3c7ca" />
          <path d={`M${x - 7} 43 H${x + 7} M${x} 36 V50`} stroke="#5c6166" strokeWidth={1.5} />
        </g>
      ))}
    </svg>
  );
}

// ───────── meadow in front of the road ─────────

/** A pond with two paddling brick ducks. */
export function Pond({ width = 220 }: { width?: number }) {
  return (
    <svg viewBox="0 0 220 70" width={width} height={(width * 70) / 220} aria-hidden>
      <ellipse cx={110} cy={40} rx={106} ry={28} fill="#2f7f45" />
      <ellipse cx={110} cy={38} rx={100} ry={25} fill="#3f9be0" />
      <ellipse cx={90} cy={32} rx={48} ry={9} fill="#7cc0f2" opacity={0.6} />
      <ellipse className="pond-ripple" cx={150} cy={44} rx={22} ry={5} fill="none" stroke="#dcecff" strokeWidth={1.5} />
      {[[70, 30, 1], [136, 40, -1]].map(([x, y, d], i) => (
        <g key={i} className="duck-bob" style={{ animationDelay: `${-i * 0.9}s` }} transform={`translate(${x} ${y}) scale(${d} 1)`}>
          <rect x={-10} y={-4} width={20} height={9} rx={2} fill="#ffd500" />
          <rect x={4} y={-12} width={10} height={9} rx={2} fill="#ffd500" />
          <rect x={13} y={-8} width={6} height={3.5} rx={1} fill="#e8403f" />
          <circle cx={10} cy={-8.5} r={1.2} fill="#111" />
          <rect x={-4} y={-6} width={7} height={3} rx={1} fill="#ffe34d" />
        </g>
      ))}
      {[[18, 44], [196, 30], [204, 46]].map(([x, y], i) => (
        <g key={`r${i}`}>
          <rect x={x} y={y - 16} width={2.5} height={16} fill="#1a5c32" />
          <rect x={x - 1.5} y={y - 22} width={5.5} height={8} rx={2} fill="#6b4c2f" />
        </g>
      ))}
    </svg>
  );
}

/** A clump of brick flowers. */
export function Flowers({ colors = ["#d01012", "#ffd500", "#ffffff"] }: { colors?: string[] }) {
  return (
    <svg viewBox="0 0 60 34" width={60} height={34} aria-hidden>
      {colors.map((c, i) => {
        const x = 10 + i * 20;
        const h = 14 + ((i * 7) % 9);
        return (
          <g key={i}>
            <rect x={x - 1} y={34 - h} width={2.5} height={h} fill="#1a5c32" />
            <rect x={x + 1} y={34 - h / 2} width={7} height={3} rx={1.5} fill="#2f7f45" />
            <circle cx={x} cy={34 - h - 4} r={6} fill={c} stroke="rgba(0,0,0,0.15)" />
            <circle cx={x} cy={34 - h - 4} r={2.2} fill="#ffb400" />
          </g>
        );
      })}
    </svg>
  );
}

/** A round bush with a few studs. */
export function Bush({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 40" width={size} height={(size * 40) / 64} aria-hidden>
      <ellipse cx={20} cy={26} rx={18} ry={14} fill="#237841" />
      <ellipse cx={42} cy={24} rx={20} ry={16} fill="#2f8f4f" />
      <ellipse cx={30} cy={18} rx={14} ry={12} fill="#3a9559" />
      {[[22, 14], [36, 10], [46, 20], [14, 24]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={4} ry={2.6} fill="rgba(255,255,255,0.22)" />
      ))}
    </svg>
  );
}

/** A sleepy brick cat. */
export function Cat() {
  return (
    <svg viewBox="0 0 46 30" width={46} height={30} aria-hidden>
      <path className="cat-tail" d="M6 22 q-6 -10 2 -16" fill="none" stroke="#3a3a3a" strokeWidth={4} strokeLinecap="round" />
      <rect x={6} y={14} width={26} height={12} rx={3} fill="#3a3a3a" />
      <rect x={26} y={6} width={14} height={13} rx={3} fill="#3a3a3a" />
      <path d="M27 7 l2 -6 l4 5 Z M35 6 l4 -5 l1 7 Z" fill="#3a3a3a" />
      <circle cx={31} cy={12} r={1.4} fill="#ffd500" />
      <circle cx={36.5} cy={12} r={1.4} fill="#ffd500" />
      <rect x={9} y={24} width={5} height={5} rx={1.5} fill="#2a2a2a" />
      <rect x={24} y={24} width={5} height={5} rx={1.5} fill="#2a2a2a" />
    </svg>
  );
}
