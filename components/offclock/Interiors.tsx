// Room interiors seen through the shop windows on /off-the-clock.
// Each is a one-point-perspective room (ceiling, side walls, back wall, floor)
// furnished for its hobby. Original, decorative, no facts.

import type { ReactNode } from "react";

const W = 240;
const H = 180;
// back wall rectangle
const BX0 = 44, BX1 = 196, BY0 = 22, BY1 = 118;

type RoomColors = { ceiling: string; side: string; back: string; floor: string };

function Room({ c, floor, back, children }: { c: RoomColors; floor?: ReactNode; back?: ReactNode; children?: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
      <polygon points={`0,0 ${W},0 ${BX1},${BY0} ${BX0},${BY0}`} fill={c.ceiling} />
      <polygon points={`0,0 ${BX0},${BY0} ${BX0},${BY1} 0,${H}`} fill={c.side} />
      <polygon points={`${W},0 ${BX1},${BY0} ${BX1},${BY1} ${W},${H}`} fill={c.side} />
      <rect x={BX0} y={BY0} width={BX1 - BX0} height={BY1 - BY0} fill={c.back} />
      <polygon points={`0,${H} ${BX0},${BY1} ${BX1},${BY1} ${W},${H}`} fill={c.floor} />
      {floor}
      {back}
      {children}
      {/* soft shadow where walls meet */}
      <path d={`M${BX0} ${BY0} V${BY1} H${BX1} V${BY0}`} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
    </svg>
  );
}

/** Floor lines converging to the back wall (planks, tiles, lanes). */
function Converge({ n, color }: { n: number; color: string }) {
  return (
    <g>
      {Array.from({ length: n + 1 }, (_, i) => {
        const t = i / n;
        return <line key={i} x1={t * W} y1={H} x2={BX0 + t * (BX1 - BX0)} y2={BY1} stroke={color} strokeWidth={1} />;
      })}
    </g>
  );
}
function Rows({ ys, color }: { ys: number[]; color: string }) {
  return (
    <g>
      {ys.map((y) => {
        const t = (y - BY1) / (H - BY1);
        const x0 = BX0 * (1 - t);
        const x1 = BX1 + (W - BX1) * t;
        return <line key={y} x1={x0} y1={y} x2={x1} y2={y} stroke={color} strokeWidth={1} />;
      })}
    </g>
  );
}

function Stud({ x, y, r, c, d }: { x: number; y: number; r: number; c: string; d: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y + r * 0.35} rx={r} ry={r * 0.7} fill={d} />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill={c} />
      <ellipse cx={x - r * 0.3} cy={y - r * 0.2} rx={r * 0.32} ry={r * 0.18} fill="rgba(255,255,255,0.55)" />
    </g>
  );
}

function Pendant({ x, len = 14 }: { x: number; len?: number }) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={len} stroke="#3a3a3a" strokeWidth={0.8} />
      <path d={`M${x - 7} ${len + 7} Q${x} ${len - 2} ${x + 7} ${len + 7} Z`} fill="#1f3b2d" />
      <ellipse cx={x} cy={len + 9} rx={16} ry={6} fill="rgba(255,226,150,0.35)" />
      <circle cx={x} cy={len + 7} r={2} fill="#ffe7a8" />
    </g>
  );
}

// ─────────────────────────────── Florist ───────────────────────────────
const FLOWER = {
  red: ["#c8102e", "#8a0b1f"],
  white: ["#fbfaf4", "#d9d7ce"],
  pink: ["#f06b8a", "#c9476a"],
  lav: ["#8b6fd6", "#5e47a3"],
} as const;
type F = keyof typeof FLOWER;

function BucketOfFlowers({ x, y, c, s = 1 }: { x: number; y: number; c: F; s?: number }) {
  const [fc, fd] = FLOWER[c];
  const heads = [[-5, -4], [0, -8], [5, -4], [-2, -1], [3, -1]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {heads.map(([dx, dy], i) => (
        <g key={i}>
          <line x1={dx * 0.4} y1={2} x2={dx} y2={dy} stroke="#2f8f4e" strokeWidth={1} />
          <Stud x={dx} y={dy} r={2.8} c={fc} d={fd} />
        </g>
      ))}
      {/* baby's breath */}
      {[[-7, -7], [7, -7], [-3, -11], [4, -11]].map(([dx, dy], i) => (
        <circle key={`b${i}`} cx={dx} cy={dy} r={1.1} fill="#ffffff" />
      ))}
      <path d="M-7 1 L7 1 L5.5 11 L-5.5 11 Z" fill="#c9ccd0" stroke="#8d9297" strokeWidth={0.6} />
      <rect x={-7.5} y={0} width={15} height={2} rx={1} fill="#e3e5e8" />
    </g>
  );
}

