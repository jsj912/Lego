// Brick-built outdoor display for the Flower Stall: buckets of flowers, a
// tiered wooden plant stand with pots, and (separately) a hanging basket and
// an OPEN sign. Original designs, decorative.

function Stud({ x, y, r, fill, dark }: { x: number; y: number; r: number; fill: string; dark: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y + r * 0.35} rx={r} ry={r * 0.7} fill={dark} />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill={fill} />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.2} rx={r * 0.35} ry={r * 0.2} fill="rgba(255,255,255,0.55)" />
    </g>
  );
}

const PAL = {
  pink: ["#f06b8a", "#c9476a"],
  coral: ["#ff8a65", "#d8623f"],
  yellow: ["#ffd500", "#ddb400"],
  blue: ["#4f6fd8", "#34489a"],
  white: ["#fbfaf4", "#d9d7ce"],
  lav: ["#9b7be0", "#6b52a8"],
  red: ["#d01012", "#9a0b0d"],
} as const;
type Petal = keyof typeof PAL;

/** A tulip head: two-tone cup from stacked studs. */
function Tulip({ x, y, c }: { x: number; y: number; c: Petal }) {
  const [f, d] = PAL[c];
  return (
    <g>
      <path d={`M${x} ${y + 3} L${x} ${y + 26}`} stroke="#237841" strokeWidth={1.6} />
      <path d={`M${x - 4} ${y - 1} Q${x} ${y + 9} ${x + 4} ${y - 1} L${x + 2} ${y - 5} L${x} ${y - 1} L${x - 2} ${y - 5} Z`} fill={f} stroke={d} strokeWidth={0.6} />
    </g>
  );
}

/** A bucket of flowers: grey/white bucket with a cluster of heads. */
function Bucket({ x, y, heads, tint = "#e9e7df" }: { x: number; y: number; heads: { dx: number; dy: number; c: Petal; kind: "stud" | "tulip" }[]; tint?: string }) {
  return (
    <g>
      {heads.map((h, i) =>
        h.kind === "tulip" ? (
          <Tulip key={i} x={x + h.dx} y={y + h.dy} c={h.c} />
        ) : (
          <g key={i}>
            <path d={`M${x + h.dx} ${y + h.dy + 2} L${x} ${y + 26}`} stroke="#237841" strokeWidth={1.4} />
            <Stud x={x + h.dx} y={y + h.dy} r={3.4} fill={PAL[h.c][0]} dark={PAL[h.c][1]} />
          </g>
        ),
      )}
      {/* leaves */}
      <path d={`M${x - 6} ${y + 24} Q${x - 14} ${y + 12} ${x - 11} ${y + 6} Q${x - 6} ${y + 14} ${x - 3} ${y + 24} Z`} fill="#2f8f4e" />
      <path d={`M${x + 6} ${y + 24} Q${x + 14} ${y + 12} ${x + 11} ${y + 6} Q${x + 6} ${y + 14} ${x + 3} ${y + 24} Z`} fill="#2f8f4e" />
      {/* bucket */}
      <path d={`M${x - 13} ${y + 24} L${x + 13} ${y + 24} L${x + 10} ${y + 44} L${x - 10} ${y + 44} Z`} fill={tint} stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} />
      <rect x={x - 14} y={y + 22} width={28} height={4} rx={1.5} fill="#d4d1c7" />
      <path d={`M${x - 11} ${y + 32} L${x + 11} ${y + 32}`} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
    </g>
  );
}

/** A terracotta pot with a small plant. */
function Pot({ x, y, c, w = 14 }: { x: number; y: number; c: Petal; w?: number }) {
  return (
    <g>
      <path d={`M${x - 3} ${y} Q${x - 9} ${y - 10} ${x - 7} ${y - 14} Q${x - 2} ${y - 8} ${x} ${y} Z`} fill="#2f8f4e" />
      <path d={`M${x + 3} ${y} Q${x + 9} ${y - 10} ${x + 7} ${y - 14} Q${x + 2} ${y - 8} ${x} ${y} Z`} fill="#3a9559" />
      <Stud x={x - 4} y={y - 13} r={2.6} fill={PAL[c][0]} dark={PAL[c][1]} />
      <Stud x={x + 4} y={y - 15} r={2.6} fill={PAL[c][0]} dark={PAL[c][1]} />
      <Stud x={x} y={y - 18} r={2.6} fill={PAL[c][0]} dark={PAL[c][1]} />
      <path d={`M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 - 2} ${y + 11} L${x - w / 2 + 2} ${y + 11} Z`} fill="#c8643a" />
      <rect x={x - w / 2 - 1} y={y - 1} width={w + 2} height={3} rx={1} fill="#a9502c" />
    </g>
  );
}