function Gladiolus({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - h} stroke="#2f8f4e" strokeWidth={1.2} />
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx={x + (i % 2 ? 2 : -2)} cy={y - h * 0.35 - i * (h * 0.11)} rx={3 - i * 0.3} ry={2.2 - i * 0.2} fill={i % 2 ? "#ff9db4" : "#f06b8a"} />
      ))}
    </g>
  );
}

export function FloristInterior() {
  return (
    <Room
      c={{ ceiling: "#f4ede2", side: "#e7ddcd", back: "#f8f1e6", floor: "#c98a64" }}
      floor={
        <>
          <Converge n={8} color="rgba(0,0,0,0.12)" />
          <Rows ys={[128, 142, 160]} color="rgba(0,0,0,0.12)" />
        </>
      }
      back={
        <>
          {/* sage wainscot */}
          <rect x={BX0} y={92} width={BX1 - BX0} height={26} fill="#b9ccb2" />
          <rect x={BX0} y={91} width={BX1 - BX0} height={2} fill="#9fb597" />
          {/* two shelves of buckets */}
          {[52, 82].map((sy, r) => (
            <g key={sy}>
              <rect x={BX0 + 6} y={sy} width={BX1 - BX0 - 12} height={3} fill="#a57a4c" />
              {(["red", "white", "pink", "lav", "red", "white"] as F[]).map((c, i) => (
                <BucketOfFlowers key={i} x={BX0 + 18 + i * 23 + (r ? 11 : 0)} y={sy - 11} c={c} s={0.85} />
              ))}
            </g>
          ))}
        </>
      }
    >
      <Pendant x={88} />
      <Pendant x={152} len={10} />
      {/* tall bucket of gladiolus on the left */}
      <g>
        <Gladiolus x={22} y={140} h={58} />
        <Gladiolus x={28} y={140} h={66} />
        <Gladiolus x={34} y={140} h={54} />
        <path d="M14 138 L42 138 L39 166 L17 166 Z" fill="#b9bdc1" stroke="#8d9297" />
      </g>
      {/* wrapping counter */}
      <rect x={70} y={130} width={110} height={36} fill="#8a6541" />
      <rect x={66} y={126} width={118} height={7} rx={1.5} fill="#b0834e" />
      <rect x={76} y={138} width={46} height={22} rx={1} fill="#7a5532" opacity={0.6} />
      <rect x={128} y={138} width={46} height={22} rx={1} fill="#7a5532" opacity={0.6} />
      {/* kraft roll */}
      <rect x={72} y={116} width={30} height={10} rx={5} fill="#c9a46b" />
      <ellipse cx={72} cy={121} rx={2.5} ry={5} fill="#a9844d" />
      <path d="M100 124 L118 128 L118 126 Z" fill="#dcbc86" />
      {/* bouquet on the counter */}
      <path d="M126 126 L150 110 L166 126 Z" fill="#c9a46b" />
      <Stud x={142} y={112} r={3.2} c={FLOWER.red[0]} d={FLOWER.red[1]} />
      <Stud x={150} y={108} r={3.2} c={FLOWER.white[0]} d={FLOWER.white[1]} />
      <Stud x={157} y={113} r={3.2} c={FLOWER.lav[0]} d={FLOWER.lav[1]} />
      <Stud x={148} y={116} r={3} c={FLOWER.pink[0]} d={FLOWER.pink[1]} />
      {/* bucket of roses on the floor, right */}
      <BucketOfFlowers x={212} y={150} c="red" s={1.4} />
    </Room>
  );
}

// ─────────────────────────────── Workshop ───────────────────────────────
export function WorkshopInterior() {
  return (
    <Room
      c={{ ceiling: "#d7dade", side: "#b9bec4", back: "#c9ced4", floor: "#8e949a" }}
      floor={<Rows ys={[130, 150]} color="rgba(0,0,0,0.12)" />}
      back={
        <>
          {/* pegboard */}
          <rect x={BX0 + 6} y={BY0 + 8} width={62} height={46} rx={2} fill="#d6b27c" />
          {Array.from({ length: 7 }, (_, i) =>
            Array.from({ length: 5 }, (_, j) => <circle key={`${i}-${j}`} cx={BX0 + 12 + i * 8.5} cy={BY0 + 14 + j * 8.5} r={0.9} fill="#8a6a3a" />),
          )}
          {/* tools */}
          <rect x={BX0 + 14} y={BY0 + 14} width={3} height={22} rx={1} fill="#5c6166" />
          <rect x={BX0 + 10} y={BY0 + 12} width={11} height={5} rx={1} fill="#5c6166" />
          <path d={`M${BX0 + 30} ${BY0 + 12} l5 0 l0 26 l-5 0 z`} fill="#d01012" />
          <circle cx={BX0 + 32.5} cy={BY0 + 12} r={4} fill="none" stroke="#9ea3a8" strokeWidth={2} />
          <rect x={BX0 + 44} y={BY0 + 14} width={16} height={4} rx={2} fill="#0055bf" />
          <rect x={BX0 + 50} y={BY0 + 18} width={4} height={18} fill="#9ea3a8" />
          {/* framed jigsaw */}
          <rect x={BX0 + 80} y={BY0 + 6} width={62} height={40} fill="#5a3c21" />
          <rect x={BX0 + 84} y={BY0 + 10} width={54} height={32} fill="#c7dbe9" />
          <rect x={BX0 + 84} y={BY0 + 24} width={34} height={8} fill="#e05aa0" />
          <rect x={BX0 + 84} y={BY0 + 32} width={34} height={10} fill="#6b5a4a" />
          <path d={`M${BX0 + 126} ${BY0 + 40} L${BX0 + 130} ${BY0 + 14} L${BX0 + 134} ${BY0 + 40} Z`} fill="none" stroke="#4a4f54" strokeWidth={1} />
          <rect x={BX0 + 118} y={BY0 + 12} width={6} height={5} fill="#5a3c21" />
          <rect x={BX0 + 128} y={BY0 + 30} width={5} height={6} fill="#5a3c21" />
          {/* shelf of set boxes */}
          <rect x={BX0 + 6} y={BY0 + 74} width={BX1 - BX0 - 12} height={3} fill="#5c6166" />
          {[["#0055bf", 18], ["#ffd500", 14], ["#d01012", 20], ["#237841", 16], ["#0055bf", 12], ["#d01012", 15]].map(([c, h], i) => (
            <g key={i}>
              <rect x={BX0 + 10 + i * 22} y={BY0 + 74 - (h as number)} width={18} height={h as number} fill={c as string} />
              <rect x={BX0 + 13 + i * 22} y={BY0 + 77 - (h as number)} width={8} height={4} fill="rgba(255,255,255,0.6)" />
            </g>
          ))}
        </>
      }
    >
      {/* desk lamp */}
      <g>
        <ellipse cx={176} cy={118} rx={26} ry={10} fill="rgba(255,226,150,0.3)" />
        <path d="M188 128 L182 104 L170 96" stroke="#3a3a3a" strokeWidth={2.2} fill="none" />
        <path d="M164 92 L178 94 L172 104 Z" fill="#ffd500" stroke="#b89500" />
        <rect x={182} y={126} width={14} height={4} rx={1.5} fill="#3a3a3a" />
      </g>
      {/* workbench */}
      <rect x={30} y={130} width={180} height={7} rx={1.5} fill="#b0834e" />
      <rect x={38} y={137} width={7} height={34} fill="#7a5532" />
      <rect x={195} y={137} width={7} height={34} fill="#7a5532" />
      <rect x={44} y={150} width={152} height={4} fill="#7a5532" />
      {/* bins under the bench */}
      {[["#d01012", 58], ["#ffd500", 96], ["#0055bf", 134]].map(([c, x]) => (
        <g key={x as number}>
          <rect x={x as number} y={156} width={30} height={14} rx={1.5} fill={c as string} />
          <rect x={(x as number) + 2} y={156} width={26} height={3} fill="rgba(0,0,0,0.2)" />
        </g>
      ))}
      {/* buggy build on the bench */}
      <g>
        <rect x={62} y={112} width={46} height={10} rx={1.5} fill="#0055bf" />
        <rect x={72} y={104} width={22} height={9} rx={1.5} fill="#ffd500" />
        <rect x={66} y={108} width={10} height={4} fill="#1f2226" />
        <path d="M94 104 L104 98 L106 100 L96 106 Z" fill="#1f2226" />
        {[64, 104].map((wx) => (
          <g key={wx}>
            <circle cx={wx} cy={124} r={7} fill="#1f2226" />
            <circle cx={wx} cy={124} r={3} fill="#2a78da" />
          </g>
        ))}
      </g>
      {/* loose puzzle pieces */}
      {[[124, 126, "#e05aa0"], [132, 124, "#c7dbe9"], [140, 127, "#6b5a4a"], [128, 128, "#8ec07c"]].map(([x, y, c], i) => (
        <path key={i} d={`M${x} ${y} h5 a1.5 1.5 0 0 1 3 0 h1 v4 h-9 z`} fill={c as string} stroke="rgba(0,0,0,0.25)" strokeWidth={0.4} />
      ))}
    </Room>
  );
}