/** Buckets on the pavement and a tiered stand, drawn in front of the shop. */
export function FlowerDisplay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 100" className={className} aria-hidden focusable="false">
      <ellipse cx={120} cy={96} rx={110} ry={4} fill="rgba(0,0,0,0.12)" />
      {/* low wooden crate the buckets stand on */}
      <rect x={20} y={80} width={190} height={14} rx={2} fill="#a57a4c" />
      <rect x={20} y={80} width={190} height={3} rx={1} fill="#c89b62" />
      {[40, 80, 120, 160, 200].map((x) => (
        <circle key={x} cx={x - 6} cy={88} r={1.3} fill="#7a5532" />
      ))}

      <Bucket x={44} y={38} heads={[{ dx: -6, dy: 0, c: "blue", kind: "stud" }, { dx: 2, dy: -6, c: "blue", kind: "stud" }, { dx: 8, dy: 2, c: "white", kind: "stud" }, { dx: -1, dy: 6, c: "lav", kind: "stud" }]} />
      <Bucket x={88} y={36} heads={[{ dx: -6, dy: 2, c: "yellow", kind: "tulip" }, { dx: 0, dy: -4, c: "yellow", kind: "tulip" }, { dx: 7, dy: 1, c: "yellow", kind: "tulip" }]} tint="#f3f1ea" />
      <Bucket x={132} y={36} heads={[{ dx: -7, dy: 1, c: "pink", kind: "tulip" }, { dx: 0, dy: -5, c: "coral", kind: "tulip" }, { dx: 7, dy: 0, c: "pink", kind: "tulip" }]} />
      <Bucket x={176} y={40} heads={[{ dx: -6, dy: 0, c: "red", kind: "stud" }, { dx: 3, dy: -5, c: "pink", kind: "stud" }, { dx: 8, dy: 3, c: "white", kind: "stud" }, { dx: -1, dy: 5, c: "red", kind: "stud" }]} tint="#f3f1ea" />

      {/* tiered wooden plant stand */}
      <g>
        <path d="M232 94 L262 30 L268 30 L240 94 Z" fill="#8a6541" />
        <path d="M318 94 L300 30 L306 30 L326 94 Z" fill="#8a6541" />
        {[[244, 86, 76], [256, 64, 58], [268, 42, 40]].map(([x, y, w]) => (
          <g key={y}>
            <rect x={x} y={y} width={w} height={5} rx={1.5} fill="#b0834e" />
            <rect x={x} y={y + 5} width={w} height={2} fill="#7a5532" />
          </g>
        ))}
        <Pot x={256} y={75} c="coral" />
        <Pot x={284} y={75} c="yellow" w={16} />
        <Pot x={306} y={75} c="pink" />
        <Pot x={268} y={53} c="lav" />
        <Pot x={296} y={53} c="red" />
        <Pot x={288} y={31} c="coral" w={12} />
      </g>
    </svg>
  );
}

/** A hanging basket on a chain. */
export function HangingBasket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden focusable="false">
      <path d="M24 0 L24 18 M24 18 L10 34 M24 18 L38 34" stroke="#5c6166" strokeWidth={1.2} fill="none" />
      <path d="M8 34 Q24 54 40 34 Z" fill="#c8643a" />
      <rect x={7} y={32} width={34} height={4} rx={2} fill="#a9502c" />
      {/* trailing greens and blooms */}
      <path d="M10 36 Q6 46 9 56 M38 36 Q42 46 39 58 M24 42 Q22 52 25 62" stroke="#2f8f4e" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Stud x={14} y={30} r={3.2} fill={PAL.coral[0]} dark={PAL.coral[1]} />
      <Stud x={24} y={27} r={3.2} fill={PAL.pink[0]} dark={PAL.pink[1]} />
      <Stud x={34} y={30} r={3.2} fill={PAL.coral[0]} dark={PAL.coral[1]} />
      <Stud x={9} y={55} r={2.2} fill={PAL.pink[0]} dark={PAL.pink[1]} />
      <Stud x={39} y={57} r={2.2} fill={PAL.coral[0]} dark={PAL.coral[1]} />
    </svg>
  );
}