// ─────────────────────────────── Craft studio ───────────────────────────────
export function StudioInterior({ photos = [] }: { photos?: string[] }) {
  const pins = [0, 1, 2, 3, 4];
  return (
    <Room
      c={{ ceiling: "#fbf6e9", side: "#efe4c8", back: "#fcf5e3", floor: "#c89b62" }}
      floor={<Converge n={10} color="rgba(0,0,0,0.12)" />}
      back={
        <>
          {/* fairy lights */}
          <path d={`M${BX0 + 4} ${BY0 + 6} Q${BX0 + 40} ${BY0 + 16} ${BX0 + 76} ${BY0 + 6} T${BX1 - 4} ${BY0 + 6}`} fill="none" stroke="#6b5a4a" strokeWidth={0.6} />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={BX0 + 10 + i * 12.5} cy={BY0 + 9 + Math.sin(i * 0.9) * 3} r={1.6} fill="#ffe27a" />
          ))}
          {/* cork board with pinned photos */}
          <rect x={BX0 + 8} y={BY0 + 18} width={84} height={52} rx={2} fill="#c89b62" stroke="#8a6541" strokeWidth={2} />
          {pins.map((i) => {
            const x = BX0 + 14 + (i % 3) * 26;
            const y = BY0 + 22 + Math.floor(i / 3) * 24;
            const rot = (i % 2 ? 4 : -5) + i;
            const src = photos[i % Math.max(photos.length, 1)];
            return (
              <g key={i} transform={`rotate(${rot} ${x + 10} ${y + 10})`}>
                <rect x={x} y={y} width={20} height={22} fill="#ffffff" />
                {src ? (
                  <image href={src} x={x + 2} y={y + 2} width={16} height={15} preserveAspectRatio="xMidYMid slice" />
                ) : (
                  <rect x={x + 2} y={y + 2} width={16} height={15} fill={["#9fc5e8", "#f4b6c2", "#b6d7a8", "#ffe599", "#d5a6bd"][i]} />
                )}
                <circle cx={x + 10} cy={y + 1} r={1.5} fill="#d01012" />
              </g>
            );
          })}
          {/* washi tape rack */}
          <rect x={BX1 - 50} y={BY0 + 30} width={42} height={2} fill="#8a6541" />
          {["#f4b6c2", "#9fc5e8", "#ffd500", "#b6d7a8", "#d5a6bd"].map((c, i) => (
            <g key={c}>
              <circle cx={BX1 - 45 + i * 8.5} cy={BY0 + 26} r={4} fill={c} />
              <circle cx={BX1 - 45 + i * 8.5} cy={BY0 + 26} r={1.6} fill="#fcf5e3" />
            </g>
          ))}
          {/* stacked paper */}
          <rect x={BX1 - 48} y={BY0 + 48} width={38} height={4} fill="#f4b6c2" />
          <rect x={BX1 - 46} y={BY0 + 44} width={36} height={4} fill="#9fc5e8" />
          <rect x={BX1 - 47} y={BY0 + 40} width={37} height={4} fill="#ffffff" />
        </>
      }
    >
      {/* desk */}
      <rect x={34} y={128} width={172} height={7} rx={1.5} fill="#f4f1e8" />
      <rect x={40} y={135} width={6} height={36} fill="#d9d4c4" />
      <rect x={194} y={135} width={6} height={36} fill="#d9d4c4" />
      {/* open scrapbook */}
      <g>
        <path d="M78 127 L118 122 L118 106 L80 110 Z" fill="#fffdf6" stroke="#d9d4c4" />
        <path d="M158 127 L118 122 L118 106 L156 110 Z" fill="#fffdf6" stroke="#d9d4c4" />
        <rect x={86} y={110} width={14} height={9} fill="#9fc5e8" transform="rotate(-6 93 114)" />
        <rect x={128} y={110} width={16} height={9} fill="#f4b6c2" transform="rotate(5 136 114)" />
        <rect x={84} y={108} width={8} height={3} fill="#ffd500" opacity={0.8} transform="rotate(-30 88 109)" />
        <rect x={140} y={107} width={8} height={3} fill="#b6d7a8" opacity={0.8} transform="rotate(30 144 108)" />
      </g>
      {/* pencil cup */}
      <rect x={172} y={112} width={12} height={16} rx={1.5} fill="#0055bf" />
      {[174, 177, 180].map((x, i) => (
        <rect key={x} x={x} y={100 + i * 2} width={2} height={14} fill={["#ffd500", "#d01012", "#237841"][i]} />
      ))}
      {/* chair */}
      <rect x={104} y={148} width={32} height={6} rx={2} fill="#d01012" />
      <rect x={108} y={154} width={3} height={18} fill="#7e0809" />
      <rect x={129} y={154} width={3} height={18} fill="#7e0809" />
    </Room>
  );
}

// ─────────────────────────────── Clubhouse ───────────────────────────────
export function ClubhouseInterior() {
  return (
    <Room
      c={{ ceiling: "#eef2f7", side: "#dde5ef", back: "#f5f8fc", floor: "#c0504d" }}
      floor={
        <>
          <Converge n={6} color="rgba(255,255,255,0.7)" />
        </>
      }
      back={
        <>
          <rect x={BX0} y={BY0 + 40} width={BX1 - BX0} height={5} fill="#0055bf" />
          {/* lockers */}
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <rect x={BX0 + 6 + i * 17} y={BY0 + 8} width={15} height={BY1 - BY0 - 8} fill="#2a78da" stroke="#004196" strokeWidth={1} />
              {[0, 1, 2].map((k) => (
                <rect key={k} x={BX0 + 9 + i * 17} y={BY0 + 12 + k * 3} width={9} height={1.2} fill="#004196" />
              ))}
              <rect x={BX0 + 17 + i * 17} y={BY0 + 44} width={2} height={6} rx={1} fill="#c3c7ca" />
            </g>
          ))}
          {/* trail map poster */}
          <rect x={BX0 + 100} y={BY0 + 10} width={44} height={32} fill="#fffdf6" stroke="#9ea3a8" />
          <path d={`M${BX0 + 104} ${BY0 + 36} C${BX0 + 114} ${BY0 + 20} ${BX0 + 124} ${BY0 + 40} ${BX0 + 140} ${BY0 + 16}`} fill="none" stroke="#c2703d" strokeWidth={2} strokeDasharray="3 2" />
          <circle cx={BX0 + 140} cy={BY0 + 16} r={2} fill="#d01012" />
          {/* wall clock */}
          <circle cx={BX0 + 128} cy={BY0 + 62} r={9} fill="#ffffff" stroke="#1f2226" strokeWidth={1.5} />
          <path d={`M${BX0 + 128} ${BY0 + 62} v-6 M${BX0 + 128} ${BY0 + 62} h4`} stroke="#1f2226" strokeWidth={1.2} />
        </>
      }
    >
      {/* bench */}
      <rect x={40} y={134} width={120} height={6} rx={1.5} fill="#b0834e" />
      <rect x={46} y={140} width={5} height={22} fill="#7a5532" />
      <rect x={150} y={140} width={5} height={22} fill="#7a5532" />
      {/* running shoes */}
      {[[62, 127], [80, 128]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y + 6} L${x} ${y} Q${x + 6} ${y - 2} ${x + 9} ${y + 2} L${x + 16} ${y + 3} Q${x + 18} ${y + 6} ${x + 16} ${y + 6} Z`} fill={i ? "#ffd500" : "#237841"} />
          <rect x={x - 0.5} y={y + 5.5} width={17} height={2} rx={1} fill="#ffffff" />
        </g>
      ))}
      {/* water bottles */}
      {[[118, "#0055bf"], [128, "#d01012"]].map(([x, c]) => (
        <g key={x as number}>
          <rect x={x as number} y={118} width={7} height={16} rx={2} fill={c as string} />
          <rect x={(x as number) + 2} y={115} width={3} height={4} fill="#1f2226" />
        </g>
      ))}
      {/* towel */}
      <path d="M170 110 h26 v40 l-4 -3 l-4 3 l-4 -3 l-4 3 l-4 -3 l-6 3 z" fill="#ffffff" stroke="#c3c7ca" />
      <rect x={170} y={120} width={26} height={3} fill="#0055bf" />
    </Room>
  );
}
